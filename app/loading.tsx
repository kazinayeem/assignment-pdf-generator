import React from 'react';

export default function Loading() {
  return (
    <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif", minHeight: "100vh", background: "#f8fafc", padding: "24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        @keyframes pulse { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0.5; } 
        }
        .skeleton { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; background: #e2e8f0; }
      `}</style>

      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header Skeleton */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 24px", marginBottom: "24px", borderRadius: "8px" }}>
          <div className="skeleton" style={{ height: "40px", borderRadius: "8px", marginBottom: "12px" }}></div>
          <div className="skeleton" style={{ height: "16px", borderRadius: "4px", maxWidth: "400px" }}></div>
        </div>

        {/* Hero Skeleton */}
        <div style={{ padding: "40px 24px", background: "#fff", borderRadius: "12px", marginBottom: "24px" }}>
          <div className="skeleton" style={{ height: "16px", width: "120px", borderRadius: "4px", marginBottom: "16px" }}></div>
          <div className="skeleton" style={{ height: "48px", borderRadius: "8px", marginBottom: "16px" }}></div>
          <div className="skeleton" style={{ height: "20px", borderRadius: "4px", maxWidth: "600px" }}></div>
        </div>

        {/* Main Grid Skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 }}>
          {/* Left Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: "240px", borderRadius: "14px" }}></div>
            ))}
          </div>

          {/* Right Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton" style={{ height: "140px", borderRadius: "14px" }}></div>
              ))}
            </div>

            {/* Main Content */}
            <div className="skeleton" style={{ height: "400px", borderRadius: "14px" }}></div>
            <div className="skeleton" style={{ height: "300px", borderRadius: "14px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
