const organizationDao = require("../dao/OrganizationDao");

class OrganizationBusiness {
  async findAll() {
    return organizationDao.findAll();
  }

  async findById(id) {
    const org = await organizationDao.findById(id);
    if (!org) {
      throw { statusCode: 404, message: "Organização não encontrada" };
    }
    return org;
  }

  async create({ description }) {
    if (!description || !description.trim()) {
      throw { statusCode: 400, message: "O campo Descrição é obrigatório" };
    }
    return organizationDao.create({ description: description.trim() });
  }

  async update(id, { description }) {
    await this.findById(id);
    if (!description || !description.trim()) {
      throw { statusCode: 400, message: "O campo Descrição é obrigatório" };
    }
    return organizationDao.update(id, { description: description.trim() });
  }

  async delete(id) {
    const deleted = await organizationDao.delete(id);
    if (!deleted) {
      throw { statusCode: 404, message: "Organização não encontrada" };
    }
    return true;
  }
}

module.exports = new OrganizationBusiness();
