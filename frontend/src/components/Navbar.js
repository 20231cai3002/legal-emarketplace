import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const textRef = useRef(null);

  // MOVING TEXT EFFECT
  useEffect(() => {
    let pos = 0;
    const interval = setInterval(() => {
      if (textRef.current) {
        pos = (pos + 1) % window.innerWidth;
        textRef.current.style.transform = `translateX(${pos}px)`;
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/5669601/pexels-photo-5669601.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "15px",
        borderBottom: "3px solid #00000040",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <div className="container-fluid">
        {/* Moving Title */}
        <div
          ref={textRef}
          style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "white",
            textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Legal eMarketplace
        </div>

        <div className="d-flex">
          {!user && (
            <>
              <Link className="btn btn-outline-light me-2" to="/login">
                Login
              </Link>

              <Link
                className="btn btn-primary me-2"
                style={{ fontWeight: "600" }}
                to="/register/citizen"
              >
                Register Citizen
              </Link>

              <Link className="btn btn-warning" to="/register/provider">
                Register Provider
              </Link>
            </>
          )}

          {user && (
            <>
              {user.role === "CITIZEN" && (
                <Link className="btn btn-primary me-2" to="/citizen">
                  Citizen
                </Link>
              )}

              {user.role === "PROVIDER" && (
                <Link className="btn btn-warning me-2" to="/provider">
                  Provider
                </Link>
              )}

              {user.role === "ADMIN" && (
                <Link className="btn btn-danger me-2" to="/admin">
                  Admin
                </Link>
              )}

              <button className="btn btn-dark" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
