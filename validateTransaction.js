export function validateTransaction(req, res, next) {
  const { sender, recipient, batchId, weightKg } = req.body || {};

  if (!sender || !recipient || !batchId || !weightKg) {
    return res.status(400).json({ error: 'sender, recipient, batchId och weightKg krävs' });
  }

  next();
}
