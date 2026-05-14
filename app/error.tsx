"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif", minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        .btn-primary { background: #6366f1; border: none; border-radius: 10px; color: #fff; cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 600; padding: 12px 24px; transition: background .2s; }
        .btn-primary:hover { background: #4f46e5; }
        
        .btn-secondary { background: #f1f5f9; border: 1.5px solid #e2e8f0; border-radius: 10px; color: #475569; cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 600; padding: 12px 24px; transition: all .2s; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .btn-secondary:hover { background: #e2e8f0; color: #1e293b; }
        
        .error-code { font-family: 'JetBrains Mono', monospace; font-size: 12px; background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 8px; margin-top: 16px; word-break: break-all; }
        
        @keyframes shake { 
          0%, 100% { transform: translateX(0); } 
          25% { transform: translateX(-5px); } 
          75% { transform: translateX(5px); } 
        }
        .shake-animation { animation: shake 0.5s ease-in-out; }
      `}</style>

      <div style={{ textAlign: "center", maxWidth: 600 }}>
        {/* Icon */}
        <div style={{ marginBottom: 32 }}>
          <div className="shake-animation" style={{ display: "inline-block" }}>
            <AlertTriangle size={80} style={{ color: "#f59e0b" }} />
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#1e293b", marginBottom: 12, letterSpacing: "-1px" }}>
          Something Went Wrong
        </h1>

        {/* Description */}
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 32, lineHeight: 1.6 }}>
          An unexpected error occurred. Our team has been notified and we're working to fix it.
        </p>

        {/* Error Details */}
        {error.message && (
          <div className="error-code">
            <strong style={{ color: "#dc2626" }}>Error:</strong> {error.message}
          </div>
        )}

        {/* Suggestions */}
        <div style={{ background: "#fef3c7", border: "1.5px solid #fcd34d", borderRadius: 14, padding: 20, marginTop: 24, marginBottom: 32, textAlign: "left" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", marginBottom: 12, letterSpacing: ".05em", textTransform: "uppercase" }}>
            Try these solutions:
          </p>
          <ul style={{ fontSize: 14, color: "#78350f", lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Refresh the page using the button below</li>
            <li>Clear your browser cache</li>
            <li>Try again in a few moments</li>
            <li>Return to the home page</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            className="btn-primary" 
            onClick={reset}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <RefreshCw size={18} /> Try Again
          </button>
          <Link href="/" style={{ textDecoration: "none" }}>
            <button className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Home size={18} /> Go Home
            </button>
          </Link>
        </div>

        {/* Footer Note */}
        <div style={{ marginTop: 40, fontSize: 12, color: "#94a3b8" }}>
          If this problem persists, please contact support
        </div>
      </div>
    </div>
  );
}
