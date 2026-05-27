<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Project Overview

- TypeScript + Next.js のWebアプリケーション
- バックエンド: Golang + Gin
- バックエンドリポジトリ： https://github.com/umedanaoyuki/golang_twitter
- データベース: PostgreSQL

- Next.jsのAppRouter使用
- server actionsや API routeをBFFとして使用して バックエンドのAPIを叩いている
  client componentの場合→ server actions（post/delete/put） or API routeを使用(get)
  server component の場合→ server actions（post/delete/put） or 直接 gin のAPIを叩く(get)

## Commands

- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Lint: `npm run lint`
- Build for production: `npm run build`

## Code Style

- ファイル名: kebab-case (`user-profile.tsx`)

## Testing

## Git

- コミットメッセージ: Conventional Commits 準拠
  - `feat:`, `fix:`, `docs:`, `refactor:`, `modify:`,
- ブランチ名: `feature/xxx`, `fix/xxx`
- PRを新規作成する場合は許可を取る

## Boundaries

- `.env*` ファイルを変更・コミットしない
- 本番環境の設定ファイルを変更する場合は必ず確認を求める

<!-- END:nextjs-agent-rules -->
