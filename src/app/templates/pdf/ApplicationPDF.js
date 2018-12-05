import Fs from 'fs';
import PDFKit from 'pdfkit';
import moment from 'moment';
import codes from 'rescode';


class ApplicationPDF {
    process(filename, email, payload, address, pob, branch, callback) {
        const processor = this;
        const onProcess = processor.generatePDF(filename, email, payload, address, pob, branch);
        onProcess.then(() => {
            callback();
        });
    }

    generatePDF(filename, email, payload, address, pob, branch) {
        return new Promise((resolve) => {
            const doc = new PDFKit();
            doc.pipe(Fs.createWriteStream(`src/resources/pdf/${filename}.pdf`));
            doc.registerFont('Thin', 'src/app/templates/pdf/assets/fonts/TimesNewRomans.ttf');
            doc.registerFont('Bold', 'src/app/templates/pdf/assets/fonts/TimesNewRomansBold.ttf');
            codes.loadModules(['code128'], {
                includetext: false,
                guardwhitespace: false,
                inkspread: 0,
                scaleX: 3,
                textyoffset: -15,
            });
            const data = this.buildData(email, payload, address, pob, branch);
            const barcode = codes.create('code128', data.transaction_number);
            this.pageOne(doc, data).then(() => {
                this.pageTwo(doc, data, barcode).then(() => {
                    this.pageThree(doc, data, barcode).then(() => {
                        this.pageFour(doc, data, barcode).then(() => {
                            doc.end();
                            // console.log(`${filename} Generated`);
                            resolve();
                        });
                    });
                });
            });
        });
    }

    pageOne = (doc, data) => new Promise((resolve) => {
        let posY = doc.y;
        // doc.font('fonts/TimesNewRomans.ttf');
        doc.fontSize(24);
        doc.text('Import Reminders', {
            align: 'left',
            width: 500,
        }, 100, 100);

        posY = doc.y;

        doc.lineWidth(1);
        doc.moveTo(72, posY + 20)
            .lineTo(541, posY + 20)
            .stroke();

        doc.lineWidth(2);
        doc.lineJoin('miter')
            .rect(75, 222.5, 42.5, 42.5)
            .stroke();
        doc.fontSize(12);

        let txt = `Your appointment is on ${data.appointment_date} at ${data.appointment_time} `
        + `Please be at ${data.site} at least thirty (30) minutes `
        + 'before your scheduled appointment';

        doc.text(txt, 150, 220, {
            align: 'left',
            width: 410,
        });

        doc.lineJoin('miter')
            .rect(75, 302.5, 42.5, 42.5)
            .stroke();
        doc.text('Please makesure you have prepared alltherequirements.', 150, 315, {
            align: 'left',
            width: 410,
        });

        doc.lineJoin('miter')
            .rect(75, 382.5, 42.5, 42.5)
            .stroke();

        txt = 'Be ready with both the original and photocopies of your documents when you '
            + 'appear for personal appearance. Application processing may be delayed if '
            + 'appointments are not ready with copies of their documents once inside the data '
            + 'capturing site.';

        doc.text(txt, 150, 380, {
            align: 'left',
            width: 410,
        });

        doc.lineJoin('miter')
            .rect(75, 462.5, 42.5, 42.5)
            .stroke();
        txt = 'For your NSO certificate requirements, you may call (02) 737-1111. Nationwide '
            + 'deliverywithin 3-4 days.';
        doc.text(txt, 150, 465, {
            align: 'left',
            width: 410,
        });

        doc.lineJoin('miter')
            .rect(75, 542.5, 42.5, 42.5)
            .stroke();
        txt = 'Kindly print yourapplication form(with barcode) in A4-size paper '
            + 'You must have a printed application form to show and submit at your chosen '
            + 'application site.';
        doc.text(txt, 150, 540, {
            align: 'left',
            width: 410,
        });
        // console.log('Page One Generated');
        resolve();
    });

