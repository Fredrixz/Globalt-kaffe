import { describe, it, expect } from 'vitest';
import { Block, addBlockToChain } from './block.js';

describe('Block (konstruktorn)', () => {
  it('sätter index, timestamp, data och previousHash', () => {
    const block = new Block(0, '2026-08-13T10:00:00.000Z', { foo: 'bar' }, 'föregåendehash');

    expect(block.index).toBe(0);
    expect(block.timestamp).toBe('2026-08-13T10:00:00.000Z');
    expect(block.data).toEqual({ foo: 'bar' });
    expect(block.previousHash).toBe('föregåendehash');
  });

  it('räknar ut en hash direkt vid skapande', () => {
    const block = new Block(0, '2026-08-13T10:00:00.000Z', { foo: 'bar' });

    expect(typeof block.hash).toBe('string');
    expect(block.hash.length).toBeGreaterThan(0);
  });
});

describe('calculateHash', () => {
  it('samma grunddata ger alltid samma hash', () => {
    const blockA = new Block(0, '2026-08-13T10:00:00.000Z', { foo: 'bar' }, 'abc');
    const blockB = new Block(0, '2026-08-13T10:00:00.000Z', { foo: 'bar' }, 'abc');

    expect(blockA.hash).toBe(blockB.hash);
  });

  it('olika data ger olika hash', () => {
    const blockA = new Block(0, '2026-08-13T10:00:00.000Z', { foo: 'bar' }, 'abc');
    const blockB = new Block(0, '2026-08-13T10:00:00.000Z', { foo: 'baz' }, 'abc');

    expect(blockA.hash).not.toBe(blockB.hash);
  });
});

describe('addBlockToChain', () => {
  it('pushar blocket till en giltig kedja', () => {
    const chain = [];
    const block = new Block(0, '2026-08-13T10:00:00.000Z', { foo: 'bar' });

    addBlockToChain(chain, block);

    expect(chain).toContain(block);
    expect(chain.length).toBe(1);
  });

  it('kastar fel om kedjan är undefined', () => {
    const chain = undefined;
    const block = new Block(0, '2026-08-13T10:00:00.000Z', { foo: 'bar' });

    expect(() => addBlockToChain(chain, block)).toThrow();
  });

  it('kastar fel om kedjan är en sträng', () => {
    const chain = 'abc';
    const block = new Block(0, '2026-08-13T10:00:00.000Z', { foo: 'bar' });

    expect(() => addBlockToChain(chain, block)).toThrow();
  });
});
