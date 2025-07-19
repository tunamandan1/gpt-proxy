const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// Congress.gov
app.get("/congress-proxy/*", async (req, res) => {
  const apiKey = process.env.CONGRESS_API_KEY;
  const path = req.params[0];
  const targetUrl = `https://api.congress.gov/v3/${path}`;
  try {
    const resp = await axios.get(targetUrl, { params: { ...req.query, api_key: apiKey } });
    res.status(resp.status).json(resp.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: "Proxy error" });
  }
});

// FRED
app.get("/fred-proxy/*", async (req, res) => {
  const apiKey = process.env.FRED_API_KEY;
  const path = req.params[0];
  const targetUrl = `https://api.stlouisfed.org/fred/${path}`;
  try {
    const resp = await axios.get(targetUrl, { params: { ...req.query, api_key: apiKey, file_type: "json" } });
    res.status(resp.status).json(resp.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: "Proxy error" });
  }
});

// Polygon
app.get("/polygon-proxy/*", async (req, res) => {
  const apiKey = process.env.POLYGON_API_KEY;
  const path = req.params[0];
  const targetUrl = `https://api.polygon.io/v2/${path}`;
  try {
    const resp = await axios.get(targetUrl, { params: { ...req.query, apiKey: apiKey } });
    res.status(resp.status).json(resp.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: "Proxy error" });
  }
});

// YouTube Data API
app.get("/youtube-proxy/*", async (req, res) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const path = req.params[0];
  const targetUrl = `https://www.googleapis.com/youtube/v3/${path}`;
  try {
    const resp = await axios.get(targetUrl, { params: { ...req.query, key: apiKey } });
    res.status(resp.status).json(resp.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: "Proxy error" });
  }
});

// Gemini Pro API (POST)
app.post("/gemini-proxy/generateContent", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      req.body,
      { headers: { "Content-Type": "application/json" } }
    );
    res.status(geminiRes.status).json(geminiRes.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: "Proxy error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

