import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_service import analyze_humanitarian_request

app = Flask(__name__)
# Enable CORS for all routes (crucial for Next.js localhost:3000 -> Flask localhost:5000)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "service": "AidLink AI Humanitarian Response API",
        "version": "1.0.0"
    })

@app.route("/api/presets", methods=["GET"])
def get_presets():
    """Sample real-world emergency presets for rapid 1-click hackathon judging demo"""
    presets = [
        {
            "id": "flood_relief",
            "title": "Flash Flood Trapped Family",
            "category": "Rescue & Water",
            "text": "URGENT: Flash flood in Ward 4 riverside area. Elderly couple and 2 small children trapped on second floor roof without clean drinking water. Water level rising fast."
        },
        {
            "id": "medical_insulin",
            "title": "Critical Medication Shortage",
            "category": "Medical",
            "text": "Medical alert: Power cut has lasted 18 hours in Sector 7 shelter. A 9-year-old child needs refrigerated insulin urgently. Glucose levels spiking."
        },
        {
            "id": "refugee_supplies",
            "title": "Displaced Community Supplies",
            "category": "Food & Shelter",
            "text": "45 displaced persons arrived at Community Hall near Central High School. Need dry food rations, baby formula, and 30 blankets before nightfall."
        }
    ]
    return jsonify(presets)

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "").strip()
    category = data.get("category", "general")

    if not text:
        return jsonify({
            "error": "Please provide a valid crisis or relief description."
        }), 400

    try:
        result = analyze_humanitarian_request(text, category)
        return jsonify({
            "success": True,
            "data": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[AidLink] Backend starting on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
