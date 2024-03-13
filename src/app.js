import express from 'express';
import passport from 'passport';
import handlebars from 'express-handlebars';
import { init as initPassportConfig } from './config/passport.config.js';
import expressCompression from 'express-compression';
import { addLogger } from './config/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Api
import cookieParser from 'cookie-parser';
import authRouter from './routers/api/auth.router.js';
import userRouter from './routers/api/user.router.js';
import productApiRouter from './routers/api/productsApi.router.js';
import cartApiRouter from './routers/api/cartsApi.router.js';
import emailRouter from './routers/api/email.router.js';

// Logger

import loggerRouter from './routers/api/logger.router.js'

//Views

import productViewRouter from './routers/views/products.router.js';
import indexViewsRouter from './routers/views/index.router.js';

import ErrorHandlers from './middlewares/ErrorHandlers.js';
import { __dirname } from './utils.js';
import path from 'path';

const app = express();

app.use(addLogger);
app.use(expressCompression({
    brotli: { enabled: true, zlib: {}}
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassportConfig();
app.use(passport.initialize());

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Swatch Api',
            description: 'Esta es la documentación de la API de Swatch (Curso Coderhouse - Backend)',
        },
    },
    apis: [ path.join(__dirname, 'docs', '**', '*.yaml') ]
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/',
    indexViewsRouter,
    authRouter,
    userRouter,
    productApiRouter,
    cartApiRouter,
    emailRouter,
    loggerRouter
    );

app.use('/views', productViewRouter);

app.use(ErrorHandlers);

export default app;