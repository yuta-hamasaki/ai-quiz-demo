"use client";

import React, { useTransition } from "react";
import { FaGoogle } from "react-icons/fa";
import { signInWithGoogle } from "@/actions/auth";

const LoginGoogle = () => {
  const [isPending, startTransition] = useTransition();

  const handleGoogleLogin = () => {
    startTransition(async () => {
      await signInWithGoogle();
    });
  };
  return (
    <div
      onClick={handleGoogleLogin}
      className="w-full gap-4 hover:cursor-pointer my-5 h-12 bg-gray-800 rounded-md p-4 flex justify-center items-center"
    >
      <FaGoogle className="text-white" />
      <p className="text-white">
        {isPending ? "ログイン中..." : "Googleでログイン"}
      </p>
    </div>
  );
};

export default LoginGoogle;