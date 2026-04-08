const { pool } = require('../config/connectionDb');

class Ingredient {
  static async find() {
    const result = await pool.query('SELECT * FROM ingredients');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM ingredients WHERE id_ingredient = $1', [id]);
    return result.rows[0];
  }

  static async search(query) {
    const result = await pool.query('SELECT * FROM ingredients WHERE str_ingredient ILIKE $1', [`%${query}%`]);
    return result.rows;
  }

  //   static async create({ title, ingredients, instructions, time, image }) {
  //     const result = await pool.query(
  //       `INSERT INTO meals (title, ingredients, instructions, time, image)
  //        VALUES ($1, $2, $3, $4, $5)
  //        RETURNING *`,
  //       [title, ingredients, instructions, time, image]
  //     );
  //     return result.rows[0];
  //   }
}

module.exports = Ingredient;
