import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Load cleaned dataset
df = pd.read_csv("dataset/cleaned_property.csv")

# Create folder for graphs
os.makedirs("graphs", exist_ok=True)

# Set graph style
sns.set_theme(style="whitegrid")

# Convert important columns into numeric
df["price"] = pd.to_numeric(df["price"], errors="coerce")
df["area_marla"] = pd.to_numeric(df["area_marla"], errors="coerce")
df["bedrooms"] = pd.to_numeric(df["bedrooms"], errors="coerce")

print("Dataset Loaded Successfully!")
print("Dataset Shape:", df.shape)

# ==================================
# 1. Property Price Distribution
# ==================================

plt.figure(figsize=(10, 6))

sns.histplot(
    data=df,
    x="price",
    bins=50,
    color="blue"
)

plt.title("Pakistan Real Estate Price Distribution")
plt.xlabel("Property Price (PKR)")
plt.ylabel("Number of Properties")

plt.tight_layout()
plt.savefig("graphs/price_distribution.png")
plt.show()


# ==================================
# 2. City Wise Property Prices
# ==================================

city_prices = (
    df.groupby("city")["price"]
    .median()
    .sort_values(ascending=False)
    .head(10)
)

plt.figure(figsize=(12, 6))

sns.barplot(
    x=city_prices.values,
    y=city_prices.index
)

plt.title("Top 10 Cities by Median Property Price")
plt.xlabel("Median Property Price (PKR)")
plt.ylabel("City")

plt.tight_layout()
plt.savefig("graphs/city_prices.png")
plt.show()


# ==================================
# 3. Property Type Comparison
# ==================================

property_prices = (
    df.groupby("property_type")["price"]
    .median()
    .sort_values(ascending=False)
)

plt.figure(figsize=(10, 6))

sns.barplot(
    x=property_prices.index,
    y=property_prices.values
)

plt.title("Property Type vs Median Price")
plt.xlabel("Property Type")
plt.ylabel("Median Price (PKR)")

plt.xticks(rotation=30)
plt.tight_layout()
plt.savefig("graphs/property_type.png")
plt.show()


# ==================================
# 4. Area vs Property Price
# ==================================

sample_data = df[
    (df["area_marla"] > 0) &
    (df["price"] > 0)
].sample(
    n=min(3000, len(df)),
    random_state=42
)

plt.figure(figsize=(10, 6))

sns.scatterplot(
    data=sample_data,
    x="area_marla",
    y="price",
    alpha=0.5
)

plt.title("Property Area vs Price")
plt.xlabel("Area (Marla)")
plt.ylabel("Property Price (PKR)")

plt.tight_layout()
plt.savefig("graphs/area_vs_price.png")
plt.show()


# ==================================
# 5. Bedrooms vs Property Price
# ==================================

bedroom_prices = (
    df.groupby("bedrooms")["price"]
    .median()
    .dropna()
)

plt.figure(figsize=(10, 6))

sns.barplot(
    x=bedroom_prices.index,
    y=bedroom_prices.values
)

plt.title("Bedrooms vs Median Property Price")
plt.xlabel("Number of Bedrooms")
plt.ylabel("Median Price (PKR)")

plt.tight_layout()
plt.savefig("graphs/bedrooms_vs_price.png")
plt.show()


print("\n================================")
print("ALL GRAPHS GENERATED SUCCESSFULLY!")
print("Check the graphs folder.")
print("================================")