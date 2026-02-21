const bcrypt = require("bcryptjs");
const userDao = require("../dao/UserDao");

class UserBusiness {
  async findAll() {
    const users = await userDao.findAll();
    return users.map(({ password, ...user }) => user);
  }

  async findById(id) {
    const user = await userDao.findById(id);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  }

  async findByEmail(email) {
    return userDao.findByEmail(email);
  }

  async create({ name, email, password, organizacao_fk }) {
    if (!name || !email || !password) {
      throw { statusCode: 400, message: "Nome, email e senha são obrigatórios" };
    }
    if (!organizacao_fk) {
      throw { statusCode: 400, message: "Organização é obrigatória" };
    }

    const existing = await userDao.findByEmail(email);
    if (existing) {
      throw { statusCode: 409, message: "Email já cadastrado" };
    }

    const hash = await bcrypt.hash(password, 10);
    return userDao.create({ name, email, password: hash, organizacao_fk: Number(organizacao_fk) });
  }

  async update(id, { name, email, password, organizacao_fk }) {
    const user = await userDao.findById(id);
    if (!user) {
      throw { statusCode: 404, message: "Usuário não encontrado" };
    }

    if (email && email !== user.email) {
      const existing = await userDao.findByEmail(email);
      if (existing) {
        throw { statusCode: 409, message: "Email já cadastrado" };
      }
    }

    const data = { name, email };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    if (organizacao_fk !== undefined) {
      data.organizacao_fk = Number(organizacao_fk);
    }

    return userDao.update(id, data);
  }

  async delete(id) {
    const deleted = await userDao.delete(id);
    if (!deleted) {
      throw { statusCode: 404, message: "Usuário não encontrado" };
    }
    return true;
  }

  async validateCredentials(email, password) {
    const user = await userDao.findByEmail(email);
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    const { password: _, ...safe } = user;
    return safe;
  }
}

module.exports = new UserBusiness();
