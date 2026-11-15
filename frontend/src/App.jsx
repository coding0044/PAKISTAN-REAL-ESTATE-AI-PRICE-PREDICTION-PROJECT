import React, { useState, useEffect } from "react";
import { checkAPI, predictProperty } from "./api";
import "./App.css";

function App() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    property_type: "House",
    city: "Karachi",
    province_name: "Sindh",
    purpose: "For Sale",
    area_marla: 5,
    bedrooms: 3,
    baths: 2,
  });

  useEffect(() => {
    checkAPI()
      .then(() => setConnected(true))
      .catch(() => setConnected(false));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await predictProperty(form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Pakistan Real Estate AI</h1>
        <p>Machine Learning Property Price Prediction</p>
        <span className={connected ? "online" : "offline"}>
          {connected ? "Backend Connected" : "Backend Disconnected"}
        </span>
      </header>

      <main className="container">
        <h2>Property Price Prediction</h2>
        <p>Enter your property details below.</p>

        <form onSubmit={handlePredict}>
          <div className="form-grid">
            <label>
              Property Type
              <select name="property_type" value={form.property_type}
                onChange={handleChange}>
                <option>House</option>
                <option>Flat</option>
                <option>Upper Portion</option>
                <option>Lower Portion</option>
                <option>Plot</option>
              </select>
            </label>

            <label>
              City
              <input name="city" value={form.city}
                onChange={handleChange} required />
            </label>

            <label>
              Province
              <select name="province_name" value={form.province_name}
                onChange={handleChange}>
                <option>Sindh</option>
                <option>Punjab</option>
                <option>KPK</option>
                <option>Balochistan</option>
                <option>Islamabad Capital Territory</option>
              </select>
            </label>

            <label>
              Purpose
              <select name="purpose" value={form.purpose}
                onChange={handleChange}>
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </label>

            <label>
              Area (Marla)
              <input type="number" name="area_marla"
                value={form.area_marla} onChange={handleChange}
                min="0.1" step="0.1" required />
            </label>

            <label>
              Bedrooms
              <input type="number" name="bedrooms"
                value={form.bedrooms} onChange={handleChange}
                min="0" required />
            </label>

            <label>
              Bathrooms
              <input type="number" name="baths"
                value={form.baths} onChange={handleChange}
                min="0" required />
            </label>
          </div>

          <button type="submit" disabled={loading || !connected}>
            {loading ? "Predicting..." : "Predict Property Price"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result">
            <h3>Predicted Property Price</h3>
            <h1>
              {result.currency}{" "}
              {Number(result.predicted_price).toLocaleString("en-PK")}
            </h1>
            <p>Machine Learning Model: {result.model}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;