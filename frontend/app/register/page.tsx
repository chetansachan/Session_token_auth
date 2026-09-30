"use client";

import { useRouter } from "next/navigation";
import AuthLayout from "../../components/AuthLayout";
import AuthForm from "../../components/AuthForm";
import { api } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Enter your email and password to get started"
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerHref="/login"
    >
      <AuthForm
        submitLabel="Join Now"
        emailPlaceholder="Email address"
        passwordPlaceholder="Password (min 8 chars)"
        showForgotPassword={false}
        onSubmit={async (email, password) => {
          await api.register(email, password);
          await api.login(email, password);
          router.push("/dashboard");
        }}
      />
    </AuthLayout>
  );
}
