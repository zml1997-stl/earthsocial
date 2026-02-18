import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Link as LinkIcon, Edit3, Settings, Image, Video, Smile } from 'lucide-react'
import { currentUser, mockPosts } from '../data/mockData'
import Feed from './Feed'

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts')

  const userPosts = mockPosts.filter(post => post.author.id === currentUser.id)

  return (
    <div>
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl overflow-hidden mb-6"
      >
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-accent-cyan/20 via-accent-emerald/20 to-accent-violet/20 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80')] bg-cover bg-center opacity-30" />
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 relative">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-24 h-24 rounded-full border-4 border-earth-800"
              />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-accent-emerald rounded-full border-2 border-earth-800" />
            </motion.div>

            {/* Name & Handle */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-white">{currentUser.displayName}</h1>
                {currentUser.verified && (
                  <svg className="w-5 h-5 text-accent-cyan" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className="text-earth-400">@{currentUser.username}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-full font-medium hover:bg-accent-cyan/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </motion.button>
              <motion.button
                className="p-2 text-earth-400 hover:text-white hover:bg-earth-700/50 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 text-earth-200">{currentUser.bio}</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2 text-earth-400">
              <MapPin className="w-4 h-4" />
              <span>St. Louis, MO</span>
            </div>
            <div className="flex items-center gap-2 text-earth-400">
              <LinkIcon className="w-4 h-4" />
              <a href="#" className="text-accent-cyan hover:underline">earthsocial.com</a>
            </div>
            <div className="flex items-center gap-2 text-earth-400">
              <Calendar className="w-4 h-4" />
              <span>Joined January 2024</span>
            </div>
          </div>

          {/* Followers */}
          <div className="flex gap-6 mt-4">
            <button className="hover:text-accent-cyan transition-colors">
              <span className="font-bold text-white">{currentUser.followers.toLocaleString()}</span>
              <span className="text-earth-400 ml-1">Followers</span>
            </button>
            <button className="hover:text-accent-cyan transition-colors">
              <span className="font-bold text-white">{currentUser.following.toLocaleString()}</span>
              <span className="text-earth-400 ml-1">Following</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-earth-800/50 p-1 rounded-xl">
        {(['posts', 'media', 'likes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-accent-cyan/20 text-accent-cyan'
                : 'text-earth-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.displayName}
                    className="w-10 h-10 rounded-full border-2 border-earth-600"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{post.author.displayName}</h3>
                    <p className="text-earth-400 text-sm">@{post.author.username}</p>
                  </div>
                </div>
                <p className="text-earth-100 mb-4">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post media"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}
              </motion.div>
            ))
          ) : (
            <EmptyState type="posts" />
          )}
        </div>
      )}

      {activeTab === 'media' && (
        <div className="grid grid-cols-3 gap-2">
          {mockPosts.filter(p => p.image).slice(0, 9).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img src={post.image} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'likes' && (
        <EmptyState type="likes" />
      )}
    </div>
  )
}

function EmptyState({ type }: { type: 'posts' | 'likes' }) {
  return (
    <div className="glass rounded-2xl p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-earth-700/50 flex items-center justify-center">
        {type === 'posts' ? (
          <Image className="w-8 h-8 text-earth-400" />
        ) : (
          <Smile className="w-8 h-8 text-earth-400" />
        )}
      </div>
      <h3 className="font-display font-semibold text-lg text-white mb-2">
        {type === 'posts' ? "No posts yet" : "No likes yet"}
      </h3>
      <p className="text-earth-400">
        {type === 'posts' 
          ? "Share your first post with the world!" 
          : "Posts you like will appear here"}
      </p>
    </div>
  )
}
