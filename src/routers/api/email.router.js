import { Router } from 'express';
import EmailService from '../../services/email.service.js';
//import TwilioService from '../../services/twilio.service.js';
import { __dirname } from '../../utils.js';
import path from 'path';
import { loggerDev } from '../../config/logger.js';

const router = Router();

router.get('/sendEmail', async (req, res, next) => {
    try {
        const result = await EmailService.sendEmail(
            'cendandesarrollos@gmail.com',
            'Este es un correo de prueba',
            `
                <div>
                    <h1>Mensaje de prueba</h1>
                    <p>Esta es una prueba desde Node js</p>
                    <img src="cid:pantalla-001" />
                </div>
            `,
            [
                {
                    filename: 'img-pantalla.png',
                    path: path.join(__dirname, './images/pantalla.png'),
                    cid: 'pantalla-001'
                }
            ]
        );
        loggerDev.info('result', result);
        res.status(200).json({ message: 'Correo enviado correctamente'})
    } catch (error) {
        next();
    };
});

/* router.get('/sendSms', async (req, res, next) => {
    const { query: { first_name, product }} = req;
    try {
        const message = `Gracias, ${first_name}, tu solicitud del producto ${product} ha sido aprobada.`
        const result = await TwilioService.sendSMS('+5491156355415', message);
        loggerDev.info('result', result);
        res.status(200).json({ message: 'Mensaje enviado correctamente.'})
    } catch (error) {
        next(error)
    }
}) */

export default router;