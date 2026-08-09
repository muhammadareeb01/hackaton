import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os

def train():
    print("--- Training AI Model for SmartCity ---")
    
    # Paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "..", "data_science", "complaints_dataset.csv")
    model_dir = os.path.join(current_dir, "models")
    os.makedirs(model_dir, exist_ok=True)
    
    # 1. Load Data
    try:
        df = pd.read_csv(dataset_path)
        print(f"Loaded {len(df)} records from dataset.")
    except Exception as e:
        print(f"Error loading dataset: {e}. Please run generate_dataset.py first.")
        return
        
    X = df['description']
    y = df['category']
    
    # 2. Split Data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 3. Vectorize Text
    print("Vectorizing text using TF-IDF...")
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # 4. Train Classifier
    print("Training Logistic Regression Model...")
    model = LogisticRegression(class_weight='balanced', random_state=42, max_iter=1000)
    model.fit(X_train_vec, y_train)
    
    # 5. Evaluate
    print("\n--- Model Evaluation ---")
    y_pred = model.predict(X_test_vec)
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # 6. Save Models
    joblib.dump(vectorizer, f"{model_dir}/tfidf_vectorizer.joblib")
    joblib.dump(model, f"{model_dir}/category_model.joblib")
    print(f"\nModel and Vectorizer saved to {model_dir}/")

if __name__ == "__main__":
    train()
