import nodemailer from "nodemailer";

class MailService {
  async sendActivationMail(someMail, link) {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: testAccount.user,
      to: someMail,
      subject: `Активация аккаунта на ${process.env.APP_URL}`,
      text: ``,
      html: `<div><div><h1>Для активации перейдите по ссылке</h1><div><p><a href="${link}">ССЫЛКА</a></p></div>`,
    });

    return nodemailer.getTestMessageUrl(info);
  }
}

export default new MailService();
