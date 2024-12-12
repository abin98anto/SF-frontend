import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          SkillForge
        </Link>

        {/* Hamburger Menu Icon */}
        <div
          className={`hamburger ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu-content">
            <button className="close-menu" onClick={toggleMenu}>
              &times;
            </button>
            <nav className="mobile-nav">
              <ul>
                <li>
                  <Link to="/courses" onClick={toggleMenu}>
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={toggleMenu}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/subscriptions" onClick={toggleMenu}>
                    Subscriptions
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="mobile-auth">
              <Link to="/login" className="login" onClick={toggleMenu}>
                Login
              </Link>
              <Link to="/signup" className="signup" onClick={toggleMenu}>
                Signup
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav">
          <ul>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/subscriptions">Subscriptions</Link>
            </li>
          </ul>
        </nav>

        <div className="auth">
          <Link to="/login" className="login">
            Login →
          </Link>
          <Link to="/signup" className="signup">
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
