import React, { useState } from "react";
import imageLogo from "./Assets/linde.png";
import "./App.css";
import { Link, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contract from "./Components/contracts.tsx";
import Points from "./Components/points.tsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Invoice from "./Components/invoice.tsx";

const App: React.FC = () => {
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);

  const toggleSidenav = () => {
    if (isLoggedIn) {
      setSidenavOpen(!sidenavOpen);
    }
  };

  const toggleLoginDropdown = () => {
    setLoginDropdownOpen(!loginDropdownOpen);
  };

  const handleLogin = () => {
    if (id && password) {
      setIsLoggedIn(true);
      setLoginDropdownOpen(false);
      setId("");
      setPassword("");
    } else {
      alert("Please enter both ID and Password.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSidenavOpen(false);
    setProfileMenuOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={imageLogo} className="App-logo" alt="logo" />
          {isLoggedIn ? (
            <div className="profile-container">
              <div
                className="profile-icon"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <i className="fas fa-user-circle"></i>
              </div>
              {profileMenuOpen && (
                <div className="profile-dropdown">
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="login-container">
              <button className="login-button" onClick={toggleLoginDropdown}>
                Login
              </button>
              {loginDropdownOpen && (
                <div className="login-dropdown">
                  <h3>Login</h3> 
                  <input
                    type="text"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="id-input"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="password-input"
                  />
                  <button className="loginsave-button" onClick={handleLogin}>
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        <div
          id="main"
          className={`${
            sidenavOpen ? "main-with-sidenav main-compressed" : ""
          }`}
        >
          <div className="hamburger-container">
            <span
              className={`hamburger-button ${!isLoggedIn ? "disabled" : ""}`}
              onClick={toggleSidenav}
            >
              ☰
            </span>
          </div>
        </div>

        <div
          id="mySidenav"
          className={`sidenav ${sidenavOpen && isLoggedIn ? "open" : ""}`}
        >
          <div className="sidenav-header">
            <span className="menu-title">Menu</span>
          </div>
          <Link
            to="/contract"
            className={`sidenav-link ${!isLoggedIn ? "disabled-link" : ""}`}
            onClick={isLoggedIn ? toggleSidenav : undefined}
          >
            Contract
          </Link>
          <Link
            to="/points"
            className={`sidenav-link ${!isLoggedIn ? "disabled-link" : ""}`}
            onClick={isLoggedIn ? toggleSidenav : undefined}
          >
            Points
          </Link>
          <Link
            to="/invoice"
            className={`sidenav-link ${!isLoggedIn ? "disabled-link" : ""}`}
            onClick={isLoggedIn ? toggleSidenav : undefined}
          >
            Invoice
          </Link>
        </div>

        <Routes>
          {isLoggedIn && (
            <>
              <Route
                path="/contract"
                element={
                  <div
                    className={`${sidenavOpen ? "contract-compressed" : ""}`}
                  >
                    <Contract />
                  </div>
                }
              />
              <Route
                path="/points"
                element={
                  <div className={`${sidenavOpen ? "points-compressed" : ""}`}>
                    <Points />
                  </div>
                }
              />
              <Route
                path="/invoice"
                element={
                  <div className={`${sidenavOpen ? "invoice-compressed" : ""}`}>
                    <Invoice />
                  </div>
                }
              />
            </>
          )}
        </Routes>

        <footer className="App-footer">
          <p className="footer-compressed">Copyright By LTE</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
