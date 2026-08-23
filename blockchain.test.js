import { describe, it, expect } from 'vitest';
import { Blockchain } from './blockchain.js';

describe('Blockchain (konstruktorn)', () => {
  it('skapar en kedja med ett genesis-block', () => {
    const blockchain = new Blockchain();

    expect(blockchain.chain.length).toBe(1);
    expect(blockchain.chain[0].index).toBe(0);
    expect(blockchain.chain[0].previousHash).toBe('0');
  });

  it('startar med en tom pendingTransactions-array', () => {
    const blockchain = new Blockchain();

    expect(blockchain.pendingTransactions).toEqual([]);
  });

  it('sätter difficulty till 1 i testmiljö', () => {
    const blockchain = new Blockchain();

    expect(blockchain.difficulty).toBe(1);
  });
});

describe('getLatestBlock', () => {
  it('returnerar det senaste blocket i kedjan', () => {
    const blockchain = new Blockchain();

    expect(blockchain.getLatestBlock()).toBe(blockchain.chain[0]);
  });
});
