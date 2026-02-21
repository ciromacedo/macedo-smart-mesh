const { getPool } = require("../config/database");

class OrganizationDao {
  async findAll() {
    const { rows } = await getPool().query(
      "SELECT id, description FROM organizations ORDER BY id"
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await getPool().query(
      "SELECT id, description FROM organizations WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async create({ description }) {
    const { rows } = await getPool().query(
      "INSERT INTO organizations (description) VALUES ($1) RETURNING id, description",
      [description]
    );
    return rows[0];
  }

  async update(id, { description }) {
    const { rows } = await getPool().query(
      "UPDATE organizations SET description = $1 WHERE id = $2 RETURNING id, description",
      [description, id]
    );
    return rows[0] || null;
  }

  async delete(id) {
    const { rowCount } = await getPool().query(
      "DELETE FROM organizations WHERE id = $1",
      [id]
    );
    return rowCount > 0;
  }
}

module.exports = new OrganizationDao();
