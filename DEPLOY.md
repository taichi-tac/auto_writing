# 🚀 デプロイ手順（完全無料）

このアプリを無料でWeb公開する手順を説明します。

## 📋 必要なもの

1. **GitHubアカウント**（既に作成済み）
2. **Vercelアカウント**（フロントエンド用）- 無料
3. **Renderアカウント**（バックエンド用）- 無料
4. **Claude APIキー**（Anthropic Console）
5. **ラッコキーワードAPIキー**（オプション）

---

## 🎯 ステップ1: GitHubにプッシュ

まず、最新のコードをGitHubにプッシュします。

```bash
cd /Users/user/Miyabi/Test/auto_writing
git add .
git commit -m "デプロイ用設定ファイルを追加"
git push origin master
```

---

## 🌐 ステップ2: フロントエンドをVercelにデプロイ

### 2.1 Vercelにログイン

1. [Vercel](https://vercel.com) にアクセス
2. "Sign Up"をクリックしてGitHubアカウントでログイン
3. GitHubとの連携を許可

### 2.2 プロジェクトをインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. GitHubリポジトリ一覧から`auto_writing`を選択
3. 「Import」をクリック

### 2.3 ビルド設定

以下の設定を入力：

- **Framework Preset**: Vite
- **Root Directory**: `frontend`（「Edit」をクリックして設定）
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.4 環境変数の設定

「Environment Variables」セクションで以下を追加：

| Key | Value | 備考 |
|-----|-------|------|
| `VITE_API_URL` | `https://あなたのバックエンドURL.onrender.com` | 後で設定 |

※ バックエンドのURLは次のステップで取得します。一旦空欄でも構いません。

### 2.5 デプロイ

「Deploy」ボタンをクリック。数分で完了します。

✅ デプロイ完了後、`https://あなたのプロジェクト名.vercel.app` のようなURLが発行されます。

---

## 🔧 ステップ3: バックエンドをRenderにデプロイ

### 3.1 Renderにログイン

1. [Render](https://render.com) にアクセス
2. "Get Started"をクリックしてGitHubアカウントでログイン
3. GitHubとの連携を許可

### 3.2 新しいWeb Serviceを作成

1. Renderダッシュボードで「New +」→「Web Service」をクリック
2. GitHubリポジトリ一覧から`auto_writing`を選択
3. 「Connect」をクリック

### 3.3 ビルド設定

以下の設定を入力：

- **Name**: `auto-writing-backend`（任意の名前）
- **Region**: `Oregon (US West)` または `Frankfurt (EU Central)`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: `Free`（無料プラン）

### 3.4 環境変数の設定

「Environment」セクションで「Add Environment Variable」をクリックし、以下を追加：

| Key | Value | 備考 |
|-----|-------|------|
| `NODE_ENV` | `production` | 必須 |
| `PORT` | `3001` | 必須 |
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxx` | Claude APIキー |
| `RAKKO_API_KEY` | `your_rakko_key` | オプション |

⚠️ **重要**: `ANTHROPIC_API_KEY`は必ず設定してください。

### 3.5 デプロイ

「Create Web Service」ボタンをクリック。初回デプロイには5〜10分かかります。

✅ デプロイ完了後、`https://auto-writing-backend.onrender.com` のようなURLが発行されます。

---

## 🔗 ステップ4: フロントエンドとバックエンドを接続

### 4.1 バックエンドのURLをコピー

Renderのダッシュボードから、デプロイ済みバックエンドのURLをコピーします。

例: `https://auto-writing-backend.onrender.com`

### 4.2 Vercelの環境変数を更新

1. Vercelダッシュボードで、デプロイ済みフロントエンドプロジェクトを開く
2. 「Settings」→「Environment Variables」に移動
3. `VITE_API_URL`の値をバックエンドのURLに更新

例: `https://auto-writing-backend.onrender.com`

### 4.3 再デプロイ

1. 「Deployments」タブに移動
2. 最新のデプロイメントの右側「...」メニューから「Redeploy」をクリック

---

## ✅ ステップ5: 動作確認

1. VercelのフロントエンドURL（例: `https://あなたのプロジェクト名.vercel.app`）にアクセス
2. 「⚙️ API設定」ボタンをクリック
3. Claude APIキーを入力して保存
4. キーワードを入力してブログ記事を生成
5. 正常に動作すればデプロイ完了！ 🎉

---

## 📝 注意事項

### Renderの無料プラン制限

- **スリープ**: 15分間アクセスがないとスリープ状態になります
- **起動時間**: スリープ状態から復帰には約30秒かかります
- **月間稼働時間**: 750時間/月（約31日間）

💡 **対策**: 初回アクセス時は少し待つ必要がありますが、その後は通常通り動作します。

### Vercelの無料プラン制限

- **帯域幅**: 100GB/月
- **ビルド時間**: 100時間/月
- **デプロイ数**: 無制限

👍 通常の使用では全く問題ありません。

### APIキーの管理

- **フロントエンド**: ユーザーが各自のAPIキーをブラウザに保存
- **バックエンド**: Renderの環境変数にAPIキーを設定（推奨）

---

## 🎨 カスタムドメイン（オプション）

無料でカスタムドメインを設定できます：

### Vercel

1. お名前.comやムームードメインでドメイン取得（年間数百円〜）
2. Vercelの「Settings」→「Domains」で追加
3. DNSレコードを設定

### Render

1. Renderの「Settings」→「Custom Domain」で追加
2. DNSレコードを設定

---

## 🆘 トラブルシューティング

### フロントエンドが表示されない

- Vercelのビルドログを確認
- `frontend/dist`ディレクトリが生成されているか確認

### バックエンドがエラーを返す

- Renderのログを確認
- 環境変数が正しく設定されているか確認
- `ライティング`フォルダがリポジトリに含まれているか確認

### CORS エラー

バックエンドのCORS設定を確認してください（`backend/src/server.ts`）。

現在の設定で問題なく動作するはずです。

---

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. GitHubリポジトリが最新の状態か
2. Vercelのビルドログ
3. Renderのデプロイログ
4. ブラウザのコンソールエラー

---

## 🎉 完了！

おめでとうございます！あなたのブログ自動生成アプリが世界中に公開されました。

**公開URL**:
- フロントエンド: `https://あなたのプロジェクト名.vercel.app`
- バックエンド: `https://auto-writing-backend.onrender.com`

このURLを友人やSNSでシェアしましょう！ 🚀
