import pandas as pd

# Load CSV file
df = pd.read_csv("dataset/Property_with_Feature_Engineering.csv")

# Display first 5 rows
print("\n========== FIRST 5 ROWS ==========")
print(df.head())

# Display all column names
print("\n========== DATASET COLUMNS ==========")
print(df.columns.tolist())

# Dataset shape
print("\n========== DATASET SHAPE ==========")
print("Rows:", df.shape[0])
print("Columns:", df.shape[1])

# Dataset information
print("\n========== DATASET INFORMATION ==========")
df.info()

# Check missing values
print("\n========== MISSING VALUES ==========")
print(df.isnull().sum())

# Check duplicate rows
print("\n========== DUPLICATE ROWS ==========")
print(df.duplicated().sum())