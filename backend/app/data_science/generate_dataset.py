import csv
import random
from datetime import datetime, timedelta
import os

# Ensure directories exist
os.makedirs("output", exist_ok=True)

categories = ["Road", "Water", "Waste", "Electricity", "Drainage", "Safety", "Other"]
priorities = ["Low", "Medium", "High", "Critical"]
statuses = ["Open", "Assigned", "In Progress", "Resolved"]

templates = {
    "Road": ["Huge pothole on {street} causing traffic", "Traffic light broken at {street} intersection", "Road surface completely destroyed near {street}"],
    "Water": ["Pipe burst near {street}, water flooding the sidewalk", "No water supply in the building on {street}", "Dirty brown water coming from taps at {street}"],
    "Waste": ["Garbage bins overflowing for days on {street}", "Illegal dumping of construction waste near {street}", "Foul smell from uncollected trash at {street}"],
    "Electricity": ["Street lights not working on {street}", "Sparking power lines near {street}", "Complete blackout in the neighborhood around {street}"],
    "Drainage": ["Sewage backing up into street on {street}", "Blocked storm drain causing flooding at {street}", "Terrible smell from open drain near {street}"],
    "Safety": ["Broken fence near the park on {street}", "No pedestrian crossing visible at {street}", "Dangerous leaning tree over walkway on {street}"],
    "Other": ["Graffiti on public wall at {street}", "Stray dogs aggressive near {street}", "Loud noise complaint from construction on {street}"]
}

streets = ["Main St", "Oak Ave", "Pine St", "Maple Dr", "Cedar Ln", "Elm St", "Washington Blvd", "Park Ave"]

def generate_dataset(num_records=500):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    filepath = os.path.join(current_dir, "complaints_dataset.csv")
    
    with open(filepath, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["complaint_id", "description", "category", "priority", "date_submitted", "resolution_days", "status"])
        
        for i in range(1, num_records + 1):
            category = random.choices(categories, weights=[0.25, 0.2, 0.2, 0.15, 0.1, 0.05, 0.05])[0] # Imbalanced
            description = random.choice(templates[category]).format(street=random.choice(streets))
            
            # Priority roughly correlates with category for realism
            if category in ["Water", "Electricity"]:
                priority = random.choices(priorities, weights=[0.1, 0.2, 0.4, 0.3])[0]
            else:
                priority = random.choices(priorities, weights=[0.4, 0.4, 0.15, 0.05])[0]
                
            date_submitted = datetime.now() - timedelta(days=random.randint(1, 180))
            
            # Status and resolution days
            status = random.choices(statuses, weights=[0.1, 0.1, 0.2, 0.6])[0]
            
            if status == "Resolved":
                # Resolution days vary by priority (critical is resolved faster typically, or sometimes slower if complex)
                if priority == "Critical":
                    res_days = random.randint(1, 5)
                else:
                    res_days = random.randint(3, 30)
            else:
                res_days = "" # Null if not resolved
                
            writer.writerow([f"C{i:04d}", description, category, priority, date_submitted.strftime("%Y-%m-%d %H:%M:%S"), res_days, status])
            
    print(f"Successfully generated {num_records} synthetic complaints at {filepath}")

if __name__ == "__main__":
    generate_dataset()
