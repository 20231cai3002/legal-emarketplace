import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RegisterProviderPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    experience: 0,
    profession: "Advocate",
    licenseNumber: "",
    documentUrl: "",
  });

  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const { data } = await api.post("/auth/register/provider", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Registered as Provider. Wait for admin verification.");
      navigate("/login");
    } catch (error) {
      setErr(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          width: "500px",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
          color: "#f0f0f0",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", fontWeight: "700" }}>
          Register as Provider
        </h2>

        {err && (
          <div
            style={{
              background: "#ff4d4d",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "10px",
              textAlign: "center",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          {["name", "email", "phone", "password", "licenseNumber", "documentUrl"].map((key) => (
            <div style={{ marginBottom: "15px" }} key={key}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "#ddd" }}>
                {key.toUpperCase()}
              </label>
              <input
                type={key === "password" ? "password" : "text"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  marginTop: "6px",
                  outline: "none",
                  fontSize: "15px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600", color: "#ddd" }}>EXPERIENCE (years)</label>
            <input
              type="number"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                marginTop: "6px",
                outline: "none",
                fontSize: "15px",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "600", color: "#ddd" }}>PROFESSION</label>
            <select
              value={form.profession}
              onChange={(e) => setForm({ ...form, profession: e.target.value })}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                marginTop: "6px",
                outline: "none",
                fontSize: "15px",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            >
              {["Advocate", "Mediator", "Arbitrator", "Notary", "DocumentWriter"].map((p) => (
                <option key={p} value={p} style={{ backgroundColor: "#333", color: "#fff" }}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#1a73e8",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
