import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import os

from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# =====================================
# 1. LOAD DATASET
# =====================================

df = pd.read_csv("dataset/cleaned_property.csv")

features = [
    "property_type",
    "city",
    "province_name",
    "purpose",
    "area_marla",
    "bedrooms",
    "baths"
]

X = df[features]
y = df["price"]

# =====================================
# 2. SPLIT DATA
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

# =====================================
# 3. LOAD TRAINED MODELS
# =====================================

models = {
    "Linear Regression": joblib.load(
        "model/linear_regression.joblib"
    ),

    "Decision Tree": joblib.load(
        "model/decision_tree.joblib"
    ),

    "Random Forest": joblib.load(
        "model/random_forest.joblib"
    )
}

# =====================================
# 4. MODEL EVALUATION
# =====================================

results = []
all_predictions = {}

for name, model in models.items():

    print(f"\nEvaluating {name}...")

    y_pred = model.predict(X_test)

    all_predictions[name] = y_pred

    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    results.append({
        "Model": name,
        "R2 Score": r2,
        "MAE": mae,
        "RMSE": rmse
    })

# =====================================
# 5. SAVE COMPARISON CSV
# =====================================

results_df = pd.DataFrame(results)

os.makedirs("results", exist_ok=True)

results_df.to_csv(
    "results/model_comparison.csv",
    index=False
)

print("\n========== MODEL COMPARISON ==========")
print(results_df.to_string(index=False))

# =====================================
# 6. FIND BEST MODEL
# =====================================

best_index = results_df["R2 Score"].idxmax()

best_model_name = results_df.loc[
    best_index, "Model"
]

print("\nBest Model:", best_model_name)

# =====================================
# 7. SAVE PREDICTIONS CSV
# =====================================

prediction_data = {
    "Actual Price": y_test.values
}

for name, prediction in all_predictions.items():
    prediction_data[name] = prediction

prediction_data["Best Model Prediction"] = (
    all_predictions[best_model_name]
)

prediction_df = pd.DataFrame(prediction_data)

prediction_df.to_csv(
    "results/all_model_predictions.csv",
    index=False
)

# =====================================
# 8. GENERATE COMPARISON GRAPHS
# =====================================

metrics = ["R2 Score", "MAE", "RMSE"]

for metric in metrics:

    plt.figure(figsize=(10, 6))

    plt.bar(
        results_df["Model"],
        results_df[metric]
    )

    plt.title(f"Model Comparison - {metric}")
    plt.xlabel("Machine Learning Models")
    plt.ylabel(metric)

    plt.tight_layout()

    plt.savefig(
        f"results/{metric.replace(' ', '_')}.png"
    )

    plt.close()

# =====================================
# 9. FINAL MESSAGE
# =====================================

print("\n====================================")
print("MODEL COMPARISON COMPLETED!")
print("Best Model:", best_model_name)
print("All results saved in results folder.")
print("====================================")