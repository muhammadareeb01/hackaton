"""
AI Prediction Engine - Powered by Google Gemini (google-genai SDK)
Uses Gemini for advanced complaint analysis, categorization, priority assessment,
and AI engineer report generation. Falls back to local ML model if Gemini unavailable.
"""

import os
import re
import json
import base64
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()

# --- Gemini Setup (new google-genai SDK) ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
gemini_client = None

try:
    from google import genai
    if GEMINI_API_KEY:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        print("Gemini AI Engine loaded successfully.")
    else:
        print("GEMINI_API_KEY not found. AI features will be disabled.")
except ImportError:
    print("google-genai not installed. AI features will be disabled.")
except Exception as e:
    print(f"Gemini init failed ({e}). AI features will be disabled.")

import joblib

def get_static_fallback(text: str = "") -> dict:
    category = "Pending Review"
    confidence = 0.0
    
    # Try to use local ML model as fallback if text is provided
    if text:
        try:
            model_path = os.path.join(os.path.dirname(__file__), "models", "category_model.joblib")
            vec_path = os.path.join(os.path.dirname(__file__), "models", "tfidf_vectorizer.joblib")
            if os.path.exists(model_path) and os.path.exists(vec_path):
                model = joblib.load(model_path)
                vectorizer = joblib.load(vec_path)
                
                text_vec = vectorizer.transform([text])
                prediction = model.predict(text_vec)[0]
                
                # Get prediction probability if available
                probs = model.predict_proba(text_vec)[0]
                max_prob = max(probs)
                
                category = prediction
                confidence = round(max_prob * 100, 1)
                print(f"Local ML Fallback used: {category} ({confidence}%)")
        except Exception as e:
            print(f"Local ML model fallback failed: {e}")

    return {
        "category": category,
        "category_confidence": confidence,
        "top_keywords": [],
        "priority": "Medium",
        "priority_reasoning": "AI model unavailable. Default priority assigned.",
        "summary": "Processed via Local ML Model." if confidence > 0 else "Needs manual review.",
        "ai_report": {
            "sentiment": "Neutral",
            "urgency_score": 5,
            "affected_area_type": "Unknown",
            "estimated_resolution_days": 7,
            "recommended_department": category if confidence > 0 else "General Services",
            "engineer_notes": "Analyzed by offline fallback model." if confidence > 0 else "AI analysis unavailable. Please review this complaint manually.",
            "risk_assessment": "Moderate Risk",
            "similar_complaint_pattern": "Unclassified complaint"
        }
    }

# --- Gemini-Powered Prediction ---
def _predict_with_gemini(text: str, image_base64: str = None) -> dict:
    """Use Gemini to analyze the complaint (and image if provided) and return structured AI insights."""
    
    prompt = f"""You are an expert AI system for a smart city civic complaint management platform.

Analyze the following citizen complaint and respond ONLY with a valid JSON object (no markdown, no extra text).

Complaint Description: "{text}"
"""
    if image_base64:
        prompt += "\nAn image of the issue is also provided. Please analyze both the image and the text description to determine the problem.\n"
        
    prompt += """
Return this exact JSON structure:
{
  "category": "<one of: Water, Electricity, Road, Sanitation, Environment, Public Safety, Other>",
  "category_confidence": <float 0-100>,
  "top_keywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "priority": "<one of: Critical, High, Medium, Low>",
  "priority_reasoning": "<one sentence explaining the priority>",
  "summary": "<a concise 1-sentence professional summary of the complaint, max 80 chars>",
  "ai_report": {
    "sentiment": "<Negative | Neutral | Positive>",
    "urgency_score": <integer 1-10>,
    "affected_area_type": "<Residential | Commercial | Industrial | Public Space | Mixed>",
    "estimated_resolution_days": <integer>,
    "recommended_department": "<department name>",
    "engineer_notes": "<2-3 sentence professional assessment for the engineering team>",
    "risk_assessment": "<Low Risk | Moderate Risk | High Risk | Critical Risk>",
    "similar_complaint_pattern": "<brief description of what type of civic issue this represents>"
  }
}

Rules:
- Priority Critical: life-threatening, fire, flood, explosion, gas leak, major blackout
- Priority High: infrastructure failure, major water/electricity issues, road accidents
- Priority Medium: moderate civic issues needing attention within a week
- Priority Low: minor cosmetic or non-urgent issues
- Be precise and professional."""

    contents = [prompt]
    
    if image_base64:
        try:
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            image_bytes = base64.b64decode(image_base64)
            from google.genai import types
            contents.append(
                types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg')
            )
        except Exception as e:
            print(f"Error processing image base64: {e}")

    # Try gemini-2.0-flash first, fallback to gemini-2.5-flash on quota error
    for model_name in ["gemini-2.0-flash", "gemini-2.5-flash"]:
        try:
            response = gemini_client.models.generate_content(
                model=model_name,
                contents=contents
            )
            raw = response.text.strip()
            raw = re.sub(r'^```(?:json)?\s*', '', raw)
            raw = re.sub(r'\s*```$', '', raw)
            print(f"Used model: {model_name}")
            return json.loads(raw)
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e) or "404" in str(e) or "NOT_FOUND" in str(e):
                print(f"{model_name} failed ({e}), trying next model...")
                continue
            raise e

    raise Exception("All Gemini models quota exhausted")


