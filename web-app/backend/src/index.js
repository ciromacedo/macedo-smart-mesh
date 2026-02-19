const fastify = require("fastify")({ logger: true });

fastify.register(require("@fastify/cors"), { origin: true });

// Health check
fastify.get("/api/health", async () => {
  return { status: "ok" };
});

// TODO: Rotas de gerenciamento
// GET  /api/gateways       — Lista gateways conectados
// GET  /api/cameras         — Lista câmeras disponíveis
// GET  /api/cameras/:id     — Detalhes de uma câmera
// POST /api/gateways/:id/cameras — Registra câmera manualmente

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
