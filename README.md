<h1 align="center">🏡 EstateIQ </h1>


<p align="center">  
  AI-Powered Real Estate Price Prediction System
  <b>Intelligent Property Valuation for Pakistan</b>  
</p>  <p align="center">  
  <img src="https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python" />  
  <img src="https://img.shields.io/badge/React-JavaScript-61DAFB?style=for-the-badge&logo=react" />  
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi" />  
  <img src="https://img.shields.io/badge/ML-Random_Forest-green?style=for-the-badge" />  
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel" />  
</p>  
---

✨ Overview

EstateIQ is an AI-powered real estate price prediction platform designed to estimate property values across Pakistan using Machine Learning.

Powered by a trained Random Forest Regression Model, EstateIQ analyzes property characteristics and generates estimated property prices through an interactive web application.

The platform combines a modern React frontend, FastAPI backend, and machine learning prediction engine.


---

🚀 Features

- 🤖 AI-powered property price prediction
- 🏠 Multiple property types
- 📍 City and province-based property analysis
- 📊 Real estate market analytics
- 🧠 Multiple machine learning models
- 📜 Prediction history
- ⚡ FastAPI REST API
- 🔌 Live backend health monitoring
- 🎨 Modern and responsive dashboard


---

🛠️ Technology Stack

Category	Technologies

Frontend	React.js, JavaScript, CSS3
Backend	Python, FastAPI, Uvicorn
Machine Learning	Scikit-learn, Random Forest
Data Processing	Pandas
Model Storage	Joblib
API Validation	Pydantic
Version Control	Git, GitHub
Deployment	Vercel



---

🧠 Machine Learning Architecture

PROPERTY DETAILS  
              |  
              ▼  
        REACT FRONTEND  
              |  
              ▼  
         FASTAPI  
          BACKEND  
              |  
              ▼  
      RANDOM FOREST MODEL  
              |  
              ▼  
       PRICE PREDICTION  
              |  
              ▼  
         RESULT IN PKR

Input Parameters

Parameter	Description

property_type	Property type
city	Property city
province_name	Province
purpose	For Sale / For Rent
area_marla	Property area
bedrooms	Number of bedrooms
baths	Number of bathrooms



---

📂 Project Structure

AI-Project/  
│  
├── Backend/  
│   ├── __init__.py  
│   └── main.py  
│  
├── frontend/  
│   └── React Application  
│  
├── dataset/  
├── graphs/  
├── model/  
│   └── random_forest.joblib  
│  
├── results/  
├── venv/  
│  
├── check_data.py  
├── compare_models.py  
├── data_cleaning.py  
├── data_visualization.py  
│  
├── train_decision_tree.py  
├── train_linear.py  
├── train_random_forest.py  
│  
├── test_prediction.py  
├── model_evaluation_report.txt  
├── requirements.txt  
├── pyproject.toml  
└── vercel.json


---

⚙️ Installation & Setup

1. Clone Repository

git clone YOUR_GITHUB_REPOSITORY_URL  
cd AI-Project

2. Create Virtual Environment

python -m venv venv

Activate on Windows:

venv\Scripts\activate

3. Install Dependencies

pip install -r requirements.txt

4. Run Backend

uvicorn Backend.main:app --reload

Backend:

https://ai-real-estate-backend.vercel.app/

API Documentation:

(https://ai-real-estate-backend.vercel.app/)/docs

5. Run Frontend

cd frontend  
npm install  
npm run dev


---

🌐 Live Backend API

Production Backend: Hosted on Vercel.

Service	URL

Backend	https://ai-real-estate-backend.vercel.app/
Health Check	https://ai-real-estate-backend.vercel.app/health
API Documentation	https://ai-real-estate-backend.vercel.app/docs



---

🔗 API Endpoints

GET /

Returns API welcome information.

GET /health

Checks backend and machine learning model status.

Example response:

{  
  "status": "healthy",  
  "model": "Random Forest"  
}

POST /predict

Generates a property price prediction.

Example request:

{  
  "property_type": "House",  
  "city": "Karachi",  
  "province_name": "Sindh",  
  "purpose": "For Sale",  
  "area_marla": 5,  
  "bedrooms": 3,  
  "baths": 2  
}

Example response:

{  
  "predicted_price": 15000000.0,  
  "currency": "PKR",  
  "model": "Random Forest"  
}

Example prediction only. Actual results depend on the trained model.


---

📊 Machine Learning Experiments

Script	Purpose

train_linear.py	Linear Regression
train_decision_tree.py	Decision Tree
train_random_forest.py	Random Forest
compare_models.py	Model comparison
test_prediction.py	Prediction testing
data_cleaning.py	Dataset cleaning
data_visualization.py	Data visualization
check_data.py	Dataset inspection



---

🎯 Project Objectives

- Simplify real estate price estimation.
- Apply machine learning to property data.
- Provide accessible property valuation.
- Explore real estate trends across Pakistani cities.
- Integrate AI with modern web technologies.


---

🔮 Future Improvements

- Advanced property price comparison.
- Interactive market trend visualization.
- Expanded city coverage.
- Improved model optimization.
- Persistent prediction history.
- Additional machine learning algorithms.


---

👨‍💻 Project Information

Detail	Information

Project Name	EstateIQ
Domain	Artificial Intelligence
Category	Machine Learning & Web Development
Model	Random Forest Regression
Frontend	React.js
Backend	FastAPI
Currency	Pakistani Rupee (PKR)
Target Market	Pakistan



---

<p align="center">  
  <h2 align="center">🏡 EstateIQ</h2>  
  <b>Smarter Property Decisions. Powered by AI.</b>  
  <br><br>  
  Built with ❤️ using Python, React & Machine Learning.  
</p>
