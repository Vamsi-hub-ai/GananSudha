const { Client } = require('pg');

async function seed() {
  const client = new Client({ connectionString: 'postgres://postgres:password@localhost:5432/gnana_sudha' });
  await client.connect();
  try {
    await client.query(`
      INSERT INTO admin_users (username, password, name) 
      VALUES ('Gnanasudha18@gmail.com', 'GnanaSudha@336', 'Gnana Sudha Admin') 
      ON CONFLICT DO NOTHING;
      
      INSERT INTO customers (name, email, password) 
      VALUES ('Vamsi', 'Vamsipallela31@gmail.com', 'Vamsi@123') 
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('Seed done');
  } catch(e) {
    console.error(e);
  } finally {
    client.end();
  }
}
seed();
