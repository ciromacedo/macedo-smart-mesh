import WebRTCPlayer from "./WebRTCPlayer.jsx";

function CameraGrid({ cameras }) {
  const columns = cameras.length <= 1 ? 1 : cameras.length <= 4 ? 2 : 3;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "0.5rem",
      }}
    >
      {cameras.map((cam) => (
        <div key={cam.id} style={{ border: "1px solid #333", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ padding: "0.25rem 0.5rem", background: "#222", color: "#fff", fontSize: "0.875rem" }}>
            {cam.name}
          </div>
          <WebRTCPlayer path={cam.path} />
        </div>
      ))}
    </div>
  );
}

export default CameraGrid;
