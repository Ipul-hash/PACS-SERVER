import os
import subprocess
import uuid
import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)

VALID_API_KEY = os.environ.get("WORKLIST_API_KEY")
WORKLIST_DIR = "/var/lib/orthanc/worklists"

def check_auth(req):
    auth_header = req.headers.get("Authorization")
    if not auth_header or auth_header != f"Bearer {VALID_API_KEY}":
        return False
    return True

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200

@app.route('/worklists', methods=['POST'])
def create_worklist():
    if not check_auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    accession_number = data.get("accession_number")
    patient_id = data.get("patient_id")
    patient_name = data.get("patient_name", "ANONYMOUS")
    patient_dob = data.get("patient_dob", "19000101")
    patient_sex = data.get("patient_sex", "O")
    aet_title = data.get("aet_title", "ORTHANC")
    
    if not accession_number or not patient_id:
        return jsonify({"error": "accession_number dan patient_id wajib diisi"}), 400

    study_uid = data.get("study_uid", "1.2.276.0.7230010.3.1.2." + str(uuid.uuid4().int >> 64))
    
    now = datetime.datetime.now()
    sched_date = now.strftime("%Y%m%d")
    sched_time = now.strftime("%H%M%S")

    dump_content = f"""
(0008,0050) SH [{accession_number}]
(0008,0052) CS [WORKLIST]
(0010,0010) PN [{patient_name}]
(0010,0020) LO [{patient_id}]
(0010,0030) DA [{patient_dob}]
(0010,0040) CS [{patient_sex}]
(0020,000d) UI [{study_uid}]
(0032,1060) LO [Radiology Procedure]
(0040,0100) SQ
  (fffe,e000) na
    (0040,0001) AE [{aet_title}]
    (0040,0002) DA [{sched_date}]
    (0040,0003) TM [{sched_time}]
    (0040,0009) SH [{accession_number}]
  (fffe,e00d) na
(fffe,e0dd) na
"""
    dump_path = f"/tmp/{accession_number}.dump"
    wl_path = os.path.join(WORKLIST_DIR, f"{accession_number}.wl")

    try:
        with open(dump_path, "w") as f:
            f.write(dump_content.strip())
        
        subprocess.run(["dump2dcm", dump_path, wl_path], check=True)
        
        if os.path.exists(dump_path):
            os.remove(dump_path)
            
        os.chmod(wl_path, 0o644)
        return jsonify({"message": "Worklist Created", "acc": accession_number}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/worklists/<acc>', methods=['DELETE'])
def delete_worklist(acc):
    if not check_auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    
    file_path = os.path.join(WORKLIST_DIR, f"{acc}.wl")
    if os.path.exists(file_path):
        os.remove(file_path)
        return jsonify({"message": f"Worklist {acc} deleted"}), 200
    return jsonify({"error": "Not found"}), 404

if __name__ == '__main__':
    port = int(os.environ.get("FLASK_RUN_PORT", 5000))
    app.run(host='0.0.0.0', port=port)