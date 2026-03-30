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

# 4. Verify System Health explicitly before declaring Deployment Victory
echo "-> Verifying System Health..."
sleep 3

# curl -f rigidly fails the script if the HTTP response isn't a 200 OK!
curl -f -s http://localhost:3000/health > /dev/null
if [ $? -eq 0 ]; then
  echo "================================================"
  echo "✅ Deployment Successful! System is LIVE and HEALTHY."
  echo "================================================"
else
  echo "================================================"
  echo "❌ Deployment FAILED! Health Check returned a degraded or offline state."
  echo "================================================"
  exit 1
fi
