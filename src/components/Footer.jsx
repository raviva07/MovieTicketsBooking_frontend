import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-5 pt-5">
      <div className="container">
        <div className="row">

          {/* Brand */}
          <div className="col-md-3 mb-4">
            <h4 className="text-danger">🎬 MovieBooking</h4>
            <p className="text-secondary small">
              Book your favorite movies anytime, anywhere. Fast, secure, and easy.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/movies" className="footer-link">Movies</Link></li>
              <li><Link to="/bookings" className="footer-link">My Bookings</Link></li>
              <li><Link to="/profile" className="footer-link">Profile</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3 mb-4">
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li><Link to="/terms" className="footer-link">Terms</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-md-3 mb-4">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="#" className="social-icon">🌐</a>
              <a href="#" className="social-icon">📘</a>
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">📸</a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="text-center border-top border-secondary py-3 small text-secondary">
        © {year} MovieBooking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
