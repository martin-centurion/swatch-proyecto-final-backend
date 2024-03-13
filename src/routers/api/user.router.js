import { Router } from "express";
import UserController from "../../controllers/user.controller.js";
import AuthController from "../../controllers/auth.controller.js";
import UserModel from "../../models/user.model.js";
import { authenticationMiddleware, authorizationMiddleware, uploader } from "../../utils.js";

const router = Router();

router.get('/users', authenticationMiddleware('jwt'), async (req, res, next) => {
    try {
        const user = await UserController.findAll()
        res.status(200).json(user);   
    } catch (error) {
        next(error)
    }
});

router.post('/users/:uid/documents',authenticationMiddleware('jwt'), uploader.single('file' ), async (req, res, next)=>{
        try {
        const {
            params: { uid },
            file,
            body: { documentType }
        } = req;
        const upDocs = 
            {
                name: documentType,
                reference: file.filename,
            };
            console.log('up***', file.fieldname);
            
        console.log('file', file)
        
        const user = await UserModel.findById(uid);
        if (!user) {
            return res.status(404).json({ message: `No se encontró el usuario ${uid}` });
        }
        user.documents.push(upDocs)
        await user.save()
  
        return res.status(201).json({ message: 'Documento cargado correctamente' });
        } catch (error) {
        next(res.status(error.statusCode || 500).json({ message: error.message }));
        }
  });

router.get('/users/:uid', authenticationMiddleware('jwt'), async (req, res, next) => {
    const { uid } = req.params;
    try {
        const result = await UserController.findById(uid);
        res.status(201).json({ uid, result })
    } catch (error) {
        next(error)
    }
});

router.put('/users/:uid', authenticationMiddleware('jwt'), async (req, res, next) => {
    try {
        const { body, params: { uid } } = req;
        await UserController.updateById({ _id: uid }, { $set: body});
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

router.delete('/users/:uid', authenticationMiddleware('jwt'), async (req, res, next) => {
    try {
        const { params: { uid } } = req;
        await UserController.deleteById({ _id: uid }); 
        res.status(204).end();
    } catch (error) {
        next(error)
    }
});

router.put('/users/premium/:uid', authenticationMiddleware('jwt'), authorizationMiddleware(['user', 'premium']), async (req, res)=>{
    try{
        const { params: { uid } } = req;
        const userToUpdate = await AuthController.changeUserRole(uid)
        res.status(200).json({ message: `Rol de usuario actualizado con éxito, user: ${userToUpdate} `});
    } catch (error) {
    req.logger.error(error);
    res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
    };
  
});


export default router;