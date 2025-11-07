"use client";
import { AnonimousSignIn as anonimousSignInAction } from "@/actions/auth";
export default function AnonimousSignIn() {
  const handleAnonimousSignIn = async () => {
    const result = await anonimousSignInAction();
    if (result?.status === "error") {
      alert(result.message);
    } else {
      // Redirect to home or another page after successful sign-in
      window.location.href = "/";
    }
  };
  return (
    <div>
      <button
        className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors"
        onClick={handleAnonimousSignIn}
      >
        ゲストユーザーとしてログイン
      </button>
    </div>
  );
}
