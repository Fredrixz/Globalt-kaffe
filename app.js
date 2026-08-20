import express from 'express';
import { transactions, addTransaction } from './transactions.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello från Express!');
});

app.get('/blockchain', (req, res) => {
  return res.json(transactions);
});

app.post('/blockchain', (req, res) => {
  const transaction = addTransaction(req.body);
  return res.status(201).json(transaction);
});

export default app;
