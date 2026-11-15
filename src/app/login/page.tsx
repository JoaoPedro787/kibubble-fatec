import { LoginForm } from "@/auth/components/login-form";
import { PageTransition } from "@/shared/components/page-transition";

export default function LoginPage() {
  return (
    <PageTransition>
      <LoginForm />
    </PageTransition>
  );
}
