import pandas as pd
import os

# Load original dataset
df = pd.read_csv("dataset/Property_with_Feature_Engineering.csv")

print("Original Dataset Shape:", df.shape)

# Remove duplicate rows
df = df.drop_duplicates()

# Fill missing agency and agent
df["agency"] = df["agency"].fillna("Unknown")
df["agent"] = df["agent"].fillna("Unknown")

# Convert text values into numeric values
df["price"] = pd.to_numeric(
    df["price"], errors="coerce"
)

df["area_marla"] = pd.to_numeric(
    df["area_marla"], errors="coerce"
)

df["area_sqft"] = pd.to_numeric(
    df["area_sqft"], errors="coerce"
)

# Remove missing and invalid prices
df = df.dropna(subset=["price", "area_marla"])

df = df[
    (df["price"] > 0) &
    (df["area_marla"] > 0)
]

# Save cleaned dataset
os.makedirs("dataset", exist_ok=True)

df.to_csv(
    "dataset/cleaned_property.csv",
    index=False
)

# Display results
print("\n========== CLEANING RESULTS ==========")

print("Cleaned Dataset Shape:", df.shape)

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Rows:", df.duplicated().sum())

print("\nCleaned CSV Saved Successfully!")