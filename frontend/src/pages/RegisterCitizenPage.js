import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function RegisterCitizenPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/auth/register/citizen', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/citizen');
    } catch (error) {
      setErr(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3>Register as Citizen</h3>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={submit}>
          {['name','email','phone','password'].map(key => (
            <div className="mb-3" key={key}>
              <label className="form-label">{key}</label>
              <input type={key === 'password' ? 'password' : 'text'}
                     className="form-control"
                     value={form[key]}
                     onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <button className="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  );
}