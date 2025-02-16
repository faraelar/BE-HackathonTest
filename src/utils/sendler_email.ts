const nodemailer = require('nodemailer');
export interface ISendMessage {
  email: string;
  code: string;
}
export class Emailsend {
  transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendmessage(data) {
    await this.transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: data.data.email,
      subject: 'Підтвердження замовлення',
      html: `${data.data.code}`,
    });
  }
}
