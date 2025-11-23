import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Legal eMarketplace</Link>
        <div className="d-flex">
          {!user && (
            <>
              <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
              <Link className="btn btn-primary me-2" to="/register/citizen">Register Citizen</Link>
              <Link className="btn btn-secondary" to="/register/provider">Register Provider</Link>
            </>
          )}
          {user && (
            <>
              {user.role === 'CITIZEN' && <Link className="btn btn-primary me-2" to="/citizen">Citizen</Link>}
              {user.role === 'PROVIDER' && <Link className="btn btn-warning me-2" to="/provider">Provider</Link>}
              {user.role === 'ADMIN' && <Link className="btn btn-danger me-2" to="/admin">Admin</Link>}
              <button className="btn btn-outline-dark" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;