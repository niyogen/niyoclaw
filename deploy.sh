#!/bin/bash
clear
echo "================================================"
echo "🚀 Starting OpenClaw Multi-Tenant Deployment..."
echo "================================================"

# 1. Pull latest verified Vibe Coding architecture from GitHub
echo "-> Pulling from GitHub main branch..."
git pull origin main

# 2. Build the TypeScript Server
echo "-> Installing dependencies & Compiling TypeScript..."
cd openclaw-multi-tenant-plugin
npm install
npx tsc

# 3. Restart the background process securely via PM2
echo "-> Restarting WhatsApp Webhook listener on standard Port 3000..."
pm2 restart openclaw-webhook || pm2 start src/server.js --name "openclaw-webhook"

echo "================================================"
echo "✅ Deployment Successful! System is LIVE."
echo "================================================"
