const client = require('../lib/client');
// import our seed data:
const weapons = require('./weapons.js');
const usersData = require('./users.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      weapons.map(weapon => {
        return client.query(`
                    INSERT INTO weapons (name, attack, affinity, element, is_longsword, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [weapon.name, weapon.attack, weapon.affinity, weapon.element, weapon.is_longsword, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
