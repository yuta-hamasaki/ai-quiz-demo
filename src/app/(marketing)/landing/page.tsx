import TestimonialCard from '@/components/TestimonialCard';
import Link from 'next/link';
import { features, testimonials } from '@/utils/landing/constants';
import { createClient } from '@/utils/supabase/server';
import PriceCards from '@/components/PriceCards';
import {client} from '@/lib/microcmsClient';

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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              <span className="block mt-2">{landingText.hero.title}</span>
            </h1>
            
            <p className="text-xm md:text-2xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
              {landingText.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/register" className="w-full sm:w-auto">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300 text-lg">
                🚀 新規登録
              </button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <button className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300 text-lg">
                  ログイン
                </button>
              </Link>
            </div>
            
            <div className="pt-8 text-sm text-blue-200">
              ✨ 7ヶ国語対応・💬 さまざまなテストやスラングを学習できる
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce delay-300">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">📚</span>
          </div>
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce delay-700">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-3xl">🧠</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">50,000+</div>
              <div className="text-gray-600">アクティブユーザー</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">95%</div>
              <div className="text-gray-600">学習継続率</div>
            </div> */}
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
              <div key={index} className="group p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
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
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
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
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl shadow-xl">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-blue-600 shadow-lg">
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
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
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