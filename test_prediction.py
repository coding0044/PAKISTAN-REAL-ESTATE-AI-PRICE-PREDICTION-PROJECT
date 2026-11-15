import pandas as pd
import joblib

# Load dataset
df = pd.read_csv("dataset/cleaned_property.csv")

# Load best model
model = joblib.load("model/random_forest.joblib")

# Select features
features = [
    "property_type",
    "city",
    "province_name",
    "purpose",
    "area_marla",
    "bedrooms",
    "baths"
]

# Take one real property from dataset
X = df[features].iloc[[0]]
actual_price = df["price"].iloc[0]

# Predict price
predicted_price = model.predict(X)[0]

print("\nREAL ESTATE PRICE PREDICTION")
print("--------------------------------")
print("Actual Price:", actual_price, "PKR")
print("Predicted Price:", predicted_price, "PKR")
print("--------------------------------")
print("Prediction Testing Completed!")