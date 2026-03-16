import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import GitHubLogin from "./GitHubLogin";
import OAuthCallback from "./OAuthCallback";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/">Home</Link>
          <GitHubLogin />
        </div>

        <hr />

        <Routes>
          <Route path="/" element={<div>Click “Login with GitHub”.</div>} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
