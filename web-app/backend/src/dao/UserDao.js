const { getPool } = require("../config/database");

class UserDao {
  async findAll() {
    const { rows } = await getPool().query(
      `SELECT u.id, u.name, u.email, u.password, u.organizacao_fk,
              o.description AS organization_description
       FROM users u
       LEFT JOIN organizations o ON o.id = u.organizacao_fk
       ORDER BY u.id`
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await getPool().query(
      `SELECT u.id, u.name, u.email, u.password, u.organizacao_fk,
              o.description AS organization_description
       FROM users u
       LEFT JOIN organizations o ON o.id = u.organizacao_fk
       WHERE u.id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email) {
    const { rows } = await getPool().query(
      "SELECT id, name, email, password, organizacao_fk FROM users WHERE email = $1",
      [email]
    );
    return rows[0] || null;
  }

  async create({ name, email, password, organizacao_fk }) {
    const { rows } = await getPool().query(
      "INSERT INTO users (name, email, password, organizacao_fk) VALUES ($1, $2, $3, $4) RETURNING id, name, email, organizacao_fk",
      [name, email, password, organizacao_fk]
    );
    return rows[0];
  }

  async update(id, { name, email, password, organizacao_fk }) {
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
    if (organizacao_fk !== undefined) {
      fields.push(`organizacao_fk = $${idx++}`);
      values.push(organizacao_fk);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const { rows } = await getPool().query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, name, email, organizacao_fk`,
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
