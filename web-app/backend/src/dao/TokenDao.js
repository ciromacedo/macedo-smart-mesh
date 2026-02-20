const { getPool } = require("../config/database");

class TokenDao {
  async findAll() {
    const { rows } = await getPool().query(
      "SELECT id, token, user_id, expiry_date, revoked FROM tokens ORDER BY id"
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await getPool().query(
      "SELECT id, token, user_id, expiry_date, revoked FROM tokens WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async findByToken(token) {
    const { rows } = await getPool().query(
      "SELECT id, token, user_id, expiry_date, revoked FROM tokens WHERE token = $1",
      [token]
    );
    return rows[0] || null;
  }

  async findByUserId(userId) {
    const { rows } = await getPool().query(
      "SELECT id, token, user_id, expiry_date, revoked FROM tokens WHERE user_id = $1 ORDER BY id",
      [userId]
    );
    return rows;
  }

  async create({ token, user_id, expiry_date, revoked = false }) {
    const { rows } = await getPool().query(
      "INSERT INTO tokens (token, user_id, expiry_date, revoked) VALUES ($1, $2, $3, $4) RETURNING id, token, user_id, expiry_date, revoked",
      [token, user_id, expiry_date, revoked]
    );
    return rows[0];
  }

  async update(id, { token, user_id, expiry_date, revoked }) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (token !== undefined) {
      fields.push(`token = $${idx++}`);
      values.push(token);
    }
    if (user_id !== undefined) {
      fields.push(`user_id = $${idx++}`);
      values.push(user_id);
    }
    if (expiry_date !== undefined) {
      fields.push(`expiry_date = $${idx++}`);
      values.push(expiry_date);
    }
    if (revoked !== undefined) {
      fields.push(`revoked = $${idx++}`);
      values.push(revoked);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const { rows } = await getPool().query(
      `UPDATE tokens SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, token, user_id, expiry_date, revoked`,
      values
    );
    return rows[0] || null;
  }

  async delete(id) {
    const { rowCount } = await getPool().query(
      "DELETE FROM tokens WHERE id = $1",
      [id]
    );
    return rowCount > 0;
  }
}

module.exports = new TokenDao();
