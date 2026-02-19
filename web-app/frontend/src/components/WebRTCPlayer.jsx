import { useEffect, useRef } from "react";

/**
 * Player WebRTC que consome um stream via WHEP do MediaMTX.
 *
 * O protocolo WHEP (WebRTC-HTTP Egress Protocol) permite iniciar
 * uma sessão WebRTC com uma simples requisição HTTP POST.
 */
function WebRTCPlayer({ path }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!path) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.addTransceiver("video", { direction: "recvonly" });
    pc.addTransceiver("audio", { direction: "recvonly" });

    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    const negotiate = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // WHEP endpoint do MediaMTX
      const whepUrl = `/webrtc/${path}/whep`;

      const res = await fetch(whepUrl, {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: offer.sdp,
      });

      if (res.ok) {
        const answer = await res.text();
        await pc.setRemoteDescription({ type: "answer", sdp: answer });
      }
    };

    negotiate().catch(console.error);

    return () => pc.close();
  }, [path]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{ width: "100%", display: "block", background: "#000" }}
    />
  );
}

export default WebRTCPlayer;
