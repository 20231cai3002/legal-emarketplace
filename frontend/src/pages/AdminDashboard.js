import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminDashboard() {
  const [providers, setProviders] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const { data: prov } = await api.get('/admin/providers');
      setProviders(prov);
      const { data: inc } = await api.get('/admin/incentives');
      setIncentives(inc);
    } catch {
      setErr('Failed to load admin data');
    }
  };

  useEffect(() => { load(); }, []);

  const verify = async (userId, approve) => {
    try {
      await api.post('/admin/verify', { userId, approve });

      // ✅ Update local state immediately
      setProviders(prev =>
        prev.map(p =>
          p.user?._id === userId
            ? { ...p, user: { ...p.user, isVerified: approve ? true : false } }
            : p
        )
      );
    } catch {
      setErr('Verification failed');
    }
  };

  return (
    <>
      <h3>Admin Dashboard</h3>
      {err && <div className="alert alert-danger">{err}</div>}
      <h5>Providers</h5>
      <ul className="list-group mb-4">
        {providers.map(p => (
          <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {p.user?.name} | {p.profession} | {p.user?.email} | Status: 
              {p.user?.isVerified === null && ' Pending'}
              {p.user?.isVerified === true && ' Approved'}
              {p.user?.isVerified === false && ' Rejected'}
            </span>
            <div>
              {p.user?.isVerified === null && (
                <>
                  <button className="btn btn-success btn-sm me-2" onClick={() => verify(p.user?._id, true)}>Approve</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => verify(p.user?._id, false)}>Reject</button>
                </>
              )}
              {p.user?.isVerified === true && (
                <span className="badge bg-success">Approved</span>
              )}
              {p.user?.isVerified === false && (
                <span className="badge bg-danger">Rejected</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <h5>Incentives</h5>
      <ul className="list-group">
        {incentives.map(i => (
          <li key={i._id} className="list-group-item">
            Provider: {i.provider} | Points: {i.points} | Reason: {i.reason}
          </li>
        ))}
      </ul>
    </>
  );
}