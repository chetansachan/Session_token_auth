"use client";

import React, { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Props {
  submitLabel: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  onSubmit: (email: string, password: string) => Promise<void>;
  showForgotPassword?: boolean;
}

export default function AuthForm({
  submitLabel,
  emailPlaceholder = "Email or Phone",
  passwordPlaceholder = "Password",
  onSubmit,
  showForgotPassword = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4.5 w-full">
      {/* Error Alert using shadcn Alert component */}
      {error && (
        <Alert
          variant="destructive"
          className="bg-red-950/40 border-red-500/30 text-red-200 py-2.5 px-3 rounded-xl flex items-center gap-2"
        >
          <AlertCircle className="size-4 shrink-0 text-red-400" />
          <AlertDescription className="text-xs text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Email Input using shadcn Input */}
      <div className="relative w-full">
        <Input
          id="auth-email-input"
          type="email"
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="h-12 w-full px-4! text-sm text-white placeholder:text-white/40 bg-white/[0.04] border-white/[0.14] rounded-xl focus-visible:border-purple-500/80 focus-visible:ring-purple-500/20 focus-visible:bg-white/[0.07] transition-all"
        />
      </div>

      {/* Password Input using shadcn Input with "Show" / "Hide" toggle */}
      <div className="relative w-full">
        <Input
          id="auth-password-input"
          type={showPassword ? "text" : "password"}
          placeholder={passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="current-password"
          className="h-12 w-full pl-4! pr-16! text-sm text-white placeholder:text-white/40 bg-white/[0.04] border-white/[0.14] rounded-xl focus-visible:border-purple-500/80 focus-visible:ring-purple-500/20 focus-visible:bg-white/[0.07] transition-all"
        />


      </div>

      {/* Forgot Password link */}
      {showForgotPassword && (
        <div className="-mt-1 text-left">
          <button
            type="button"
            onClick={() => setForgotPasswordNotice(true)}
            className="text-xs text-white/60 hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            Forgot Password
          </button>
        </div>
      )}

      {/* Primary Submit Button using shadcn Button */}
      <Button
        id="auth-submit-btn"
        type="submit"
        disabled={busy}
        className="w-full h-12 mt-1 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-400 border-0 shadow-[0_4px_22px_rgba(147,51,234,0.45)] hover:shadow-[0_6px_30px_rgba(168,85,247,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        {busy ? <span className="spinner" /> : submitLabel}
      </Button>

      {/* Note: NO sign in with apple button as explicitly requested */}
    </form>
  );
}
