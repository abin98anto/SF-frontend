import { Link } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          SkillForge
        </Link>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/">Courses</Link>
            </li>
            <li>
              <Link to="/">About</Link>
            </li>
            <li>
              <Link to="/">Subscriptions</Link>
            </li>
          </ul>
        </nav>
        <div className="auth">
          <Link to="/" className="login">
            Login →
          </Link>
          <Link to="/" className="signup">
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
