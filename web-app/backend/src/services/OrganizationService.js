const organizationBusiness = require("../business/OrganizationBusiness");

async function organizationService(fastify) {
  const auth = { onRequest: [fastify.authenticate] };

  fastify.get("/api/organizations", auth, async () => {
    return organizationBusiness.findAll();
  });

  fastify.get("/api/organizations/:id", auth, async (request, reply) => {
    try {
      return await organizationBusiness.findById(Number(request.params.id));
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });

  fastify.post("/api/organizations", auth, async (request, reply) => {
    try {
      const org = await organizationBusiness.create(request.body);
      return reply.code(201).send(org);
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });

  fastify.put("/api/organizations/:id", auth, async (request, reply) => {
    try {
      const org = await organizationBusiness.update(
        Number(request.params.id),
        request.body
      );
      return org;
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });

  fastify.delete("/api/organizations/:id", auth, async (request, reply) => {
    try {
      await organizationBusiness.delete(Number(request.params.id));
      return reply.code(204).send();
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });
}

module.exports = organizationService;
