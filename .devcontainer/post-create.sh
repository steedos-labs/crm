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
echo "✅ 环境准备完成。"
echo ""
echo "下一步（开两个终端）："
echo "  终端 A: pnpm dev:deps    # 启动嵌入式 MongoDB（副本集）+ Redis，写入 .env.local"
echo "  终端 B: pnpm dev         # 启动 Steedos（自动读取 .env / .env.local，监听元数据热重载）"

