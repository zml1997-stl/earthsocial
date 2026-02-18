import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react'
import { mockPosts, currentUser } from '../data/mockData'
import { Post } from '../types'
import PostSkeleton from './PostSkeleton'
import CommentsSection from './CommentsSection'

export default function Feed() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      return mockPosts
    },
  })

  return (
    <div className="space-y-4">
      {/* Feed Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Feed</h1>
          <p className="text-earth-400">Posts from people you follow</p>
        </div>
        <div className="flex gap-2">
          {['Latest', 'Trending', 'Following'].map((filter, i) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === 0
                  ? 'bg-accent-cyan/20 text-accent-cyan'
                  : 'text-earth-400 hover:text-white hover:bg-earth-700/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Posts */}
      <AnimatePresence>
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          posts?.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))
        )}
      </AnimatePresence>
    </div>
  )
}

interface PostCardProps {
  post: Post
  index: number
}

function PostCard({ post, index }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked)
  const [bookmarked, setBookmarked] = useState(post.bookmarked)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post.comments)

  const handleLike = () => {
    setLiked(!liked)
    setLikesCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-2xl p-5 hover:border-earth-600/50 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.displayName}
            className="w-10 h-10 rounded-full border-2 border-earth-600"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{post.author.displayName}</h3>
              {post.author.verified && (
                <VerifiedBadge />
              )}
            </div>
            <p className="text-earth-400 text-sm">@{post.author.username} · {formatDate(post.createdAt)}</p>
          </div>
        </div>
        <button className="text-earth-400 hover:text-white p-2 rounded-lg hover:bg-earth-700/50 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <p className="text-earth-100 mb-4 leading-relaxed">{post.content}</p>

      {/* Image */}
      {post.image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 rounded-xl overflow-hidden"
        >
          <img
            src={post.image}
            alt="Post media"
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-earth-700/50">
        <div className="flex items-center gap-1">
          <ActionButton
            icon={<Heart className={`w-5 h-5 ${liked ? 'fill-accent-rose text-accent-rose' : ''}`} />}
            count={likesCount}
            active={liked}
            onClick={handleLike}
            activeColor="text-accent-rose"
          />
          <ActionButton
            icon={<MessageCircle className="w-5 h-5" />}
            count={commentsCount}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        <div className="flex items-center gap-1">
          <ActionButton
            icon={<Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-accent-amber text-accent-amber' : ''}`} />}
            active={bookmarked}
            onClick={handleBookmark}
            activeColor="text-accent-amber"
          />
          <ActionButton
            icon={<Share2 className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <CommentsSection 
              postId={post.id} 
              onCommentCountChange={setCommentsCount}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function VerifiedBadge() {
  return (
    <svg className="w-4 h-4 text-accent-cyan" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

interface ActionButtonProps {
  icon: React.ReactNode
  count?: number
  active?: boolean
  onClick?: () => void
  activeColor?: string
}

function ActionButton({ icon, count, active, onClick, activeColor }: ActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        active 
          ? activeColor || 'text-accent-cyan' 
          : 'text-earth-400 hover:text-white hover:bg-earth-700/50'
      }`}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
      {count !== undefined && (
        <span className="text-sm">{count.toLocaleString()}</span>
      )}
    </motion.button>
  )
}
