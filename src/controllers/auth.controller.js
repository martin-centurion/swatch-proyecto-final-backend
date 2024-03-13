import AuthService from "../services/auth.service.js";
import UserService from "../services/user.service.js";
import EmailService from "../services/email.service.js";
import UserModel from "../models/user.model.js";
import { 
    isValidPassword, 
    tokenGenerator, 
    createHash
} from "../utils.js";
import { CustomError } from "../utils/CustomError.js"
import EnumsError from '../utils/EnumsError.js'
import { generatorUserError, validatorUserError, generatorUserUpdate} from "../utils/CauseMessageError.js";
import config from "../config.js";

export default class AuthController {
  static async register(data) {
        const {
            first_name,
            last_name,
            age,
            email,
            password,
            role
          } = data;
          if (
            !first_name ||
            !last_name ||
            !age ||
            !email ||
            !password
          ) {
            CustomError.createError({
              name: 'Error creando el usuario',
              cause: generatorUserError({
                first_name,
                last_name,
                email,
                age,
                password,
                role
              }),
              message: 'Ocurrio un error mientras intentamos crear un usuario.',
              code: EnumsError.BAD_REQUEST_ERROR,
            });
          }
          let user = await AuthService.findAll({ email });
          if (!user) {
            throw new Error('Correo ya registrado 😨. Intenta recuperar tu contraseña 😁.');
          }
          //const cart = await CartService.create();
          user = await AuthService.create({
            first_name,
            last_name,
            age,
            email,
            password: createHash(password),
            role
          });
          console.log('user', user);
          const token = tokenGenerator(user)
          const emailService = EmailService.getInstance();
          await emailService.sendWelcomeEmail(user);
          return token;
    }

    static async login(data) {
      const { 
          email, 
          password 
      } = data;
        if (email === config.admin.email && password === config.admin.password) {
          const token = tokenGenerator ({
              first_name: config.admin.name,
              last_name: config.admin.lastname,
              email: config.admin.email,
              role: config.admin.role
          });
  
          return token;
        }
      if (!email || !password) {
        CustomError.createError({
          name: 'Error accediendo al usuario',
          cause: validatorUserError({
            email,
            password,
          }),
          message: 'Contraseña o email invalidos.',
          code: EnumsError.INVALID_PARAMS_ERROR,
        })
      }
      const user = await AuthService.getEmail({ email });
      await UserModel.findByIdAndUpdate(user.id, { last_connection: Date.now() });
      const isValidPass = isValidPassword(password, user);
      if (!isValidPass) {
        CustomError.createError({
          name: 'Error accediendo al usuario ',
          cause: validatorUserError({
            email,
            password,
          }),
          message: 'Contraseña o email invalidos.',
          code: EnumsError.INVALID_PARAMS_ERROR,
        })
      }
      const token = tokenGenerator(user);
      return token;
  }

    static async recovery(data) {
      const { email, newPassword } = data;
      const user = await UserService.get({ email });
      if (!user) {
        CustomError.createError({
          name: 'Error accediendo al usuario ',
          cause: validatorUserError({
            email,
            password,
          }),
          message: 'Contraseña o email invalidos😨.',
          code: EnumsError.INVALID_PARAMS_ERROR,
        })
      }
      await UserModel.updateOne({ email }, { $set: { password: createHash(newPassword) }});
      return user;
    }

    static async restorePassword(data) {
      const { email } = data;
      const user = await UserService.get({ email });
        if (!user) {
          CustomError.createError({
            name: 'Error accediendo al usuario ',
            cause: validatorUserError({
              email,
              password,
            }),
            message: 'No hay ningun ususario registrado con ese email 😨.',
            code: EnumsError.INVALID_PARAMS_ERROR,
          })
        };
      const emailService = EmailService.getInstance();
      await emailService.sendRecoveryPasswordEmail(user);
  
      return user
    };

    static async changeUserRole(uid){
  
      const userToUpdate = await UserService.findById(uid);
        console.log('user to update', userToUpdate);
        if (!userToUpdate) {
          console.log({ message: 'Usuario no encontrado' });
        }
        console.log('us doc', userToUpdate.documents);
        const { documents } = userToUpdate;
        const requiredDocuments = ['identification', 'proofOfAddress', 'bankStatement'];
        const missingDocuments = requiredDocuments.filter(docName => !documents.find(doc => doc.name === docName));
        if (missingDocuments.length > 0) {
          CustomError.createError({
            name: 'Error actualizando al usuario',
            cause: generatorUserUpdate(documents),
            message: 'Faltan completar campos 😨.',
            code: EnumsError.INVALID_PARAMS_ERROR,
          });
        }
        const UserRole =  userToUpdate.role
          const UserUpdated = UserRole === 'user' ? 'premium' : 'user';
          const userToUp = {...userToUpdate, role: UserUpdated}
       console.log('user updated', UserUpdated);
           const user=  await UserService.updateById(uid, userToUp);
           console.log('uo', user);
           return UserUpdated
    
    }}


