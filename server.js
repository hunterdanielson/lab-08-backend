require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

app.get('/weapons', async(req, res) => {
  // const data = await client.query('SELECT * from weapons');
  const data = await client.query(`
  SELECT weapons.id, weapons.name, weapons.attack, weapons.affinity, elements.element, weapons.is_longsword
  from weapons
  join elements
  on weapons.element_id = elements.id
  `);


  res.json(data.rows);
});

app.get('/weapons/:id', async(req, res) => {
  const id = req.params.id;
  const data = await client.query(`
  SELECT weapons.id, weapons.name, weapons.attack, weapons.affinity, elements.element, weapons.is_longsword
  from weapons
  join elements
  on weapons.element_id = elements.id
  where weapons.id = $1
  `, [id]);

  res.json(data.rows);
});

app.get('/elements', async(req, res) => {
  const data = await client.query('SELECT * from elements');

  res.json(data.rows);
});

app.post('/weapons/', async(req, res) => {
  console.log(req.body, res.body);
  try {
    const data = await client.query(
      `insert into weapons (name, attack, affinity, element_id, is_longsword, owner_id)
      values ($1, $2, $3, $4, $5, $6)
      returning *;`,
      [req.body.name, req.body.attack, req.body.affinity, req.body.element_id, req.body.is_longsword, 1]
    );

    res.json(data.rows[0]);

  } catch(e) {
    console.error(e);
    res.json(e);
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
