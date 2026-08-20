import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app.js';

describe('GET /', () => {
  it('svarar med 200 och rätt text', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello från Express!');
  });
});
