const { pool } = require('../config/connectionDb');

class Meal {
  static async find() {
    const result = await pool.query('SELECT * FROM meals');
    return result.rows;
  }

  static async find10RandomMeals() {
    const result = await pool.query('SELECT * FROM meals ORDER BY RANDOM() LIMIT 10;');
    return result.rows;
  }

  static async find10RandomDesserts() {
    const result = await pool.query(`SELECT * FROM meals WHERE str_category = 'Dessert' ORDER BY RANDOM() LIMIT 10;`);
    return result.rows;
  }

  static async find10RandomVegetarians() {
    const result = await pool.query(`SELECT * FROM meals WHERE str_category = 'Vegetarian' ORDER BY RANDOM() LIMIT 10;`);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM meals WHERE id_meal = $1', [id]);
    return result.rows[0]; 
  }

  static async findMealIngredients(id) {
    const result = await pool.query(
      `SELECT lmi.id_meal, lim.id_ingredient, lmi.quantity, m.id_measure, m.str_measure, i.str_ingredient, i.str_thumb, i.str_type
        FROM lien_meals_ingredients lmi
        JOIN lien_ingredients_measures lim ON lmi.id_lien = lim.id_lien
        JOIN ingredients i ON lim.id_ingredient = i.id_ingredient
        JOIN measures m ON lim.id_measure = m.id_measure
        WHERE lmi.id_meal = $1;
      `, [id]);
    return result.rows; 
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

  static async addComment({ id_user, id_meal, note, commentaire, date }) {
    const result = await pool.query(
      `INSERT INTO commentaires_meal (id_user, id_meal, note, commentaire, created_at)
       VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
      [id_user, id_meal, note, commentaire, date]
    );
    return result.rows[0];
  }

  static async deleteComment({ id_user, id_meal }) {
    await pool.query(
      `DELETE FROM commentaires_meal
       WHERE id_user = $1 AND id_meal = $2`,
      [id_user, id_meal]
    );
  }

  static async getComments(id_meal) {
    const result = await pool.query(
      `SELECT cm.id_user, cm.id_meal, cm.note, cm.commentaire, cm.created_at, u.username
       FROM commentaires_meal cm
       JOIN users u ON cm.id_user = u.id
       WHERE cm.id_meal = $1`,
      [id_meal]
    );
    return result.rows;
  }
}

module.exports = Meal;
