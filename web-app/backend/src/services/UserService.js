const userBusiness = require("../business/UserBusiness");

async function userService(fastify) {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/api/users", async () => {
    return userBusiness.findAll();
  });

  fastify.get("/api/users/:id", async (request, reply) => {
    const user = await userBusiness.findById(Number(request.params.id));
    if (!user) {
      return reply.code(404).send({ error: "Usuário não encontrado" });
    }
    return user;
  });

  fastify.post("/api/users", async (request, reply) => {
    try {
      const user = await userBusiness.create(request.body);
      return reply.code(201).send(user);
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });

  fastify.put("/api/users/:id", async (request, reply) => {
    try {
      const user = await userBusiness.update(
        Number(request.params.id),
        request.body
      );
      return user;
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });

  fastify.delete("/api/users/:id", async (request, reply) => {
    try {
      await userBusiness.delete(Number(request.params.id));
      return reply.code(204).send();
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });
}

module.exports = userService;
