import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function RegisterProviderPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    experience: 0, profession: 'Advocate', licenseNumber: '', documentUrl: ''
  });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/auth/register/provider', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Registered as Provider. Wait for admin verification.');
      navigate('/login');
    } catch (error) {
      setErr(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h3>Register as Provider</h3>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={submit}>
          {['name','email','phone','password','licenseNumber','documentUrl'].map(key => (
            <div className="mb-3" key={key}>
              <label className="form-label">{key}</label>
              <input type={key === 'password' ? 'password' : 'text'}
                     className="form-control"
                     value={form[key]}
                     onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <div className="mb-3">
            <label className="form-label">Experience (years)</label>
            <input type="number" className="form-control" value={form.experience} onChange={e => setForm({ ...form, experience: Number(e.target.value) })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Profession</label>
            <select className="form-select" value={form.profession} onChange={e => setForm({ ...form, profession: e.target.value })}>
              {['Advocate','Mediator','Arbitrator','Notary','DocumentWriter'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button className="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  );
}