#!/usr/bin/env bash
set -euo pipefail

# 启用 pnpm
corepack enable
corepack prepare pnpm@9.15.0 --activate

# 准备 .env
if [ ! -f .env ]; then
  cp .env.example .env
fi

# 安装依赖（postinstall 会顺带下载 mongo / redis 二进制）
pnpm install --frozen-lockfile || pnpm install

echo ""
echo "✅ 环境准备完成。运行 'pnpm dev' 一键启动 Steedos（内嵌 MongoDB + Redis）。"

