import { describe, it, expect, beforeEach } from 'vitest';
import { transactions, addTransaction } from './transactions.js';

describe('addTransaction', () => {
  beforeEach(() => {
    transactions.length = 0;
  });

  it('lägger till en ny transaktion i listan', () => {
    const nyTransaktion = { sender: 'A', recipient: 'B', batchId: '3', weightKg: '10' };

    addTransaction(nyTransaktion);

    expect(transactions).toContainEqual(nyTransaktion);
    expect(transactions.length).toBe(1);
  });
});
