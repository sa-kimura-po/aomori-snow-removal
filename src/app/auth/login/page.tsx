import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">ログイン</h1>
      <LoginForm />
      <p className="text-center text-sm text-gray-500 mt-4">
        アカウントをお持ちでない方は{" "}
        <Link href="/auth/signup" className="text-blue-700 hover:underline">
          新規登録
        </Link>
      </p>
    </div>
  );
}
