import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function GatewayCreate() {
  const [name, setName] = useState("");
  const [organizacaoFk, setOrganizacaoFk] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [saving, setSaving] = useState(false);
  const [createdKey, setCreatedKey] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/organizations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrganizations(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Falha ao carregar organizações"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("O campo Nome e obrigatorio.");
      return;
    }
    if (!organizacaoFk) {
      toast.error("Selecione uma organização.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/gateways", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, organizacao_fk: Number(organizacaoFk) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao cadastrar gateway");
      setCreatedKey(data.gateway.api_key);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdKey).then(() => {
      toast.success("API key copiada!");
    });
  };

  if (createdKey) {
    return (
      <div style={styles.page}>
        <h2 style={styles.title}>Gateway criado!</h2>

        <div style={styles.keyBox}>
          <div style={styles.keyWarning}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0a500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>
              Copie a API key agora. Ela <strong>nao sera exibida novamente</strong>.
            </span>
          </div>

          <div style={styles.keyDisplay}>
            <code style={styles.keyCode}>{createdKey}</code>
            <button onClick={handleCopy} style={styles.copyBtn} title="Copiar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copiar
            </button>
          </div>

          <p style={styles.keyHint}>
            Adicione esta key no arquivo <code>.env</code> do gateway:
          </p>
          <pre style={styles.envExample}>{`API_KEY=${createdKey}`}</pre>
        </div>

        <button onClick={() => navigate("/gateways")} style={styles.doneBtn}>
          Concluir
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Novo Gateway</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>
            Nome <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: gateway-escritorio"
            style={styles.input}
            autoFocus
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            Organização <span style={styles.required}>*</span>
          </label>
          <select
            value={organizacaoFk}
            onChange={(e) => setOrganizacaoFk(e.target.value)}
            style={styles.select}
          >
            <option value="">Selecione uma organização</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>{org.description}</option>
            ))}
          </select>
        </div>

        <div style={styles.actions}>
          <button type="submit" disabled={saving} style={styles.submitBtn}>
            {saving ? "Criando..." : "Criar Gateway"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/gateways")}
            style={styles.cancelBtn}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  page: {
    padding: "1rem 0",
  },
  title: {
    color: "white",
    marginTop: 0,
    marginBottom: "1.5rem",
    fontSize: "1.4rem",
  },
  form: {
    background: "#16213e",
    padding: "2rem",
    borderRadius: "10px",
    border: "1px solid #0f3460",
  },
  field: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    color: "#a0a0a0",
    fontSize: "0.875rem",
    marginBottom: "0.5rem",
  },
  required: {
    color: "#e94560",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    background: "#1a1a2e",
    border: "1px solid #0f3460",
    borderRadius: "6px",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    background: "#1a1a2e",
    border: "1px solid #0f3460",
    borderRadius: "6px",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
  submitBtn: {
    padding: "0.65rem 1.5rem",
    background: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.95rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "0.65rem 1.5rem",
    background: "transparent",
    color: "#a0a0a0",
    border: "1px solid #a0a0a0",
    borderRadius: "6px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  keyBox: {
    background: "#16213e",
    border: "1px solid #0f3460",
    borderRadius: "10px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  keyWarning: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    color: "#f0a500",
    marginBottom: "1.25rem",
    fontSize: "0.95rem",
    lineHeight: 1.5,
  },
  keyDisplay: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "#1a1a2e",
    border: "1px solid #0f3460",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    marginBottom: "1.25rem",
    flexWrap: "wrap",
  },
  keyCode: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: "0.9rem",
    color: "#4caf50",
    wordBreak: "break-all",
  },
  copyBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.4rem 0.9rem",
    background: "#0f3460",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.85rem",
    cursor: "pointer",
    flexShrink: 0,
  },
  keyHint: {
    color: "#a0a0a0",
    fontSize: "0.875rem",
    margin: "0 0 0.5rem 0",
  },
  envExample: {
    background: "#1a1a2e",
    border: "1px solid #0f3460",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    fontFamily: "monospace",
    fontSize: "0.85rem",
    color: "#a0c4ff",
    margin: 0,
    overflowX: "auto",
  },
  doneBtn: {
    padding: "0.65rem 1.5rem",
    background: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.95rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default GatewayCreate;
