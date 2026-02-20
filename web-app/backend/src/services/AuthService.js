const userBusiness = require("../business/UserBusiness");

async function authService(fastify) {
  fastify.post("/api/auth/login", async (request, reply) => {
    const { email, password } = request.body || {};

    if (!email || !password) {
      return reply.code(400).send({ error: "Email e senha são obrigatórios" });
    }

    const user = await userBusiness.validateCredentials(email, password);
    if (!user) {
      return reply.code(401).send({ error: "Credenciais inválidas" });
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return { token };
  });

  fastify.get(
    "/api/auth/me",
    { onRequest: [fastify.authenticate] },
    async (request) => {
      return {
        id: request.user.id,
        email: request.user.email,
        name: request.user.name,
      };
    }
  );
}

module.exports = authService;
