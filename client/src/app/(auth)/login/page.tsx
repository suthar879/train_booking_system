import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <AuthForm type="login" />
    </div>
  );
}
