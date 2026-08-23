import { describe, it, expect } from 'vitest';
import { Block } from './block.js';

describe('Block (konstruktorn)', () => {
  it('sätter index, timestamp, transactions, previousHash och nonce', () => {
    const transactions = [{ sender: 'A', recipient: 'B', batchId: '1', weightKg: '10' }];
    const block = new Block(0, '2026-08-13T10:00:00.000Z', transactions, 'föregåendehash');

    expect(block.index).toBe(0);
    expect(block.timestamp).toBe('2026-08-13T10:00:00.000Z');
    expect(block.transactions).toEqual(transactions);
    expect(block.previousHash).toBe('föregåendehash');
    expect(block.nonce).toBe(0);
  });

  it('räknar ut en hash direkt vid skapande', () => {
    const block = new Block(0, '2026-08-13T10:00:00.000Z', []);

    expect(typeof block.hash).toBe('string');
    expect(block.hash.length).toBeGreaterThan(0);
  });
});

describe('calculateHash', () => {
  it('samma grunddata ger alltid samma hash', () => {
    const blockA = new Block(0, '2026-08-13T10:00:00.000Z', [{ batchId: '1' }], 'abc');
    const blockB = new Block(0, '2026-08-13T10:00:00.000Z', [{ batchId: '1' }], 'abc');

    expect(blockA.hash).toBe(blockB.hash);
  });

  it('olika transaktioner ger olika hash', () => {
    const blockA = new Block(0, '2026-08-13T10:00:00.000Z', [{ batchId: '1' }], 'abc');
    const blockB = new Block(0, '2026-08-13T10:00:00.000Z', [{ batchId: '2' }], 'abc');

    expect(blockA.hash).not.toBe(blockB.hash);
  });

  it('hashen ändras om nonce ändras', () => {
    const block = new Block(0, '2026-08-13T10:00:00.000Z', [{ batchId: '1' }], 'abc');
    const hashFörst = block.hash;

    block.nonce = 1;
    const hashEfter = block.calculateHash();

    expect(hashEfter).not.toBe(hashFörst);
  });
});

describe('mineBlock (Proof-of-Work)', () => {
  it('hittar en hash som börjar med rätt antal nollor', () => {
    const difficulty = 2;
    const block = new Block(0, '2026-08-13T10:00:00.000Z', [{ batchId: '1' }], 'abc');

    block.mineBlock(difficulty);

    expect(block.hash.startsWith('0'.repeat(difficulty))).toBe(true);
  });

  it('ökar nonce under mining-processen', () => {
    const block = new Block(0, '2026-08-13T10:00:00.000Z', [{ batchId: '1' }], 'abc');

    block.mineBlock(2);

    expect(block.nonce).toBeGreaterThan(0);
  });
});
