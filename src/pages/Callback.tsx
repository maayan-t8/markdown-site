// src/pages/Callback.tsx
// Handles OAuth callback from WorkOS and redirects to home
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Once authentication is complete, redirect to home
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="callback-page">
      <h1>Authenticating...</h1>
      <p>Please wait while we process your login.</p>
    </div>
  );
}
