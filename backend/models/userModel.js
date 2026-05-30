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

  static async getFavorites(id_user) {
    const query = `
      SELECT meals.*
      FROM meals
      JOIN favorites_user ON meals.id_meal = favorites_user.id_meal
      WHERE favorites_user.id_user = $1
      ORDER BY meals.str_meal ASC
    `;
    const values = [id_user];
    const result = await pool.query(query, values);
    return result.rows;
  }
  
  static async addToFavorites(id_user, id_meal) {
    const query = `
      INSERT INTO favorites_user (id_user, id_meal)
      VALUES ($1, $2)
    `;
    const values = [id_user, id_meal];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteFavorite(id_user, id_meal) {
    const query = `
      DELETE FROM favorites_user
      WHERE id_user = $1 AND id_meal = $2
    `;
    const values = [id_user, id_meal];
    await pool.query(query, values);
  }

  static async isFavorite(id_user, id_meal) {
    const query = `
      SELECT 1 FROM favorites_user
      WHERE id_user = $1 AND id_meal = $2
    `;
    const values = [id_user, id_meal];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  }

  static async getPreferences(id_user) {
    const query = `
      SELECT * FROM preferences_user
      WHERE id_user = $1
    `;
    const values = [id_user];
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async updatePreferences(id_user, diets, allergies) {
    console.log('updatePreferencesMODEL - id_user:', id_user);
    console.log('updatePreferencesMODEL - diets:', diets);
    console.log('updatePreferencesMODEL - allergies:', allergies);
    const query = `
      INSERT INTO preferences_user (
        id_user,
        diets,
        allergies
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (id_user)
      DO UPDATE SET
        diets = EXCLUDED.diets,
        allergies = EXCLUDED.allergies
    `;

    const values = [
      id_user,
      diets,
      allergies,
    ];

    await pool.query(query, values);
  }
}

module.exports = User;
