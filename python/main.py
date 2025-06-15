from flask import Flask, request, jsonify
import whisper
import tempfile
import os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
model = whisper.load_model("base")
UPLOAD_DIR = os.getenv('UPLOAD_DIR','../public/uploads')
API_KEY = os.getenv("API_KEY")
def check_api_key(req):
    client_key = req.headers.get("x-api-key")
    return client_key == API_KEY

@app.route("/api/transcribe", methods=["POST"])
def transcribe():
    data = request.get_json()
    if not check_api_key(request):
         return jsonify({"error": "Unauthorized"}), 401
     
    if not data or 'filename' not in data:
        return jsonify({"error": "Missing 'filename' in request body"}), 400

    filename = data['filename']

    full_path = os.path.abspath(os.path.join(os.path.dirname(__file__), UPLOAD_DIR, filename))

    if not os.path.isfile(full_path):
        return jsonify({"error": f"File '{filename}' not found at {full_path}"}), 404
    try:
        result = model.transcribe(full_path)
        return jsonify({"text": result["text"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=os.getenv('APP_PORT',5000))
