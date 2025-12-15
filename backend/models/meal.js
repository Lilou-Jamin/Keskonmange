const { pool } = require('../config/connectionDb');

class Meal {
  static async find() {
    const result = await pool.query(
      'SELECT * FROM meals'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM meals WHERE id = $1',
      [id]
    );
    return result.rows[0]; // undefined si rien trouvé
  }

  static async create({ title, ingredients, instructions, time, image }) {
    const result = await pool.query(
      `INSERT INTO meals (title, ingredients, instructions, time, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, ingredients, instructions, time, image]
    );
    return result.rows[0];
  }
}

module.exports = Meal;
