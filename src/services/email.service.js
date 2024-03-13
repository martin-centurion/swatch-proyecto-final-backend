import nodemailer from 'nodemailer';
import config from '../config.js';

export default class EmailService {
    static #instance = null;
    constructor() {
        this.transport = nodemailer.createTransport(
            {
                service: config.mail.service,
                port: config.mail.port,
                auth: {
                    user: config.mail.user,
                    pass: config.mail.password,
                },
            }
        )
    };
    sendEmail(to, subject, html, attachments = []) {
        return this.transport.sendMail({
            from: config.mail.user,
            to,
            subject,
            html,
            attachments,
        });
    }

    sendWelcomeEmail(user) {
        return this.sendEmail(
            user.email,
            `Hola, ${user.first_name}`,
            `<h1>Hola, ${user.first_name}. Te damos la bienvenida a nuestra institución!</h1>`
        );
    }

    sendRecoveryPasswordEmail(user) {
        return this.sendEmail(
          user.email,
          `Recuperación de contraseña`,
          `<h1>Hola!, ${user.first_name}. Ingresa a este <a href='http://localhost:8081/recovery-password'>link</a> para recuperar tu contraseña</h1>`
        );
      }
    
    static getInstance() {
        if (!EmailService.#instance) {
            EmailService.#instance = new EmailService();
        }
        return EmailService.#instance;
    }
}