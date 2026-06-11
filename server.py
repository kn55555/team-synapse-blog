import http.server
import socketserver
import json
import urllib.request
import urllib.parse
import subprocess
import os
import threading

PORT = 3000

class PortalRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow CORS for development ease
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "OK")
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/save-config':
            self.handle_save_config()
        elif self.path == '/api/save-thoughts':
            self.handle_save_thoughts()
        else:
            self.send_error(404, "Endpoint not found")

    def handle_save_config(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            payload = json.loads(post_data.decode('utf-8'))
            
            # Read existing config
            config_path = os.path.join('data', 'site_config.json')
            if os.path.exists(config_path):
                with open(config_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            else:
                data = {"config": {}}
                
            config = data.get("config", {})
            
            # Process each key from the payload
            # Payload is a dict: { key: { en: "...", ja: "..." } }
            for key, values in payload.items():
                en = values.get('en', '').strip()
                ja = values.get('ja', '').strip()
                
                # If Japanese translation is left blank, auto-translate it!
                if en and not ja:
                    print(f"[server.py] Auto-translating key '{key}': '{en}'...")
                    ja = translate_en_to_ja(en)
                    print(f"[server.py] Translation: '{ja}'")
                
                config[key] = {
                    "en": en,
                    "ja": ja
                }
                
            data["config"] = config
            
            # Save config to file
            os.makedirs('data', exist_ok=True)
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                
            self.send_json_response({"status": "success", "message": "Configuration saved successfully."})
            
            # Trigger Git deploy pipeline in a background thread
            threading.Thread(target=trigger_git_deploy, args=(["data/site_config.json"],)).start()
            
        except Exception as e:
            print("[server.py] Error in save-config:", e)
            self.send_json_response({"status": "error", "message": str(e)}, status_code=500)

    def handle_save_thoughts(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            payload = json.loads(post_data.decode('utf-8'))
            # Payload is a list of thoughts: [{ id: 1, timestamp: "...", text_en: "...", text_ja: "..." }]
            
            # Process thoughts list
            processed_thoughts = []
            for item in payload:
                en = item.get('text_en', '').strip()
                ja = item.get('text_ja', '').strip()
                
                # Auto-translate if Japanese is empty
                if en and not ja:
                    print(f"[server.py] Auto-translating thoughts item: '{en[:30]}...'")
                    ja = translate_en_to_ja(en)
                
                processed_thoughts.append({
                    "id": item.get('id', 1),
                    "timestamp": item.get('timestamp', ''),
                    "text_en": en,
                    "text_ja": ja
                })
                
            thoughts_data = {"thoughts": processed_thoughts}
            
            # Save thoughts to file
            thoughts_path = os.path.join('data', 'author_thoughts.json')
            os.makedirs('data', exist_ok=True)
            with open(thoughts_path, 'w', encoding='utf-8') as f:
                json.dump(thoughts_data, f, ensure_ascii=False, indent=2)
                
            self.send_json_response({"status": "success", "message": "Thoughts saved successfully."})
            
            # Trigger Git deploy pipeline in a background thread
            threading.Thread(target=trigger_git_deploy, args=(["data/author_thoughts.json"],)).start()
            
        except Exception as e:
            print("[server.py] Error in save-thoughts:", e)
            self.send_json_response({"status": "error", "message": str(e)}, status_code=500)

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

def translate_en_to_ja(text):
    if not text:
        return ""
    try:
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            sentences = data[0]
            result = "".join([s[0] for s in sentences if s[0]])
            return result
    except Exception as e:
        print("[server.py] Translation helper failed:", e)
        return text # Fallback to English

def trigger_git_deploy(files):
    try:
        print(f"[server.py] Starting Git deploy pipeline for {files}...")
        
        # 1. Git add
        add_cmd = ["git", "add"] + files
        subprocess.run(add_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # 2. Git commit
        commit_cmd = ["git", "commit", "-m", "docs: Author update via Portal"]
        subprocess.run(commit_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # 3. Git push
        push_cmd = ["git", "push"]
        result = subprocess.run(push_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        print("[server.py] Git deploy completed successfully! Changes pushed to GitHub.")
    except subprocess.CalledProcessError as e:
        print(f"[server.py] Git command failed: {e.cmd}")
        if e.stderr:
            print(f"[server.py] Git stderr: {e.stderr.decode('utf-8', errors='replace')}")
    except Exception as ex:
        print(f"[server.py] Deploy pipeline error: {ex}")

if __name__ == '__main__':
    # Change CWD to script directory to serve correct files
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    Handler = PortalRequestHandler
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"[server.py] AI engineering team Server running at http://localhost:{PORT}")
        print(f"[server.py] Author portal available at http://localhost:{PORT}/author.html")
        print("[server.py] Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[server.py] Server stopped.")
