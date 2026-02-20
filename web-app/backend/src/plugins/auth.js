const fp = require("fastify-plugin");

module.exports = fp(async function authPlugin(fastify) {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET || "changeme-generate-a-strong-secret",
    sign: { expiresIn: "24h" },
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Token inválido ou expirado" });
    }
  });
});
