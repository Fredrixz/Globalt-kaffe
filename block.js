import crypto from 'node:crypto';

export class Block {
  constructor(index, timestamp, transactions, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const payload =
      this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  mineBlock(difficulty) {
    const target = '0'.repeat(difficulty);

    while (!this.hash.startsWith(target)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}
