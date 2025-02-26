import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, Lock, Zap } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold">Axiom Chat</span>
            </div>
            <Link
              to="/chat"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Open Chat
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Chat with Multiple AI Models
              <span className="block text-blue-500 mt-2">All in One Place</span>
            </h1>
            <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
              Experience seamless conversations with leading AI models like GPT-4, Claude, and Gemini Pro.
              All data stays local, giving you complete privacy and control.
            </p>
            <div className="mt-10">
              <Link
                to="/chat"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center transition-colors"
              >
                Start Chatting
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400">
                Get instant responses from multiple AI models without switching between different apps.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Private</h3>
              <p className="text-gray-400">
                All your conversations are stored locally. Your data never leaves your device.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Models</h3>
              <p className="text-gray-400">
                Choose from various AI models to get the best responses for your specific needs.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}