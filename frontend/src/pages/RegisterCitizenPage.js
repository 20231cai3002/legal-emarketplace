import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RegisterCitizenPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const { data } = await api.post("/auth/register/citizen", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/citizen");
    } catch (error) {
      setErr(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.pexels.com/photos/5669601/pexels-photo-5669601.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "rgba(0,0,0,0.55)",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          color: "white",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            fontWeight: "700",
          }}
        >
          Register as Citizen
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
            }}
          >
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          {["name", "email", "phone", "password"].map((key) => (
            <div style={{ marginBottom: "16px" }} key={key}>
              <label style={{ fontWeight: "600", fontSize: "14px" }}>
                {key.toUpperCase()}
              </label>
              <input
                type={key === "password" ? "password" : "text"}
                placeholder={`Enter your ${key}`}
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
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#1a73e8",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
