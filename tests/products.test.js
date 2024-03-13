import { expect } from 'chai';
import supertest from 'supertest';
import config from '../src/config.js';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { getNewId } from '../src/utils.js';

const requester = supertest(`http://localhost:${config.port}`);

describe('Testing modulo productos', function () {
    this.timeout(8000);
    let email;
    let cookie;
    email = `test${Date.now()}@gmail.com`;

    const userMock = {
        first_name: 'test100',
        last_name: 'test',
        email,
        age: 30,
        password: '1111',
        role: 'admin'
    };

    before(async function () {
        await mongoose.connect(config.db.mongodbUri);
        console.log('Conectado a la db TEST'); 

        await requester.post('/auth/register').send(userMock);

        const {
            headers,
            statusCode,
            ok,
            _body
        } = await requester.post('/auth/login').send(userMock);
        console.log(
            headers,
            statusCode,
            ok,
            _body
        );
        await requester.post('/auth/login').send(userMock);
        const [key, value] = headers['set-cookie'][0].split('=');
        cookie = { key, value };
    });

    after(async function () {
        await mongoose.connection.close();
    });
    
    it('Debe crear un producto correctamente', async function () {
        const productMock = {
            title: faker.commerce.productName(),
            description: `${faker.commerce.productName()} = ${faker.lorem.word(5)}`,
            code: getNewId(),
            price: 100,
            stock: faker.number.int({ min: 0, max: 10000 }),
            category: faker.commerce.department()
        };
        const {
            statusCode,
            ok,
            _body,
        } = await requester.post('/register-product')
            .send(productMock)
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);

        expect(statusCode).to.be.equals(201);
        expect(ok).to.be.ok;
        expect(_body).to.have.property('message', 'Producto creado correctamente.')
    });

    it('Obtiene un producto por su id', async function () {
        let { 
            _body: firstResponseBody 
        } = await requester.get('/products')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        const pid = firstResponseBody.payload[0]._id;
        const {
            statusCode,
            ok,
            _body
        } = await requester.get(`/products/${pid}`)
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);

        expect(statusCode).to.be.equals(200);
    });

    it('Obtiene la lista de productos', async function () {
        const {
            statusCode,
            ok,
            _body
        } = await requester.get('/products').set('Cookie', [`${cookie.key}=${cookie.value}`]);
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(Array.isArray(_body.payload)).to.be.ok;

    });
});