import { motion } from 'framer-motion'
import { Home, Globe, User, Settings, Plus, LogOut } from 'lucide-react'
import { currentUser } from '../data/mockData'

type Page = 'feed' | 'profile' | 'globe'

interface SidebarProps {
  onCreatePost: () => void
  currentPage: Page
  onPageChange: (page: Page) => void
}

export default function Sidebar({ onCreatePost, currentPage, onPageChange }: SidebarProps) {
  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Feed', page: 'feed' as Page },
    { icon: <Globe className="w-5 h-5" />, label: 'Explore', page: 'globe' as Page },
    { icon: <User className="w-5 h-5" />, label: 'Profile', page: 'profile' as Page },
  ]

  return (
    <aside className="hidden md:block w-64 shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-12 h-12 rounded-full border-2 border-accent-cyan/30"
            />
            <div>
              <h3 className="font-display font-semibold text-white">{currentUser.displayName}</h3>
              <p className="text-earth-400 text-sm">@{currentUser.username}</p>
            </div>
          </div>
          
          <div className="flex justify-between mt-4 pt-4 border-t border-earth-700/50">
            <div className="text-center">
              <p className="font-bold text-white">{currentUser.followers.toLocaleString()}</p>
              <p className="text-earth-400 text-xs">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white">{currentUser.following.toLocaleString()}</p>
              <p className="text-earth-400 text-xs">Following</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white">{currentUser.posts}</p>
              <p className="text-earth-400 text-xs">Posts</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="glass rounded-2xl p-3">
          {navItems.map((item, i) => (
            <motion.button
              key={item.page}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onPageChange(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPage === item.page
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-earth-300 hover:bg-earth-700/50 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Create Post Button */}
        <motion.button
          onClick={onCreatePost}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-cyan to-accent-emerald text-earth-900 font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Create Post
        </motion.button>

        {/* Settings */}
        <motion.button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-earth-400 hover:bg-earth-700/30 hover:text-earth-200 transition-colors"
          whileHover={{ x: 4 }}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </motion.button>
        
        <motion.button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-earth-400 hover:bg-earth-700/30 hover:text-earth-200 transition-colors"
          whileHover={{ x: 4 }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </motion.button>
      </div>
    </aside>
  )
}
