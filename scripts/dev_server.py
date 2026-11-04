#!/usr/bin/env python3
"""Local zero-dependency SPA development server. Requires Python 3.10+."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
import os

SITE = Path(__file__).resolve().parents[1] / 'site'
PORT = int(os.environ.get('PORT', '4173'))

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE), **kwargs)

    def do_GET(self):
        route = urlsplit(self.path).path
        if route == '/public' or route.startswith('/public/'):
            self.path = '/index.html'
        super().do_GET()

    def do_HEAD(self):
        route = urlsplit(self.path).path
        if route == '/public' or route.startswith('/public/'):
            self.path = '/index.html'
        super().do_HEAD()

if __name__ == '__main__':
    server = ThreadingHTTPServer(('127.0.0.1', PORT), Handler)
    print(f'LexGlobal BD Public Foundation: http://127.0.0.1:{PORT}/public')
    server.serve_forever()
