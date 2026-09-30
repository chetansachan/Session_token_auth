"use client";

import { useRouter } from "next/navigation";
import AuthLayout from "../../components/AuthLayout";
import AuthForm from "../../components/AuthForm";
import { api } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Keep it all together and you'll be fine"
      footerText="New to Atomz"
      footerLinkText="Join Now"
      footerHref="/register"
    >
      <AuthForm
        submitLabel="Sign In"
        emailPlaceholder="Email or Phone"
        passwordPlaceholder="Password"
        showForgotPassword={true}
        onSubmit={async (email, password) => {
          await api.login(email, password);
          router.push("/dashboard");
        }}
      />
    </AuthLayout>
  );
}
