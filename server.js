const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.get("/congress-proxy/*", async (req, res) => {
  const apiKey = process.env.CONGRESS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "No API key set" });
  const congressPath = req.params[0];
  const targetUrl = `https://api.congress.gov/v3/${congressPath}`;
  try {
    const resp = await axios.get(targetUrl, {
      params: { ...req.query, api_key: apiKey }
    });
    res.status(resp.status).json(resp.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: "Proxy error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
