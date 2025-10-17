import React from 'react';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container footer-inner">
        <div style={{ color: 'var(--muted)' }}>
          © {new Date().getFullYear()} AI E‑Learning & Proctor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;


