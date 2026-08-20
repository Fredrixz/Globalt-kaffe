const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello från Express!');
});

app.get('/blockchain', (req, res) => {
  const transactions = [
    { sender: '', recipient: '', batchId: '1', weightKg: '' },
    { sender: '', recipient: '', batchId: '2', weightKg: '' }
  ];

  return res.json(transactions);
});

module.exports = app;
