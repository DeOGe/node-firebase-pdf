import Fs from 'fs';
import PDFKit from 'pdfkit';
import { amountFormat, toInt } from './Helpers/Number';

class ListOfBankChecks {

    process(filename) {
        const processor = this;
        const onProcess = processor.generatePDF(filename);
    }

    generatePDF(filename) {
        return new Promise((resolve) => {
            const doc = new PDFKit();
            doc.pipe(Fs.createWriteStream(`src/resources/pdf/${filename}.pdf`));
            doc.registerFont('Thin', 'src/app/templates/pdf/assets/fonts/TimesNewRomans.ttf');
            doc.registerFont('Bold', 'src/app/templates/pdf/assets/fonts/TimesNewRomansBold.ttf');

            const data = this.buildData();

            this.pageOne(doc, data).then(() => {
                doc.end()
                console.log('BANK CHECKS GENERATED.');
                resolve();
            });
        });
    }

    pageOne = (doc, data) => new Promise((resolve) => {
        let posY = doc.y;

        doc.font('Courier')
        doc.fontSize(9);

        doc.text('Payment Collection Service', 30, 30, {
            align: 'left',
            width: 550
        });

        doc.text('L I S T  O F  B A N K  C H E C K S', 30, 40, {
            align: 'left',
            width: 550
        });

        doc.text(`TPA Code : ${data.tpa_code}`, 30, 50, {
            align: 'left',
            width: 100
        });

        doc.text(`TPA Name : ${data.tpa_name}`, 150, 50, {
            align: 'left',
            width: 300
        });

        doc.text(`Run Date : ${data.run_date}`, 30, 60, {
            align: 'left',
            width: 550,
        });

        doc.text(`REPORT FOR ${data.report_for}`, 30, 80, {
            align: 'left',
            width: 550
        });

        doc.text('cut here ------------------------------------------------------------------------------------------', 30, 100, {
            align: 'left',
            width: 550
        });

        doc.text('Manila Electric Company', 30, 120, {
            align: 'left',
            width: 550
        });
        doc.text('Bank Name', 30, 130, {
            align: 'left',
            width: 100
        });
        doc.text('Branch', 200, 130, {
            align: 'left',
            width: 100
        });
        doc.text('Check No.', 350, 130, {
            align: 'left',
            width: 100
        });
        doc.text('Amount', 500, 130, {
            align: 'left',
            width: 100
        });
        doc.text('Total for (0) Meralco transaction/s:', 30, 140, {
            align: 'left',
            width: 550
        });

        doc.text('0.00', 430, 140, {
            align: 'right',
            width: 100
        });
        
        resolve();
    });

    buildData = () => ({
        tpa_code: 'test',
        tpa_name: 'July 26, 2018',
        run_date: 'September 14, 2018 10:38:40 AM',
        report_for: 'July 26, 2018 10:38:40 AM',
        merchants: {}
    });
}

export default new DailyCollectionAndDepositReportService();