    pageTwo = (doc, data, barcode) => new Promise((resolve) => {
        doc.addPage();
        doc.image('src/app/templates/pdf/assets/resources/PageTwo.jpg', 0, 0, {
            width: doc.page.width,
            height: doc.page.height,
        });

        doc.image(barcode, 451, 25, {
            height: 25,
            width: 112,
        });

        doc.fontSize(11);
        doc.font('Bold');
        doc.text(data.transaction_number, 450, 49, {
            align: 'center',
            width: 112,
        });

        const txt = `${data.site}`;

        doc.fontSize(9);
        doc.font('Bold');
        doc.text(txt, 65, 27, {
            align: 'left',
            width: 150,
        });
        doc.text(data.appointment_date, 65, 47, {
            align: 'left',
            width: 500,
        });
        doc.text(data.appointment_time, 65, 57, {
            align: 'left',
            width: 500,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.last_name, 67, 107, {
            align: 'left',
            width: 500,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.first_name, 311, 107, {
            align: 'left',
            width: 500,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.middle_name, 67, 140, {
            align: 'left',
            width: 500,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.pob, 311, 140, {
            align: 'left',
            width: 500,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(moment(data.dob).format('MMMM'), 65, 175, {
            align: 'center',
            width: 80,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(moment(data.dob).format('DD'), 155, 175, {
            align: 'center',
            width: 55,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(moment(data.dob).format('YYYY'), 220, 175, {
            align: 'center',
            width: 60,
        });

        this.fillGenderBlock(doc, data.gender);
        this.fillCivilStatusBlock(doc, data.civil_status);

        doc.fill('black');
        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.complete_address, 149, 251, {
            align: 'left',
            width: 275,
            height: 5,
            ellipsis: true,
        });

        doc.fill('black');
        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.home_tel_no, 465, 251, {
            align: 'left',
            width: 100,
            height: 5,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.occupation, 149, 263, {
            align: 'left',
            width: 275,
            height: 5,
            ellipsis: true,
        });

        doc.fill('black');
        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.mobile_number, 478, 263, {
            align: 'left',
            width: 100,
            height: 5,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.work_address, 130, 275, {
            align: 'left',
            width: 300,
            height: 5,
            ellipsis: true,
        });

        doc.fill('black');
        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.work_tel_no, 466, 275, {
            align: 'left',
            width: 100,
            height: 5,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.email, 130, 287, {
            align: 'left',
            width: 415,
            height: 5,
            ellipsis: true,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.spouse_name, 167, 299, {
            align: 'left',
            width: 260,
            height: 5,
            ellipsis: true,
        });

        doc.fill('black');
        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.spouse_citizenship, 485, 299, {
            align: 'left',
            width: 100,
            height: 5,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.father_name, 140, 311, {
            align: 'left',
            width: 280,
            height: 5,
            ellipsis: true,
        });

        doc.fill('black');
        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.father_citizenship, 485, 311, {
            align: 'left',
            width: 100,
            height: 5,
            ellipsis: true,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.mother_maiden_name, 200, 323, {
            align: 'left',
            width: 220,
            height: 5,
            ellipsis: true,
        });

        doc.fill('black');
        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.mother_citizenship, 485, 323, {
            align: 'left',
            width: 100,
            height: 5,
            ellipsis: true,
        });

        this.fillCitizenshipAquirementBlock(doc, data.citizenship_acquired_by);
        this.fillForeignPassportHolderBlock(doc, data.has_foreign_passport);
        this.fillPhilippinePassportHolderBlock(doc, data.has_old_philippine_passport, data);

        doc.fill('black');
        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.minor_companion, 220, 426, {
            align: 'left',
            width: 342.5,
            height: 5,
            ellipsis: true,
        });

        doc.fill('black');
        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.companion_relationship, 170, 438, {
            align: 'left',
            width: 140,
            height: 5,
            ellipsis: true,
        });

        doc.fill('black');
        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.companion_relationship, 390, 438, {
            align: 'left',
            width: 160,
            height: 5,
            ellipsis: true,
        });

        // console.log('Page Two Generated');
        resolve();
    });

    pageThree = (doc, data, barcode) => new Promise((resolve) => {
        doc.addPage();
        doc.image('src/app/templates/pdf/assets/resources/PageThree.jpg', 0, 0, {
            width: doc.page.width,
            height: doc.page.height,
        });

        doc.image(barcode, 363, 144.5, {
            height: 34,
            width: 140,
        });

        doc.fontSize(15);
        doc.font('Bold');
        doc.text(data.transaction_number, 363, 178.5, {
            align: 'center',
            width: 140,
        });

        doc.fontSize(15);
        doc.font('Thin');
        doc.text(data.ereceipt_number, 330, 68, {
            align: 'left',
            width: 170,
        });

        doc.fontSize(11);
        doc.font('Thin');
        doc.text(data.merchant, 160, 142, {
            align: 'left',
            width: 200,
        });

        doc.fontSize(11);
        doc.font('Thin');
        doc.text(data.branch_code, 180, 150.5, {
            align: 'left',
            width: 180,
        });

        doc.fontSize(11);
        doc.font('Thin');
        doc.text(data.refno, 185, 162, {
            align: 'left',
            width: 175,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.date, 130, 173, {
            align: 'left',
            width: 230,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.time, 128, 183, {
            align: 'left',
            width: 230,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.transaction_number, 230, 212, {
            align: 'left',
            width: 265,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(`${data.first_name} ${data.middle_name} ${data.last_name}`, 130, 233, {
            align: 'left',
            width: 370,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.site, 155, 256, {
            align: 'left',
            width: 345,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.transaction, 175, 276, {
            align: 'left',
            width: 325,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.processing_type, 200, 296, {
            align: 'left',
            width: 300,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.payment_mode, 205, 318, {
            align: 'left',
            width: 295,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.service_number, 195, 339, {
            align: 'left',
            width: 305,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(`(E-PASSPORT FEE) ${data.epassport_fee}`, 195, 360, {
            align: 'left',
            width: 305,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(`(EXPEDITE FEE) ${data.expidite_fee}`, 195, 381.5, {
            align: 'left',
            width: 305,
        });
        resolve();
    });

    pageFour = (doc, data, barcode) => new Promise((resolve) => {
        doc.addPage();
        doc.image('src/app/templates/pdf/assets/resources/PageFour.jpg', 0, 0, {
            width: doc.page.width,
            height: doc.page.height,
        });

        doc.image(barcode, 363, 144.5, {
            height: 34,
            width: 140,
        });

        doc.fontSize(15);
        doc.font('Bold');
        doc.text(data.transaction_number, 363, 178.5, {
            align: 'center',
            width: 140,
        });

        doc.fontSize(15);
        doc.font('Thin');
        doc.text(data.ereceipt_number, 330, 68, {
            align: 'left',
            width: 170,
        });

        doc.fontSize(11);
        doc.font('Thin');
        doc.text(data.merchant, 160, 142, {
            align: 'left',
            width: 200,
        });

        doc.fontSize(11);
        doc.font('Thin');
        doc.text(data.branch_code, 180, 150.5, {
            align: 'left',
            width: 180,
        });

        doc.fontSize(11);
        doc.font('Thin');
        doc.text(data.refno, 185, 162, {
            align: 'left',
            width: 175,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.date, 130, 173, {
            align: 'left',
            width: 230,
        });

        doc.fontSize(10);
        doc.font('Thin');
        doc.text(data.time, 128, 183, {
            align: 'left',
            width: 230,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.transaction_number, 230, 212, {
            align: 'left',
            width: 265,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(`${data.first_name} ${data.middle_name} ${data.last_name}`, 130, 233, {
            align: 'left',
            width: 370,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.site, 155, 255, {
            align: 'left',
            width: 345,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.transaction, 175, 276, {
            align: 'left',
            width: 325,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.processing_type, 200, 296, {
            align: 'left',
            width: 300,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.payment_mode, 205, 318, {
            align: 'left',
            width: 295,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(data.service_number, 195, 339, {
            align: 'left',
            width: 305,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(`(E-PASSPORT FEE) ${data.epassport_fee}`, 195, 360, {
            align: 'left',
            width: 305,
        });

        doc.fontSize(12);
        doc.font('Thin');
        doc.text(`(EXPEDITE FEE) ${data.expidite_fee}`, 195, 381.5, {
            align: 'left',
            width: 305,
        });

        // console.log('Page Four Generated');
        resolve();
    });

    fillGenderBlock = (doc, gender) => {
        if (gender === 'MALE' || gender === 'Male' || gender === 'M' || gender === 'm') {
            doc.rect(415.80, 179.35, 11, 9.75).fill();
        }

        if (gender === 'FEMALE' || gender === 'Female' || gender === 'F' || gender === 'f') {
            doc.rect(474.50, 179.35, 11, 9.75).fill();

        }
    }

    fillCivilStatusBlock = (doc, civilStatus) => {
        if (civilStatus === 'SINGLE') {
            doc.rect(152.5, 239.7, 7.5, 7).fill();
        }

        if (civilStatus === 'MARRIED' || civilStatus === 'Single') {
            doc.rect(228.5, 239.7, 7.5, 7).fill();
        }

        if (civilStatus === 'WIDOWER' || civilStatus === 'Single') {
            doc.rect(307.5, 239.7, 7.5, 7).fill();
        }

        if (civilStatus === 'SEPARATED' || civilStatus === 'Single') {
            doc.rect(390.6, 239.7, 7.5, 7).fill();
        }

        if (civilStatus === 'ANULLED' || civilStatus === 'Single') {
            doc.rect(497, 239.7, 7.5, 7).fill();
        }
    }

    fillCitizenshipAquirementBlock = (doc, citizenshipAquirement) => {
        const options = ['BIRTH', 'ELECTION', 'MARRIAGE', 'NATURALIZATION', 'R.A. 9225'];
        if (citizenshipAquirement === options[0]) {
            doc.rect(65.3, 363, 7.5, 7).fill();
        }

        if (citizenshipAquirement === options[1]) {
            doc.rect(106, 363, 7.5, 7).fill();
        }

        if (citizenshipAquirement === options[2]) {
            doc.rect(157.8, 363, 7.5, 7).fill();
        }

        if (citizenshipAquirement === options[3]) {
            doc.rect(216.2, 363, 7.5, 7).fill();
        }

        if (citizenshipAquirement === options[4]) {
            doc.rect(291.5, 363, 7.5, 7).fill();
        }

        if (!options.includes(citizenshipAquirement)) {
            doc.rect(368, 363, 7.5, 7).fill();
            doc.fill('black');
            doc.fontSize(10);
            doc.font('Thin');
            doc.text(citizenshipAquirement, 410, 360, {
                align: 'left',
                width: 150,
                height: 5,
            });
        }
    }

    fillForeignPassportHolderBlock = (doc, foreignPassportHolder) => {
        if (foreignPassportHolder) {
            doc.rect(220, 383.8, 7.5, 7).fill();
            doc.fontSize(10);
            doc.font('Thin');
            doc.text(foreignPassportHolder, 170, 392, {
                align: 'left',
                width: 100,
                height: 5,

            });
        }

        if (!foreignPassportHolder) {
            doc.rect(251.8, 383.8, 7.5, 7).fill();
        }
    }

    fillPhilippinePassportHolderBlock = (doc, philippinePassportHolder, data) => {
        if (philippinePassportHolder) {
            doc.rect(492, 380.5, 7.5, 7).fill();
            doc.fontSize(10);
            doc.font('Thin');
            doc.text(data.old_passport_number, 413, 388, {
                align: 'left',
                width: 130,
                height: 5,
            });

            doc.fontSize(8);
            doc.font('Thin');
            doc.text(data.old_passport_issuance_date, 345, 400, {
                align: 'center',
                width: 80,
                height: 5,
            });

            doc.fontSize(8);
            doc.font('Thin');
            doc.text(data.old_passport_issuance_place, 487, 400, {
                align: 'center',
                width: 60,
                height: 5,
            });
        }

        if (!philippinePassportHolder) {
            doc.rect(524, 380.5, 7.5, 7).fill();

        }
    }

    buildData = (emailAddress, payload, address, birthPlace, branch) => ({
        site: branch,
        date: moment(payload.payment_gateway_datetime).format('D-MM-YYYY'),
        time: moment(payload.payment_gateway_datetime).format('HH:mm:ss'),
        appointment_date: moment(payload.schedule.date).format('dddd,  MMM D, YYYY'),
        appointment_time: moment(payload.schedule.from_time, 'HH:mm:ss').format('HH:mm') + ' ' + moment(payload.schedule.to_time, 'HH:mm:ss').format('HH:mm'),
        transaction_number: payload.ref_no,
        last_name: payload.last_name,
        first_name: payload.first_name,
        middle_name: payload.middle_name,
        pob: birthPlace,
        dob: payload.birth_date,
        gender: payload.gender,
        civil_status: payload.civil_status,
        complete_address: address,
        occupation: payload.occupation,
        work_address: payload.office_address,
        email: emailAddress,
        spouse_name: `${payload.spouse_first_name} ${payload.spouse_middle_name} ${payload.spouse_last_name}`,
        father_name: `${payload.father_first_name} ${payload.father_middle_name} ${payload.father_last_name}`,
        mother_maiden_name: `${payload.mother_first_name} ${payload.mother_middle_name} ${payload.mother_last_name}`,
        home_tel_no: payload.telephone_number,
        mobile_number: payload.mobile_number,
        work_tel_no: payload.office_number,
        spouse_citizenship: payload.spouse_country_citizenship,
        father_citizenship: payload.father_country_citizenship,
        mother_citizenship: payload.mother_country_citizenship,
        citizenship_acquired_by: payload.basis_of_philippine_citizenship,
        passport_holder: payload.passport_holder,
        foreign_passport_country: payload.foreign_passport_holder,
        has_old_philippine_passport: payload.passport_holder,
        old_passport_number: payload.old_passport_number,
        old_passport_issuance_date: payload.old_passport_date_of_issue,
        old_passport_issuance_place: payload.issuing_authority,
        minor_companion: payload.traveling_companion_name,
        companion_relationship: payload.traveling_companion_relationship,
        companion_contact_number: payload.traveling_companion_contact_number,
        rereceipt_number: '1800250228',
        merchant: payload.payment_gateway_type,
        branch_code: '7112630',
        refno: payload.payment_gateway_ref_no,
        transaction: 'PASSPORT PROCESSING',
        processing_type: payload.processing_type,
        payment_mode: 'CASH',
        service_number: '1800250228',
        epassport_fee: payload.amount,
        expidite_fee: 'P 250.00',
    })
}

export default new ApplicationPDF();
