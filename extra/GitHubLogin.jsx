import React from "react";

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_CLIENT_ID = "CLIENTID HERE";
const REDIRECT_URI = "http://localhost:3000/oauth/callback";
const SCOPES = ["read:user", "user:email"];

export default function GitHubLogin() {
  const startLogin = () => {
    const state = crypto.randomUUID();
    sessionStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(" "),
      state,
    });

    window.location.href = `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
  };

  return <button onClick={startLogin}>Login with GitHub</button>;
}
