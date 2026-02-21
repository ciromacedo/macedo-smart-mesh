import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function OrganizationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`/api/organizations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Organização não encontrada");
        return res.json();
      })
      .then((data) => {
        setDescription(data.description || "");
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    if (!description.trim()) {
      toast.error("O campo Descrição é obrigatório.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/organizations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar organização");
      toast.success("Organização atualizada com sucesso!");
      navigate("/organizations");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.status}>Carregando...</div>;
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Editar Organização</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Descrição <span style={styles.required}>*</span></label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nome da organização"
            style={styles.input}
          />
        </div>

        <div style={styles.actions}>
          <button type="submit" disabled={saving} style={styles.submitBtn}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/organizations")}
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
  status: {
    textAlign: "center",
    color: "#a0a0a0",
    padding: "3rem",
    fontSize: "1.05rem",
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
};

export default OrganizationEdit;
