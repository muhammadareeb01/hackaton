import requests
try:
    res = requests.post("http://localhost:8000/api/chat/", json={"messages": [{"role": "user", "content": "hi"}]})
    print(res.status_code)
    print(res.text)
except Exception as e:
    print(e)
