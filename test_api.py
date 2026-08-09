import requests
import json

url = "http://localhost:8000/api/complaints/"
payload = {
    "description": "iwyfiuw wyfoui lkwdhfoi kjwdhfiuw",
    "location": "karachi hyderbad",
    "citizen_name": "ahskl sldsifhli",
    "citizen_email": "syedareebali795@gmail.com",
    "citizen_phone": "+1 234 567 890",
    "category": "Road",
    "image_base64": None
}

headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
