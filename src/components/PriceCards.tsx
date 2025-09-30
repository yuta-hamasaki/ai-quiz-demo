import Link from 'next/link'
import { createClient } from '@/utils/supabase/server';
import initStripe, {Stripe} from "stripe"
import { redirect } from 'next/navigation';
import {subscribeAction} from '@/actions/stripe';
import PurchaseBtn from './PurchaseBtn';
import PortalBtn from './PortalBtn';

interface Plan {
  id: string;
  name: string;
  price: string | null; // Stripe returns price as a string
  currency: string;
  status: boolean;
}

const standardPlan = process.env.STANDARD_PLAN_ID || 'price_1RihruKhyfhfuII6lJmTUFfg';
const yearlyProPlan = process.env.YEARLY_PRO_PLAN_ID || 'price_1RiiD8KhyfhfuII6jSS2BxnH';
const monthlyProPlan = process.env.MONTHLY_PRO_PLAN_ID || 'price_1RiiBwKhyfhfuII6cUYLAxtR'

  const PLAN_IDS = {
    STANDARD: standardPlan, 
    YEARLY_PRO: yearlyProPlan,    
    MONTHLY_PRO: monthlyProPlan   
  };

const getIsSubscribed = async (userId: string) => {
  const supabase = createClient();
  const { data: isSubscribed } = await (await supabase)
    .from("user_profile")
    .select("is_subscribed")
    .eq("id", userId)
    .single();
  return isSubscribed?.is_subscribed;
}


export default async function PriceCards({ user }: { user: any }) {
  const isSubscribed = user ? await getIsSubscribed(user.id) : null;

    const showRegister = !user;
    const showPayButton = user && !isSubscribed;
    const showPortalButton = user && isSubscribed;




  return (
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {!user && "シンプルな料金体系"}
              {user && "料金プランを選択"}
            </h2>
            <p className="text-xl text-gray-600">
              コーヒー1杯分の価格で、無制限の学習体験を
            </p>
            {user && 
            <div className="text-center mt-4 text-xs">
            <p className="text-gray-600 mb-2">
              すべてのプランで3日間無料体験が可能です
            </p>
            <div className="flex justify-center space-x-8  text-gray-500 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>いつでもキャンセル可能</span>
              </div>
            </div>
          </div>
        }
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* standard Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">スタンダードプラン</h3>
                  <div className="text-4xl font-bold text-gray-900">¥200</div>
                  <p className="text-gray-600">月額</p>
                </div>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>AI個別最適化</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>11試験対応</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>苦手単語自動管理</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-gray-300">✗</span>
                    <span className="text-gray-500">
                      <span>英語のみ対応</span>
                  </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-gray-300">✗</span>
                    <span className="text-gray-500">
                      <span>問題数1日20問まで</span>
                    </span>
                  </li>
                </ul>

                <div className="mt-6">
                  {showPayButton && <PurchaseBtn
                    className={"w-full py-3 bg-gray-100 text-gray-800 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-300"}
                    user={user}
                    priceId={PLAN_IDS.STANDARD}
                    btnText={"スタンダードプランを選択"}
                  />
                  }
                  {showPortalButton && <PortalBtn/>}
                  {showRegister && <Link
                    href="/register">
                    <button
                    className="w-full py-3 bg-gray-100 text-gray-800 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-300"
                    >
                      スタンダードプランを選択
                    </button>
                    </Link>}
                  
                </div>
              </div>
            </div>

            {/* Yealy Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                  人気No.1
                </div>
              </div>
              <div className="text-center space-y-6 text-white">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">年間PROプラン</h3>
                  <div className="text-4xl font-bold">¥390</div>
                  <p className="text-blue-100">月額</p>
                </div>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>AI個別最適化</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>11試験対応</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>苦手単語自動管理</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>7言語完全対応</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>問題数無制限</span>
                  </li>
                </ul>
                <div className="mt-6">
                  {showPayButton && <PurchaseBtn 
                    className={"w-full py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300"}
                    user={user}
                    priceId={PLAN_IDS.YEARLY_PRO}
                    btnText={"年間PROプランを選択"}
                  />}
                  {showPortalButton && <PortalBtn/>}
                  {showRegister && <Link href="/register">
                        <button
                          className="w-full py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300"
                        >
                          年間PROプランを選択
                        </button>
                      </Link>
                  }
                </div>
              </div>
            </div>

            {/* Monthly Pro Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">月間PROプラン</h3>
                  <div className="text-4xl font-bold text-gray-900">¥490</div>
                  <p className="text-gray-600">月額</p>
                </div>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>AI個別最適化</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>11試験対応</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>苦手単語自動管理</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>7言語完全対応</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>問題数無制限</span>
                  </li>
                </ul>
                <div className="mt-6">
                {showPayButton && <PurchaseBtn 
                className={"w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300"}
                  user={user}
                  priceId={PLAN_IDS.MONTHLY_PRO}
                  btnText={"月額PROプランを選択"}
                />}
                {showPortalButton && <PortalBtn/>}
                {showRegister &&
                  <Link href="/register">
                  <button
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300"
                  >
                    月額PROプランを選択
                  </button>
                  </Link>
}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              すべてのプランで3日間無料体験が可能です
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>いつでもキャンセル可能</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
