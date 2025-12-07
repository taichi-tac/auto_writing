# Auto Blog Writer

キーワードを入力するだけで、SEO最適化されたブログ記事を自動生成するWebアプリケーション

## 特徴

- **キーワード入力だけ**で完全自動化
- **7ステップのワークフロー**で高品質な記事を生成
- **ラッコキーワードAPI**で競合分析
- **Claude AI**による自然な文章生成
- **Webインターフェース**で簡単操作

## デモ

![Auto Blog Writer](https://via.placeholder.com/800x400?text=Auto+Blog+Writer+Demo)

## システム構成

```
auto_writing/
├── backend/          # Node.js + Express API
├── frontend/         # React + TypeScript
└── ライティング/      # プロンプトテンプレート
```

## セットアップ

### 必要要件

- Node.js 18以上
- npm または yarn
- ラッコキーワードAPIキー
- Anthropic Claude APIキー

### 1. APIキーの取得

詳細は [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) を参照してください。

**ラッコキーワードAPI:**
- https://related-keywords.com/
- 月額990円〜

**Claude API:**
- https://console.anthropic.com/
- 従量課金（1記事約15〜45円）

### 2. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成：

```bash
cp .env.example .env
```

`.env` ファイルを編集して、APIキーを設定：

```bash
RAKKO_API_KEY=your_rakko_api_key_here
ANTHROPIC_API_KEY=sk-ant-your_api_key_here
PORT=3001
VITE_API_URL=http://localhost:3001
```

### 3. 依存関係のインストール

```bash
# バックエンド
cd backend
npm install

# フロントエンド
cd ../frontend
npm install
```

### 4. アプリケーションの起動

**ターミナル1（バックエンド）:**
```bash
cd backend
npm run dev
```

**ターミナル2（フロントエンド）:**
```bash
cd frontend
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

## 使い方

1. **キーワードを入力**
   - 例: "ダイエット 簡単"

2. **生成ボタンをクリック**
   - AIが自動的に記事を生成します

3. **結果を確認**
   - タイトル案（5つ）
   - リード文
   - 本文
   - まとめ

4. **コピーして使用**
   - "全文コピー"ボタンで記事全体をコピー

## 記事生成の流れ

1. **キーワードリサーチ** - ラッコキーワードで関連キーワード取得
2. **検索意図分析** - 上位記事から検索意図を分析
3. **記事構成作成** - h2/h3の見出し構造を生成
4. **タイトル生成** - SEO最適化されたタイトル案を5つ生成
5. **リード文作成** - 読者を引き込むリード文を作成
6. **本文作成** - 各見出しに対応した本文を生成
7. **まとめ作成** - 記事全体をまとめる

## 技術スタック

### バックエンド
- Node.js
- Express
- TypeScript
- Anthropic Claude API
- ラッコキーワードAPI

### フロントエンド
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

## 開発

### バックエンド

```bash
cd backend
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm start        # 本番起動
```

### フロントエンド

```bash
cd frontend
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm run preview  # プレビュー
```

## API仕様

### POST /api/blog/generate

ブログ記事を生成

**リクエスト:**
```json
{
  "keyword": "ダイエット 簡単",
  "genre": "ダイエット",
  "theme": "おすすめのダイエット方法",
  "authority": "管理栄養士",
  "callToAction": "無料カウンセリングを受ける"
}
```

**レスポンス:**
```json
{
  "keyword": "ダイエット 簡単",
  "searchIntent": {...},
  "structure": [...],
  "title": ["タイトル1", "タイトル2", ...],
  "leadText": "リード文...",
  "body": "本文...",
  "summary": "まとめ...",
  "generatedAt": "2024-01-01T00:00:00.000Z"
}
```

## トラブルシューティング

### APIキーエラー

```
⚠️  RAKKO_API_KEY が設定されていません
```

→ `.env` ファイルにAPIキーを設定してください

### CORS エラー

→ バックエンドとフロントエンドが異なるポートで起動していることを確認

### ラッコキーワードAPI エラー

→ APIキーが正しいか、月間リクエスト上限を超えていないか確認

## ライセンス

MIT

## サポート

質問や問題があれば、Issueを作成してください。

## 今後の予定

- [ ] アイキャッチ画像の自動生成
- [ ] WordPressへの自動投稿
- [ ] SEOスコア分析
- [ ] 複数記事の一括生成
- [ ] 記事の保存・編集機能
