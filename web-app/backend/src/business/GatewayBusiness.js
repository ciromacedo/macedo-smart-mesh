const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const GatewayDao = require("../dao/GatewayDao");

const MEDIAMTX_API = process.env.MEDIAMTX_API || "http://localhost:9997";

async function kickAllRtspSessions() {
  try {
    const res = await fetch(`${MEDIAMTX_API}/v3/rtspsessions/list`);
    if (!res.ok) return;
    const data = await res.json();
    const publishers = (data.items || []).filter((s) => s.state === "publish");
    for (const session of publishers) {
      await fetch(`${MEDIAMTX_API}/v3/rtspsessions/kick/${session.id}`, {
        method: "POST",
      }).catch(() => {});
    }
  } catch {
    // MediaMTX pode estar fora do ar; não bloquear a operação
  }
}

class GatewayBusiness {
  _generateApiKey() {
    const hex = crypto.randomBytes(16).toString("hex"); // 32 hex chars
    return `smgw_${hex}`;
  }

  async findAll() {
    return GatewayDao.findAll();
  }

  async findById(id) {
    const gateway = await GatewayDao.findById(id);
    if (!gateway) throw { statusCode: 404, message: "Gateway não encontrado" };
    return gateway;
  }

  async create({ name }) {
    if (!name || !name.trim()) {
      throw { statusCode: 400, message: "Nome é obrigatório" };
    }

    const apiKey = this._generateApiKey();
    const api_key_hash = await bcrypt.hash(apiKey, 10);
    const api_key_prefix = apiKey.substring(0, 12);

    const gateway = await GatewayDao.create({
      name: name.trim(),
      api_key_hash,
      api_key_prefix,
    });

    return { ...gateway, api_key: apiKey };
  }

  async toggle(id) {
    const gateway = await GatewayDao.findById(id);
    if (!gateway) throw { statusCode: 404, message: "Gateway não encontrado" };

    const updated = await GatewayDao.setActive(id, !gateway.active);

    // Se foi desativado, derrubar sessões RTSP ativas imediatamente
    if (!updated.active) {
      await kickAllRtspSessions();
    }

    return updated;
  }

  async delete(id) {
    const deleted = await GatewayDao.delete(id);
    if (!deleted) throw { statusCode: 404, message: "Gateway não encontrado" };

    // Derrubar sessões RTSP ativas do gateway excluído
    await kickAllRtspSessions();

    return deleted;
  }

  async validateApiKey(apiKey) {
    if (!apiKey) return null;

    const gateways = await GatewayDao.findAllWithHash();
    for (const gateway of gateways) {
      const match = await bcrypt.compare(apiKey, gateway.api_key_hash);
      if (match) {
        await GatewayDao.updateLastSeen(gateway.id);
        return gateway;
      }
    }
    return null;
  }
}

module.exports = new GatewayBusiness();
