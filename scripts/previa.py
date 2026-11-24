"""Prévia local com as URLs públicas da DoSim. Execute com python3 scripts/previa.py."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
import mimetypes
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
STATIC_DIRS = {"css", "js", "assets/img", "assets/home", "assets/icons", "assets/fonts", "assets/collections"}
PUBLIC_FILES = {"data/precos.json", "data/colecoes.json", "robots.txt", "manifest.webmanifest", "sitemap.xml"}


def public_file(url):
    name = unquote(urlsplit(url).path).strip("/")
    candidate = (ROOT / name).resolve()
    if not candidate.is_relative_to(ROOT):
        return None
    if candidate.is_dir():
        candidate = candidate / "index.html"
    elif name in {"index", "404"}:
        candidate = candidate.with_suffix(".html")
    relative = candidate.relative_to(ROOT)
    if candidate.suffix == ".html":
        route_index = (
            len(relative.parts) == 2 and relative.name == "index.html"
            and (ROOT / (relative.parts[0] + ".html")).is_file()
        )
        public = len(relative.parts) == 1 or route_index or relative.parts[0] in {"colecoes", "links", "link"}
    else:
        public = str(relative) in PUBLIC_FILES or str(relative.parent) in STATIC_DIRS
    return candidate if public and candidate.is_file() else None


class PreviewServer(ThreadingHTTPServer):
    # The catalogue opens several image, font and script connections together.
    request_queue_size = 64


class Preview(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_HEAD(self):
        path = public_file(self.path)
        if path is None:
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header("Content-Type", mimetypes.guess_type(path)[0] or "application/octet-stream")
        self.send_header("Content-Length", str(path.stat().st_size))
        self.end_headers()
        return path

    def do_GET(self):
        path = self.do_HEAD()
        if path:
            with path.open("rb") as content:
                shutil.copyfileobj(content, self.wfile)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
    with PreviewServer(("127.0.0.1", port), Preview) as server:
        print(f"Prévia DoSim em http://127.0.0.1:{port}/", flush=True)
        server.serve_forever()
