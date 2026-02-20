import { useNavigate } from "react-router-dom";
import WebRTCPlayer from "./WebRTCPlayer.jsx";

// Inject responsive styles once
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .camera-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
    @media (max-width: 1200px) {
      .camera-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 768px) {
      .camera-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 480px) {
      .camera-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(styleEl);
}

function CameraGrid({ cameras }) {
  const navigate = useNavigate();

  return (
    <div className="camera-grid">
      {cameras.map((cam) => (
        <div key={cam.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cameraName}>{cam.name}</span>
            <span
              style={{
                ...styles.statusDot,
                background: cam.ready ? "#4ade80" : "#a0a0a0",
              }}
            />
          </div>
          {cam.ready ? (
            <WebRTCPlayer path={cam.path} />
          ) : (
            <div style={styles.offline}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a0a0a0"
                strokeWidth="1.5"
              >
                <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                <line x1="2" y1="2" x2="22" y2="22" stroke="#e94560" strokeWidth="2" />
              </svg>
              <span style={styles.offlineText}>Offline</span>
            </div>
          )}
          <div style={styles.actionBar}>
            <button
              style={{
                ...styles.actionBtn,
                ...(cam.ready ? {} : styles.actionBtnDisabled),
              }}
              onClick={() => cam.ready && navigate(`/cameras/${cam.path}`)}
              disabled={!cam.ready}
              title="Maximizar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #e94560",
    borderRadius: "8px",
    overflow: "hidden",
    background: "#16213e",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0.75rem",
    background: "#0f3460",
  },
  cameraName: {
    color: "white",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  offline: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1rem",
    background: "#1a1a2e",
    gap: "0.75rem",
  },
  offlineText: {
    color: "#a0a0a0",
    fontSize: "0.875rem",
  },
  actionBar: {
    display: "flex",
    gap: "0.5rem",
    padding: "0.4rem 0.75rem",
    background: "#0f3460",
    borderTop: "1px solid rgba(233, 69, 96, 0.2)",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    color: "#a0a0a0",
    cursor: "pointer",
    padding: "0.3rem",
    borderRadius: "4px",
  },
  actionBtnDisabled: {
    opacity: 0.3,
    cursor: "default",
  },
};

export default CameraGrid;
