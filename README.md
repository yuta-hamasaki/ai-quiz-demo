# 🧠 AIWordQuiz - 購読型ライティング・単語学習アプリ
> Next.js / OpenAI (GPT-4) / Supabase を活用し、ユーザーの習熟度と選択テーマに基づいたカスタム学習体験を提供するSaaS型語学学習プラットフォームです。

---
### 主な機能
1.  **AI添削:** ユーザーの作文をリアルタイムで添削し、文法修正点とスタイル提案をJSON形式で提供。
2.  **レベル別課題:** 選択した言語・レベルに基づいた課題（単語クイズまたは作文プロンプト）を生成・提供。
3.  **ユーザー管理:** Supabaseを利用した認証、ユーザープロファイル管理、および有料購読のステータス管理。
- 📚 **７ヶ国語対応、レベル選択可能（初級〜上級）**
- ✅ **4択形式のクイズ / 自動的に1問ずつ表示**
- 🔐 **Supabaseによるユーザー認証**
- 📌 **間違えた単語のみSupabaseに保存**
- 💳 **Stripe決済**
- 📱 **レスポンシブデザイン（Tailwind CSS）**

---

## 🛠️ 技術スタック

| カテゴリ | 技術 | 採用理由 |
| :--- | :--- | :--- |
| **フロントエンド** | Next.js (App Router) | Backendも同じコードベースで開発できるため|
| **スタイル** | Tailwind CSS | 迅速なUI構築、モバイルファーストなレスポンシブデザインの実装。 |
| **バックエンド** | Next.js API Routes | フロントエンドと同じTypeScript/JavaScript環境で、外部サービスとのセキュアな連携を実現。 |
| **データベース & Auth** | Supabase (PostgreSQL) | 認証 (Auth) とデータベースを統合。認証チェックやユーザーの購読ステータス管理を効率化。 |
| **AI** | OpenAI API (GPT-4/GPT-4o) | 言語添削と、クイズの生成に利用。 |
<!-- | **テスト** | Jest / React Testing Library | カスタムフックのロジック（データ取得、状態遷移）を分離テストし、堅牢性を確保。 | -->

---

## ⚙️ Getting Started

### 1. 環境変数を設定

`.env.local` を作成して以下を記述：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
