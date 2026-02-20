const { getPool } = require("../config/database");

class UserDao {
  async findAll() {
    const { rows } = await getPool().query(
      "SELECT id, name, email, password FROM users ORDER BY id"
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await getPool().query(
      "SELECT id, name, email, password FROM users WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email) {
    const { rows } = await getPool().query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [email]
    );
    return rows[0] || null;
  }

  async create({ name, email, password }) {
    const { rows } = await getPool().query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, password]
    );
    return rows[0];
  }

  async update(id, { name, email, password }) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(name);
    }
    if (email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (password !== undefined) {
      fields.push(`password = $${idx++}`);
      values.push(password);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const { rows } = await getPool().query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, name, email`,
      values
    );
    return rows[0] || null;
  }

  async delete(id) {
    const { rowCount } = await getPool().query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );
    return rowCount > 0;
  }
}

module.exports = new UserDao();
