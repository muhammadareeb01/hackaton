import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

models = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-2.5-pro"]
for model in models:
    try:
        print(f"Testing {model}...")
        response = client.models.generate_content(
            model=model,
            contents="Hello! Respond with one word: 'Success'."
        )
        print(f"--- SUCCESS with {model} ---")
        print("Response:", response.text)
    except Exception as e:
        print(f"--- FAILURE with {model} ---")
        print("Error details:", str(e)[:300])
