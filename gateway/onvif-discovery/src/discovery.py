"""
ONVIF Camera Discovery Service

Descobre câmeras ONVIF na rede local e registra seus streams RTSP
no MediaMTX gateway.
"""

import logging
import time

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)


def discover_cameras():
    """Descobre câmeras ONVIF na rede local via WS-Discovery."""
    # TODO: Implementar descoberta ONVIF
    # from onvif import ONVIFCamera
    # from WSDiscovery import WSDiscovery
    logger.info("Iniciando descoberta ONVIF...")
    return []


def get_rtsp_uri(camera_host: str, port: int, user: str, password: str) -> str:
    """Obtém a URI RTSP de uma câmera ONVIF."""
    # TODO: Implementar obtenção de URI via ONVIF GetStreamUri
    return ""


def register_in_mediamtx(camera_name: str, rtsp_uri: str):
    """Registra um stream no MediaMTX via API."""
    # TODO: POST para http://localhost:9997/v3/config/paths/add/{camera_name}
    logger.info("Registrando câmera %s: %s", camera_name, rtsp_uri)


def main():
    logger.info("ONVIF Discovery Service iniciado")
    while True:
        cameras = discover_cameras()
        for cam in cameras:
            logger.info("Câmera encontrada: %s", cam)
        time.sleep(60)


if __name__ == "__main__":
    main()
