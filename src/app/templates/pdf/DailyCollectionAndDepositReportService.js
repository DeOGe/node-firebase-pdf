import Fs from 'fs';
import PDFKit from 'pdfkit';
import { amountFormat, toInt } from './Helpers/Number';

class DailyCollectionAndDepositReportService {

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
                // this.pageTwo(doc, data).then(() => {
                //     this.pageThree(doc, data).then(() => {
                        doc.end()
                        console.log('PDF2 GENERATED.');
                        resolve();
                //     });
                // });
            });
        });
    }

    pageOne = (doc, data) => new Promise((resolve) => {
        let posY = doc.y;
        doc.font('Courier')
        doc.fontSize(10);

        let startY = 125;
        let page = 1;
        this.addHeader(doc, data, page);
        data.merchants.forEach((merchant, key, arr) => {
            if (startY + 190 > 700) {
                doc.addPage()
                page += 1;
                this.addHeader(doc, data, page);
                startY = 110;
            }

            this.addMerchantColumn(doc, merchant, startY);
            if (!Object.is(arr.length - 1, key)) {
                doc.text('_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _', 30, startY + 175, {
                    align: 'center',
                    width: 550,
                });
            } 
            startY += 190;
            
        });

        resolve();
    });

    addHeader = (doc, data, page) => new Promise((resolve) => {
        let startY = 30;
        if (page > 1) {
            doc.text(`Page ${page}`, 30, startY, {
                align: 'left',
                width: 550,
            });
            startY = 40;
        }

        doc.text('Payment Collection Service', 30, startY + 10, {
            align: 'left',
            width: 550,
        });
        doc.text('DAILY COLLECTION AND DEPOSIT REPORT', 30, startY + 20, {
            align: 'left',
            width: 550,
        });

        doc.fontSize(9);
        doc.text('BayadCenter Code:', 30, startY + 30, {
            align: 'left',
            width: 550,
        });

        doc.text('TPA ID: 0000', 30, startY + 40, {
            align: 'left',
            width: 550,
        });

        if (page < 2) {
            doc.text('REPORT GENERATED FOR TRANSACTION DATE - ' + `${data.transactionDate}`, 30, startY + 55, {
                align: 'left',
                width: 550,
            });
    
            doc.text('Run Date: ' + `${data.runDate}`, 30, startY +65, {
                align: 'left',
                width: 550,
            });
    
            doc.text('Prepared By : ' + `${data.preparedBy}`, 30, startY + 80, {
                align: 'left',
                width: 550,
            });
        }
    });

    addMerchantColumn = (doc, merchant, startPos) => new Promise((resolve) => {
        doc.text(merchant.name, 30, startPos, {
            align: 'left',
            width: 550,
        });

        doc.text('Cash Amt/Cnt', 200, startPos + 20, {
            align: 'left',
            width: 200,
        });
        doc.text('Check Amt/Cnt', 350, startPos + 20, {
            align: 'left',
            width: 200,
        });
        doc.text('Total Amt', 500, startPos + 20, {
            align: 'left',
            width: 300,
        });

        doc.text('COLLECTIONS', 30, startPos + 20, {
            align: 'left',
            width: 550,
        });

        doc.text(`${merchant.total.cash.transactions}`, 230, startPos + 30, {
            align: 'left',
            width: 200,
        });

        doc.text(`${merchant.total.check.transactions}`, 390, startPos + 30, {
            align: 'left',
            width: 200,
        });

        doc.text(`${merchant.total.all.transactions}`, 500, startPos + 30, {
            align: 'left',
            width: 200,
        });

        doc.text('VALIDATED DEPOSITS', 30, startPos + 60, {
            align: 'left',
            width: 550,
        });

        doc.text('________________', 300, startPos + 65, {
            align: 'right',
            width: 250,
        });

        doc.text('Total Deposits', 200, startPos + 80, {
            align: 'center',
            width: 250,
        });

        doc.text(`${amountFormat(merchant.total.deposit)}`, 390, startPos + 80, {
            align: 'center',
            width: 250,
        });

        doc.text('Difference', 200, startPos + 100, {
            align: 'center',
            width: 250,
        });
        let difference = `${parseFloat(merchant.total.deposit.replace(/,/g, ''))}` - `${parseFloat(merchant.total.all.transactions.replace(/,/g, ''))}`;
        doc.text(`${amountFormat(difference)}`, 390, startPos + 100, {
            align: 'center',
            width: 250,
        });

        doc.text('________________', 465, startPos + 105, {
            align: 'left',
            width: 250,
        });

        doc.text('________________', 465, startPos + 125, {
            align: 'left',
            width: 250,
        });

        doc.text('Noted By: __________________', 302, startPos + 145, {
            align: 'right',
            width: 250,
        });

        doc.text('Supervisor / Manager', 300, startPos + 155, {
            align: 'right',
            width: 250,
        });

        doc.text('(sign over printed name)', 310, startPos + 165, {
            align: 'right',
            width: 250,
        });
    });

    pageTwo = (doc, data) => new Promise((resolve) => {
        doc.addPage();
        let posY = doc.y;

        doc.fontSize(12);

        doc.text('Payment Collection Service', 30, 30, {
            align: 'left',
            width: 550
        });

        doc.text('L I S T  O F  B A N K  C H E C K S', 30, 40, {
            align: 'left',
            width: 550
        });

        doc.text('TPA Code : 0000', 30, 50, {
            align: 'left',
            width: 100
        });

        doc.text('TPA Name : JEROMEDELEONNN', 150, 50, {
            align: 'left',
            width: 300
        });

        doc.text('Run Date : September 14, 2018  10:52:53 AM', 30, 60, {
            align: 'left',
            width: 550,
        });

        doc.text('REPORT FOR July 26, 2018', 30, 80, {
            align: 'left',
            width: 550
        });

        doc.text('cut here -----------------------------------------------------------------------------------------------------------------------', 30, 100, {
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
        doc.text('cut here -----------------------------------------------------------------------------------------------------------------------', 30, 160, {
            align: 'left',
            width: 550
        });

        doc.text('Maynilad Water Services, Inc.', 30, 180, {
            align: 'left',
            width: 550
        });
        doc.text('Bank Name', 30, 190, {
            align: 'left',
            width: 100
        });
        doc.text('Branch', 200, 190, {
            align: 'left',
            width: 100
        });
        doc.text('Check No.', 350, 190, {
            align: 'left',
            width: 100
        });
        doc.text('Amount', 500, 190, {
            align: 'left',
            width: 100
        });
        doc.text('Total for (0) Maynilad transaction/s:', 30, 200, {
            align: 'left',
            width: 550
        });
        doc.text('0.00', 430, 200, {
            align: 'right',
            width: 100
        });
        doc.text('cut here -----------------------------------------------------------------------------------------------------------------------', 30, 220, {
            align: 'left',
            width: 550
        });

        doc.text('Social Security System', 30, 240, {
            align: 'left',
            width: 550
        });
        doc.text('Bank Name', 30, 250, {
            align: 'left',
            width: 100
        });
        doc.text('Branch', 200, 250, {
            align: 'left',
            width: 100
        });
        doc.text('Check No.', 350, 250, {
            align: 'left',
            width: 100
        });
        doc.text('Amount', 500, 250, {
            align: 'left',
            width: 100
        });
        doc.text('Total for (0) SSS_CON transaction/s:', 30, 260, {
            align: 'left',
            width: 550
        });
        doc.text('0.00', 430, 260, {
            align: 'right',
            width: 100
        });
        doc.text('cut here -----------------------------------------------------------------------------------------------------------------------', 30, 280, {
            align: 'left',
            width: 550
        });

        doc.text('Manila Water Company', 30, 300, {
            align: 'left',
            width: 550
        });
        doc.text('Bank Name', 30, 310, {
            align: 'left',
            width: 100
        });
        doc.text('Branch', 200, 310, {
            align: 'left',
            width: 100
        });
        doc.text('Check No.', 350, 310, {
            align: 'left',
            width: 100
        });
        doc.text('Amount', 500, 310, {
            align: 'left',
            width: 100
        });
        doc.text('Total for (0) MWCOM transaction/s:', 30, 320, {
            align: 'left',
            width: 550
        });
        doc.text('0.00', 430, 320, {
            align: 'right',
            width: 100
        });
        doc.text('cut here -----------------------------------------------------------------------------------------------------------------------', 30, 340, {
            align: 'left',
            width: 550
        });

        doc.text('Manila Water Company', 30, 360, {
            align: 'left',
            width: 550
        });
        doc.text('Bank Name', 30, 370, {
            align: 'left',
            width: 100
        });
        doc.text('Branch', 200, 370, {
            align: 'left',
            width: 100
        });
        doc.text('Check No.', 350, 370, {
            align: 'left',
            width: 100
        });
        doc.text('Amount', 500, 370, {
            align: 'left',
            width: 100
        });
        doc.text('Total for (0) MWCOM transaction/s:', 30, 380, {
            align: 'left',
            width: 550
        });
        doc.text('0.00', 430, 380, {
            align: 'right',
            width: 100
        });
        doc.text('cut here -----------------------------------------------------------------------------------------------------------------------', 30, 400, {
            align: 'left',
            width: 550
        });

        doc.text('SkyCable', 30, 420, {
            align: 'left',
            width: 550
        });
        doc.text('Bank Name', 30, 430, {
            align: 'left',
            width: 100
        });
        doc.text('Branch', 200, 430, {
            align: 'left',
            width: 100
        });
        doc.text('Check No.', 350, 430, {
            align: 'left',
            width: 100
        });
        doc.text('Amount', 500, 430, {
            align: 'left',
            width: 100
        });
        doc.text('Total for (0) SkyCable transaction/s:', 30, 440, {
            align: 'left',
            width: 550
        });
        doc.text('0.00', 430, 440, {
            align: 'right',
            width: 100
        });
        doc.text('cut here -----------------------------------------------------------------------------------------------------------------------', 30, 460, {
            align: 'left',
            width: 550
        });

        doc.text('PLDTI', 30, 480, {
            align: 'left',
            width: 550
        });
        doc.text('Bank Name', 30, 490, {
            align: 'left',
            width: 100
        });
        doc.text('Branch', 200, 490, {
            align: 'left',
            width: 100
        });
        doc.text('Check No.', 350, 490, {
            align: 'left',
            width: 100
        });
        doc.text('Amount', 500, 490, {
            align: 'left',
            width: 100
        });
        doc.text('Total for (0) PLDTI transaction/s:', 30, 500, {
            align: 'left',
            width: 550
        });
        doc.text('0.00', 430, 500, {
            align: 'right',
            width: 100
        });
        doc.text('cut here -----------------------------------------------------------------------------------------------------------------------', 30, 520, {
            align: 'left',
            width: 550
        });

        doc.text('Globe Telecom', 30, 540, {
            align: 'left',
            width: 550
        });
        doc.text('Bank Name', 30, 550, {
            align: 'left',
            width: 100
        });
        doc.text('Branch', 200, 550, {
            align: 'left',
            width: 100
        });
        doc.text('Check No.', 350, 550, {
            align: 'left',
            width: 100
        });
        doc.text('Amount', 500, 550, {
            align: 'left',
            width: 100
        });
        doc.text('Total for (0) Globe transaction/s:', 30, 560, {
            align: 'left',
            width: 550
        });
        doc.text('0.00', 430, 560, {
            align: 'right',
            width: 100
        });
        doc.text('cut here -----------------------------------------------------------------------------------------------------------------------', 30, 580, {
            align: 'left',
            width: 550
        });

        doc.text('2C2P', 30, 600, {
            align: 'left',
            width: 550
        });
        doc.text('Bank Name', 30, 610, {
            align: 'left',
            width: 100
        });
        doc.text('Branch', 200, 610, {
            align: 'left',
            width: 100
        });
        doc.text('Check No.', 350, 610, {
            align: 'left',
            width: 100
        });
        doc.text('Amount', 500, 610, {
            align: 'left',
            width: 100
        });
        doc.text('Total for (0) 2C2P transaction/s:', 30, 620, {
            align: 'left',
            width: 550
        });
        doc.text('0.00', 430, 620, {
            align: 'right',
            width: 100
        });
        doc.text('cut here -----------------------------------------------------------------------------------------------------------------------', 30, 640, {
            align: 'left',
            width: 550
        });
        resolve();
    });
    pageThree = (doc, data) => new Promise((resolve) => {
        doc.addPage();
        let posY = doc.y;
        doc.fontSize(12);

        doc.text('Payment Collection Service', 30, 30, {
            align: 'center',
            width: 550,
        });

        doc.text('TPA MONTHLY TRANSACTION VOLUME REPORT', 30, 40, {
            align: 'center',
            width: 550,
        });

        doc.text('Report for the month of <month>', 30, 50, {
            align: 'center',
            width: 550,
        });

        doc.text('TPA Code      : 0000', 30, 80, {
            align: 'left',
            width: 550
        });
        doc.text('TPA Name     : JEROMEDELEONNN', 30, 90, {
            align: 'left',
            width: 550
        });
        doc.text('Prepared by   : jedeleon', 30, 100, {
            align: 'left',
            width: 550
        });

        doc.text('Merchant      : Meralco - Manila Electric Company', 30, 120, {
            align: 'left',
            width: 550
        });

        doc.text('No transactions for the month of <month>.', 30, 130, {
            align: 'left',
            width: 550
        });

        doc.text('Signed and verified by: _______________________________', 30, 160, {
            align: 'left',
            width: 550
        });

        doc.text('* * * * * * * * * * * * * * * * End of Report * * * * * * * * * * * * * * * *', 30, 200, {
            align: 'center',
            width: 550
        });
        resolve();
    });

    buildData = () => ({
        test: 'test',
        transactionDate: 'July 26, 2018',
        runDate: 'September 14, 2018 10:38:40 AM',
        preparedBy: 'jedeleon',
        merchants: [
            {
                name: "Manila Electric Company",
                total: {
                    all: {
                        count: 160,
                        transactions: '30,020.00',
                    },
                    cash: {
                        count: 110,
                        transactions: '17,020.00'
                    },
                    check: {
                        count: 20,
                        transactions: '13,000.00'
                    },
                    card: {
                        count: 0,
                        transactions: '0.00'
                    },
                    deposit: '50000'
                },
            },
            {
                name: "Manila Water Services, Inc.",
                total: {
                    all: {
                        count: 160,
                        transactions: '30,020.00',
                    },
                    cash: {
                        count: 110,
                        transactions: '17,020.00'
                    },
                    check: {
                        count: 20,
                        transactions: '13,000.00'
                    },
                    card: {
                        count: 0,
                        transactions: '0.00'
                    },
                    deposit: '50000'
                }
            },
            {
                name: "Manila Water Services, Inc.",
                total: {
                    all: {
                        count: 160,
                        transactions: '30,020.00',
                    },
                    cash: {
                        count: 110,
                        transactions: '17,020.00'
                    },
                    check: {
                        count: 20,
                        transactions: '13,000.00'
                    },
                    card: {
                        count: 0,
                        transactions: '0.00'
                    },
                    deposit: '50000'
                }
            },
            {
                name: "Manila Water Services, Inc.",
                total: {
                    all: {
                        count: 160,
                        transactions: '30,020.00',
                    },
                    cash: {
                        count: 110,
                        transactions: '17,020.00'
                    },
                    check: {
                        count: 20,
                        transactions: '13,000.00'
                    },
                    card: {
                        count: 0,
                        transactions: '0.00'
                    },
                    deposit: '50000'
                }
            }
        ]
    });
}

export default new DailyCollectionAndDepositReportService();