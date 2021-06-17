const nodemailer = require('nodemailer');

class MainService {
    constructor() {
        this.transp = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_USER_PSW
            }
        })
    }

    async sendActivationMailTo(to, activationRandom){
        const activationLink = this.formActivationLink(activationRandom);
        await this.transp.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: process.env.CLIENT_URL + " account activation",
            html:
                `
                <div>
                    <a href="${activationLink}">Click to activate your account</a>
                </div>
                `
        })
    }

    formActivationLink(activationRandom) {
        return `${process.env.CLIENT_URL}/api/activate/${activationRandom}`
    }
}
module.exports = new MainService();