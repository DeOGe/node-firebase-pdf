import Env from 'dotenv';
import moment from 'moment';
import figlet from 'figlet';
import GulpUtil from 'gulp-util';
import CryptoJS from 'crypto-js';
import collectionSummaryService from './app/templates/pdf/CollectionSummaryService';
import dailyCollectionAndDepositReportService from './app/templates/pdf/DailyCollectionAndDepositReportService';
import userCollectionService from './app/templates/pdf/UserCollectionService';

class PDF {
    
    constructor() {
        // this.fb = FirebaseAdmin.initializeApp({
        //     credential: FirebaseAdmin.credential.cert(ServiceAccount),
        //     databaseURL: process.env.FIREBASE_URL,
        // });
    }

    initialize = () => {
        console.log(GulpUtil.colors.green(figlet.textSync('PDF-GENERATOR', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'full',
        })));
        
        // this.collectionSummaryService();
        this.dailyCollectionAndDepositReportService();
        // this.userCollectionService();
    } 

    collectionSummaryService = () => {
        const filename = 'PaymentCollection'/*CryptoJS.MD5(moment().format('YYYYMMDD hhmmss')).toString() */;
        const pdf = this.generatePaymentCollectionPdf(
            filename,
        );
        pdf.then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        });
    }

    generatePaymentCollectionPdf = (filename) => {
        const promise = new Promise(() => {
            collectionSummaryService.process(
                filename,
                /* () => {
                    // this.uploadS3Link(filename);
                    resolve();
                }, */
            );
        });
        return promise;
    }

    dailyCollectionAndDepositReportService = () => {
        const filename = 'DailyCollectionAndDepositReport'/*CryptoJS.MD5(moment().format('YYYYMMDD hhmmss')).toString() */;
        const pdf = this.generateDailyCollectionPdf(
            filename,
        );
        pdf.then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        });
    }

    generateDailyCollectionPdf = (filename) => {
        const promise = new Promise(() => {
            dailyCollectionAndDepositReportService.process(
                filename,
                /* () => {
                    // this.uploadS3Link(filename);
                    resolve();
                }, */
            );
        });
        return promise;
    }

    userCollectionService = () => {
        const filename = 'UserCollection'/*CryptoJS.MD5(moment().format('YYYYMMDD hhmmss')).toString() */;
        const pdf = this.generateUserCollection(
            filename,
        );
        pdf.then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        });
    }

    generateUserCollection = (filename) => {
        const promise = new Promise(() => {
            userCollectionService.process(
                filename,
                /* () => {
                    // this.uploadS3Link(filename);
                    resolve();
                }, */
            );
        });
        return promise;
    }

}

Env.config();
const x = new PDF();
x.initialize();
