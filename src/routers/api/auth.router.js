import { Router } from "express";
import AuthController from "../../controllers/auth.controller.js";

const router = Router();

router.post('/auth/login', async (req, res) => {
  try {
    const token = await AuthController.login(req.body);
      res
        .cookie('access_token', token, {
          maxAge: 600000,
          httpOnly: true,
        })
        .status(200)
        //.json({ message: 'sucess'})
        .redirect('/products')
  } catch (error) {
    //res.redirect('/')
    res
    .status(404).json({ message: error.message });
    //.redirect('/error-login')
    req.logger.error(error.cause);
  }

});

router.post('/auth/register', async (req, res) => {
  try {
      const { body } = req
      await AuthController.register(body);
      res.status(201).json({ message: 'Usuario creado correctamente.' });
  } catch (error) {
      res.status(400).json({ message: error.message });
      req.logger.error(error.cause);
  }
});

router.post('/auth/recovery-password', async (req, res) => {
  try {
    const user = await AuthController.recovery(req.body);
    res
    //.status(201).json({ message: 'Contraseña actualizada.' });
    .redirect('/');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/auth/restore-password', async (req, res) => {
  try {
    const user = await AuthController.restorePassword(req.body)
    res
    //status(201).json({ message: 'Correo enviado para reestablecer la contraseña.' });
    .redirect('/');
  } catch (error) {
    res.status(400).json({  message: error.message  })
  }

});



export default router;