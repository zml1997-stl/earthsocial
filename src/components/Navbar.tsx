import { motion } from 'framer-motion'
import { Globe, Home, User, Search, Bell, Menu } from 'lucide-react'
import { currentUser } from '../data/mockData'

type Page = 'feed' | 'profile' | 'globe'

interface NavbarProps {
  onPageChange: (page: Page) => void
  currentPage: Page
}

export default function Navbar({ onPageChange, currentPage }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-earth-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            onClick={() => onPageChange('globe')}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-emerald flex items-center justify-center">
                <Globe className="w-5 h-5 text-earth-900" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-emerald blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="font-display font-bold text-xl text-white">EarthSocial</span>
          </motion.button>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
              <input
                type="text"
                placeholder="Search posts, people, topics..."
                className="w-full bg-earth-800/50 border border-earth-700 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-earth-400 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-all"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-2">
            <NavIcon 
              icon={<Home className="w-5 h-5" />} 
              active={currentPage === 'feed'}
              onClick={() => onPageChange('feed')}
              label="Home"
            />
            <NavIcon 
              icon={<Globe className="w-5 h-5" />} 
              active={currentPage === 'globe'}
              onClick={() => onPageChange('globe')}
              label="Explore"
            />
            <NavIcon 
              icon={<Bell className="w-5 h-5" />} 
              label="Notifications"
              badge
            />
            
            <div className="w-px h-6 bg-earth-700 mx-2" />
            
            {/* User Avatar */}
            <motion.button
              onClick={() => onPageChange('profile')}
              className={`flex items-center gap-2 p-1 rounded-full transition-colors ${
                currentPage === 'profile' 
                  ? 'bg-accent-cyan/20 ring-2 ring-accent-cyan/50' 
                  : 'hover:bg-earth-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-8 h-8 rounded-full border-2 border-earth-600"
              />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}

interface NavIconProps {
  icon: React.ReactNode
  active?: boolean
  onClick?: () => void
  label: string
  badge?: boolean
}

function NavIcon({ icon, active, onClick, label, badge }: NavIconProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative p-3 rounded-xl transition-colors ${
        active
          ? 'text-accent-cyan bg-accent-cyan/10'
          : 'text-earth-300 hover:text-white hover:bg-earth-700/50'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      {icon}
      {badge && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-accent-rose rounded-full animate-pulse" />
      )}
    </motion.button>
  )
}
