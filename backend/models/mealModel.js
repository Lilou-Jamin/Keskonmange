const { pool } = require('../config/connectionDb');

class Meal {
  static async find() {
    const result = await pool.query('SELECT * FROM meals');
    return result.rows;
  }

  // pour la recherche de recettes par via barre de recherche
  static async findByName(name, diet, allergies) {
    let query = `
      SELECT m.*, 
      COALESCE(AVG(c.note), 0) AS avg_note,
      COUNT(c.note) AS nb_comments
      FROM meals m
      LEFT JOIN commentaires_meal c 
      ON c.id_meal = m.id_meal
      WHERE m.str_meal ILIKE $1
      GROUP BY m.id_meal  
    `;

    const values = [`%${name}%`];
    let paramIndex = 2;

    // si y'a un régime particulier on filtre les résultats en fonction de ça
    if (diet === "vegetarian") {
      query += ` AND m.str_category ILIKE $${paramIndex}`;
      values.push("%Vegetarian%");
      paramIndex++;
    }
    if (diet === "vegan") {
      query += ` AND m.str_category ILIKE $${paramIndex}`;
      values.push("%Vegan%");
      paramIndex++;
    }

    // si l'utilisateur a des allergies on exclut de la recherche
    // les recettes qui contiennent ces allergènes
    // on compare en minuscule pour éviter les problèmes de casse
    if (allergies.length > 0) {
      query += `
        AND NOT EXISTS (
          SELECT 1
          FROM lien_meals_ingredients lmi
          JOIN ingredients i ON i.id_ingredient = lmi.id_ingredient
          WHERE lmi.id_meal = m.id_meal
          AND LOWER(i.str_ingredient) = ANY($${paramIndex}::text[]) 
          )
      `;
      values.push(allergies.map((allergy) => allergy.toLowerCase()));
      paramIndex++;
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async find10RandomMeals() {
    const result = await pool.query(`
      SELECT m.*, 
      COALESCE(AVG(c.note), 0) AS avg_note,
      COUNT(c.note) AS nb_comments
      FROM meals m
      LEFT JOIN commentaires_meal c 
      ON c.id_meal = m.id_meal
      GROUP BY m.id_meal          
      ORDER BY RANDOM() 
      LIMIT 10;
      `);
      console.log('allo ?', result.rows)
    return result.rows;
  }

  static async find10RandomDesserts() {
    const result = await pool.query(`
      SELECT m.*, 
      COALESCE(AVG(c.note), 0) AS avg_note,
      COUNT(c.note) AS nb_comments
      FROM meals m
      LEFT JOIN commentaires_meal c 
      ON c.id_meal = m.id_meal
      WHERE str_category = 'Dessert'
      GROUP BY m.id_meal          
      ORDER BY RANDOM() 
      LIMIT 10;
    `);
    return result.rows;
  }

  static async find10RandomVegetarians() {
    const result = await pool.query(`
      SELECT m.*, 
      COALESCE(AVG(c.note), 0) AS avg_note,
      COUNT(c.note) AS nb_comments
      FROM meals m
      LEFT JOIN commentaires_meal c 
      ON c.id_meal = m.id_meal
      WHERE str_category = 'Vegetarian'
      GROUP BY m.id_meal          
      ORDER BY RANDOM() 
      LIMIT 10;
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT m.*,
      COALESCE(AVG(c.note), 0) AS avg_note,
      COUNT(c.note) AS nb_comments
      FROM meals m
      LEFT JOIN commentaires_meal c 
      ON c.id_meal = m.id_meal
      WHERE m.id_meal = $1
      GROUP BY m.id_meal    
      `, [id]);
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
      `,
      [id]
    );
    return result.rows;
  }

  // renvoie seulement les IDs des ingrédients leur quantité et leur ID de lien donné un tableau de repas
  static async findMealsIngredientsOptimized(ids) {
    const result = await pool.query(
      `SELECT *
        FROM lien_meals_ingredients lmi
        WHERE lmi.id_meal = ANY($1::int[]);
      `,
      [ids]
    );
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

  static async getListMealsByCategory(category) {
    const result = await pool.query(`
        SELECT m.*, 
        COALESCE(AVG(c.note), 0) AS avg_note,
        COUNT(c.note) AS nb_comments
        FROM meals m
        LEFT JOIN commentaires_meal c 
        ON c.id_meal = m.id_meal
        WHERE str_tags ILIKE '%' || $1 || '%' OR str_category ILIKE '%' || $1 || '%'
        GROUP BY m.id_meal    
      `,
      [category]
    );
    return result.rows;
  }
}

module.exports = Meal;
