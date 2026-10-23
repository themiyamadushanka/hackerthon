import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def analyze_humanitarian_request(user_text, category_hint="general"):
    """
    Analyzes crisis/relief distress signals, medical needs, or humanitarian requests.
    Returns structured data for rapid response coordination.
    """
    # 1. If GEMINI_API_KEY is configured and valid, call Gemini API
    if GEMINI_API_KEY and not GEMINI_API_KEY.startswith("your_") and len(GEMINI_API_KEY) > 10:
        try:
            gemini_result = call_gemini_api(user_text, category_hint)
            if gemini_result:
                return gemini_result
        except Exception as e:
            print(f"[AI Service] Gemini call failed: {e}. Falling back to rule-based AI engine.")

    # 2. Robust Built-in Hackathon AI Rule & NLP Fallback Engine
    # Ensures the demo ALWAYS succeeds even without network or API key
    return fallback_ai_engine(user_text, category_hint)


def call_gemini_api(user_text, category_hint):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    system_prompt = """You are an AI for Humanity Crisis & Relief Coordinator.
Analyze the user's distress message or humanitarian request.
Return ONLY valid JSON matching this schema:
{
  "urgency": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "category": "Medical" | "Food & Water" | "Shelter & Rescue" | "Mental Support" | "Logistics",
  "summary": "1-sentence executive summary",
  "extracted_location": "Extracted location or 'Unknown/Not specified'",
  "people_affected_estimate": "Estimated number or 'Unspecified'",
  "immediate_needs": ["list", "of", "top", "needs"],
  "recommended_actions": ["step 1", "step 2", "step 3"],
  "sentiment_urgency_score": 85 (0 to 100),
  "ai_reasoning": "Brief explanation of why this priority was assigned"
}
Do not include markdown ticks like ```json, just return raw JSON."""

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{system_prompt}\n\nUser Message: {user_text}\nCategory Hint: {category_hint}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json"
        }
    }

    resp = requests.post(url, json=payload, timeout=8)
    if resp.status_code == 200:
        data = resp.json()
        raw_text = data['candidates'][0]['content']['parts'][0]['text']
        return json.loads(raw_text)
    else:
        print(f"[Gemini API Error] {resp.status_code}: {resp.text}")
        return None


def fallback_ai_engine(text, category_hint):
    """
    Intelligent heuristic triage engine for zero-failure hackathon demonstrations.
    """
    lower = text.lower()
    
    # Priority keywords
    critical_keywords = ["trapped", "dying", "bleeding", "drowning", "unconscious", "heart attack", "collapsed", "urgent", "suffocating", "severe"]
    high_keywords = ["insulin", "elderly", "children", "baby", "drinking water", "flood", "fire", "pregnant", "injured", "out of medication", "stranded"]
    medical_keywords = ["doctor", "medicine", "insulin", "pain", "hospital", "bandage", "fever", "fracture", "oxygen", "prescription"]
    food_water_keywords = ["hungry", "food", "drinking water", "starving", "clean water", "rations", "supplies", "dehydration"]
    shelter_keywords = ["shelter", "blanket", "tent", "roof", "evacuate", "displaced", "home destroyed"]
    mental_keywords = ["panic", "anxiety", "crying", "trauma", "scared", "alone", "terrified", "depression"]

    # Calculate urgency
    urgency = "MEDIUM"
    score = 65

    if any(k in lower for k in critical_keywords):
        urgency = "CRITICAL"
        score = 95
    elif any(k in lower for k in high_keywords):
        urgency = "HIGH"
        score = 82
    elif len(text.split()) < 4:
        urgency = "LOW"
        score = 40

    # Determine category
    category = "Logistics & General Relief"
    if any(k in lower for k in medical_keywords):
        category = "Medical Emergency"
    elif any(k in lower for k in food_water_keywords):
        category = "Food & Clean Water"
    elif any(k in lower for k in shelter_keywords):
        category = "Shelter & Rescue"
    elif any(k in lower for k in mental_keywords):
        category = "Mental Health & Crisis Support"

    # Extract location heuristically (looks for "in ...", "at ...", "near ...")
    location_match = re.search(r'\b(?:in|at|near|around|from)\s+([A-Z][a-zA-Z0-9\s,]+(?:\bward|\bsector|\bstreet|\bcity|\bzone|\bdistrict)?)', text, re.IGNORECASE)
    extracted_location = location_match.group(1).strip() if location_match else "Unspecified / Needs GPS Verification"

    # Extract numbers if present
    nums = re.findall(r'\b(\d+)\s*(?:people|persons|families|children|elderly|victims)?\b', text, re.IGNORECASE)
    people_affected = f"Approximately {nums[0]} individuals" if nums else "Unspecified group size"

    # Needs synthesis
    needs = []
    if "water" in lower: needs.append("Potable drinking water")
    if "food" in lower or "rations" in lower: needs.append("Nutritional food packets")
    if "insulin" in lower or "medicine" in lower: needs.append("Critical medication & temperature-controlled storage")
    if "trapped" in lower or "boat" in lower or "rescue" in lower: needs.append("Search and rescue squad / boat deployment")
    if "blanket" in lower or "cold" in lower: needs.append("Warm blankets & dry clothing")
    if not needs:
        needs = ["On-ground situation assessment", "Emergency first-response kit", "Communication relay"]

    # Recommended actions
    actions = [
        f"Dispatch nearest responder unit to location: {extracted_location}",
        f"Alert volunteer logistics team for {category.lower()} requirements",
        "Open high-priority communication channel for status confirmation",
        "Log incident to humanitarian relief coordinate dashboard"
    ]

    return {
        "urgency": urgency,
        "category": category,
        "summary": text[:120] + ("..." if len(text) > 120 else ""),
        "extracted_location": extracted_location,
        "people_affected_estimate": people_affected,
        "immediate_needs": needs,
        "recommended_actions": actions,
        "sentiment_urgency_score": score,
        "ai_reasoning": f"Identified {category} indicators with priority status '{urgency}' based on humanitarian keyword scoring."
    }
