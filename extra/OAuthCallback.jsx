import React, { useEffect, useState } from "react";

export default function OAuthCallback() {
  const [status, setStatus] = useState("Logging in...");

  useEffect(() => {
    (async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      const expectedState = sessionStorage.getItem("oauth_state");
      sessionStorage.removeItem("oauth_state");

      if (!code) return setStatus("No code returned from GitHub.");
      if (state !== expectedState) return setStatus("State mismatch.");

      setStatus("Exchanging code for token...");

      const resp = await fetch("http://localhost:4000/api/github/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const token = await resp.json();
      if (!resp.ok) return setStatus("Token exchange failed.");

      setStatus("Fetching user...");

      const meResp = await fetch("http://localhost:4000/api/github/me", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });

      const me = await meResp.json();
      if (!meResp.ok) return setStatus("User fetch failed.");

      setStatus(`Logged in as ${me.login}`);
    })();
  }, []);

  return <div>{status}</div>;
}
