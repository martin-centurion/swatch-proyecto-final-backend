import { Router } from "express";

const router = Router();

  router.get('/', (req, res) => {
    res.render('login', { title: 'Login' });
  });

  router.get('/profile', (req, res) => {
    res.render('profile', { title: 'Perfil' });
  });
  
  router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
  });

  router.get('/logout', (req, res) => {
    res.clearCookie('access_token').redirect('/')
  });

  router.get('/recovery-password', (req, res) => {
    res.render('recovery-password', { title: 'Recuperar Contraseña' });
  });

  router.get('/restore-password', (req, res) => {
    res.render('restore-password', { title: 'Reestablecer Contraseña' });
  });

export default router;