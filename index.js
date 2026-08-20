const app = require('./app');
const port = 3000;

app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
