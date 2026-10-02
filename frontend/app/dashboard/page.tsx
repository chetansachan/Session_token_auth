"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "../../lib/api";
import CosmicBackground from "../../components/CosmicBackground";
import { ShieldCheck, User as UserIcon, LogOut, Database, KeyRound, Clock, Server } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.me()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  async function handleLogout() {
    try {
      await api.logout();
    } finally {
      router.push("/login");
    }
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#05040a",
          color: "#ffffff",
        }}
      >
        <CosmicBackground />
        <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 10 }}>
          <span className="spinner" />
          <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
            Verifying server session...
          </span>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        overflow: "hidden",
      }}
    >
      <CosmicBackground />

      <div
        className="fade-in-card"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "680px",
          borderRadius: "24px",
          backgroundColor: "rgba(18, 15, 28, 0.75)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(147, 51, 234, 0.12)",
          padding: "36px 32px",
          overflow: "hidden",
        }}
      >
        {/* Subtle Celestial Rim Light Reflection in top-right corner of card */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "250px",
            height: "250px",
            background: "radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.25) 0%, rgba(168, 85, 247, 0.15) 35%, transparent 75%)",
            pointerEvents: "none",
            borderTopRightRadius: "24px",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "22px",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#4ade80",
                  boxShadow: "0 0 10px #4ade80",
                }}
              />
              <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4ade80", fontWeight: 600 }}>
                Active Session
              </span>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.65)", marginTop: "2px" }}>
              {user.email}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <a
              href="/profile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 15px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#e9d5ff",
                backgroundColor: "rgba(168, 85, 247, 0.12)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "10px",
                transition: "background-color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(168, 85, 247, 0.22)";
                e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(168, 85, 247, 0.12)";
                e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)";
              }}
            >
              <UserIcon size={14} />
              Profile
            </a>

            <button
              onClick={handleLogout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 15px",
                fontSize: "13px",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.75)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "background-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
                e.currentTarget.style.color = "#fca5a5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.75)";
              }}
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </div>

        {/* Architecture Pipeline Banner */}
        <div
          style={{
            padding: "18px 20px",
            borderRadius: "14px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255, 255, 255, 0.5)", marginBottom: "8px" }}>
            Authentication Flow (Level 01)
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              color: "#c084fc",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <span>Cookie</span>
            <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>→</span>
            <span>Session ID</span>
            <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>→</span>
            <span>Redis Store</span>
            <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>→</span>
            <span>Postgres User</span>
          </div>
        </div>

        {/* Security & State Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <ShieldCheck size={20} style={{ color: "#a855f7", marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>Cookie Hardening</div>
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.55)", marginTop: "2px" }}>
                HttpOnly, SameSite=Strict, opaque 256-bit crypto/rand token.
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <Clock size={20} style={{ color: "#a855f7", marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>Sliding Renewal</div>
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.55)", marginTop: "2px" }}>
                Every authenticated request refreshes the Redis session TTL (60 min).
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <Database size={20} style={{ color: "#a855f7", marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>Redis Session Store</div>
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.55)", marginTop: "2px" }}>
                Stores SHA-256 IP/User-Agent hashes and user mapping in RAM.
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <KeyRound size={20} style={{ color: "#a855f7", marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>Argon2id Hashing</div>
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.55)", marginTop: "2px" }}>
                Protected with m=64MB, t=3, p=4 against GPU & timing attacks.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
