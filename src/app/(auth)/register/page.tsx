import SignUpForm from "@/components/SignUpForm";
import Link from "next/link";
import React from "react";
import LoginGoogle from "@/components/LoginGoogle";

const SignUp = async () => {
  return (
    <div className="w-full flex pt-20 justify-center ">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">新規登録</h1>
        <LoginGoogle />
        <p className="text-center">--- または ---</p>
        <SignUpForm />
        <div className="mt-2 flex items-center">
          <h1>すでにアカウントをお持ちの方はこちら</h1>
          <Link className="font-bold ml-2" href="/login">
            ログイン
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SignUp;