import pandas as pd
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score

def train():
    print("--- Training Resolution Time Predictor Model ---")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "..", "data_science", "complaints_dataset.csv")
    model_dir = os.path.join(current_dir, "models")
    os.makedirs(model_dir, exist_ok=True)
    
    # 1. Load Data
    try:
        df = pd.read_csv(dataset_path)
        print(f"Loaded {len(df)} total records from dataset.")
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return
        
    # 2. Filter valid rows
    # We only want rows where resolution_days is not null
    df = df.dropna(subset=['resolution_days'])
    print(f"Using {len(df)} records with valid resolution days for training.")
    
    # Features (X) and Target (y)
    X = df[['category', 'priority']]
    y = df['resolution_days']
    
    # 3. Create Preprocessing Pipeline
    # Convert categorical text features into one-hot encoded numbers
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['category', 'priority'])
        ]
    )
    
    # 4. Create Model Pipeline
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    # 5. Split Data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 6. Train the Model
    print("Training Random Forest Regressor...")
    model_pipeline.fit(X_train, y_train)
    
    # 7. Evaluate
    y_pred = model_pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print("\n--- Model Evaluation ---")
    print(f"Mean Absolute Error (MAE): {mae:.2f} days")
    print(f"R-squared Score (R2): {r2:.2f}")
    
    # 8. Save the Pipeline
    model_path = os.path.join(model_dir, "resolution_model.joblib")
    joblib.dump(model_pipeline, model_path)
    print(f"\nModel Pipeline saved successfully to {model_path}")

if __name__ == "__main__":
    train()
