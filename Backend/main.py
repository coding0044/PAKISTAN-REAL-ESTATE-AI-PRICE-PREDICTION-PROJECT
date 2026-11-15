from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
from pathlib import Path

# Initialize FastAPI
app = FastAPI(
    title="Real Estate Price Prediction API",
    description="Property Price Prediction using Machine Learning",
    version="1.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "model" / "random_forest.joblib"

# Load trained model
model = joblib.load(MODEL_PATH)

print("Machine Learning Model Loaded Successfully!")


# Input data structure
class PropertyData(BaseModel):
    property_type: str
    city: str
    province_name: str
    purpose: str
    area_marla: float
    bedrooms: int
    baths: int


# Home route
@app.get("/")
def home():
    return {
        "message": "Real Estate Price Prediction API is Running",
        "status": "Success"
    }


# Health check
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "Random Forest"
    }


# Predict property price
@app.post("/predict")
def predict_price(data: PropertyData):

    try:
        input_data = pd.DataFrame([{
            "property_type": data.property_type,
            "city": data.city,
            "province_name": data.province_name,
            "purpose": data.purpose,
            "area_marla": data.area_marla,
            "bedrooms": data.bedrooms,
            "baths": data.baths
        }])

        prediction = model.predict(input_data)[0]

        return {
            "predicted_price": round(float(prediction), 2),
            "currency": "PKR",
            "model": "Random Forest"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )