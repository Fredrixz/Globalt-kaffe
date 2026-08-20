export const transactions = [
  { sender: '', recipient: '', batchId: '1', weightKg: '' },
  { sender: '', recipient: '', batchId: '2', weightKg: '' }
];

export function addTransaction(transaction) {
  transactions.push(transaction);
  return transaction;
}
