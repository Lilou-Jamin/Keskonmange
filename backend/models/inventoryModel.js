const { pool } = require('../config/connectionDb');

class Inventory {
  static async find() {
    const result = await pool.query('SELECT * FROM lien_users_ingredients');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM lien_users_ingredients WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByUserId(id, joined = false) {
    let result;
    if (joined) {
      result = await pool.query(
        'SELECT * FROM lien_users_ingredients JOIN ingredients USING(id_ingredient) WHERE id_user = $1',
        [id]
      );
    } else {
      result = await pool.query('SELECT * FROM lien_users_ingredients WHERE id_user = $1', [id]);
    }
    return result.rows;
  }

  static async findIngredientQuantityForUserId(userId, ingredientId) {
    const result = await pool.query('SELECT * FROM lien_users_ingredients WHERE id_user = $1 AND id_ingredient = $2', [
      userId,
      ingredientId,
    ]);
    return result.rows[0];
  }

  static async findByIngredientId(id) {
    const result = await pool.query('SELECT * FROM lien_users_ingredients WHERE id_ingredient = $1', [id]);
    return result.rows;
  }

  static async addToInventory(idUser, idIngredient, qty = 1) {
    const query = `
            INSERT INTO lien_users_ingredients (id_user, id_ingredient, qty)
            VALUES ($1, $2, $3)
            RETURNING id, id_user, id_ingredient, qty;
        `;
    const values = [idUser, idIngredient, qty];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateInventory(idUser, idIngredient, qty = 1) {
    const query = `
            UPDATE lien_users_ingredients
            SET qty = $1;
        `;
    const values = [qty];
    await pool.query(query, values);
  }

  static async removeFromInventory(idUser, idIngredient) {
    const query = `
            DELETE FROM lien_users_ingredients
            WHERE id_user = $1 AND id_ingredient = $2
        `;
    const values = [idUser, idIngredient];
    await pool.query(query, values);
  }
}

module.exports = Inventory;
