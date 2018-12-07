import Path from 'path';
import Promise from 'promise';
import Mailer from 'nodemailer';
import Async from 'asyncawait/async';
import Await from 'asyncawait/await';
import EmailTemplate from 'email-templates';
import collectionSummaryPdf from './templates/pdf/CollectionSummaryPdf';

class EmailCollectionSummary {
    constructor(data) {
        this.email = data.email;
        this.name = data.name;
        this.payload = data.payload;
    }

    process = Async(() => new Promise((resolve, reject) => {
        try {
            const emailResponse = Await(this.sendEmail(this.email, this.name));
            resolve(emailResponse);
        } catch (error) {
            reject(error);
        }
    }));

    sendEmail = (email, name) => {
        const promise = new Promise((resolve, reject) => {
            const emailSend = this.prepareEmail();
            emailSend
                .send({
                    template: 'collection-summary',
                    message: this.prepareMailOption(email),
                    locals: this.prepareLocals(name),
                })
                .then((res) => {
                    resolve(res.response);
                })
                .catch((err) => {
                    reject(err);
                });
        });

        return promise;
    }

    prepareEmail = () => new EmailTemplate({
        transport: Mailer.createTransport(this.prepareSMTPConfig()),
        views: {
            root: Path.resolve(__dirname, '', 'templates/emails'),
            options: {
                extension: 'twig',
            },
        },
        htmlToText: false,
        preview: false,
        send: true,
    })

    prepareTemplate = () => {
        const templateDir = Path.resolve(__dirname, '', 'templates/emails');
        const template = new EmailTemplate(Path.join(templateDir, 'collection-summary'));
        return template;
    }

    prepareLocals = (fullName) => ({
        name: fullName,
    });

    prepareMailOption = email => ({
        from: `${process.env.MAIL_NAME} <${process.env.MAIL_FROM}>`, // sender address
        to: email, // list of receivers
        bcc: [],
        subject: 'Multipay - Collection Summary', // Subject line
    })

    prepareSMTPConfig = () => ({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // use SSL
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
}

export default EmailCollectionSummary;
