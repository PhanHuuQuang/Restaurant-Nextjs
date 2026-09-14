import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user and set an httpOnly token cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(res.body.email).toBe('test@example.com');
      expect(res.body.password).toBeUndefined();
      const setCookie = res.headers['set-cookie'] as unknown as string[];
      expect(setCookie[0]).toContain('token=');
      expect(setCookie[0]).toContain('HttpOnly');
    });

    it('should return 409 if email already exists', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'dup@example.com',
          password: 'password123',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User 2',
          email: 'dup@example.com',
          password: 'password123',
        })
        .expect(409);
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'not-an-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('should return 400 for short password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'short',
        })
        .expect(400);
    });

    it('should return 400 for missing name', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should login and set an httpOnly token cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(res.body.email).toBe('login@example.com');
      expect(res.body.password).toBeUndefined();
      const setCookie = res.headers['set-cookie'] as unknown as string[];
      expect(setCookie[0]).toContain('token=');
      expect(setCookie[0]).toContain('HttpOnly');
    });

    it('should return 401 for wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should return 401 for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nobody@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should return user profile with valid cookie', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Profile User',
          email: 'profile@example.com',
          password: 'password123',
        });

      const cookies = loginRes.headers['set-cookie'] as unknown as string[];

      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Cookie', cookies)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe('profile@example.com');
          expect(res.body.role).toBe('USER');
        });
    });

    it('should return user profile with valid Bearer token', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Bearer User',
          email: 'bearer@example.com',
          password: 'password123',
        });

      const cookies = loginRes.headers['set-cookie'] as unknown as string[];
      const token = String(cookies[0]).split(';')[0].split('=')[1];

      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe('bearer@example.com');
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('should return 401 with invalid cookie', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Cookie', 'token=invalid-token')
        .expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should clear the token cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(201);

      const setCookie = res.headers['set-cookie'] as unknown as string[];
      expect(setCookie[0]).toContain('token=');
      expect(res.body).toEqual({ success: true });
    });
  });
});
