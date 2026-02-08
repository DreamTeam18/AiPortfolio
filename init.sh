#!/bin/bash

# AI Portfolio - Development Environment Setup Script
# This script sets up and runs the development environment for Siddhant Saxena's AI Portfolio

set -e  # Exit on error

echo "======================================"
echo "   AI Portfolio - Environment Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "======================================"
echo "   Starting Development Server"
echo "======================================"
echo ""

# Start Vite dev server
echo "🚀 Starting Vite development server..."
echo ""
echo "Frontend will be available at:"
echo "   http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
