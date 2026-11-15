import { useEffect, useMemo, useState } from "react";
import { checkAPI, predictProperty } from "./api";
import "./App.css";

const navigation = [
  { id: "overview", label: "Overview", icon: "overview" },
  { id: "predict", label: "Predict property", icon: "predict" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
  { id: "models", label: "ML models", icon: "models" },
  { id: "history", label: "Prediction history", icon: "history" },
  { id: "about", label: "About project", icon: "about" },
];

const iconPaths = {
  overview: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  predict: ["m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z", "m19 14 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z"],
  analytics: ["M3 3v18h18", "m19 9-5 5-4-4-5 5", "M19 9v5h-5"],
  models: ["m12 3 9 5-9 5-9-5 9-5Z", "m3 12 9 5 9-5", "m3 16 9 5 9-5", "M12 13v8"],
  history: ["M3 12a9 9 0 1 0 2.6-6.4L3 8", "M3 3v5h5", "M12 7v5l3 2"],
  about: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 11v5", "M12 8h.01"],
  search: ["m20 20-4.4-4.4", "M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"],
  bell: ["M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9", "M10 21h4"],
  arrow: ["M5 12h14", "m13 6 6 6-6 6"],
  home: ["m3 10 9-7 9 7", "M5 9v12h14V9", "M9 21v-7h6v7"],
  building: ["M3 21h18", "M5 21V5l7-2v18", "M19 21V9l-7-2", "M9 7h.01", "M9 11h.01", "M9 15h.01", "M15 11h.01", "M15 15h.01"],
  pin: ["M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z", "M12 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"],
  bed: ["M2 4v17", "M2 8h18a2 2 0 0 1 2 2v11", "M2 17h20", "M6 8v9"],
  bath: ["M9 6 7.5 4.5a2.1 2.1 0 0 0-3 3L6 9", "M3 12h18v2a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-2Z", "M7 20v2", "M17 20v2"],
  area: ["m3 3 7 7", "M3 9V3h6", "m21 21-7-7", "M21 15v6h-6", "M3 21 21 3"],
  check: ["m5 12 4 4L19 6"],
  close: ["M18 6 6 18", "m6 6 12 12"],
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "m7 10 5 5 5-5", "M12 15V3"],
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {(iconPaths[name] || []).map((path, index) => (
        <path d={path} key={`${name}-${index}`} />
      ))}
    </svg>
  );
}

function formatPrice(value, compact = false) {
  if (!Number.isFinite(Number(value))) return "—";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(Number(value));
}

function formatNumber(value) {
  return Number.isFinite(Number(value))
    ? new Intl.NumberFormat("en-PK").format(Number(value))
    : "—";
}

function formatMetric(value, type) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "Unavailable";
  }
  if (type === "r2") return Number(value).toFixed(3);
  return formatPrice(value, true);
}

function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  return (
    <>
      {isOpen && <button className="sidebar-backdrop" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar${isOpen ? " sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Icon name="home" size={22} /></div>
          <div>
            <strong>EstateIQ</strong>
            <span>PAKISTAN REAL ESTATE</span>
          </div>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation">
            <Icon name="close" />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={`nav-item${activePage === item.id ? " nav-item-active" : ""}`}
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              aria-current={activePage === item.id ? "page" : undefined}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.id === "predict" && <span className="nav-new">AI</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-model">
            <div className="model-orbit"><span /></div>
            <div>
              <span className="eyebrow">POWERED BY</span>
              <strong>Random Forest</strong>
              <span className="model-live"><i /> Prediction model</span>
            </div>
          </div>
          <div className="sidebar-footnote">Built for smarter property decisions.</div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ page, connected, onMenuClick }) {
  const active = navigation.find((item) => item.id === page);
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenuClick} aria-label="Open navigation">
        <Icon name="menu" />
      </button>
      <div className="topbar-title">
        <span className="breadcrumbs">EstateIQ <span>/</span> {active?.label || "Overview"}</span>
        <h1>{active?.label || "Overview"}</h1>
      </div>
      <div className="topbar-actions">
        <div className={`connection-pill${connected ? " connection-online" : ""}`}>
          <span className="connection-dot" />
          <span>{connected ? "API connected" : "API offline"}</span>
        </div>
        <div className="topbar-divider" />
        <div className="avatar" aria-label="Pakistan Real Estate project">PK</div>
      </div>
    </header>
  );
}