# --- Main Public API ---
def predict_complaint(text: str, image_base64: str = None) -> dict:
    """
    Analyze a civic complaint using Google Gemini AI.
    """
    result = None
    if gemini_client:
        try:
            result = _predict_with_gemini(text, image_base64)
            print(f"Gemini analysis complete: {result.get('category')} / {result.get('priority')}")
        except Exception as e:
            print(f"Gemini prediction failed ({e}). Returning ML fallback.")
            result = get_static_fallback(text)
    else:
        result = get_static_fallback(text)
        
    # Inject Data Science ML Resolution Predictor
    try:
        model_path = os.path.join(os.path.dirname(__file__), "models", "resolution_model.joblib")
        if os.path.exists(model_path):
            resolution_model = joblib.load(model_path)
            
            # Prepare input data for pipeline
            import pandas as pd
            input_df = pd.DataFrame([{
                'category': result.get('category', 'Other'),
                'priority': result.get('priority', 'Medium')
            }])
            
            # Predict days and round to nearest whole number
            predicted_days = resolution_model.predict(input_df)[0]
            result['ai_report']['estimated_resolution_days'] = max(1, int(round(predicted_days)))
            print(f"ML Resolution Prediction: {result['ai_report']['estimated_resolution_days']} days")
    except Exception as e:
        print(f"Failed to run resolution ML predictor: {e}")

    return result

def get_estimated_resolution_days(category: str, priority: str) -> int:
    """Helper function to quickly predict resolution days for existing complaints"""
    try:
        model_path = os.path.join(os.path.dirname(__file__), "models", "resolution_model.joblib")
        if os.path.exists(model_path):
            resolution_model = joblib.load(model_path)
            import pandas as pd
            input_df = pd.DataFrame([{'category': category or 'Other', 'priority': priority or 'Medium'}])
            predicted_days = resolution_model.predict(input_df)[0]
            return max(1, int(round(predicted_days)))
    except Exception as e:
        pass
    return 7 # Default fallback


def generate_engineer_report(complaint_id: str, description: str, location: str,
                              category: str, priority: str) -> str:
    """
    Generate a detailed AI engineer report for a specific complaint.
    Used by the /report endpoint for admin dashboard.
    """
    if not gemini_client:
        return (
            f"## Engineer Report - {complaint_id}\n\n"
            f"**Category:** {category}\n"
            f"**Priority:** {priority}\n"
            f"**Location:** {location}\n\n"
            f"*AI report generation unavailable. Please review manually.*\n\n"
            f"**Description:** {description}"
        )

    prompt = f"""You are a senior civil engineer AI assistant for a smart city management system.

Generate a professional, detailed engineering report for the following civic complaint.

Complaint ID: {complaint_id}
Category: {category}
Priority: {priority}
Location: {location}
Description: {description}

Write a structured markdown report with these sections:
1. **Executive Summary** - 2-3 sentences
2. **Technical Assessment** - What is the likely cause and technical nature?
3. **Impact Analysis** - Who is affected and risks if unresolved?
4. **Recommended Actions** - Step-by-step action items for field team
5. **Resource Requirements** - Equipment, personnel, or materials needed
6. **Estimated Timeline** - Realistic resolution timeframe
7. **Prevention Recommendations** - How to prevent recurrence

Be professional, precise, and actionable."""

    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Report generation failed: {e}\n\nPlease review complaint {complaint_id} manually."


@lru_cache(maxsize=100)
def generate_category_metadata(category_name: str) -> dict:
    """
    Generate an emoji icon and a hex color code for a new category using Gemini.
    """
    if not gemini_client:
        return {"icon": "📋", "color": "#1a7a8a"}

    prompt = f"""You are a design assistant for a civic management portal.
I am creating a new complaint category named "{category_name}".

Please provide exactly ONE emoji that best represents this category and ONE suitable hex color code that is visually pleasing for a modern UI.

Respond ONLY with a valid JSON object in this exact format, with no other text or markdown fences:
{{
  "icon": "🐶",
  "color": "#d97706"
}}
"""
    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        raw = response.text.strip()
        raw = re.sub(r'^```(?:json)?\s*', '', raw)
        raw = re.sub(r'\s*```$', '', raw)
        return json.loads(raw)
    except Exception as e:
        print(f"generate_category_metadata failed: {e}")
        return {"icon": "📋", "color": "#1a7a8a"}


# --- Test ---
if __name__ == "__main__":
    test_text = "There is a massive water leak from a burst pipe on Oak Street, flooding the road."
    print("\nTesting AI Prediction Engine...")
    print(f"Input: {test_text}\n")
    result = predict_complaint(test_text)
    print(json.dumps(result, indent=2))
