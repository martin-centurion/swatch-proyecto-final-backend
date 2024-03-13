import { Router } from 'express';

const router = Router();

router.get('/loggers', (req, res) => {
    req.logger.fatal('Esta es una prueba de log error');
    req.logger.error('Esta es una prueba de log error');
    req.logger.warning('Esta es una prueba de log warn');
    req.logger.info('Esta es una prueba de log infos');
    req.logger.http('Esta es una prueba de log http');
    req.logger.debug('Esta es una prueba de log debug');
    res.status(200).json({ message: 'Ok!' });
});

export default router;