import os
import joblib
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "email_spam_model.joblib")

# A mini dataset of good vs disposable/spam domains to train the model on the fly
TRAINING_DATA = [
    # Good Domains
    {"domain": "gmail.com", "is_spam": 0},
    {"domain": "yahoo.com", "is_spam": 0},
    {"domain": "hotmail.com", "is_spam": 0},
    {"domain": "outlook.com", "is_spam": 0},
    {"domain": "icloud.com", "is_spam": 0},
    {"domain": "company.com", "is_spam": 0},
    {"domain": "university.edu", "is_spam": 0},
    {"domain": "gov.pk", "is_spam": 0},
    {"domain": "live.com", "is_spam": 0},
    {"domain": "me.com", "is_spam": 0},
    {"domain": "protonmail.com", "is_spam": 0},

    # Disposable / Spam Domains
    {"domain": "10minutemail.com", "is_spam": 1},
    {"domain": "temp-mail.org", "is_spam": 1},
    {"domain": "guerrillamail.com", "is_spam": 1},
    {"domain": "mailinator.com", "is_spam": 1},
    {"domain": "yopmail.com", "is_spam": 1},
    {"domain": "trashmail.com", "is_spam": 1},
    {"domain": "dispostable.com", "is_spam": 1},
    {"domain": "sharklasers.com", "is_spam": 1},
    {"domain": "spam4.me", "is_spam": 1},
    {"domain": "tempmail.com", "is_spam": 1},
    {"domain": "fakeinbox.com", "is_spam": 1},
    {"domain": "throwawaymail.com", "is_spam": 1}
]

def get_or_train_model():
    """Loads the model from disk, or trains it if it doesn't exist."""
    if os.path.exists(MODEL_PATH):
        try:
            return joblib.load(MODEL_PATH)
        except Exception as e:
            print(f"Error loading model: {e}. Retraining...")
    
    print("Training Email Spam Detection Model...")
    df = pd.DataFrame(TRAINING_DATA)
    
    # We use character n-grams to detect patterns common in disposable emails 
    # (like "temp", "trash", "mailinator") vs normal domains.
    pipeline = Pipeline([
        ('vectorizer', CountVectorizer(analyzer='char_wb', ngram_range=(3, 5))),
        ('classifier', LogisticRegression(random_state=42))
    ])
    
    pipeline.fit(df['domain'], df['is_spam'])
    
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    
    return pipeline

def is_disposable_email(email: str) -> bool:
    """
    Predicts whether a given email is disposable/spam using the ML model.
    Returns True if it's likely a disposable email, False otherwise.
    """
    if not email or "@" not in email:
        return True # Invalid emails are treated as bad
        
    domain = email.split("@")[-1].lower().strip()
    
    # Exact match for major known providers (to be absolutely safe on common ones)
    KNOWN_GOOD = {"gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"}
    if domain in KNOWN_GOOD:
        return False
        
    # Use ML model for the rest
    model = get_or_train_model()
    prediction = model.predict([domain])[0]
    
    return bool(prediction == 1)

if __name__ == "__main__":
    # Test the model
    test_emails = [
        "user@gmail.com",
        "hacker@10minutemail.com",
        "john.doe@company.com",
        "spammer@temp-mail.org",
        "hello@yopmail.com"
    ]
    for e in test_emails:
        res = "SPAM/DISPOSABLE" if is_disposable_email(e) else "GOOD"
        print(f"{e:30} -> {res}")
