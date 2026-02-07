import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">新規登録</h1>
      <SignupForm />
      <p className="text-center text-sm text-gray-500 mt-4">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/auth/login" className="text-blue-700 hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
