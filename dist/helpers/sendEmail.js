"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user,
                pass: process.env.pass,
            },
        });
        this.transporterMail = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user,
                pass: process.env.pass,
            },
        });
    }
    sendEmail(to, subject, text, attachmentPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.user,
                to: to,
                subject: subject,
                text: text,
                attachments: [{
                        path: attachmentPath
                    }]
            };
            try {
                const info = yield this.transporter.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);
            }
            catch (error) {
                console.error('Email sending failed:', error);
                throw new Error('Failed to send email');
            }
        });
    }
    sendMail(to, subject, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.user,
                to: to,
                subject: subject,
                text: text,
            };
            try {
                const info = yield this.transporterMail.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);
            }
            catch (error) {
                console.error('Email sending failed:', error);
                throw new Error('Failed to send email');
            }
        });
    }
}
exports.default = new EmailService();
