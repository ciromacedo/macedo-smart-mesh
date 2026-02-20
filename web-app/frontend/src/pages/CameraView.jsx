import { useParams, useNavigate } from "react-router-dom";
import WebRTCPlayer from "../components/WebRTCPlayer.jsx";

function CameraView() {
  const { path } = useParams();
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.videoArea}>
        <WebRTCPlayer path={path} />
      </div>

      <div style={styles.actionBar}>
        <span style={styles.cameraName}>{path}</span>
        <div style={styles.actions}>
          <button
            style={styles.actionBtn}
            onClick={() => navigate("/")}
            title="Voltar para cameras"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span style={styles.actionLabel}>Voltar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    inset: 0,
    background: "#000",
    display: "flex",
    flexDirection: "column",
    zIndex: 500,
  },
  videoArea: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.6rem 1rem",
    background: "#16213e",
    borderTop: "1px solid #0f3460",
  },
  cameraName: {
    color: "white",
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "none",
    border: "none",
    color: "#a0a0a0",
    cursor: "pointer",
    padding: "0.4rem 0.6rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    transition: "color 0.15s",
  },
  actionLabel: {
    fontSize: "0.8rem",
  },
};

export default CameraView;
