# 🧠 AI Word Quiz App

AIを活用して外国語の単語を覚えるためのクイズアプリです。  
クイズの生成にはOpenAI APIを使用し、ユーザー認証・単語の保存にはSupabase、決済にはStripeを活用したフルスタックアプリです。

---

## 🚀 Features

- ✨ **AIによるクイズ生成**（OpenAI API）
- 📚 **７ヶ国語対応、レベル選択可能（初級〜上級）**
- ✅ **4択形式のクイズ / 自動的に1問ずつ表示**
- 🔐 **Supabaseによるユーザー認証**
- 📌 **間違えた単語のみSupabaseに保存**
- 💳 **Stripe決済**
- 📱 **レスポンシブデザイン（Tailwind CSS）**

---

## 🛠️ Built With

| 技術         | 説明 |
|--------------|------|
| **Next.js 15 App Router** | フレームワーク |
| **TypeScript** | 言語 |
| **Tailwind CSS** | スタイリング |
| **Supabase** | Auth & DB |
| **OpenAI API** | クイズ自動生成 |
| **Stripe** | 決済 |

---

## ⚙️ Getting Started

### 1. 環境変数を設定

`.env.local` を作成して以下を記述：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
