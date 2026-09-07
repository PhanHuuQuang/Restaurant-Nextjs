import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcryptjs';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role, Status } from '../prisma/generated/prisma/enums';

describe('Orders Admin (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;
  let productId: number;
  let orderId: number;

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
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productOption.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productOption.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        role: Role.ADMIN,
      },
    });

    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
    });

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' })
      .expect(201);
    adminToken = adminLogin.body.accessToken;

    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })
      .expect(201);
    userToken = userLogin.body.accessToken;

    const category = await prisma.category.create({
      data: { slug: 'test', title: 'Test' },
    });
    const product = await prisma.product.create({
      data: {
        title: 'Pizza',
        price: 10.0,
        categoryId: category.id,
      },
    });
    productId = product.id;

    const order = await prisma.order.create({
      data: {
        userId: (
          await prisma.user.findUniqueOrThrow({
            where: { email: 'user@example.com' },
          })
        ).id,
        subtotal: 10,
        serviceCost: 0.5,
        deliveryCost: 0,
        total: 10.5,
        address: '123 Main St',
        phone: '1234567890',
        items: { create: [{ productId, quantity: 1, price: 10 }] },
      },
    });
    orderId = order.id;
  });

  describe('GET /orders (admin list)', () => {
    it('should return paginated orders for admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
      expect(res.body.data[0]).toMatchObject({
        id: orderId,
        user: { email: 'user@example.com' },
      });
    });

    it('should return 403 for regular user', async () => {
      await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/orders').expect(401);
    });
  });

  describe('PATCH /orders/:id/status', () => {
    it('should transition PENDING to PAID for admin', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'PAID' })
        .expect(200);

      expect(res.body.status).toBe(Status.PAID);
    });

    it('should return 400 for invalid transition (PENDING to DELIVERED)', async () => {
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'DELIVERED' })
        .expect(400);
    });

    it('should return 400 for invalid status value', async () => {
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'INVALID' })
        .expect(400);
    });

    it('should return 404 for non-existent order', async () => {
      await request(app.getHttpServer())
        .patch('/orders/99999/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'PAID' })
        .expect(404);
    });

    it('should return 403 for regular user', async () => {
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'PAID' })
        .expect(403);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}/status`)
        .send({ status: 'PAID' })
        .expect(401);
    });
  });
});
