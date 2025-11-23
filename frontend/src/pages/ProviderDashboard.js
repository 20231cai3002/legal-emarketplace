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