function PageIntro({ eyebrow, title, description, action }) {
  return (
    <div className="page-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon, label, value, note, accent = "violet" }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-${accent}`}><Icon name={icon} size={19} /></div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </article>
  );
}

function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`panel chart-card ${className}`}>
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function EmptyAnalytics({ loading, error }) {
  return (
    <div className="chart-empty">
      <div className="empty-icon"><Icon name={error ? "about" : "analytics"} size={22} /></div>
      <strong>{error ? "Analytics unavailable" : loading ? "Loading verified data…" : "No analytics available"}</strong>
      <span>{error || "No dataset summary has been loaded."}</span>
    </div>
  );
}

function BarList({ items, valueKey = "count", formatter = formatNumber, color = "purple" }) {
  if (!items?.length) return <EmptyAnalytics />;
  const max = Math.max(...items.map((item) => Number(item[valueKey]) || 0), 1);
  return (
    <div className="bar-list">
      {items.map((item) => {
        const value = Number(item[valueKey]) || 0;
        return (
          <div className="bar-row" key={item.name} title={`${item.name}: ${formatter(value)}`}>
            <div className="bar-label">
              <span>{item.name}</span>
              <strong>{formatter(value)}</strong>
            </div>
            <div className="bar-track">
              <span className={`bar-fill bar-${color}`} style={{ width: `${Math.max((value / max) * 100, 2)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Overview({ analytics, analyticsLoading, analyticsError, health, history, onNavigate }) {
  const dataset = analytics?.dataset;
  const modelName = health?.model || "Unavailable";
  const recent = history.slice(0, 3);
  return (
    <div className="page-content">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <div className="welcome-kicker"><span className="welcome-sparkle">✦</span> YOUR PROPERTY INTELLIGENCE WORKSPACE</div>
          <h2>Find your next move<br /><span>with confidence.</span></h2>
          <p>AI-powered property price insights for Pakistan, backed by your Random Forest model and real market data.</p>
          <button className="button-primary" onClick={() => onNavigate("predict")}>
            Predict a property <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="welcome-visual" aria-hidden="true">
          <div className="visual-glow" />
          <div className="visual-grid" />
          <div className="visual-card visual-card-back"><span>MARKET INSIGHT</span><strong>PKR</strong><i>01 / 03</i></div>
          <div className="visual-building"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <div className="visual-card visual-card-front"><span><i /> LIVE MODEL</span><strong>Random Forest</strong><small>Ready for prediction</small></div>
        </div>
        <div className="banner-decoration banner-decoration-one" />
        <div className="banner-decoration banner-decoration-two" />
      </section>

      <div className="section-heading">
        <div><span className="eyebrow">AT A GLANCE</span><h2>Project overview</h2></div>
        <span className="data-source-note"><i /> Verified project data</span>
      </div>
      <div className="stats-grid">
        <StatCard icon="building" label="Dataset properties" value={dataset ? formatNumber(dataset.records) : "—"} note={dataset ? `${formatNumber(dataset.pricedRecords)} priced records` : "Dataset summary unavailable"} />
        <StatCard icon="pin" label="Cities covered" value={dataset ? formatNumber(dataset.cities) : "—"} note="Distinct dataset cities" accent="blue" />
        <StatCard icon="models" label="Active model" value={modelName} note={health?.status === "healthy" ? "Connected to prediction API" : "Waiting for API connection"} accent="teal" />
        <StatCard icon="history" label="Your predictions" value={formatNumber(history.length)} note="This browser session" accent="orange" />
      </div>

      <div className="content-grid overview-grid">
        <ChartCard title="City price snapshot" subtitle="Average listing price · top cities by dataset volume">
          {analytics ? <BarList items={analytics.cityPrices} valueKey="averagePrice" formatter={(value) => formatPrice(value, true)} /> : <EmptyAnalytics loading={analyticsLoading} error={analyticsError} />}
          {analytics && <div className="chart-footnote">Source: cleaned_property.csv · grouped by city</div>}
        </ChartCard>
        <section className="panel activity-panel">
          <div className="panel-heading">
            <div><h3>Recent predictions</h3><p>Your latest property estimates</p></div>
            <button className="text-button" onClick={() => onNavigate("history")}>View all <Icon name="arrow" size={15} /></button>
          </div>
          {recent.length ? (
            <div className="activity-list">
              {recent.map((item) => (
                <div className="activity-item" key={item.id}>
                  <div className="activity-icon"><Icon name="home" size={17} /></div>
                  <div className="activity-detail"><strong>{item.property.city}, {item.property.province_name}</strong><span>{item.property.property_type} · {item.property.area_marla} marla</span></div>
                  <div className="activity-price"><strong>{formatPrice(item.predicted_price, true)}</strong><span>{new Date(item.createdAt).toLocaleDateString("en-PK")}</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="activity-empty">
              <div className="empty-icon"><Icon name="history" size={21} /></div>
              <strong>No predictions yet</strong>
              <span>Run a live estimate to see activity here.</span>
              <button className="text-button" onClick={() => onNavigate("predict")}>Start a prediction <Icon name="arrow" size={15} /></button>
            </div>
          )}
        </section>
      </div>

      <div className="section-heading quick-heading">
        <div><span className="eyebrow">EXPLORE</span><h2>Quick access</h2></div>
      </div>
      <div className="quick-grid">
        {[
          { page: "analytics", icon: "analytics", title: "Explore market data", copy: "Real dataset trends across cities and property types." },
          { page: "models", icon: "models", title: "Compare ML models", copy: "See the evaluation results available in this project." },
          { page: "about", icon: "about", title: "About EstateIQ", copy: "Learn how the project and prediction flow work." },
        ].map((item) => (
          <button className="quick-card" key={item.page} onClick={() => onNavigate(item.page)}>
            <span className="quick-icon"><Icon name={item.icon} size={20} /></span>
            <span className="quick-copy"><strong>{item.title}</strong><small>{item.copy}</small></span>
            <Icon name="arrow" size={17} />
          </button>
        ))}
      </div>
    </div>
  );
}

function PredictionPage({ connected, history, onPrediction }) {
  const [form, setForm] = useState({
    property_type: "House",
    city: "Karachi",
    province_name: "Sindh",
    purpose: "For Sale",
    area_marla: 5,
    bedrooms: 3,
    baths: 2,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const updateForm = (event) => {
    const { name, value, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "number" ? Number(value) : value }));
  };

  const submitPrediction = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    const property = {
      property_type: form.property_type,
      city: form.city.trim(),
      province_name: form.province_name,
      purpose: form.purpose,
      area_marla: Number(form.area_marla),
      bedrooms: Number(form.bedrooms),
      baths: Number(form.baths),
    };

    try {
      const response = await predictProperty(property);
      const predictedPrice = Number(response?.predicted_price);
      if (!Number.isFinite(predictedPrice) || !response?.model || !response?.currency) {
        throw new Error("The prediction API returned an unexpected response. Please check the backend response and try again.");
      }
      const prediction = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        predicted_price: predictedPrice,
        currency: response.currency,
        model: response.model,
        property,
      };
      setResult(prediction);
      onPrediction(prediction);
    } catch (requestError) {
      setError(requestError?.message || "Unable to complete the prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "property_type", label: "Property type", type: "select", options: ["House", "Flat", "Upper Portion", "Lower Portion", "Plot"] },
    { name: "city", label: "City", type: "text", placeholder: "e.g. Karachi" },
    { name: "province_name", label: "Province / territory", type: "select", options: ["Sindh", "Punjab", "KPK", "Balochistan", "Islamabad Capital Territory"] },
    { name: "purpose", label: "Purpose", type: "select", options: ["For Sale", "For Rent"] },
    { name: "area_marla", label: "Area", type: "number", suffix: "Marla", min: "0.1", step: "0.1" },
    { name: "bedrooms", label: "Bedrooms", type: "number", suffix: "Beds", min: "0", step: "1" },
    { name: "baths", label: "Bathrooms", type: "number", suffix: "Baths", min: "0", step: "1" },
  ];

  return (
    <div className="page-content">
      <PageIntro eyebrow="AI PRICE ESTIMATOR" title="Predict a property" description="Enter the property details to get a live estimate from your connected Random Forest model." />
      <div className="prediction-layout">
        <section className="panel prediction-form-panel">
          <div className="form-panel-title">
            <div className="form-icon"><Icon name="predict" size={21} /></div>
            <div><h3>Property details</h3><p>All fields are sent to the existing prediction API.</p></div>
          </div>
          <form onSubmit={submitPrediction}>
            <div className="prediction-fields">
              {fields.map((field) => (
                <label className="input-field" key={field.name}>
                  <span>{field.label}</span>
                  <div className="input-wrap">
                    {field.type === "select" ? (
                      <select name={field.name} value={form[field.name]} onChange={updateForm} required>
                        {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    ) : (
                      <input
                        name={field.name}
                        type={field.type}
                        value={form[field.name]}
                        onChange={updateForm}
                        placeholder={field.placeholder}
                        min={field.min}
                        step={field.step}
                        required
                      />
                    )}
                    {field.suffix && <span className="input-suffix">{field.suffix}</span>}
                  </div>
                </label>
              ))}
            </div>
            {error && <div className="form-error" role="alert"><Icon name="about" size={18} /><span>{error}</span></div>}
            <button className="button-primary predict-submit" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Estimating your property…</> : <><Icon name="predict" size={18} /> Generate price estimate <Icon name="arrow" size={17} /></>}
            </button>
            <p className="form-disclaimer"><Icon name="check" size={15} /> {connected ? "Live request to your FastAPI prediction service" : "API currently offline — submit to retry the live service"}</p>
          </form>
        </section>

        <aside className="prediction-side">
          {result ? (
            <section className="result-panel">
              <div className="result-topline"><span className="result-check"><Icon name="check" size={17} /></span><span>ESTIMATE COMPLETE</span><button className="result-close icon-button" onClick={() => setResult(null)} aria-label="Dismiss result"><Icon name="close" size={18} /></button></div>
              <p className="result-caption">Predicted property price</p>
              <strong className="result-price">{formatPrice(result.predicted_price)}</strong>
              <div className="result-model"><span className="model-orbit small"><span /></span><div><small>MODEL</small><strong>{result.model}</strong></div><span className="live-tag">LIVE</span></div>
              <div className="result-divider" />
              <h4>Property summary</h4>
              <div className="result-property">
                <span><Icon name="home" size={15} /> {result.property.property_type}</span>
                <span><Icon name="pin" size={15} /> {result.property.city}, {result.property.province_name}</span>
                <span><Icon name="area" size={15} /> {result.property.area_marla} marla · {result.property.purpose}</span>
                <span><Icon name="bed" size={15} /> {result.property.bedrooms} bedrooms · {result.property.baths} bathrooms</span>
              </div>
              <small className="result-date">Estimated {new Date(result.createdAt).toLocaleString("en-PK")}</small>
            </section>
          ) : (
            <section className="prediction-aside-card">
              <div className="aside-glow" />
              <div className="aside-orbit"><Icon name="home" size={31} /></div>
              <span className="eyebrow">YOUR ESTIMATE</span>
              <h3>A clearer view<br />of property value.</h3>
              <p>Your result will include the live estimate, model name and a summary of the details you submitted.</p>
              <div className="aside-feature"><span><Icon name="check" size={14} /></span> Real-time model response</div>
              <div className="aside-feature"><span><Icon name="check" size={14} /></span> Saved in this session's history</div>
              <div className="aside-model"><div className="model-orbit small"><span /></div><div><small>CONNECTED MODEL</small><strong>Random Forest</strong></div><span className={`connection-dot${connected ? " dot-online" : ""}`} /></div>
            </section>
          )}
          <section className="session-note">
            <Icon name="history" size={17} />
            <span><strong>{history.length} estimates</strong> in your current session</span>
          </section>
        </aside>
      </div>
    </div>
  );
}

function AnalyticsPage({ analytics, loading, error }) {
  if (!analytics) {
    return <div className="page-content"><PageIntro eyebrow="REAL DATA, CLEAR SIGNALS" title="Market analytics" description="Explore verified patterns in the project's property dataset." /><section className="panel analytics-unavailable"><EmptyAnalytics loading={loading} error={error} /></section></div>;
  }

  return (
    <div className="page-content">
      <PageIntro eyebrow="REAL DATA, CLEAR SIGNALS" title="Market analytics" description={`A view of ${formatNumber(analytics.dataset.records)} records from ${analytics.dataset.source}. Charts below are grouped from the project dataset.`} />
      <div className="analytics-summary">
        <div><span>Records analyzed</span><strong>{formatNumber(analytics.dataset.records)}</strong></div>
        <div><span>Average listed price</span><strong>{formatPrice(analytics.dataset.averagePrice, true)}</strong></div>
        <div><span>Cities</span><strong>{formatNumber(analytics.dataset.cities)}</strong></div>
        <div><span>Provinces / territories</span><strong>{formatNumber(analytics.dataset.provinces)}</strong></div>
      </div>
      <div className="content-grid analytics-grid">
        <ChartCard title="City-wise average prices" subtitle="Top cities by record count · PKR">
          <BarList items={analytics.cityPrices} valueKey="averagePrice" formatter={(value) => formatPrice(value, true)} />
        </ChartCard>
        <ChartCard title="Property distribution by province" subtitle="Number of dataset listings">
          <BarList items={analytics.provinceDistribution} formatter={formatNumber} color="blue" />
        </ChartCard>
        <ChartCard title="Property type distribution" subtitle="Listing count by property type">
          <BarList items={analytics.propertyTypeDistribution} formatter={formatNumber} color="teal" />
        </ChartCard>
        <ChartCard title="Average price by property type" subtitle="Average listed price · PKR">
          <BarList items={analytics.averagePrices} valueKey="averagePrice" formatter={(value) => formatPrice(value, true)} />
        </ChartCard>
        <ChartCard title="Bedrooms vs. property price" subtitle="Average price by bedroom count · PKR">
          <BarList items={analytics.bedroomPrices} valueKey="averagePrice" formatter={(value) => formatPrice(value, true)} color="blue" />
        </ChartCard>
        <ChartCard title="Area vs. property price" subtitle="Average price by area band · PKR">
          <BarList items={analytics.areaPrices} valueKey="averagePrice" formatter={(value) => formatPrice(value, true)} color="teal" />
        </ChartCard>
        <ChartCard title="Purpose distribution" subtitle="Sale and rental listings in the dataset">
          <BarList items={analytics.purposeDistribution} formatter={formatNumber} color="orange" />
        </ChartCard>
      </div>
      <p className="chart-footnote analytics-source">Source: {analytics.dataset.source}. Prices are averages of positive numeric prices; area bands use area_marla. This describes the supplied dataset and is not a real-time market feed.</p>
    </div>
  );
}

function ModelsPage({ analytics, loading, error, health }) {
  if (!analytics) {
    return <div className="page-content"><PageIntro eyebrow="MODEL PERFORMANCE" title="Machine learning models" description="Evaluation results available in the project files." /><section className="panel analytics-unavailable"><EmptyAnalytics loading={loading} error={error} /></section></div>;
  }
  const models = analytics.models || [];
  const activeModel = health?.model || "Random Forest";
  return (
    <div className="page-content">
      <PageIntro eyebrow="MODEL PERFORMANCE" title="Machine learning models" description="Compare the evaluation metrics recorded in the project. Only Random Forest is used by the live prediction API." />
      <div className="model-live-banner"><div className="live-banner-icon"><Icon name="predict" size={20} /></div><div><span className="eyebrow">LIVE PREDICTION MODEL</span><strong>{activeModel}</strong><p>{health?.status === "healthy" ? "Connected and ready to return real predictions." : "This model is configured for the API; the backend is currently offline."}</p></div><span className={`connection-pill${health?.status === "healthy" ? " connection-online" : ""}`}><span className="connection-dot" />{health?.status === "healthy" ? "Connected" : "Offline"}</span></div>
      <div className="model-cards">
        {models.map((model) => (
          <article className={`panel model-card${model.name === "Random Forest" ? " model-card-featured" : ""}`} key={model.name}>
            <div className="model-card-head"><span className={`model-card-icon model-icon-${model.name === "Random Forest" ? "purple" : model.name === "Decision Tree" ? "blue" : "gray"}`}><Icon name="models" size={20} /></span>{model.name === "Random Forest" && <span className="best-model-tag">BEST R²</span>}</div>
            <h3>{model.name}</h3>
            <p>{model.name === "Random Forest" ? "Ensemble model used for live price prediction." : "Evaluation result available; not connected to the live prediction endpoint."}</p>
            <div className="model-metric-list">
              {[["R² Score", model.r2, "r2"], ["MAE", model.mae, "price"], ["MSE", model.mse, "price"], ["RMSE", model.rmse, "price"]].map(([label, value, type]) => (
                <div className="model-metric" key={label}><span>{label}</span><strong className={value == null ? "metric-unavailable" : ""}>{value == null ? "Not available" : formatMetric(value, type)}</strong></div>
              ))}
            </div>
            <div className="model-card-footer"><span className={`model-status-dot${model.name === "Random Forest" && health?.status === "healthy" ? " dot-online" : ""}`} />{model.name === "Random Forest" ? "Live API model" : "Evaluation only"}</div>
          </article>
        ))}
      </div>
      <ChartCard title="Evaluation comparison" subtitle="Actual scores from results/model_comparison.csv">
        <div className="model-comparison">
          {[
            { label: "R² score", key: "r2", max: 1, formatter: (value) => Number(value).toFixed(3), color: "purple" },
            { label: "MAE", key: "mae", max: Math.max(...models.map((model) => model.mae || 0)), formatter: (value) => formatPrice(value, true), color: "blue" },
            { label: "RMSE", key: "rmse", max: Math.max(...models.map((model) => model.rmse || 0)), formatter: (value) => formatPrice(value, true), color: "teal" },
          ].map((metric) => (
            <div className="comparison-metric" key={metric.key}>
              <div className="comparison-title"><strong>{metric.label}</strong><span>{metric.key === "r2" ? "Higher is better" : "Lower is better"}</span></div>
              {models.map((model) => {
                const value = Number(model[metric.key]) || 0;
                return <div className="comparison-row" key={`${metric.key}-${model.name}`}><span>{model.name}</span><div className="bar-track"><i className={`bar-fill bar-${metric.color}`} style={{ width: `${metric.max ? Math.max(value / metric.max * 100, 2) : 0}%` }} /></div><strong>{metric.formatter(value)}</strong></div>;
              })}
            </div>
          ))}
        </div>
        <p className="chart-footnote">MSE is unavailable in the supplied model comparison results; it is intentionally not estimated or inferred from RMSE.</p>
      </ChartCard>
    </div>
  );
}

function HistoryPage({ history, onNavigate }) {
  return (
    <div className="page-content">
      <PageIntro eyebrow="YOUR SESSION ACTIVITY" title="Prediction history" description="Live estimates made during this browser session. History is not sent to or stored by the backend." />
      <section className="panel history-panel">
        <div className="panel-heading history-heading"><div><h3>Recent estimates</h3><p>{history.length} {history.length === 1 ? "prediction" : "predictions"} this session</p></div>{history.length > 0 && <span className="history-session-tag"><i /> SESSION ONLY</span>}</div>
        {history.length ? (
          <div className="table-scroll">
            <table className="history-table">
              <thead><tr><th>Property</th><th>Location</th><th>Area</th><th>Rooms</th><th>Predicted price</th><th>Model</th><th>Date</th></tr></thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td><span className="table-property-icon"><Icon name="home" size={16} /></span><strong>{item.property.property_type}</strong></td>
                    <td>{item.property.city}, {item.property.province_name}</td>
                    <td>{item.property.area_marla} marla</td>
                    <td>{item.property.bedrooms} bd · {item.property.baths} ba</td>
                    <td className="table-price">{formatPrice(item.predicted_price)}</td>
                    <td><span className="table-model">{item.model}</span></td>
                    <td>{new Date(item.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="history-empty"><div className="empty-icon"><Icon name="history" size={22} /></div><h3>Your history starts here</h3><p>Each successful live prediction will appear here for this session.</p><button className="button-primary" onClick={() => onNavigate("predict")}>Make a prediction <Icon name="arrow" size={17} /></button></div>
        )}
      </section>
    </div>
  );
}

function AboutPage({ health, analytics }) {
  return (
    <div className="page-content">
      <PageIntro eyebrow="THE PROJECT" title="About EstateIQ" description="A machine-learning property price prediction experience built around the project's existing model and API." />
      <section className="about-hero panel">
        <div className="about-brandmark"><Icon name="home" size={30} /></div>
        <div><span className="eyebrow">PAKISTAN REAL ESTATE · AI ESTIMATOR</span><h3>Property intelligence,<br /><span>made more accessible.</span></h3><p>EstateIQ presents real dataset analytics and an easy-to-use interface for requesting property price estimates from the existing machine-learning API.</p></div>
      </section>
      <div className="about-cards">
        <section className="panel about-card"><span className="about-card-icon"><Icon name="predict" size={20} /></span><h3>Live prediction</h3><p>The form sends the seven property fields to the existing <code>/predict</code> endpoint and displays the actual returned price, currency and model.</p><div className="about-info-row"><span>API</span><strong>http://127.0.0.1:8000</strong></div><div className="about-info-row"><span>Connection</span><strong className={health?.status === "healthy" ? "text-online" : ""}>{health?.status === "healthy" ? "Healthy" : "Unavailable"}</strong></div></section>
        <section className="panel about-card"><span className="about-card-icon about-card-blue"><Icon name="analytics" size={20} /></span><h3>Real dataset insights</h3><p>Charts are aggregates from the project's cleaned property CSV. Dataset totals and price summaries reflect the records provided with this project.</p><div className="about-info-row"><span>Source</span><strong>{analytics?.dataset.source || "Dataset summary unavailable"}</strong></div><div className="about-info-row"><span>Records</span><strong>{analytics ? formatNumber(analytics.dataset.records) : "Unavailable"}</strong></div></section>
        <section className="panel about-card"><span className="about-card-icon about-card-teal"><Icon name="models" size={20} /></span><h3>Model transparency</h3><p>Evaluation metrics are read from the supplied model comparison file. Only the Random Forest model is connected to live predictions.</p><div className="about-info-row"><span>Live model</span><strong>{health?.model || "Random Forest"}</strong></div><div className="about-info-row"><span>Metric coverage</span><strong>R² · MAE · RMSE</strong></div></section>
      </div>
      <div className="about-footnote"><Icon name="about" size={17} /><p>Predicted prices are model estimates, not professional valuations or guarantees of a property's market value. Analytics describe the supplied dataset and may not reflect current listings.</p></div>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [health, setHealth] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [history, setHistory] = useState([]);
  const connected = health?.status === "healthy";

  useEffect(() => {
    let active = true;
    const refreshHealth = async () => {
      try {
        const response = await checkAPI();
        if (active) setHealth(response);
      } catch {
        if (active) setHealth(null);
      }
    };
    refreshHealth();
    const intervalId = window.setInterval(refreshHealth, 30000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/analytics.json")
      .then((response) => {
        if (!response.ok) throw new Error("The analytics summary could not be loaded.");
        return response.json();
      })
      .then((data) => {
        if (!data?.dataset || !Array.isArray(data.models)) {
          throw new Error("The analytics summary has an unexpected format.");
        }
        if (active) setAnalytics(data);
      })
      .catch((requestError) => {
        if (active) setAnalyticsError(requestError?.message || "Analytics data is unavailable.");
      })
      .finally(() => {
        if (active) setAnalyticsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const sortedHistory = useMemo(() => [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [history]);
  const addPrediction = (prediction) => setHistory((current) => [prediction, ...current]);

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-shell">
        <Topbar page={activePage} connected={connected} onMenuClick={() => setSidebarOpen(true)} />
        <main className="main-content">
          {activePage === "overview" && <Overview analytics={analytics} analyticsLoading={analyticsLoading} analyticsError={analyticsError} health={health} history={sortedHistory} onNavigate={setActivePage} />}
          {activePage === "predict" && <PredictionPage connected={connected} history={sortedHistory} onPrediction={addPrediction} />}
          {activePage === "analytics" && <AnalyticsPage analytics={analytics} loading={analyticsLoading} error={analyticsError} />}
          {activePage === "models" && <ModelsPage analytics={analytics} loading={analyticsLoading} error={analyticsError} health={health} />}
          {activePage === "history" && <HistoryPage history={sortedHistory} onNavigate={setActivePage} />}
          {activePage === "about" && <AboutPage health={health} analytics={analytics} />}
        </main>
        <footer className="app-footer"><span>EstateIQ <i /> Pakistan Real Estate Price Intelligence</span><span>Predictions are estimates, not valuations.</span></footer>
      </div>
    </div>
  );
}

export default App;
