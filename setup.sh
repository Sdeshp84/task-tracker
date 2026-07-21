#!/bin/bash

# Task Tracker - Cloudflare Setup Script
# This script helps you set up the serverless deployment

echo "🚀 Task Tracker - Cloudflare Serverless Setup"
echo "=============================================="
echo ""

# Step 1: Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
else
    echo "✅ Wrangler already installed"
fi

echo ""
echo "Step 1️⃣ : Authenticate with Cloudflare"
echo "Run: wrangler login"
echo ""

echo "Step 2️⃣ : Create D1 Database"
echo "Run: wrangler d1 create task-tracker"
echo "Then copy the database_id and update wrangler.toml"
echo ""

echo "Step 3️⃣ : Get your Account ID"
echo "Go to Cloudflare Dashboard → Copy Account ID"
echo "Update wrangler.toml with account_id"
echo ""

echo "Step 4️⃣ : Initialize Database Schema"
echo "Run: wrangler d1 execute task-tracker --file schema.sql"
echo ""

echo "Step 5️⃣ : Deploy to Cloudflare"
echo "Run: npm run deploy:all"
echo ""

echo "📝 Next Steps:"
echo "1. Edit wrangler.toml with your account_id and database_id"
echo "2. Run the commands above in order"
echo "3. Your app will be live at: https://task-tracker.pages.dev"
echo ""
