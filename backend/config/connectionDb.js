const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

const connectDB = async () => {
  try {
    // simple requête pour vérifier la connexion
    await pool.query('SELECT NOW()');
    console.log('Base PostgreSQL connectée !');
  } catch (error) {
    console.error('Connexion à la base PostgreSQL échouée :', error);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
