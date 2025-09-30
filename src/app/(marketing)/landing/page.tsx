import TestimonialCard from '@/components/TestimonialCard';
import Link from 'next/link';
import { features, testimonials } from '@/utils/landing/constants';
import { createClient } from '@/utils/supabase/server';
import PriceCards from '@/components/PriceCards';
import {client} from '@/lib/microcmsClient';
import bg from "../../../../public/bg.jpg";

export default async function LandingPage() {
  const supabase = createClient();
  const { data: session } = await (await supabase).auth.getSession()
  const user= session.session?.user;

const landingText = await client.get({
  endpoint: 'landing',
})   


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative h-[680px] overflow-hidden bg-cover bg-center text-white" 
        style={{ backgroundImage: `url(${bg.src})` }}
      > 
        <div className="absolute inset-0 bg-blue-900/40 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">     
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              <span className="block mt-2 text-white">{landingText.hero.title}</span> 
            </h1>
            <p className="text-xm md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed"> 
              {landingText.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/register" className="w-full sm:w-auto">
              <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 text-lg">
                🚀 新規登録
              </button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <button className="px-8 py-4 bg-white text-blue-800 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 text-lg">
                  ログイン
                </button>
              </Link>
            </div>
            <div className="pt-8 text-sm text-blue-200">
              ✨ 7ヶ国語対応・💬 さまざまなテストやスラングを学習できる
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">3倍</div>
              <div className="text-gray-700">学習効率向上</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">7言語</div>
              <div className="text-gray-700">完全対応</div>
              <p className="text-gray-500 text-sm">英語、スペイン語、ドイツ語、フランス語、中国語、韓国語、オランダ語</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">11試験</div>
              <div className="text-gray-700">主要語学試験対応</div>
              <p className="text-gray-500 text-sm">TOEIC、TOEFL、IELTS、独検 など</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-600">6段階</div>
              <div className="text-gray-700">レベル別学習</div>
              <p className="text-gray-500 text-sm">初級（A1）から上級（C2）まで、あなたのレベルに合わせた学習</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {landingText.feat.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {landingText.feat.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} 
                  className="group p-8 rounded-3xl bg-gray-50 hover:bg-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:scale-105 border border-gray-100">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 text-blue-600"> 
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              3ステップで始める
            </h2>
            <p className="text-xl text-gray-600">
              簡単な設定で、今すぐAI学習を体験できます
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "クイズをカスタマイズ",
                description: "あなたのレベルや目的を設定",
                icon: "🎯"
              },
              {
                step: "02",
                title: "AI学習開始",
                description: "AIがあなた専用のクイズを自動生成",
                icon: "🤖"
              },
              {
                step: "03",
                title: "継続的改善",
                description: "過去に間違った単語を自動でリスト化して何度も学習可能",
                icon: "📈"
              }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-4xl shadow-xl">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-blue-600 shadow-lg border border-blue-200">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PriceCards
        user={user}
      />


      {/* Testimonials */}
      <section className="py-24 bg-white">
        <TestimonialCard
          testimonials={landingText.testimonials}
        />
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            今すぐ語彙学習を
            <span className="block">革命的に変えよう</span>
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            3日間の無料体験で、AIの力を実感してください
          </p>
          <button className="px-12 py-4 bg-white text-blue-600 font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300">
            🚀 無料体験を始める
          </button>
          <p className="text-sm text-blue-200 mt-4">
            無料体験後キャンセル可能
          </p>
        </div>
      </section>


    </div>
  );
}