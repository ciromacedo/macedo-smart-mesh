const tokenDao = require("../dao/TokenDao");
const userDao = require("../dao/UserDao");

class TokenBusiness {
  async findAll() {
    return tokenDao.findAll();
  }

  async findById(id) {
    return tokenDao.findById(id);
  }

  async findByUserId(userId) {
    return tokenDao.findByUserId(userId);
  }

  async create({ token, user_id, expiry_date }) {
    if (!token || !user_id || !expiry_date) {
      throw { statusCode: 400, message: "Token, user_id e expiry_date são obrigatórios" };
    }

    const user = await userDao.findById(user_id);
    if (!user) {
      throw { statusCode: 404, message: "Usuário não encontrado" };
    }

    return tokenDao.create({ token, user_id, expiry_date });
  }

  async revoke(id) {
    const token = await tokenDao.findById(id);
    if (!token) {
      throw { statusCode: 404, message: "Token não encontrado" };
    }

    return tokenDao.update(id, { revoked: true });
  }

  async update(id, data) {
    const token = await tokenDao.findById(id);
    if (!token) {
      throw { statusCode: 404, message: "Token não encontrado" };
    }

    return tokenDao.update(id, data);
  }

  async delete(id) {
    const deleted = await tokenDao.delete(id);
    if (!deleted) {
      throw { statusCode: 404, message: "Token não encontrado" };
    }
    return true;
  }
}

module.exports = new TokenBusiness();
