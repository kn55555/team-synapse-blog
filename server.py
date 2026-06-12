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
        elif self.path == '/api/append-thought':
            self.handle_append_thought()
        elif self.path == '/api/save-meeting-notes':
            self.handle_save_meeting_notes()
        elif self.path == '/api/save-projects':
            self.handle_save_projects()
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

    def handle_append_thought(self):
        """
        POST /api/append-thought
        Payload: { timestamp, text_en, text_ja }
        Appends a single new entry to author_thoughts.json.
        Auto-translates text_ja if blank. Saves & git-pushes.
        """
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        try:
            entry = json.loads(post_data.decode('utf-8'))
            thoughts_path = os.path.join('data', 'author_thoughts.json')

            # Load existing thoughts
            if os.path.exists(thoughts_path):
                with open(thoughts_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            else:
                data = {"thoughts": []}

            thoughts = data.get('thoughts', [])

            en = entry.get('text_en', '').strip()
            ja = entry.get('text_ja', '').strip()

            if not en:
                self.send_json_response({"status": "error", "message": "text_en is required."}, status_code=400)
                return

            # Auto-translate if Japanese is blank
            if not ja:
                print(f"[server.py] Auto-translating journal entry...")
                ja = translate_en_to_ja(en)

            next_id = max((t.get('id', 0) for t in thoughts), default=0) + 1
            new_entry = {
                "id": next_id,
                "timestamp": entry.get('timestamp', ''),
                "text_en": en,
                "text_ja": ja
            }
            thoughts.append(new_entry)
            data['thoughts'] = thoughts

            os.makedirs('data', exist_ok=True)
            with open(thoughts_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            self.send_json_response({"status": "success", "message": "Entry appended.", "id": next_id, "total": len(thoughts)})

            threading.Thread(
                target=trigger_git_deploy,
                args=(["data/author_thoughts.json"], "data: Publish journal entry via Portal")
            ).start()

        except Exception as e:
            print("[server.py] Error in append-thought:", e)
            self.send_json_response({"status": "error", "message": str(e)}, status_code=500)

    def handle_save_meeting_notes(self):
        """
        POST /api/save-meeting-notes
        Payload: { session: {...}, messages: [...] }
          OR just: { message: { id, timestamp, agent, role_en, role_ja, type, content_en, content_ja } }
        If a single `message` object is provided, it is appended to the existing messages array.
        If the full object is provided, it replaces the file entirely.
        Auto-translates content_ja if empty. Saves and git-pushes.
        """
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        try:
            payload = json.loads(post_data.decode('utf-8'))
            notes_path = os.path.join('data', 'meeting_notes.json')

            # Read existing data
            if os.path.exists(notes_path):
                with open(notes_path, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
            else:
                existing = {"session": {}, "messages": []}

            if 'message' in payload:
                # Single-message append mode
                msg = payload['message']
                en = msg.get('content_en', '').strip()
                ja = msg.get('content_ja', '').strip()
                if en and not ja:
                    print(f"[server.py] Auto-translating meeting message from {msg.get('agent', '?')}...")
                    ja = translate_en_to_ja(en)
                msg['content_ja'] = ja

                # Assign next id
                messages = existing.get('messages', [])
                next_id = max((m.get('id', 0) for m in messages), default=0) + 1
                msg['id'] = next_id

                messages.append(msg)
                existing['messages'] = messages

            elif 'messages' in payload:
                # Full replace mode
                processed = []
                for msg in payload.get('messages', []):
                    en = msg.get('content_en', '').strip()
                    ja = msg.get('content_ja', '').strip()
                    if en and not ja:
                        ja = translate_en_to_ja(en)
                    msg['content_ja'] = ja
                    processed.append(msg)
                existing['messages'] = processed
                if 'session' in payload:
                    existing['session'] = payload['session']
            else:
                self.send_json_response({"status": "error", "message": "Payload must contain 'message' or 'messages'."}, status_code=400)
                return

            os.makedirs('data', exist_ok=True)
            with open(notes_path, 'w', encoding='utf-8') as f:
                json.dump(existing, f, ensure_ascii=False, indent=2)

            self.send_json_response({"status": "success", "message": "Meeting notes saved.", "total": len(existing.get('messages', []))})

            threading.Thread(
                target=trigger_git_deploy,
                args=(["data/meeting_notes.json"], "data: Append meeting message via Portal")
            ).start()

        except Exception as e:
            print("[server.py] Error in save-meeting-notes:", e)
            self.send_json_response({"status": "error", "message": str(e)}, status_code=500)

    def handle_save_projects(self):
        """
        POST /api/save-projects
        Payload: { project_id, update: { title_en, title_ja, content_en, content_ja, timestamp } }
          OR { projects: [...] } for a full replace.
        Single update: appends an update entry to the matching project.
        Auto-translates title_ja / content_ja if empty. Saves and git-pushes.
        """
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        try:
            payload = json.loads(post_data.decode('utf-8'))
            projects_path = os.path.join('data', 'projects.json')

            if os.path.exists(projects_path):
                with open(projects_path, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
            else:
                existing = {"projects": []}

            if 'projects' in payload:
                # Full replace mode
                existing['projects'] = payload['projects']

            elif 'project_id' in payload and 'update' in payload:
                # Append update to existing project
                project_id = payload['project_id']
                upd = payload['update']

                # Auto-translate
                for field_en, field_ja in [('title_en', 'title_ja'), ('content_en', 'content_ja')]:
                    en_val = upd.get(field_en, '').strip()
                    ja_val = upd.get(field_ja, '').strip()
                    if en_val and not ja_val:
                        print(f"[server.py] Auto-translating project update field '{field_en}'...")
                        upd[field_ja] = translate_en_to_ja(en_val)
                    else:
                        upd[field_ja] = ja_val

                projects = existing.get('projects', [])
                matched = False
                for project in projects:
                    if str(project.get('id')) == str(project_id):
                        updates = project.get('updates', [])
                        next_id = max((u.get('id', 0) for u in updates), default=0) + 1
                        upd['id'] = next_id
                        if 'timestamp' not in upd or not upd['timestamp']:
                            from datetime import datetime, timezone
                            upd['timestamp'] = datetime.now(timezone.utc).isoformat()
                        updates.append(upd)
                        project['updates'] = updates
                        matched = True
                        break

                if not matched:
                    self.send_json_response({"status": "error", "message": f"Project id '{project_id}' not found."}, status_code=404)
                    return

                existing['projects'] = projects
            else:
                self.send_json_response({"status": "error", "message": "Payload must contain 'projects' or 'project_id'+'update'."}, status_code=400)
                return

            os.makedirs('data', exist_ok=True)
            with open(projects_path, 'w', encoding='utf-8') as f:
                json.dump(existing, f, ensure_ascii=False, indent=2)

            self.send_json_response({"status": "success", "message": "Projects saved."})

            threading.Thread(
                target=trigger_git_deploy,
                args=(["data/projects.json"], "data: Add project update via Portal")
            ).start()

        except Exception as e:
            print("[server.py] Error in save-projects:", e)
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

def trigger_git_deploy(files, commit_msg="docs: Author update via Portal"):
    try:
        print(f"[server.py] Starting Git deploy pipeline for {files}...")

        # 1. Git add
        add_cmd = ["git", "add"] + files
        subprocess.run(add_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        # 2. Git commit
        commit_cmd = ["git", "commit", "-m", commit_msg]
        result = subprocess.run(commit_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode != 0:
            stderr = result.stderr.decode('utf-8', errors='replace')
            if 'nothing to commit' in stderr or 'nothing added' in stderr:
                print("[server.py] Nothing to commit — file unchanged.")
                return
            print(f"[server.py] Git commit warning: {stderr}")

        # 3. Git push
        push_cmd = ["git", "push"]
        push_result = subprocess.run(push_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

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
        print(f"[server.py] Endpoints:")
        print(f"[server.py]   POST /api/save-config         -- update site_config.json")
        print(f"[server.py]   POST /api/save-thoughts        -- update author_thoughts.json")
        print(f"[server.py]   POST /api/save-meeting-notes   -- append/replace meeting_notes.json")
        print(f"[server.py]   POST /api/save-projects        -- append/replace projects.json")
        print(f"[server.py] Author portal: http://localhost:{PORT}/author.html")
        print("[server.py] Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[server.py] Server stopped.")
