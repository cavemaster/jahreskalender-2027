#!/usr/bin/env python3
"""
Deploy script for Futuristic 2027 Calendar to:
juliejung.de/kalender/
"""
import os
import sys
import json
from ftplib import FTP_TLS, error_perm

CONFIG_PATH = os.path.join(os.path.dirname(__file__), '.ftp_config.json')
LOCAL_DIR = os.path.dirname(__file__)
SUBDIR = "kalender"

def load_config():
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

def main():
    config = load_config()
    print(f"Verbinde zu {config['host']} via FTPS...")
    ftps = FTP_TLS(timeout=20)
    ftps.connect(config['host'], 21)
    ftps.login(config['username'], config['password'])
    ftps.prot_p()
    print("✓ Verbunden.")

    ftps.cwd('httpdocs')

    try:
        ftps.cwd(SUBDIR)
    except error_perm:
        print(f"Erstelle Unterverzeichnis '{SUBDIR}'...")
        ftps.mkd(SUBDIR)
        ftps.cwd(SUBDIR)

    print(f"Zielverzeichnis: {ftps.pwd()}")

    def upload_file(local_path, remote_name):
        print(f"Lade hoch: {remote_name} ...", end=" ", flush=True)
        with open(local_path, 'rb') as f:
            ftps.storbinary(f"STOR {remote_name}", f)
        print("✓")

    files = ['index.html', 'style.css', 'app.js', 'manifest.json']
    for fname in files:
        fpath = os.path.join(LOCAL_DIR, fname)
        if os.path.exists(fpath):
            upload_file(fpath, fname)

    ftps.cwd("..")
    ftps.quit()
    print("\n✓ Erfolgreich online gestellt:")
    print("https://juliejung.de/kalender/")

if __name__ == '__main__':
    main()
