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

describe('addTransaction', () => {
  it('lägger till transaktionen i pendingTransactions', () => {
    const blockchain = new Blockchain();
    const transaction = { sender: 'Gård A', recipient: 'Rosteri B', batchId: '1', weightKg: '20' };

    blockchain.addTransaction(transaction);

    expect(blockchain.pendingTransactions).toContainEqual(transaction);
    expect(blockchain.pendingTransactions.length).toBe(1);
  });
});

describe('minePendingTransactions (mining)', () => {
  it('minar ett nytt block med de väntande transaktionerna och lägger till det i kedjan', () => {
    const blockchain = new Blockchain();
    const transaction = { sender: 'Gård A', recipient: 'Rosteri B', batchId: '1', weightKg: '20' };
    blockchain.addTransaction(transaction);

    const minedBlock = blockchain.minePendingTransactions();

    expect(blockchain.chain.length).toBe(2);
    expect(minedBlock.transactions).toContainEqual(transaction);
    expect(minedBlock.previousHash).toBe(blockchain.chain[0].hash);
    expect(minedBlock.hash.startsWith('0'.repeat(blockchain.difficulty))).toBe(true);
  });

  it('tömmer pendingTransactions efter mining', () => {
    const blockchain = new Blockchain();
    blockchain.addTransaction({ sender: 'Gård A', recipient: 'Rosteri B', batchId: '1', weightKg: '20' });

    blockchain.minePendingTransactions();

    expect(blockchain.pendingTransactions).toEqual([]);
  });
});

describe('isChainValid', () => {
  it('returnerar true för en oförändrad kedja', () => {
    const blockchain = new Blockchain();
    blockchain.addTransaction({ sender: 'Gård A', recipient: 'Rosteri B', batchId: '1', weightKg: '20' });
    blockchain.minePendingTransactions();

    expect(blockchain.isChainValid()).toBe(true);
  });

  it('returnerar false om ett blocks transaktioner har manipulerats', () => {
    const blockchain = new Blockchain();
    blockchain.addTransaction({ sender: 'Gård A', recipient: 'Rosteri B', batchId: '1', weightKg: '20' });
    blockchain.minePendingTransactions();

    blockchain.chain[1].transactions = [{ sender: 'Fuskare', recipient: 'Okänd', batchId: '999', weightKg: '9999' }];

    expect(blockchain.isChainValid()).toBe(false);
  });

  it('returnerar false om ett blocks hash inte längre stämmer med sitt innehåll', () => {
    const blockchain = new Blockchain();
    blockchain.addTransaction({ sender: 'Gård A', recipient: 'Rosteri B', batchId: '1', weightKg: '20' });
    blockchain.minePendingTransactions();

    blockchain.chain[1].previousHash = 'förfalskad-hash';

    expect(blockchain.isChainValid()).toBe(false);
  });

  it('returnerar false om previousHash pekar på fel block, även om blockets egen hash stämmer', () => {
    const blockchain = new Blockchain();
    blockchain.addTransaction({ sender: 'Gård A', recipient: 'Rosteri B', batchId: '1', weightKg: '20' });
    blockchain.minePendingTransactions();
    blockchain.addTransaction({ sender: 'Rosteri B', recipient: 'Kafé C', batchId: '2', weightKg: '15' });
    blockchain.minePendingTransactions();

    blockchain.chain[2].previousHash = blockchain.chain[0].hash;
    blockchain.chain[2].hash = blockchain.chain[2].calculateHash();

    expect(blockchain.isChainValid()).toBe(false);
  });
});

describe('difficulty via miljövariabler', () => {
  it('använder DIFFICULTY-miljövariabeln utanför testmiljö', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalDifficulty = process.env.DIFFICULTY;
    process.env.NODE_ENV = 'production';
    process.env.DIFFICULTY = '3';

    const blockchain = new Blockchain();

    process.env.NODE_ENV = originalNodeEnv;
    process.env.DIFFICULTY = originalDifficulty;

    expect(blockchain.difficulty).toBe(3);
  });

  it('faller tillbaka på difficulty 2 om DIFFICULTY saknas utanför testmiljö', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalDifficulty = process.env.DIFFICULTY;
    process.env.NODE_ENV = 'production';
    delete process.env.DIFFICULTY;

    const blockchain = new Blockchain();

    process.env.NODE_ENV = originalNodeEnv;
    process.env.DIFFICULTY = originalDifficulty;

    expect(blockchain.difficulty).toBe(2);
  });
});
