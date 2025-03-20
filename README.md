# Image Generator

Gemini APIを使用して画像を生成するWebアプリケーションです。

## 機能

- 画像のアップロード
- プロンプトの入力
- 画像サイズの選択
- APIキーの暗号化保存

## 開発環境のセットアップ

1. リポジトリをクローン

```bash
git clone [repository-url]
cd ImageGenerator
```

2. 依存関係のインストール

```bash
npm install
```

3. 環境変数の設定
`.env`ファイルをプロジェクトのルートディレクトリに作成し、以下の環境変数を設定してください：

```bash
# Gemini APIキー（オプション - 環境変数を設定しない場合、UIから入力可能）
VITE_GEMINI_API_KEY=your-api-key-here

# 暗号化用のソルト値（必須）
# 以下のコマンドで生成できます：
# node -e "console.log(crypto.randomBytes(16).toString('hex'))"
VITE_CRYPTO_SALT=your-random-salt-here
```

⚠️ **重要: セキュリティに関する注意**

- `.env`ファイルは決してGitにコミットしないでください
- 本番環境では必ず異なるSALT値を使用してください
- SALT値は安全な方法で保管・共有してください

4. 開発サーバーの起動

```bash
npm run dev
```

## 技術スタック

- React + TypeScript
- Vite
- Shadcn UI
- TailwindCSS
- Web Crypto API
- Google Gemini API

## セキュリティ機能

- APIキーの暗号化保存（AES-GCM）
- PBKDF2を使用したキー導出
- ドメインベースの暗号化（オリジン単位での暗号化）
- 環境変数による機密情報の管理