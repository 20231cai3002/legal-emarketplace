import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [providers, setProviders] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [err, setErr] = useState("");
  const [scale, setScale] = useState(1);

  const bgImage =
    "https://images.unsplash.com/photo-1521790361543-f645cf042ec4?auto=format&fit=crop&w=1600&q=80";

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const { data: prov } = await api.get("/admin/providers");
      setProviders(prov);
      const { data: inc } = await api.get("/admin/incentives");
      setIncentives(inc);
    } catch {
      setErr("Failed to load admin data");
    }
  };

  const verify = async (userId, approve) => {
    try {
      await api.post("/admin/verify", { userId, approve });
      setProviders((prev) =>
        prev.map((p) =>
          p.user?._id === userId
            ? { ...p, user: { ...p.user, isVerified: approve } }
            : p
        )
      );
    } catch {
      setErr("Verification failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: `scale(${scale})`,
        transition: "0.3s ease",
        color: "white",
        fontFamily: "Poppins, sans-serif",
        textShadow: "0px 3px 6px rgba(0,0,0,0.8)",
      }}
    >
      <h1 style={{ fontSize: "38px", fontWeight: "700" }}>Admin Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          style={btn}
          onClick={() => setScale((s) => Math.max(0.8, s - 0.1))}
        >
          ➖ Zoom Out
        </button>
        <button style={btn} onClick={() => setScale(1)}>
          🔄 Reset
        </button>
        <button style={btn} onClick={() => setScale((s) => s + 0.1)}>
          ➕ Zoom In
        </button>
      </div>

      {err && (
        <div
          style={{
            padding: "10px",
            background: "rgba(255,0,0,0.6)",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          {err}
        </div>
      )}

      {/* Card with glass effect */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          padding: "25px",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Providers</h3>

        {providers.map((p) => (
          <div
            key={p._id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "8px",
              fontSize: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {p.user?.name} | {p.profession} | {p.user?.email} | Status:
              {p.user?.isVerified === null && " Pending"}
              {p.user?.isVerified === true && " Approved"}
              {p.user?.isVerified === false && " Rejected"}
            </span>

            <div>
              {p.user?.isVerified === null && (
                <>
                  <button
                    style={{ ...btnSmall, background: "#28a745" }}
                    onClick={() => verify(p.user?._id, true)}
                  >
                    Approve
                  </button>
                  <button
                    style={{
                      ...btnSmall,
                      background: "transparent",
                      border: "1px solid red",
                    }}
                    onClick={() => verify(p.user?._id, false)}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        <h3 style={{ marginTop: "30px" }}>Incentives</h3>

        {incentives.map((i) => (
          <div
            key={i._id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "8px",
              fontSize: "18px",
            }}
          >
            Provider: {i.provider} | Points: {i.points} | Reason: {i.reason}
          </div>
        ))}
      </div>
    </div>
  );
}

// Inline button styles
const btn = {
  padding: "8px 16px",
  marginRight: "10px",
  fontSize: "15px",
  borderRadius: "6px",
  cursor: "pointer",
  border: "none",
  background: "rgba(255,255,255,0.2)",
  color: "white",
  backdropFilter: "blur(5px)",
};

const btnSmall = {
  padding: "6px 12px",
  marginLeft: "8px",
  borderRadius: "6px",
  cursor: "pointer",
  color: "white",
  border: "none",
};
