import LoginForm from "@/components/LoginForm";
import LoginGoogle from "@/components/LoginGoogle";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="w-full flex pt-20 justify-center">
        <section className="flex flex-col w-[400px]">
          <h1 className="text-3xl w-full text-center font-bold mb-6">
            ログイン
          </h1>
          <LoginGoogle />
          <p className="text-center">--- または ---</p>
          <LoginForm />
          <div className="mt-2 flex items-center">
            <h1>{`新規登録はこちら`}</h1>
            <Link className="text-sm ml-2" href="/register">
              アカウントを作成する
            </Link>
          </div>
          <div className="mt-2 flex items-center">
            <h1>{`パスワードをお忘れですか?`}</h1>
            <Link className="text-sm ml-2" href="/forgot-password">
              パスワードをリセットする
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}