import React from 'react';
import { Sparkles, MessageCircle, Heart, Share2, TrendingUp } from 'lucide-react';

export default function Feed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading with sparkle animation */}
          <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              COMING SOON
            </span>
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Main title */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-fade-in">
            The Feed is
            <br />
            On Its Way
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get ready to share your thoughts, connect with your community, and experience social networking like never before.
          </p>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Post Anything</h3>
              <p className="text-gray-400 text-sm">Share your thoughts, ideas, and moments with the community</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Engage & React</h3>
              <p className="text-gray-400 text-sm">Like, comment, and interact with posts from your peers</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-pink-400/50 transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Trending Topics</h3>
              <p className="text-gray-400 text-sm">Stay updated with what's hot in your community</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-16 flex items-center justify-center gap-2 text-gray-400">
            <Share2 className="h-4 w-4" />
            <p className="text-sm">Launching soon — Stay connected</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}