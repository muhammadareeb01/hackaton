import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
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
    
    # 3. Create Pipeline
    print("Creating Pipeline with TF-IDF and Logistic Regression...")
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=1000)),
        ('clf', LogisticRegression(class_weight='balanced', random_state=42, max_iter=1000))
    ])
    
    # 4. Train Classifier
    print("Training Pipeline...")
    pipeline.fit(X_train, y_train)
    
    # 5. Evaluate
    print("\n--- Model Evaluation ---")
    y_pred = pipeline.predict(X_test)
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # 6. Save Model
    joblib.dump(pipeline, f"{model_dir}/category_pipeline.joblib")
    print(f"\nPipeline saved to {model_dir}/category_pipeline.joblib")

if __name__ == "__main__":
    train()
