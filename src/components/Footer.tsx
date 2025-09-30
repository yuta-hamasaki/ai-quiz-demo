
export default function Footer() {
  return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🤖</span>
                <span className="text-xl font-bold">AI Word Quiz</span>
              </div>
              <p className="text-gray-400">
                AIを使った革新的な語彙学習プラットフォーム
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">プロダクト</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">機能一覧</a></li>
                <li><a href="#" className="hover:text-white transition-colors">料金プラン</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                {/* <li><a href="#" className="hover:text-white transition-colors">ヘルプセンター</a></li> */}
                <li><a href="mailto:yutahamasaki.official@gmail.com" className="hover:text-white transition-colors">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">コミュニティ comming soon..</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">会社情報</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">私たちについて</a></li>
                <li><a href="/legal/privacy" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
                <li><a href="/legal/term-of-use" className="hover:text-white transition-colors">利用規約</a></li>
                <li><a href="/legal" className="hover:text-white transition-colors">特定商取引法に基づく表記</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AI Word Quiz. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}
