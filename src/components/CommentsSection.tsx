import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Send } from 'lucide-react'
import { mockComments, currentUser } from '../data/mockData'

interface CommentsSectionProps {
  postId: string
  onCommentCountChange: (count: number) => void
}

export default function CommentsSection({ postId, onCommentCountChange }: CommentsSectionProps) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: `comment-${Date.now()}`,
      author: currentUser,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment('')
    onCommentCountChange(comments.length + 1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="mt-4 pt-4 border-t border-earth-700/50">
      {/* Comments List */}
      <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3"
          >
            <img
              src={comment.author.avatar}
              alt={comment.author.displayName}
              className="w-8 h-8 rounded-full border border-earth-600 shrink-0"
            />
            <div className="flex-1">
              <div className="glass-light rounded-xl px-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-white">{comment.author.displayName}</span>
                  <span className="text-earth-500 text-xs">@{comment.author.username}</span>
                  <span className="text-earth-600 text-xs">· {formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-earth-200 text-sm">{comment.content}</p>
              </div>
              <div className="flex items-center gap-4 mt-1 ml-2">
                <button className="flex items-center gap-1 text-earth-500 hover:text-accent-rose text-xs transition-colors">
                  <Heart className="w-3 h-3" />
                  <span>{comment.likes}</span>
                </button>
                <button className="text-earth-500 hover:text-accent-cyan text-xs transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.displayName}
          className="w-8 h-8 rounded-full border border-earth-600 shrink-0"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-earth-800/50 border border-earth-700 rounded-full py-2 pl-4 pr-12 text-sm text-white placeholder-earth-500 focus:outline-none focus:border-accent-cyan/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-accent-cyan text-earth-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-cyan/80 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
