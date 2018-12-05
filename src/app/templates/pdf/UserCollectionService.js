import Fs from 'fs';
import PDFKit from 'pdfkit';
import { amountFormat, toInt } from './Helpers/Number';

class UserCollectionService {
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
                console.log('PDF3 GENERATED.');
                resolve();
                // this.pageTwo(doc, data).then(() => {
                // });
            });
        });
    }
    pageOne = (doc, data) => new Promise((resolve) => {
        let posY = doc.y;
        doc.fontSize(10);

        doc.text('Payment Collection Service', 30, 30, {
            align: 'left',
            width: 550
        });

        doc.text('U S E R  C O L L E C T I O N  R E P O R T', 30, 40, {
            align: 'left',
            width: 550
        });

        doc.text('TPA Code: ' + `${data.tpa_code}`, 30, 50, {
            align: 'left',
            width: 550
        });

        doc.text('TPA Name: ' + `${data.tpa_name}`, 150, 50, {
            align: 'left',
            width: 550
        });

        doc.text('Run Date : September 14, 2018   10:44:55 AM', 30, 60, {
            align: 'left',
            width: 550
        });

        doc.text('REPORT FOR ' + `${data.transaction.date}`, 30, 75, {
            align: 'left',
            width: 550
        });

        doc.text('Transaction for user : ' + `${data.user}`, 30, 85, {
            align: 'left',
            width: 550
        });

        doc.text('Acct # ', 30, 95, {
            align: 'left',
            width: 100,
        });
        doc.text('Merchant ', 120, 95, {
            align: 'left',
            width: 100,
        });
        doc.text('Cash Amt', 200, 95, {
            align: 'left',
            width: 100,
        });
        doc.text('Check Amt', 280, 95, {
            align: 'left',
            width: 100,
        });
        doc.text('Card Amt', 360, 95, {
            align: 'left',
            width: 100,
        });
        doc.text('Amount', 430, 95, {
            align: 'left',
            width: 100,
        });
        doc.text('Pd Time', 480, 95, {
            align: 'left',
            width: 100,
        });
        doc.text('Check #', 550, 95, {
            align: 'left',
            width: 100,
        });
        let cashtransactions = data.transaction.cash_transactions;
        let checktransaction = data.transaction.check_transaction;
        let startY = 105;
        doc.fontSize(8);
        cashtransactions.forEach((txt) => {
            doc.text('CASH TRANSACTIONS', 30, startY, {
                align: 'left',
                width: 550
            });
            startY += 15;
            txt.data.forEach((zxc) => {
                const accnt = zxc.account_name;
                const mrchnt = txt.merchant;
                const cshamt = zxc.cash_amt;
                const chckamt = zxc.check_amt;
                const crdamt = zxc.card_amt;
                const amnt = zxc.amount;
                const pdtime = zxc.pd_time;
                const chckno = zxc.check_no;

                doc.text(`${accnt}`, 30, startY , {
                    align: 'left',
                    width: 550
                });
                doc.text(`${mrchnt}`, 130, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${cshamt}`, 210, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${chckamt}`, 290, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${crdamt}`, 370, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${amnt}`, 430, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${pdtime}`, 480, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${chckno}`, 530, startY, {
                    align: 'left',
                    width: 550
                });
                startY += 12;
            });
            startY += 15;
        });
        checktransaction.forEach((chcktxt) => {
            doc.text('CHECK TRANSACTIONS', 30, startY, {
                align: 'left',
                width: 550
            });
            startY += 15;
            chcktxt.data.forEach((asd) => {
                const accnt = asd.account_name;
                const mrchnt = chcktxt.merchant;
                const cshamt = asd.cash_amt;
                const chckamt = asd.check_amt;
                const crdamt = asd.card_amt;
                const amnt = asd.amount;
                const pdtime = asd.pd_time;
                const chckno = asd.check_no;

                doc.text(`${accnt}`, 30, startY , {
                    align: 'left',
                    width: 550
                });
                doc.text(`${mrchnt}`, 130, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${cshamt}`, 210, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${chckamt}`, 290, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${crdamt}`, 370, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${amnt}`, 430, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${pdtime}`, 480, startY, {
                    align: 'left',
                    width: 550
                });
                doc.text(`${chckno}`, 530, startY, {
                    align: 'left',
                    width: 550
                });
                startY += 12;
            });
            startY += 15;
        });
        resolve();
    });
    buildData = () => ({
        user: 'jedeleon',
        tpa_code: '0000',
        tpa_name: 'JEROMEDELEONNNN',
        transaction: {
            date: 'July 26, 2018',
            cash_transactions: [
                {
                    merchant: 'AVONC',
                    data: [
                        {
                            account_name: '4854-5165-15151',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '17:15',
                            check_no: ''
                        },
                        {
                            account_name: '8754-2132-13213',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '17:15',
                            check_no: ''
                        },
                        {
                            account_name: '5546-5461-52135',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '17:15',
                            check_no: ''
                        },
                        {
                            account_name: '5465-8845-15138',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '17:16',
                            check_no: ''
                        },
                        {
                            account_name: '5151-5321-25418',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '17:17',
                            check_no: ''
                        },
                        {
                            account_name: '5156-4154-16854',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:38',
                            check_no: ''
                        },
                        {
                            account_name: '5641-6848-64864',
                            cash_amt: '170.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '170.00',
                            pd_time: '18:38',
                            check_no: ''
                        },
                        {
                            account_name: '6556-1564-15615',
                            cash_amt: '680.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '680.00',
                            pd_time: '18:39',
                            check_no: ''
                        },
                        {
                            account_name: '4541-5618-65415',
                            cash_amt: '120.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '120.00',
                            pd_time: '18:39',
                            check_no: ''
                        },
                        {
                            account_name: '5465-4186-58648',
                            cash_amt: '157.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '157.00',
                            pd_time: '18:40',
                            check_no: ''
                        }
                    ]
                },
                {
                    merchant: 'BPIMS',
                    data: [
                        {
                            account_name: '48748564878466',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '18:03',
                            check_no: ''
                        },
                        {
                            account_name: '154878456415135',
                            cash_amt: '500.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '500.00',
                            pd_time: '18:04',
                            check_no: ''
                        },
                        {
                            account_name: '248648641354871',
                            cash_amt: '420.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '420.00',
                            pd_time: '18:06',
                            check_no: ''
                        },
                        {
                            account_name: '115415415451651',
                            cash_amt: '300.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '300.00',
                            pd_time: '18:07',
                            check_no: ''
                        },
                        {
                            account_name: '218548641543841',
                            cash_amt: '650.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '650.00',
                            pd_time: '18:07',
                            check_no: ''
                        },
                        {
                            account_name: '655616484513416',
                            cash_amt: '200.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '200.00',
                            pd_time: '18:07',
                            check_no: ''
                        },
                        {
                            account_name: '548413584153418',
                            cash_amt: '520.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '520.00',
                            pd_time: '18:07',
                            check_no: ''
                        },
                        {
                            account_name: '156415648651354',
                            cash_amt: '400.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '400.00',
                            pd_time: '18:08',
                            check_no: ''
                        },
                        {
                            account_name: '548964563418648',
                            cash_amt: '200.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '200.00',
                            pd_time: '18:08',
                            check_no: ''
                        },
                        {
                            account_name: '485486168416548',
                            cash_amt: '410.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '410.00',
                            pd_time: '18:09',
                            check_no: ''
                        },
                    ],
                },
                {
                    merchant: 'MPAY1',
                    data: [
                        {
                            account_name: 'MPBLZU1F9',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:30',
                            check_no: ''
                        },
                        {
                            account_name: 'MP3FOGFUQ7',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:31',
                            check_no: ''
                        },
                        {
                            account_name: 'MPIPRPSEY6',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:31',
                            check_no: ''
                        },
                        {
                            account_name: 'MPA92L73J8',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:32',
                            check_no: ''
                        },
                        {
                            account_name: 'MPDCDRGTW7',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:33',
                            check_no: ''
                        },
                        {
                            account_name: 'MPNKSVRQX3',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:35',
                            check_no: ''
                        },
                        {
                            account_name: 'MPEMPUQD75',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:36',
                            check_no: ''
                        },
                        {
                            account_name: 'MPALCALAAT8',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:36',
                            check_no: ''
                        },
                        {
                            account_name: 'MPEJLDQYX5',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:36',
                            check_no: ''
                        },
                        {
                            account_name: 'MP9UAWPGY4',
                            cash_amt: '150.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '150.00',
                            pd_time: '18:37',
                            check_no: ''
                        },
                    ]
                },
                {
                    merchant: 'CPLCO',
                    data: [
                        {
                            account_name: '95631000007',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '17:40',
                            check_no: ''
                        },
                        {
                            account_name: '46372111115',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '17:41',
                            check_no: ''
                        },
                        {
                            account_name: '77360000005',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '17:41',
                            check_no: ''
                        },
                        {
                            account_name: '6486368738',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '17:42',
                            check_no: ''
                        },
                        {
                            account_name: '12633111112',
                            cash_amt: '100.00',
                            check_amt: '0.00',
                            card_amt: '0.00',
                            amount: '100.00',
                            pd_time: '17:43',
                            check_no: ''
                        },
                    ]
                },
            ],
            check_transaction: [
                {
                    merchant: 'CPLCO',
                    data: [
                        {
                            account_name: '14010000009',
                            cash_amt: '0.00',
                            check_amt: '200.00',
                            card_amt: '0.00',
                            amount: '200.00',
                            pd_time: '17:54',
                            check_no: 'ALB 123456'
                        },
                        {
                            account_name: '64943111118',
                            cash_amt: '0.00',
                            check_amt: '200.00',
                            card_amt: '0.00',
                            amount: '200.00',
                            pd_time: '17:54',
                            check_no: 'ALB 123456'
                        },
                        {
                            account_name: '5067000004',
                            cash_amt: '0.00',
                            check_amt: '200.00',
                            card_amt: '0.00',
                            amount: '200.00',
                            pd_time: '17:55',
                            check_no: 'ALB 123456'
                        },
                        {
                            account_name: '765421111117',
                            cash_amt: '0.00',
                            check_amt: '200.00',
                            card_amt: '0.00',
                            amount: '200.00',
                            pd_time: '17:55',
                            check_no: 'ALB 123456'
                        },
                    ]
                },
            ]
        },

    });
}

export default new UserCollectionService();