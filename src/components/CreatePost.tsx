import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Image, Video, Smile, MapPin, Send, Loader2 } from 'lucide-react'
import { currentUser } from '../data/mockData'

interface CreatePostProps {
  onClose: () => void
}

export default function CreatePost({ onClose }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsPosting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In production, this would send to Notion
      console.log('Post created:', { content, image })
      
      onClose()
    } catch (err) {
      setError('Failed to create post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  const handleImageUpload = () => {
    // In production, this would open file picker
    setImage('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xl glass rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-earth-700/50">
          <button
            onClick={onClose}
            className="p-2 text-earth-400 hover:text-white hover:bg-earth-700/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-white">Create Post</span>
          <div className="w-9" />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-10 h-10 rounded-full border-2 border-earth-600 shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening on our planet?"
                className="w-full bg-transparent text-white text-lg placeholder-earth-500 resize-none focus:outline-none min-h-[120px]"
                autoFocus
              />

              {/* Image Preview */}
              {image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative mt-3 rounded-xl overflow-hidden"
                >
                  <img
                    src={image}
                    alt="Upload preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 p-1 bg-earth-900/80 rounded-full text-white hover:bg-earth-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-accent-rose text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}

              {/* Preview Label */}
              <div className="flex items-center gap-2 mt-3 text-accent-cyan text-sm">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                Posting to EarthSocial (Notion sync coming soon)
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-earth-700/50">
            <div className="flex items-center gap-1">
              <ToolbarButton icon={<Image className="w-5 h-5" />} onClick={handleImageUpload} />
              <ToolbarButton icon={<Video className="w-5 h-5" />} />
              <ToolbarButton icon={<Smile className="w-5 h-5" />} />
              <ToolbarButton icon={<MapPin className="w-5 h-5" />} />
            </div>

            <motion.button
              type="submit"
              disabled={!content.trim() || isPosting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-cyan to-accent-emerald text-earth-900 font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isPosting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function ToolbarButton({ icon, onClick }: { icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2.5 text-accent-cyan hover:bg-accent-cyan/10 rounded-full transition-colors"
    >
      {icon}
    </button>
  )
}
