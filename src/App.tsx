import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Users, MessageCircle, Share2, Heart, Zap, Map, TrendingUp, Bell, Settings, Search, Menu, X, Image, Smile } from 'lucide-react'

// Sample data
const SAMPLE_USERS = [
  { id: 1, name: 'Sarah Chen', handle: '@sarahc', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', bio: 'Climate scientist | Earth enthusiast' },
  { id: 2, name: 'Marcus Johnson', handle: '@marcusj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', bio: 'Environmental activist' },
  { id: 3, name: 'Elena Rodriguez', handle: '@elena_r', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', bio: 'Sustainability advocate' },
  { id: 4, name: 'James Park', handle: '@jamesp', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', bio: 'Tech & nature photographer' },
]

const SAMPLE_POSTS = [
  { id: 1, user: SAMPLE_USERS[0], content: 'Just discovered an amazing sustainable farming initiative in rural Oregon! 🌱 They\'re using regenerative agriculture to restore soil health while producing incredible yields. This is the future of food.', time: '2h', likes: 234, comments: 45, shares: 12, image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800' },
  { id: 2, user: SAMPLE_USERS[1], content: 'Today marks 5 years since we started our ocean cleanup project. We\'ve removed over 50 tons of plastic from coastal areas! Thank you to everyone who\'s supported us. The journey continues 💙', time: '4h', likes: 892, comments: 156, shares: 78, image: null },
  { id: 3, user: SAMPLE_USERS[2], content: 'Exciting news! Our community solar program just got approved. Over 500 households will now have access to clean, affordable energy. Small steps lead to big changes 🌍', time: '6h', likes: 567, comments: 89, shares: 34, image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800' },
  { id: 4, user: SAMPLE_USERS[3], content: 'Caught this incredible sunrise over the mountains this morning. Nature never fails to remind us why we fight to protect our planet. Morning light through the peaks 🌄', time: '8h', likes: 1203, comments: 67, shares: 89, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
]

function App() {
  const [activeTab, setActiveTab] = useState('feed')
  const [showGlobe, setShowGlobe] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowGlobe(!showGlobe)}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Globe className="w-5 h-5 text-white" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">EarthSocial</h1>
                <p className="text-xs text-emerald-400/70">Connect globally</p>
              </div>
            </div>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search posts, people, topics..." 
                  className="w-full bg-slate-800/50 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 border border-white/5 focus:outline-none focus:border-emerald-500/30"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="hidden sm:flex w-10 h-10 rounded-full bg-slate-800/50 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="hidden sm:flex w-10 h-10 rounded-full bg-slate-800/50 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 p-0.5">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser" 
                  alt="Profile" 
                  className="w-full h-full rounded-full bg-slate-900"
                />
              </div>
              <button 
                className="md:hidden w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 pb-4"
              >
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-slate-800/50 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 border border-white/5 focus:outline-none focus:border-emerald-500/30"
                  />
                </div>
                <nav className="flex gap-2 overflow-x-auto pb-2">
                  {[
                    { id: 'feed', icon: Users, label: 'Feed' },
                    { id: 'explore', icon: Zap, label: 'Explore' },
                    { id: 'globe', icon: Globe, label: 'Globe' },
                    { id: 'trending', icon: TrendingUp, label: 'Trending' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setShowGlobe(item.id === 'globe'); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        activeTab === item.id
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800/50 text-slate-400 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1 mt-4">
            {[
              { id: 'feed', icon: Users, label: 'Feed' },
              { id: 'explore', icon: Zap, label: 'Explore' },
              { id: 'globe', icon: Globe, label: 'Globe' },
              { id: 'trending', icon: TrendingUp, label: 'Trending' },
              { id: 'map', icon: Map, label: 'Map' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setShowGlobe(item.id === 'globe'); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-8 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Desktop */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 space-y-4">
                {/* Profile Card */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser" 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-white">You</h3>
                      <p className="text-sm text-slate-400">@currentuser</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-center">
                    <div>
                      <p className="font-bold text-white">1.2K</p>
                      <p className="text-xs text-slate-400">Following</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">8.5K</p>
                      <p className="text-xs text-slate-400">Followers</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">342</p>
                      <p className="text-xs text-slate-400">Posts</p>
                    </div>
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                  <h3 className="font-semibold text-white mb-3">Trending Topics</h3>
                  <div className="space-y-3">
                    {['#ClimateAction', '#OceanCleanup', '#RenewableEnergy', '#SustainableLiving'].map((tag) => (
                      <div key={tag} className="flex items-center justify-between">
                        <span className="text-emerald-400 text-sm">{tag}</span>
                        <span className="text-xs text-slate-500">+12%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Feed */}
            <div className="lg:col-span-6">
              <AnimatePresence mode="wait">
                {showGlobe ? (
                  <motion.div
                    key="globe"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden"
                  >
                    {/* Globe View - Simplified for production */}
                    <div className="relative aspect-square max-h-[500px] bg-gradient-to-br from-emerald-900 to-cyan-900 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-64 h-64">
                          {/* Simplified animated globe */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 animate-pulse" />
                          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 animate-pulse delay-75" />
                          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-emerald-600/40 to-cyan-600/40 flex items-center justify-center">
                            <Globe className="w-16 h-16 text-emerald-300" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <h3 className="font-semibold text-white mb-2">Live Earth View</h3>
                          <p className="text-sm text-slate-300">Connect with people around the world. View live activity across the globe.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="feed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Post Composer */}
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                      <div className="flex gap-3">
                        <img 
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser" 
                          alt="Your avatar" 
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="What's happening on our planet?"
                            className="w-full bg-transparent text-white placeholder-slate-400 resize-none border-none focus:outline-none min-h-[80px]"
                          />
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                            <div className="flex gap-2">
                              <button className="p-2 rounded-full hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                                <Image className="w-5 h-5" />
                              </button>
                              <button className="p-2 rounded-full hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                                <Map className="w-5 h-5" />
                              </button>
                              <button className="p-2 rounded-full hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                                <Smile className="w-5 h-5" />
                              </button>
                            </div>
                            <button 
                              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full font-medium text-sm text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                              disabled={!postContent.trim()}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Posts */}
                    {SAMPLE_POSTS.map((post, index) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex gap-3">
                          <img 
                            src={post.user.avatar} 
                            alt={post.user.name}
                            className="w-10 h-10 rounded-full bg-slate-700"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white">{post.user.name}</span>
                              <span className="text-slate-400 text-sm">{post.user.handle}</span>
                              <span className="text-slate-500">·</span>
                              <span className="text-slate-500 text-sm">{post.time}</span>
                            </div>
                            <p className="text-white/90 mb-3">{post.content}</p>
                            {post.image && (
                              <div className="mb-3 rounded-xl overflow-hidden">
                                <img src={post.image} alt="Post media" className="w-full h-48 object-cover" />
                              </div>
                            )}
                            <div className="flex items-center gap-6">
                              <button className="flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors group">
                                <div className="p-2 rounded-full group-hover:bg-pink-400/10">
                                  <Heart className="w-4 h-4" />
                                </div>
                                <span className="text-sm">{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors group">
                                <div className="p-2 rounded-full group-hover:bg-emerald-400/10">
                                  <MessageCircle className="w-4 h-4" />
                                </div>
                                <span className="text-sm">{post.comments}</span>
                              </button>
                              <button className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group">
                                <div className="p-2 rounded-full group-hover:bg-cyan-400/10">
                                  <Share2 className="w-4 h-4" />
                                </div>
                                <span className="text-sm">{post.shares}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Sidebar - Desktop */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 space-y-4">
                {/* Who to Follow */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                  <h3 className="font-semibold text-white mb-3">Who to Follow</h3>
                  <div className="space-y-3">
                    {SAMPLE_USERS.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full bg-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm truncate">{user.name}</p>
                          <p className="text-xs text-slate-400 truncate">{user.handle}</p>
                        </div>
                        <button className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                  <h3 className="font-semibold text-white mb-3">Earth Impact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Active Users</span>
                      <span className="text-emerald-400 font-semibold">2.4M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Posts Today</span>
                      <span className="text-emerald-400 font-semibold">45.2K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Countries</span>
                      <span className="text-emerald-400 font-semibold">192</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-xs text-slate-500 px-2">
                  <p>© 2026 EarthSocial</p>
                  <p className="mt-1">Connecting our global community</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
