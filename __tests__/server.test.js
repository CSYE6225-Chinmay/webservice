const request = require('supertest');
const app = require('../index');

test('Responds with 200 to /healthz', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
  });

test('Unauthorised while accessing /users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(404);
  });

