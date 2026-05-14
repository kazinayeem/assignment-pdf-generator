"use client";

import Link from "next/link";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif", minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        .btn-primary { background: #6366f1; border: none; border-radius: 10px; color: #fff; cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 600; padding: 12px 24px; transition: background .2s; }
        .btn-primary:hover { background: #4f46e5; }
        
        .btn-secondary { background: #f1f5f9; border: 1.5px solid #e2e8f0; border-radius: 10px; color: #475569; cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 600; padding: 12px 24px; transition: all .2s; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .btn-secondary:hover { background: #e2e8f0; color: #1e293b; }
        
        @keyframes float { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-20px); } 
        }
        .float-animation { animation: float 3s ease-in-out infinite; }
      `}</style>

      <div style={{ textAlign: "center", maxWidth: 600 }}>
        {/* Icon */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "inline-block", className: "float-animation" }}>
            <AlertCircle size={80} style={{ color: "#ef4444", opacity: 0.8 }} />
          </div>
        </div>

        {/* Error Code */}
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 72, fontWeight: 900, color: "#1e293b", letterSpacing: "-2px", lineHeight: 1 }}>404</h1>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#1e293b", marginBottom: 12, letterSpacing: "-0.5px" }}>
          Page Not Found
        </h2>

        {/* Description */}
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 32, lineHeight: 1.6 }}>
          Sorry, the page you're looking for doesn't exist or is not available. 
          <br />
          It might have been moved or deleted.
        </p>

        {/* Suggestions */}
        <div style={{ background: "#eef2ff", border: "1.5px solid #c7d2fe", borderRadius: 14, padding: 20, marginBottom: 32, textAlign: "left" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#6366f1", marginBottom: 12, letterSpacing: ".05em", textTransform: "uppercase" }}>
            Here's what you can do:
          </p>
          <ul style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Check the URL for spelling mistakes</li>
            <li>Return to the home page</li>
            <li>Navigate using the main menu</li>
            <li>Contact support if you think this is an error</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Home size={18} /> Go to Home
            </button>
          </Link>
          <button 
            className="btn-secondary" 
            onClick={() => window.history.back()}
            style={{ cursor: "pointer" }}
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, letterSpacing: ".05em", textTransform: "uppercase", fontWeight: 600 }}>
            Quick Links
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href="/tools" style={{ textDecoration: "none", color: "#6366f1", fontSize: 14, fontWeight: 500, padding: "8px 12px", borderRadius: 8, transition: "all .2s", display: "inline-block", border: "1px solid #e2e8f0" }}>
              Tools
            </Link>
            <Link href="/about" style={{ textDecoration: "none", color: "#6366f1", fontSize: 14, fontWeight: 500, padding: "8px 12px", borderRadius: 8, transition: "all .2s", display: "inline-block", border: "1px solid #e2e8f0" }}>
              About
            </Link>
            <Link href="/login" style={{ textDecoration: "none", color: "#6366f1", fontSize: 14, fontWeight: 500, padding: "8px 12px", borderRadius: 8, transition: "all .2s", display: "inline-block", border: "1px solid #e2e8f0" }}>
              Login
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ marginTop: 40, fontSize: 12, color: "#94a3b8" }}>
          Error Code: <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#64748b" }}>404_NOT_FOUND</span>
        </div>
      </div>
    </div>
  );
}
