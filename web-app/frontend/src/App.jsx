import { useState, useEffect } from "react";
import CameraGrid from "./components/CameraGrid.jsx";

function App() {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    // TODO: Buscar lista de câmeras do backend
    // fetch("/api/cameras").then(r => r.json()).then(setCameras);

    // Placeholder
    setCameras([
      { id: "camera-01", name: "Entrada Principal", path: "site-a/camera-01" },
      { id: "camera-02", name: "Estacionamento", path: "site-a/camera-02" },
    ]);
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>WebRTC Gateway</h1>
      <CameraGrid cameras={cameras} />
    </div>
  );
}

export default App;
