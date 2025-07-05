import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <AuthForm type="signup" />
    </div>
  );
}
