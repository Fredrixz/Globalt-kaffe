import { Block } from './block.js';

function resolveDifficulty() {
  if (process.env.NODE_ENV === 'test') {
    return 1;
  }

  return Number(process.env.DIFFICULTY) || 2;
}

export class Blockchain {
  constructor() {
    this.difficulty = resolveDifficulty();
    this.pendingTransactions = [];
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}
