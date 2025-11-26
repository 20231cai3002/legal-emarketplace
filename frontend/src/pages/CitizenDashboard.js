import React, { useEffect, useState, useCallback } from "react";
import api from "../api";

export default function CitizenDashboard() {
  const [providers, setProviders] = useState([]);
  const [q, setQ] = useState("");
  const [profession, setProfession] = useState("");
  const [minExp, setMinExp] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");
  const [message, setMessage] = useState("");

  const search = useCallback(async () => {
    setErr("");
    try {
      const { data } = await api.get("/providers", {
        params: { q, profession, minExp },
      });
      setProviders(data);
    } catch (error) {
      setErr("Failed to fetch providers");
    }
  }, [q, profession, minExp]);

  useEffect(() => {
    search();
  }, [search]);

  const book = async () => {
    setMessage("");
    setErr("");
    try {
      const { data } = await api.post("/bookings", {
        providerId: selected,
        date,
        time,
      });
      setMessage(`Booking created: ${data._id}`);
    } catch (error) {
      setErr(error.response?.data?.error || "Booking failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: "0",
        padding: "20px",
        backgroundImage:
          "url('https://images.pexels.com/photos/5669601/pexels-photo-5669601.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h3
        style={{
          color: "white",
          textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
          marginBottom: "20px",
        }}
      >
        Citizen Dashboard
      </h3>

      {err && <div className="alert alert-danger">{err}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Search Filters */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Search name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          >
            <option value="">All</option>
            {["Advocate", "Mediator", "Arbitrator", "Notary", "DocumentWriter"].map(
              (p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              )
            )}
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min exp"
            value={minExp}
            onChange={(e) => setMinExp(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={search}>
            Search
          </button>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="row">
        {providers.map((p) => (
          <div key={p._id} className="col-md-4">
            <div
              className="card mb-3"
              style={{
                background: "rgba(255,255,255,0.85)", // semi-transparent card
                borderRadius: "12px",
                boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
              }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  {p.user?.name} ({p.profession})
                </h5>
                <p className="card-text">
                  Exp: {p.experience} yrs | Rating:{" "}
                  {p.ratingAvg?.toFixed(1)} ({p.ratingCount})
                </p>
                <div className="mb-2">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label>Time</label>
                  <input
                    type="time"
                    className="form-control"
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-success w-100"
                  onClick={() => {
                    setSelected(p._id);
                    book();
                  }}
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
