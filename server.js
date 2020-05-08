require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

app.get('/weapons', async(req, res) => {
  const data = await client.query('SELECT * from weapons');

  res.json(data.rows);
});

app.get('/weapons/:id', async(req, res) => {
  const data = await client.query(`
  SELECT * from weapons
  WHERE id=${req.params.id};
  `);



  res.json(data.rows);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
