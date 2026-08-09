from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

try:
    history = []
    history.append(types.Content(role='user', parts=[types.Part.from_text(text="Hello")]))
    latest_message = "How are you?"

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[*history, latest_message],
        config=types.GenerateContentConfig(
            system_instruction="You are a bot.",
            temperature=0.3,
        )
    )
    print(response.text)
except Exception as e:
    print("EXCEPTION:", repr(e))
