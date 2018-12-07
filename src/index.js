import Env from 'dotenv';
import moment from 'moment';
import figlet from 'figlet';
import GulpUtil from 'gulp-util';
import FirebaseAdmin from 'firebase-admin';
import ServiceAccount from '../../credentials.json';
import EmailCollectionSummary from './app/EmailCollectionSummary';
import { resolve } from 'path';
// import { resolve } from 'url';
// import listOfBankChecks from './app/templates/pdf/ListOfBankChecks';
// import userCollectionService from './app/templates/pdf/UserCollectionService';
// import dailyCollectionAndDepositReportService from './app/templates/pdf/DailyCollectionAndDepositReportService';

class PDF {
    
    constructor() {
        this.fb = FirebaseAdmin.initializeApp({
            credential: FirebaseAdmin.credential.cert(ServiceAccount),
            databaseURL: process.env.FIREBASE_URL,
        });
    }

    initialize = () => {
        console.log(GulpUtil.colors.green(figlet.textSync('PDF-GENERATOR', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'full',
        })));
        
        this.emailCollectionSummary();
        // this.dailyCollectionAndDepositReportService();
        // this.listOfBankChecks();
        // this.userCollectionService();
    } 

    // collectionSummaryService = () => {
    //     const filename = 'CollectionSummary'/*CryptoJS.MD5(moment().format('YYYYMMDD hhmmss')).toString() */;
    //     const pdf = this.generatePaymentCollectionPdf(
    //         filename,
    //     );
    //     pdf.then((res) => {
    //         resolve(res);
    //     })
    //     .catch((err) => {
    //         reject(err);
    //     });
    // }

    emailCollectionSummary = () => {
        const options = {
            specId: 'payment_reference',
            numWorkers: 5,
            suppressStack: true,
        };
        const ref = this.fb.database().ref('queue');
        const emailCollectionSummary = new EmailCollectionSummary({
            name: 'Jon Doe',
            email: 'deocampogerhard@gmail.com',
            payload: {
                tpa_code: '0000',
                tpa_name: 'JEROMEDELEON',
                run_by: 'jedeleon',
                deposit: '50000',
                run_on: 'September 14,2018 10:36:34 AM',
                report_for: 'July 26,2018',
            }
        }).process();

        emailCollectionSummary
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        // const firebase = new FirebaseQueue(ref, options, (data, prog'res's, resolve, reject) => {
        //     const emailReport = new EmailPaymentReference(data.data).process();
        //     emailReport
        //         .then((res) => {
        //             console.log(res);
        //             resolve(res);
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //             reject();
        //         });
        // });
    }

    // generatePaymentCollectionPdf = (filename) => {
    //     const promise = new Promise(() => {
    //         collectionSummaryService.process(
    //             filename,
    //             /* () => {
    //                 // this.uploadS3Link(filename);
    //                 resolve();
    //             }, */
    //         );
    //     });
    //     return promise;
    // }

    // listOfBankChecks = () => {
    //     const filename = 'ListOfBankChecks'/*CryptoJS.MD5(moment().format('YYYYMMDD hhmmss')).toString() */;
    //     const pdf = this.generateListOfBankChecksPdf(
    //         filename,
    //     );
    //     pdf.then((res) => {
    //         resolve(res);
    //     })
    //     .catch((err) => {
    //         reject(err);
    //     });
    // }

    // generateListOfBankChecksPdf = (filename) => {
    //     const promise = new Promise(() => {
    //         listOfBankChecks.process(
    //             filename,
    //             /* () => {
    //                 // this.uploadS3Link(filename);
    //                 resolve();
    //             }, */
    //         );
    //     });
    //     return promise;
    // }

    // dailyCollectionAndDepositReportService = () => {
    //     const filename = 'DailyCollectionAndDepositReport'/*CryptoJS.MD5(moment().format('YYYYMMDD hhmmss')).toString() */;
    //     const pdf = this.generateDailyCollectionPdf(
    //         filename,
    //     );
    //     pdf.then((res) => {
    //         resolve(res);
    //     })
    //     .catch((err) => {
    //         reject(err);
    //     });
    // }

    // generateDailyCollectionPdf = (filename) => {
    //     const promise = new Promise(() => {
    //         dailyCollectionAndDepositReportService.process(
    //             filename,
    //             /* () => {
    //                 // this.uploadS3Link(filename);
    //                 resolve();
    //             }, */
    //         );
    //     });
    //     return promise;
    // }

    // userCollectionService = () => {
    //     const filename = 'UserCollection'/*CryptoJS.MD5(moment().format('YYYYMMDD hhmmss')).toString() */;
    //     const pdf = this.generateUserCollection(
    //         filename,
    //     );
    //     pdf.then((res) => {
    //         resolve(res);
    //     })
    //     .catch((err) => {
    //         reject(err);
    //     });
    // }

    // generateUserCollection = (filename) => {
    //     const promise = new Promise(() => {
    //         userCollectionService.process(
    //             filename,
    //             /* () => {
    //                 // this.uploadS3Link(filename);
    //                 resolve();
    //             }, */
    //         );
    //     });
    //     return promise;
    // }

}

Env.config();
const x = new PDF();
x.initialize();
