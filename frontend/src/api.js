const API_BASE_URL = "http://127.0.0.1:8000";

// Check FastAPI connection
export const checkAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend connection failed");
  }

  return await response.json();
};

// Predict property price
export const predictProperty = async (propertyData) => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(propertyData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Prediction failed");
  }

  return result;
};