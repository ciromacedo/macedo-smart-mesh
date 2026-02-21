import { useState, useEffect } from "react";
import DeviceGrid from "../components/DeviceGrid.jsx";

function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("/api/iot-devices", { headers }).then((r) => r.json()),
      fetch("/api/cameras", { headers })
        .then((r) => r.ok ? r.json() : { cameras: [] })
        .catch(() => ({ cameras: [] })),
    ])
      .then(([iotDevices, cameraData]) => {
        const cameraMap = {};
        for (const cam of cameraData.cameras || []) {
          cameraMap[cam.name] = cam;
        }

        const merged = (Array.isArray(iotDevices) ? iotDevices : []).map((dev) => {
          if (dev.type === "CAMERA") {
            const cam = cameraMap[dev.name] || {};
            return { ...dev, ready: cam.ready || false, path: cam.path || dev.name };
          }
          return dev;
        });

        setDevices(merged);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={styles.title}>Painel de Controle</h2>

      {loading && <div style={styles.status}>Carregando...</div>}
      {error && <div style={styles.error}>{error}</div>}
      {!loading && !error && devices.length === 0 && (
        <div style={styles.status}>
          Nenhum dispositivo registrado. Verifique se o gateway está ativo.
        </div>
      )}
      {!loading && devices.length > 0 && <DeviceGrid devices={devices} />}
    </div>
  );
}

const styles = {
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
    fontSize: "1.1rem",
  },
  error: {
    textAlign: "center",
    color: "#ff6b6b",
    padding: "3rem",
    fontSize: "1.1rem",
  },
};

export default Dashboard;
