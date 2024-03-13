import { expect } from 'chai';
import supertest from 'supertest';
import config from '../src/config.js';
import mongoose from 'mongoose';

const requester = supertest(`http://localhost:${config.port}`);

describe('Testing modulo authentication', function () {

    this.timeout(8000);
    let email;
    let cookie;
    email = `test${Date.now()}@gmail.com`;
    const userMock = {
        first_name: 'test',
        last_name: 'test',
        email,
        age: 30,
        password: '1111',
        role: 'admin'
    };

    before(async function () {
        await mongoose.connect(config.db.mongodbUri);
        console.log('Conectado a la db TEST');  
    });

    after(async function () {
        await mongoose.connection.close();
    });

    it('Debe registrar un usuario de forma exitosa', async function() {
        
        const { 
            statusCode,
            ok,
            _body
        } = await requester.post('/auth/register').send(userMock);
        expect(statusCode).to.be.equals(201);
        expect(ok).to.be.ok;
        expect(_body).to.be.has.property('message', 'Usuario creado correctamente.');
    });

    it('Login exitoso y redirecciona a products', async function () {
        const {
            headers,
            statusCode,
            ok,
            _body
        } = await requester.post('/auth/login').send(userMock);
        console.log('headers', headers);
        expect(statusCode).to.be.equals(302);
        expect(headers).to.have.property('location', '/products');
        const [key, value] = headers['set-cookie'][0].split('=');
        cookie = { key, value };
    });

    it('Obtiene el usuario actual con un token válido', async function () {
        const {
            headers,
            statusCode,
            ok,
            _body
        } = await requester.get('/products')
        .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        console.log(
            headers,
            statusCode,
            ok,
            _body
        );
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(_body).to.have.property('userName', userMock.first_name);
    });

    it('Obtiene un listado de los usuarios', async function () {
        const {
            statusCode,
            ok,
            _body
        } = await requester.get('/users').set('Cookie', [`${cookie.key}=${cookie.value}`]);
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(Array.isArray(_body)).to.be.ok
    });

});