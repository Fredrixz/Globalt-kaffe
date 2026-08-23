import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app.js';

describe('GET /blockchain', () => {
  it('returnerar hela kedjan med minst ett genesis-block', async () => {
    const res = await request(app).get('/blockchain');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('hash');
    expect(res.body[0]).toHaveProperty('previousHash');
  });
});

describe('POST /transactions', () => {
  it('lägger till en giltig transaktion och returnerar 201', async () => {
    const transaction = { sender: 'Gård A', recipient: 'Rosteri B', batchId: '1', weightKg: '20' };

    const res = await request(app).post('/transactions').send(transaction);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(transaction);
  });
});

describe('POST /transactions - validering', () => {
  it('avvisar en transaktion som saknar batchId med 400', async () => {
    const ogiltigTransaktion = { sender: 'Gård A', recipient: 'Rosteri B', weightKg: '20' };

    const res = await request(app).post('/transactions').send(ogiltigTransaktion);

    expect(res.status).toBe(400);
  });

  it('avvisar en tom body med 400', async () => {
    const res = await request(app).post('/transactions').send({});

    expect(res.status).toBe(400);
  });
});

describe('POST /mine', () => {
  it('minar väntande transaktioner och lägger till ett nytt block i kedjan', async () => {
    await request(app)
      .post('/transactions')
      .send({ sender: 'Gård A', recipient: 'Rosteri B', batchId: '1', weightKg: '20' });

    const chainInnan = await request(app).get('/blockchain');
    const antalBlockInnan = chainInnan.body.length;

    const res = await request(app).post('/mine');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('hash');
    expect(res.body.transactions.length).toBeGreaterThan(0);

    const chainEfter = await request(app).get('/blockchain');
    expect(chainEfter.body.length).toBe(antalBlockInnan + 1);
  });
});
