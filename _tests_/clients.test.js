const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Client = require('../models/Client');
const clientRoutes = require('../routes/clientRoutes');

const app = express();
app.use(express.json());
app.use('/api/clients', clientRoutes);


beforeAll(async () => {
    await mongoose.connect('mongodb+srv://zekemilne:voJ6iMVTQsfyiRBJ@cluster0.rru5eaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Client API', () => {
    let clientId;

    it('should create a new client', async () => {
        const res = await request(app)
            .post('/api/clients')
            .send({
                name: 'John Doe',
                dob: '1990-01-01',
                contactNumber: '1234567890',
                gp: 'Dr. Smith'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        clientId = res.body._id;
    });

    it('should fetch all clients', async () => {
        const res = await request(app).get('/api/clients');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should fetch a single client by ID', async () => {
        const res = await request(app).get(`/api/clients/${clientId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', clientId);
    });

    it('should update a client by ID', async () => {
        const res = await request(app)
            .put(`/api/clients/${clientId}`)
            .send({
                name: 'Jane Doe',
                dob: '1985-05-15',
                contactNumber: '0987654321',
                gp: 'Dr. Brown'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Jane Doe');
    });

    it('should delete a client by ID', async () => {
        const res = await request(app).delete(`/api/clients/${clientId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Client removed');
    });

    it('should return 404 when client is not found for deletion', async () => {
        const res = await request(app).delete(`/api/clients/${clientId}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Client not found');
    });
});
