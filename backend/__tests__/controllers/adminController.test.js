const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const adminController = require('../../src/controllers/adminController');
const Admin = require('../../src/models/Admin');
const Kyc = require('../../src/models/Kyc');
const auth = require('../../src/middleware/auth');

// Mock logger
jest.mock('../../src/config/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  pdf: jest.fn()
}));

// Mock PDF services
jest.mock('../../src/services/pdfProducer', () => ({
  requestPdfGeneration: jest.fn().mockResolvedValue(true),
  requestBatchPdfGeneration: jest.fn().mockResolvedValue([]),
  getQueueStatus: jest.fn().mockResolvedValue({ data: { pending: 0, processing: 0 } })
}));

jest.mock('../../src/services/pdfService', () => ({
  generateKycPdf: jest.fn().mockResolvedValue('/path/to/pdf.pdf'),
  pdfExists: jest.fn().mockReturnValue(true)
}));

// Create Express app for testing
const app = express();
app.use(express.json());

// Setup routes
app.post('/admin/register', adminController.register);
app.post('/admin/login', adminController.login);
app.get('/admin/profile', auth, adminController.getProfile);
app.put('/admin/profile', auth, adminController.updateProfile);
app.post('/admin/change-password', auth, adminController.changePassword);

let mongoServer;

describe('Admin Controller Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Admin.deleteMany({});
    await Kyc.deleteMany({});
  });

  describe('POST /admin/register', () => {
    test('should register a new admin successfully', async () => {
      const adminData = {
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/admin/register')
        .send(adminData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.admin.email).toBe(adminData.email);
      expect(response.body.data.admin.name).toBe(adminData.name);
    });

    test('should reject registration with duplicate email', async () => {
      const adminData = {
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      };

      await request(app).post('/admin/register').send(adminData);

      const response = await request(app)
        .post('/admin/register')
        .send(adminData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    test('should reject registration with invalid data', async () => {
      const invalidData = {
        name: 'Test Admin',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/admin/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /admin/login', () => {
    beforeEach(async () => {
      await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });
    });

    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/admin/login')
        .send({
          email: 'test@admin.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.admin.email).toBe('test@admin.com');
    });

    test('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/admin/login')
        .send({
          email: 'wrong@admin.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });

    test('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/admin/login')
        .send({
          email: 'test@admin.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });

    test('should reject login without credentials', async () => {
      const response = await request(app)
        .post('/admin/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });
  });

  describe('GET /admin/profile', () => {
    test('should get profile with valid token', async () => {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      const token = admin.generateAuthToken();

      const response = await request(app)
        .get('/admin/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@admin.com');
      expect(response.body.data.password).toBeUndefined();
    });

    test('should reject request without token', async () => {
      const response = await request(app)
        .get('/admin/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /admin/profile', () => {
    test('should update profile successfully', async () => {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      const token = admin.generateAuthToken();

      const response = await request(app)
        .put('/admin/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
    });
  });

  describe('POST /admin/change-password', () => {
    test('should change password successfully', async () => {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      const token = admin.generateAuthToken();

      const response = await request(app)
        .post('/admin/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('changed successfully');
    });

    test('should reject with incorrect current password', async () => {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      const token = admin.generateAuthToken();

      const response = await request(app)
        .post('/admin/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('incorrect');
    });

    test('should reject short new password', async () => {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      const token = admin.generateAuthToken();

      const response = await request(app)
        .post('/admin/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'short'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('at least 8 characters');
    });
  });
});
