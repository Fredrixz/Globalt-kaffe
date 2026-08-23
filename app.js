import express from 'express';
import { Blockchain } from './blockchain.js';

const app = express();
const blockchain = new Blockchain();

app.use(express.json());

app.get('/blockchain', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/transactions', (req, res) => {
  const transaction = blockchain.addTransaction(req.body);
  res.status(201).json(transaction);
});

app.post('/mine', (req, res) => {
  const block = blockchain.minePendingTransactions();
  res.status(201).json(block);
});

export default app;
