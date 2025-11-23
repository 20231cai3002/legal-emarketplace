import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [scale, setScale] = useState(1); // zoom
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/auth/login", { identifier, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      switch (data.user.role) {
        case "CITIZEN":
          navigate("/citizen");
          break;
        case "PROVIDER":
          navigate("/provider");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
          setErr("Unknown role. Contact support.");
      }
    } catch (error) {
      setErr(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textShadow: "0 2px 8px rgba(0,0,0,0.9)",
        fontWeight: "600",
        transform: `scale(${scale})`,
        transition: "0.3s ease",
      }}
    >
      {/* Zoom Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setScale((s) => Math.max(0.7, s - 0.1))}
          style={{
            padding: "8px 12px",
            marginRight: "10px",
            background: "rgba(255,255,255,0.3)",
            border: "1px solid #fff",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          − Zoom Out
        </button>

        <button
          onClick={() => setScale(1)}
          style={{
            padding: "8px 12px",
            marginRight: "10px",
            background: "rgba(255,255,255,0.3)",
            border: "1px solid #fff",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Reset
        </button>

        <button
          onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
          style={{
            padding: "8px 12px",
            background: "rgba(255,255,255,0.3)",
            border: "1px solid #fff",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          + Zoom In
        </button>
      </div>

      {/* Glass Card */}
      <div
        style={{
          maxWidth: "450px",
          margin: "auto",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

        {err && (
          <div
            style={{
              background: "rgba(255,0,0,0.4)",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          >
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Email or Phone
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="Enter email or phone"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "none",
              outline: "none",
            }}
          />

          <label style={{ display: "block", marginBottom: "8px" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "none",
              outline: "none",
            }}
          />

          <button
            style={{
              width: "100%",
              padding: "12px",
              background: "rgba(0,0,0,0.6)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link
            to="/register/citizen"
            style={{ color: "white", marginRight: "10px" }}
          >
            Create Citizen Account
          </Link>
          |
          <Link
            to="/register/provider"
            style={{ color: "white", marginLeft: "10px" }}
          >
            Create Provider Account
          </Link>
        </div>
      </div>
    </div>
  );
}
