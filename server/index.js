import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token",
} = process.env;

app.post("/api/github/exchange", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Missing code" });

    const tokenResp = await fetch(GITHUB_TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenJson = await tokenResp.json();

    if (!tokenResp.ok || tokenJson.error) {
      return res.status(400).json({ error: "token_exchange_failed", details: tokenJson });
    }

    res.json(tokenJson); // { access_token, token_type, scope }
  } catch (e) {
    res.status(500).json({ error: "server_error", details: String(e) });
  }
});

app.get("/api/github/me", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing Bearer token" });

    const meResp = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
      },
    });

    const meJson = await meResp.json();
    res.status(meResp.status).json(meJson);
  } catch (e) {
    res.status(500).json({ error: "server_error", details: String(e) });
  }
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
