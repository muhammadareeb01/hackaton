import sys
import os

# Add backend directory to sys.path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.ai.predict import predict_complaint

result = predict_complaint("There is a large pothole on Main Street causing traffic accidents.")
print(result)
