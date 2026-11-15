import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# 1. Load Dataset
df = pd.read_csv("dataset/cleaned_property.csv")

print("Dataset Loaded Successfully!")
print("Dataset Shape:", df.shape)

# 2. Select Features and Target
features = [
    "property_type",
    "city",
    "province_name",
    "purpose",
    "area_marla",
    "bedrooms",
    "baths"
]

X = df[features].copy()
y = pd.to_numeric(df["price"], errors="coerce")

# 3. Remove Invalid Prices
valid = y.notna() & (y > 0)
X = X.loc[valid]
y = y.loc[valid]

# 4. Define Columns
categorical_columns = [
    "property_type",
    "city",
    "province_name",
    "purpose"
]

numeric_columns = [
    "area_marla",
    "bedrooms",
    "baths"
]

# 5. Preprocessing
numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median"))
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("num", numeric_pipeline, numeric_columns),
    ("cat", categorical_pipeline, categorical_columns)
])

# 6. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.20,
    random_state=42
)

# 7. Create Random Forest Model
model = Pipeline([
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        min_samples_split=10,
        min_samples_leaf=5,
        random_state=42,
        n_jobs=-1
    ))
])

# 8. Train Model
print("\nTraining Random Forest Model...")

model.fit(X_train, y_train)

# 9. Predictions
predictions = model.predict(X_test)

# 10. Evaluation
r2 = r2_score(y_test, predictions)
mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))

print("\n========== RANDOM FOREST RESULTS ==========")
print("R2 Score:", round(r2, 4))
print("MAE:", round(mae, 2), "PKR")
print("RMSE:", round(rmse, 2), "PKR")

# 11. Save Model
os.makedirs("model", exist_ok=True)

joblib.dump(
    model,
    "model/random_forest.joblib"
)

print("\nRandom Forest Model Saved Successfully!")