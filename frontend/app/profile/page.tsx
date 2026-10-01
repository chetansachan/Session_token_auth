"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "../../lib/api";
import CosmicBackground from "../../components/CosmicBackground";
import { ArrowLeft, User as UserIcon, Mail, Fingerprint, Calendar } from "lucide-react";

export default function ProfilePage() {
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
            Loading user profile...
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
          maxWidth: "480px",
          borderRadius: "22px",
          backgroundColor: "rgba(18, 15, 28, 0.75)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(147, 51, 234, 0.12)",
          padding: "36px 32px",
          overflow: "hidden",
        }}
      >
        {/* Subtle Celestial Rim Light Reflection in top-right corner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.25) 0%, rgba(168, 85, 247, 0.15) 35%, transparent 75%)",
            pointerEvents: "none",
            borderTopRightRadius: "22px",
          }}
        />

        <div style={{ marginBottom: "24px" }}>
          <a
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.65)",
              marginBottom: "16px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#c084fc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)";
            }}
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </a>

          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
            User Profile
          </h1>
          <p style={{ fontSize: "13.5px", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>
            Identity verified via authenticated server-side session
          </p>
        </div>

        {/* Info Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Fingerprint size={18} style={{ color: "#a855f7", flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255, 255, 255, 0.5)" }}>
                User ID
              </div>
              <div style={{ fontSize: "13px", color: "#ffffff", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.id}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Mail size={18} style={{ color: "#a855f7", flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255, 255, 255, 0.5)" }}>
                Email
              </div>
              <div style={{ fontSize: "13.5px", color: "#ffffff", fontWeight: 500 }}>
                {user.email}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Calendar size={18} style={{ color: "#a855f7", flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255, 255, 255, 0.5)" }}>
                Registered At
              </div>
              <div style={{ fontSize: "13.5px", color: "rgba(255, 255, 255, 0.85)" }}>
                {new Date(user.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
