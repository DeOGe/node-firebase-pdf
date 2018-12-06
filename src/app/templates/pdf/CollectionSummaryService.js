import Fs from 'fs';
import PDFKit from 'pdfkit';
// import moment from 'moment';
// import codes from 'rescode';
import {amountFormat, toInt} from './Helpers/Number';

class CollectionSummaryService {
    process(filename/* , callback */) {
        const processor = this;
        const onProcess = processor.generatePDF(filename);
        // onProcess.then(() => {
        //     callback();
        // });
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
                console.log('PDF GENERATED.');
                resolve();
            });
        });
    }

    pageOne = (doc, data) => new Promise((resolve) => {
        let posY = doc.y;
        doc.font('Courier')
        doc.fontSize(12);
        // doc.text('0', 0, 0, {
        //     align: 'left',
        //     width: 550,
        // });

        // doc.text('612', 0, 0, {
        //     align: 'right',
        //     width: 612,
        // });

        doc.text('P a y m e n t   C o l l e c t i o n   S e r v i c e', 30, 30, {
            align: 'center',
            width: 550,
        });

        doc.text('-------------------------------------', 30, 55, {
            align: 'center',
            width: 550,
        });

        doc.text('C O L L E C T I O N   S U M M A R Y', 30, 70, {
            align: 'center',
            width: 550,
        });

        doc.text('-------------------------------------', 30, 85, {
            align: 'center',
            width: 550,
        });

        doc.fontSize(8.5);
        doc.text('TPA Code : '+ data.tpa_code, 30, 120, {
            align: 'left',
            width: 100,
        });


        doc.text('TPA Name : '+ data.tpa_name, 160, 120, {
            align: 'left',
            width: 200,
        });

        doc.text(`Run by User ${data.run_by} > ${data.run_on}`, 30, 130, {
            align: 'left',
            width: 582,
        });

        doc.text(`REPORT FOR ${data.report_for}`, 30, 150, {
            align: 'left',
            width: 582,
        });

        doc.text(`Total for ALL`, 30, 170, {
            align: 'left',
            width: 85,
        });
        doc.text(`${data.total.all.count}`, 115, 170, {
            align: 'right',
            width: 30,
        });
        doc.text('Transactions  :', 150, 170, {
            align: 'left',
            width: 80,
        });
        doc.text(data.total.all.transactions, 230, 170, {
            align: 'right',
            width: 80,
        });


        doc.text(`Total for cash`, 30, 180, {
            align: 'left',
            width: 85,
        });
        doc.text(`${data.total.cash.count}`, 115, 180, {
            align: 'right',
            width: 30,
        });
        doc.text('Transactions  :', 150, 180, {
            align: 'left',
            width: 80,
        });
        doc.text(data.total.cash.transactions, 230, 180, {
            align: 'right',
            width: 80,
        });


        doc.text(`Total for check`, 30, 190, {
            align: 'left',
            width: 85,
        });
        doc.text(`${data.total.check.count}`, 115, 190, {
            align: 'right',
            width: 30,
        });
        doc.text('Transactions  :', 150, 190, {
            align: 'left',
            width: 80,
        });
        doc.text(data.total.check.transactions, 230, 190, {
            align: 'right',
            width: 80,
        });


        doc.text(`Total for card`, 30, 200, {
            align: 'left',
            width: 85,
        });
        doc.text(`${data.total.card.count}`, 115, 200, {
            align: 'right',
            width: 30,
        });
        doc.text('Transactions  :', 150, 200, {
            align: 'left',
            width: 80,
        });
        doc.text(data.total.card.transactions, 230, 200, {
            align: 'right',
            width: 80,
        });


        doc.text('Trans Merchant', 30, 220, {
            align: 'left',
            width: 100,
        });
        doc.text('Cash Amt/Cnt', 180, 220, {
            align: 'left',
            width: 100,
        });
        doc.text('Check Amt/Cnt', 300, 220, {
            align: 'left',
            width: 100,
        });
        doc.text('Card Amt/Cnt', 420, 220, {
            align: 'left',
            width: 100,
        });
        doc.text('Total Amt', 520, 220, {
            align: 'left',
            width: 100,
        });
        
        let transactions = data.transactions;
        let startY = 230;

        let totalAmount = 0;
        let totalCount = 0;
        let cashTotal = {amount: 0, count: 0};
        let checkTotal = {amount: 0, count: 0};
        let cardTotal = {amount: 0, count: 0};
        transactions.forEach((txn, i) => {
            const cash = txn.cash;
            const check = txn.check;
            const card = txn.card;
            let items = cash.count + check.count + card.count
            doc.text(`${items} ${txn.merchant}`, 40, startY, {
                align: 'left',
                width: 130
            });

            doc.text(`${cash.amount}/`, 160, startY, {
                align: 'right',
                width: 70,
            });

            doc.text(`${cash.count}`, 230, startY, {
                align: 'right',
                width: 30,
            });

            doc.text(`${check.amount}/`, 280, startY, {
                align: 'right',
                width: 70,
            });

            doc.text(`${check.count}`, 350, startY, {
                align: 'right',
                width: 30,
            });

            doc.text(`${card.amount}/`, 390, startY, {
                align: 'right',
                width: 70,
            });

            doc.text(`${card.count}`
                , 460, startY, {
                align: 'right',
                width: 30,
            });

            const rowTotal = toInt(cash.amount) + toInt(check.amount) + toInt(card.amount)
            doc.text(`${amountFormat(rowTotal)}`
                , 520, startY, {
                align: 'right',
                width: 50,
            });

            cashTotal.count += cash.count;
            cashTotal.amount += toInt(cash.amount);

            checkTotal.count += check.count;
            checkTotal.amount += toInt(check.amount);

            cardTotal.count += card.count;
            cardTotal.amount += toInt(card.amount);

            totalAmount += rowTotal;
            totalCount += items;
            startY += 15;
        });

        doc.text('Trans Merchant', 30, startY+15, {
            align: 'left',
            width: 100,
        });
        doc.text('Cash Amt/Cnt', 180, startY+15, {
            align: 'left',
            width: 100,
        });
        doc.text('Check Amt/Cnt', 300, startY+15, {
            align: 'left',
            width: 100,
        });
        doc.text('Card Amt/Cnt', 420, startY+15, {
            align: 'left',
            width: 100,
        });
        doc.text('Total Amt', 520, startY+15, {
            align: 'left',
            width: 100,
        });

        

        doc.text(`${totalCount}`, 40, startY+30, {
            align: 'left',
            width: 130
        });

        doc.text(`${cashTotal.amount}/`, 160, startY+30, {
            align: 'right',
            width: 70,
        });

        doc.text(`${cashTotal.count}`, 230, startY+30, {
            align: 'right',
            width: 30,
        });

        doc.text(`${checkTotal.amount}/`, 280, startY+30, {
            align: 'right',
            width: 70,
        });

        doc.text(`${checkTotal.count}`, 350, startY+30, {
            align: 'right',
            width: 30,
        });

        doc.text(`${cardTotal.amount}/`, 390, startY+30, {
            align: 'right',
            width: 70,
        });

        doc.text(`${cardTotal.count}`, 460, startY+30, {
            align: 'right',
            width: 30,
        });

        doc.text(`${amountFormat(totalAmount)}`, 500, startY+30, {
            align: 'right',
            width: 70,
        });

        doc.text(`****************************** End of Report ******************************`, 30, startY+55, {
            align: 'center',
            width: 550,
        });

        doc.text('Noted By:__________________', 300, startY+100, {
            align: 'right',
            width: 250,
        });

        doc.text('Supervisor / Manager', 300, startY+115, {
            align: 'right',
            width: 250,
        });

        resolve();
    });

    buildData = () => ({
        tpa_code: '0000',
        tpa_name: 'JEROMEDELEON',
        run_by: 'jedeleon',
        deposit: '50000',
        run_on: 'September 14,2018 10:36:34 AM',
        report_for: 'July 26,2018',
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
            }
        },
        transactions: [
            {
                count: 10,
                merchant: 'AVON_Cosmet',
                cash: {
                    count: 10,
                    amount: '17,77.00'
                },
                check: {
                    count: 0,
                    amount: '0.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 1777
            },
            {
                count: 10,
                merchant: 'BPI_MS',
                cash: {
                    count: 10,
                    amount: '3,700.00'
                },
                check: {
                    count: 0,
                    amount: '0.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 3700
            },
            {
                count: 10,
                merchant: 'BayadCenter',
                cash: {
                    count: 10,
                    amount: '1,500.00'
                },
                check: {
                    count: 0,
                    amount: '0.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 1500
            },
            {
                count: 10,
                merchant: 'CLPCO',
                cash: {
                    count: 5,
                    amount: '500.00'
                },
                check: {
                    count: 5,
                    amount: '1,000.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 1500
            },
            {
                count: 10,
                merchant: 'DASCA_CABLE',
                cash: {
                    count: 10,
                    amount: '1,718.00'
                },
                check: {
                    count: 0,
                    amount: '0.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 1718
            },
            {
                count: 10,
                merchant: 'DAVAO_Light',
                cash: {
                    count: 5,
                    amount: '500.00'
                },
                check: {
                    count: 5,
                    amount: '4,000.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 4500
            },
            {
                count: 10,
                merchant: 'MEZCO',
                cash: {
                    count: 5,
                    amount: '500.00'
                },
                check: {
                    count: 5,
                    amount: '5,000.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 5500
            },
            {
                count: 10,
                merchant: 'NHA',
                cash: {
                    count: 10,
                    amount: '3,010.00'
                },
                check: {
                    count: 0,
                    amount: '0.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 3010
            },
            {
                count: 10,
                merchant: 'Southlink_w',
                cash: {
                    count: 10,
                    amount: '3,005.00'
                },
                check: {
                    count: 0,
                    amount: '0.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 3005
            },
            {
                count: 10,
                merchant: 'VECO',
                cash: {
                    count: 5,
                    amount: '500.00'
                },
                check: {
                    count: 5,
                    amount: '3,000.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 3500
            },
            {
                count: 60,
                merchant: 'CIS_Fee',
                cash: {
                    count: 30,
                    amount: '310.00'
                },
                check: {
                    count: 0,
                    amount: '0.00'
                },
                card: {
                    count: 0,
                    amount: '0.00'
                },
                total: 310
            }
        ]
    })

    
}



export default new CollectionSummaryService();
