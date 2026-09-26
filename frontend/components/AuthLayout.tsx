"use client";

import React, { ReactNode } from "react";
import CosmicBackground from "./CosmicBackground";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerHref?: string;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerHref,
}: Props) {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflow: "hidden",
      }}
    >
      <CosmicBackground />

      {/* Main Glassmorphic Auth Container */}
      <div
        className="fade-in-card"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Card Box */}
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "22px",
            backgroundColor: "rgba(18, 15, 28, 0.72)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(147, 51, 234, 0.12)",
            padding: "38px 34px",
            overflow: "hidden",
          }}
        >
          {/* Subtle Celestial Rim Light Reflection in top-right corner of card */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "210px",
              height: "210px",
              background: "radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.28) 0%, rgba(168, 85, 247, 0.18) 35%, transparent 72%)",
              pointerEvents: "none",
              borderTopRightRadius: "22px",
            }}
          />

          {/* Header */}
          <div style={{ marginBottom: "26px", textAlign: "left" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 600,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "13.5px",
                color: "rgba(255, 255, 255, 0.62)",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Body / Form */}
          {children}
        </div>

        {/* Footer Link below card */}
        {footerText && footerLinkText && footerHref && (
          <div
            style={{
              marginTop: "22px",
              fontSize: "13.5px",
              color: "rgba(255, 255, 255, 0.6)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>{footerText}</span>
            <a
              href={footerHref}
              style={{
                color: "#c084fc",
                fontWeight: 600,
                transition: "color 0.15s, text-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#e879f9";
                e.currentTarget.style.textShadow = "0 0 12px rgba(232, 121, 249, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#c084fc";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              {footerLinkText}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
