FROM node:24-slim

# 環境変数の設定
ENV NODE_ENV=production

# 作業ディレクトリの設定
WORKDIR /app

# パッケージのインストール
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev

# コードをコピー
COPY job ./job

# Jobを実行
CMD ["node", "job/index.js"]


