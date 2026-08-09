import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os

def perform_eda():
    dataset_path = "complaints_dataset.csv"
    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)
    
    # Load dataset
    df = pd.read_csv(dataset_path)
    
    print("--- AI Smart Civic Services: Statistical EDA Report (Batch 4) ---")
    print(f"Total Complaints: {len(df)}")
    
    # 1. Frequency Distribution of Categories
    category_counts = df['category'].value_counts()
    category_percentages = df['category'].value_counts(normalize=True) * 100
    
    print("\n[Category Distribution]")
    for cat, count in category_counts.items():
        print(f"{cat}: {count} ({category_percentages[cat]:.1f}%)")
        
    # Plot Category Bar Chart
    plt.figure(figsize=(10, 6))
    category_counts.plot(kind='bar', color='#1a7a8a')
    plt.title("Complaint Category Frequency", fontsize=14, fontweight='bold')
    plt.xlabel("Category")
    plt.ylabel("Number of Complaints")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f"{output_dir}/category_distribution.png")
    plt.close()

    # 2. Priority Distribution
    priority_counts = df['priority'].value_counts()
    print("\n[Priority Distribution]")
    print(priority_counts)
    
    # Plot Priority Pie Chart
    plt.figure(figsize=(8, 8))
    colors = ['#16a34a', '#eab308', '#ea580c', '#dc2626'] # Green, Yellow, Orange, Red
    priority_counts.plot(kind='pie', autopct='%1.1f%%', colors=colors)
    plt.title("Priority Levels", fontsize=14, fontweight='bold')
    plt.ylabel("")
    plt.tight_layout()
    plt.savefig(f"{output_dir}/priority_distribution.png")
    plt.close()

    # 3. Resolution Time Statistics
    # Filter only resolved cases
    resolved_df = df[df['status'] == 'Resolved'].copy()
    resolved_df['resolution_days'] = pd.to_numeric(resolved_df['resolution_days'])
    
    days = resolved_df['resolution_days']
    
    mean = np.mean(days)
    median = np.median(days)
    mode = days.mode()[0]
    std_dev = np.std(days)
    variance = np.var(days)
    min_val = np.min(days)
    max_val = np.max(days)
    data_range = max_val - min_val
    
    q1 = np.percentile(days, 25)
    q3 = np.percentile(days, 75)
    iqr = q3 - q1
    lower_fence = q1 - (1.5 * iqr)
    upper_fence = q3 + (1.5 * iqr)
    
    print("\n[Resolution Time Statistics (Days)]")
    print(f"Mean (Average): {mean:.2f}")
    print(f"Median (Middle): {median:.2f}")
    print(f"Mode (Most Common): {mode}")
    print(f"Standard Deviation (Consistency): {std_dev:.2f}")
    print(f"Variance: {variance:.2f}")
    print(f"Range: {data_range} (Min: {min_val}, Max: {max_val})")
    
    print("\n[Distribution Shape & Outliers]")
    print(f"Q1 (25th Percentile): {q1}")
    print(f"Q3 (75th Percentile): {q3}")
    print(f"IQR (Middle 50% Spread): {iqr}")
    print(f"Lower Fence: {lower_fence}")
    print(f"Upper Fence: {upper_fence}")
    
    outliers = resolved_df[(days < lower_fence) | (days > upper_fence)]
    print(f"Number of Outlier Cases (Unusually fast or slow): {len(outliers)}")
    
    # Plot Resolution Time Boxplot
    plt.figure(figsize=(8, 6))
    plt.boxplot(days, vert=False, patch_artist=True, boxprops=dict(facecolor='#0b3d59', color='#0b3d59'))
    plt.title("Resolution Time Spread (Boxplot with Fences)", fontsize=14, fontweight='bold')
    plt.xlabel("Days to Resolve")
    plt.tight_layout()
    plt.savefig(f"{output_dir}/resolution_boxplot.png")
    plt.close()
    
    print(f"\nAll statistics computed successfully. Charts saved to /{output_dir}/")

if __name__ == "__main__":
    perform_eda()
