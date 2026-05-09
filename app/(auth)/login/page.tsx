import { Suspense } from "react";
import { LoginForm } from "../_components/LoginForm";

export default function LoginPage() {
  return (
    // Wrap in Suspense because LoginForm uses useSearchParams()
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}