import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Users, MessageCircle, Share2, Heart, Zap } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('feed')

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              EarthSocial
            </h1>
          </div>
          <nav className="flex gap-2">
            {[
              { id: 'feed', icon: Users, label: 'Feed' },
              { id: 'explore', icon: Zap, label: 'Explore' },
              { id: 'messages', icon: MessageCircle, label: 'Messages' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-2 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">
              Welcome to <span className="text-emerald-400">EarthSocial</span>
            </h2>
            <p className="text-white/70 text-lg">
              Connect with others through our shared planet
            </p>
          </motion.div>

          {/* Post Composer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10"
          >
            <textarea
              placeholder="What's on your mind?"
              className="w-full bg-white/5 rounded-xl p-4 text-white placeholder-white/40 resize-none border border-white/10 focus:outline-none focus:border-emerald-500/50"
              rows={3}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                  <Globe className="w-5 h-5" />
                </button>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Post
              </button>
            </div>
          </motion.div>

          {/* Sample Posts */}
          <AnimatePresence>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                  <div>
                    <div className="font-medium">User {i}</div>
                    <div className="text-white/40 text-sm">2 hours ago</div>
                  </div>
                </div>
                <p className="text-white/80 mb-4">
                  This is a sample post #{i} for the EarthSocial platform. 
                  Welcome to the future of social media!
                </p>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-white/60 hover:text-pink-400 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>{i * 12}</span>
                  </button>
                  <button className="flex items-center gap-2 text-white/60 hover:text-emerald-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{i * 5}</span>
                  </button>
                  <button className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default App
