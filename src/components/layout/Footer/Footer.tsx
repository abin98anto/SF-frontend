import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import "./Footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Social Links */}
        <div>
          <div className="footer-logo">
            <strong className="logo">SkillForge</strong>
            <p>skillforge4202@gmail.com</p>
            <p>Brocamp, Ernakulam</p>
            <p>+91 8848746391</p>

            <div className="footer-social">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <Link to={"/tutor/signup"}>Become a Instructor →</Link>
              </li>
              <li>
                <a href="/courses">Courses</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Top 5 Categories</h4>
            <ul>
              <li>
                <a href="/category/1">Design</a>
              </li>
              <li>
                <a href="/category/2">Development</a>
              </li>
              <li>
                <a href="/category/3">Marketing</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        © 2024 SkillForge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
