import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js'; // Ensure your express app is exported from server.js
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';

beforeAll(async () => {
  // Connect to test DB
  const url = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/fleetlink_test';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('FleetLink Backend Tests', () => {

  describe('POST /api/vehicles', () => {
    it('should create a vehicle with valid data', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send({ name: 'Truck A', capacityKg: 1000, tyres: 6 });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Truck A');
      expect(res.body).toHaveProperty('capacityKg', 1000);
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send({ name: 'Truck B' }); // missing capacityKg & tyres

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/vehicles/available', () => {
    it('should return available vehicles', async () => {
      // Add test vehicle
      const vehicle = await Vehicle.create({ name: 'Truck C', capacityKg: 2000, tyres: 8 });

      const res = await request(app)
        .get('/api/vehicles/available')
        .query({
          capacityRequired: 1500,
          fromPincode: '560001',
          toPincode: '560020',
          startTime: new Date().toISOString()
        });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.vehicles)).toBe(true);
      expect(res.body.vehicles[0]).toHaveProperty('name', vehicle.name);
      expect(res.body).toHaveProperty('estimatedRideDurationHours');
    });
  });

  describe('POST /api/bookings', () => {
    it('should create a booking if vehicle is available', async () => {
      const vehicle = await Vehicle.create({ name: 'Truck D', capacityKg: 3000, tyres: 10 });
      const payload = {
        vehicleId: vehicle._id,
        fromPincode: '560001',
        toPincode: '560010',
        startTime: new Date().toISOString(),
        customerId: 'customer123'
      };

      const res = await request(app).post('/api/bookings').send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('vehicleId', vehicle._id.toString());
    });

    it('should not allow booking if time slot conflicts', async () => {
      const vehicle = await Vehicle.create({ name: 'Truck E', capacityKg: 1500, tyres: 4 });

      // Create first booking
      const startTime = new Date();
      await Booking.create({
        vehicleId: vehicle._id,
        fromPincode: '560001',
        toPincode: '560010',
        startTime,
        endTime: new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // 2 hrs later
      });

      // Attempt overlapping booking
      const res = await request(app).post('/api/bookings').send({
        vehicleId: vehicle._id,
        fromPincode: '560001',
        toPincode: '560015',
        startTime: startTime.toISOString(),
        customerId: 'customer123'
      });

      expect(res.statusCode).toBe(409);
    });
  });

});
