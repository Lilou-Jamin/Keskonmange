const { pool } = require('../config/connectionDb');

class User {
  static async createUser({ email, username, passwordHash }) {
    const query = `
        INSERT INTO users (email, username, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, email, username, created_at;
    `;
    const values = [email, username, passwordHash];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findUserByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findUserById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = User;
