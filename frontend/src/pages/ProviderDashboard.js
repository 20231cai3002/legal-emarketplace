// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";

// export default function RegisterCitizenPage() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const [err, setErr] = useState("");
//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     setErr("");

//     try {
//       const { data } = await api.post("/auth/register/citizen", form);
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       navigate("/citizen");
//     } catch (error) {
//       setErr(error.response?.data?.error || "Registration failed");
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1521791055366-0d553872125f')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: "20px",
//         fontFamily: "'Poppins', sans-serif",
//       }}
//     >
//       <div
//         style={{
//           width: "420px",
//           background: "rgba(0, 0, 0, 0.55)",
//           padding: "32px",
//           borderRadius: "18px",
//           color: "white",
//           backdropFilter: "blur(5px)",
//           boxShadow: "0 0 20px rgba(0,0,0,0.4)",
//         }}
//       >
//         <h2
//           style={{
//             textAlign: "center",
//             marginBottom: "25px",
//             fontWeight: "700",
//             fontSize: "26px",
//           }}
//         >
//           Register as Citizen
//         </h2>

//         {err && (
//           <div
//             style={{
//               background: "#ff4d4d",
//               padding: "10px",
//               borderRadius: "6px",
//               marginBottom: "15px",
//               textAlign: "center",
//               fontWeight: "600",
//             }}
//           >
//             {err}
//           </div>
//         )}

//         <form onSubmit={submit}>
//           {["name", "email", "phone", "password"].map((key) => (
//             <div style={{ marginBottom: "16px" }} key={key}>
//               <label style={{ fontWeight: "600", fontSize: "14px" }}>
//                 {key.toUpperCase()}
//               </label>
//               <input
//                 type={key === "password" ? "password" : key === "email" ? "email" : "text"}
//                 placeholder={`Enter your ${key}`}
//                 value={form[key]}
//                 required
//                 onChange={(e) => setForm({ ...form, [key]: e.target.value })}
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   border: "none",
//                   marginTop: "6px",
//                   outline: "none",
//                   fontSize: "15px",
//                 }}
//               />
//             </div>
//           ))}

//           <button
//             type="submit"
//             style={{
//               width: "100%",
//               background: "#1a73e8",
//               border: "none",
//               padding: "12px",
//               borderRadius: "8px",
//               color: "white",
//               fontWeight: "700",
//               fontSize: "16px",
//               marginTop: "10px",
//               cursor: "pointer",
//             }}
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ProviderDashboard() {
  const [me, setMe] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState([{ date: '', slots: [] }]);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const { data: mine } = await api.get('/bookings/mine');
      setBookings(mine);
      const { data } = await api.get('/providers/me');
      setMe(data);
      setAvailability(data.availability?.length ? data.availability : [{ date: '', slots: [] }]);
    } catch {
      setErr('Failed to load data');
    }
  };

  useEffect(() => { load(); }, []);

  const saveAvail = async () => {
    setMsg(''); setErr('');
    try {
      await api.put('/providers/availability', { availability });
      setMsg('Availability updated');
    } catch {
      setErr('Failed to update availability');
    }
  };

  const respond = async (bookingId, action) => {
    try {
      await api.post('/bookings/respond', { bookingId, action });
      load();
    } catch {
      setErr('Failed to respond');
    }
  };

  const complete = async (bookingId) => {
    try {
      await api.post('/bookings/complete', { bookingId });
      load();
    } catch {
      setErr('Failed to complete');
    }
  };

  return (
    <>
      <h3>Provider Dashboard</h3>
      {me && <div className="alert alert-info">Incentive Points: {me.incentivePoints}</div>}
      {err && <div className="alert alert-danger">{err}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}

      <h5>Availability</h5>
      <div className="mb-3">
        {availability.map((a, idx) => (
          <div key={idx} className="border p-2 mb-2">
            <input type="date" className="form-control mb-2" value={a.date} onChange={e => {
              const copy = [...availability]; copy[idx].date = e.target.value; setAvailability(copy);
            }} />
            <input type="text" className="form-control mb-2" placeholder="Slots comma separated e.g. 10:00,10:30"
                   value={a.slots.join(',')} onChange={e => {
                     const copy = [...availability]; copy[idx].slots = e.target.value.split(',').map(s => s.trim()); setAvailability(copy);
                   }} />
          </div>
        ))}
        <button className="btn btn-secondary me-2" onClick={() => setAvailability([...availability, { date: '', slots: [] }])}>Add Day</button>
        <button className="btn btn-primary" onClick={saveAvail}>Save Availability</button>
      </div>

      <h5>Bookings</h5>
      <ul className="list-group">
        {bookings.map(b => (
          <li key={b._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{b.citizen?.name} | {b.date} {b.time} | {b.status}</span>
            <div>
              {b.status === 'PENDING' && (
                <>
                  <button className="btn btn-success btn-sm me-2" onClick={() => respond(b._id, 'ACCEPT')}>Accept</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => respond(b._id, 'REJECT')}>Reject</button>
                </>
              )}
              {b.status === 'ACCEPTED' && (
                <button className="btn btn-warning btn-sm" onClick={() => complete(b._id)}>Complete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
