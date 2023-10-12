import nodemailer from 'nodemailer';
import fs from 'fs/promises'; // Import fs.promises for Promise-based API
import dotenv from 'dotenv';
dotenv.config();

class EmailService {
  private transporter: nodemailer.Transporter;
  private transporterMail: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // e.g., 'Gmail'
      auth: {
        user: process.env.user as string,
        pass: process.env.pass as string,
      },
    });

    this.transporterMail = nodemailer.createTransport({
      service: 'gmail', // e.g., 'Gmail'
      auth: {
        user: process.env.user as string,
        pass: process.env.pass as string,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, attachmentPath?: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.user as string,
      to: to,
      subject: subject,
      text: text,
      attachments: [{
        path:attachmentPath
      }]
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }


  async sendMail(to: string, subject: string, text: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.user as string,
      to: to,
      subject: subject,
      text: text,
    };
    try {
      const info = await this.transporterMail.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }


}

export default new EmailService();
