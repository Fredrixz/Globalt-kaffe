import crypto from 'node:crypto';

export class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const payload = this.index + this.previousHash + this.timestamp + JSON.stringify(this.data);
    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}

export function addBlockToChain(chain, block) {
  if (!Array.isArray(chain)) {
    throw new Error('chain måste vara en array');
  }

  chain.push(block);
  return chain;
}
