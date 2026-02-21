const { getPool } = require("../config/database");

class GatewayDao {
  async findAll() {
    const result = await getPool().query(
      "SELECT id, name, api_key_prefix, active, created_at, last_seen_at FROM gateways ORDER BY created_at DESC"
    );
    return result.rows;
  }

  async findById(id) {
    const result = await getPool().query(
      "SELECT id, name, api_key_hash, api_key_prefix, active, created_at, last_seen_at FROM gateways WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async create({ name, api_key_hash, api_key_prefix }) {
    const result = await getPool().query(
      "INSERT INTO gateways (name, api_key_hash, api_key_prefix) VALUES ($1, $2, $3) RETURNING id, name, api_key_prefix, active, created_at",
      [name, api_key_hash, api_key_prefix]
    );
    return result.rows[0];
  }

  async setActive(id, active) {
    const result = await getPool().query(
      "UPDATE gateways SET active = $1 WHERE id = $2 RETURNING id, name, api_key_prefix, active, created_at, last_seen_at",
      [active, id]
    );
    return result.rows[0] || null;
  }

  async updateLastSeen(id) {
    await getPool().query(
      "UPDATE gateways SET last_seen_at = NOW() WHERE id = $1",
      [id]
    );
  }

  async delete(id) {
    const result = await getPool().query(
      "DELETE FROM gateways WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows[0] || null;
  }

  async findAllWithHash() {
    const result = await getPool().query(
      "SELECT id, name, api_key_hash, active FROM gateways WHERE active = true"
    );
    return result.rows;
  }
}

module.exports = new GatewayDao();
