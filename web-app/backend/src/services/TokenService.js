const tokenBusiness = require("../business/TokenBusiness");

async function tokenService(fastify) {
  const auth = { onRequest: [fastify.authenticate] };

  fastify.get("/api/tokens", auth, async () => {
    return tokenBusiness.findAll();
  });

  fastify.get("/api/tokens/:id", auth, async (request, reply) => {
    const token = await tokenBusiness.findById(Number(request.params.id));
    if (!token) {
      return reply.code(404).send({ error: "Token não encontrado" });
    }
    return token;
  });

  fastify.post("/api/tokens", auth, async (request, reply) => {
    try {
      const token = await tokenBusiness.create(request.body);
      return reply.code(201).send(token);
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });

  fastify.put("/api/tokens/:id", auth, async (request, reply) => {
    try {
      const token = await tokenBusiness.update(
        Number(request.params.id),
        request.body
      );
      return token;
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });

  fastify.put("/api/tokens/:id/revoke", auth, async (request, reply) => {
    try {
      const token = await tokenBusiness.revoke(Number(request.params.id));
      return token;
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });

  fastify.delete("/api/tokens/:id", auth, async (request, reply) => {
    try {
      await tokenBusiness.delete(Number(request.params.id));
      return reply.code(204).send();
    } catch (err) {
      return reply
        .code(err.statusCode || 500)
        .send({ error: err.message || "Erro interno" });
    }
  });
}

module.exports = tokenService;
