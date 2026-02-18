export default function PostSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="flex-1">
          <div className="h-4 w-32 rounded skeleton mb-2" />
          <div className="h-3 w-24 rounded skeleton" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-3/4 rounded skeleton" />
      </div>

      {/* Image placeholder */}
      <div className="h-64 rounded-xl skeleton mb-4" />

      {/* Actions */}
      <div className="flex justify-between pt-3 border-t border-earth-700/50">
        <div className="flex gap-4">
          <div className="h-8 w-16 rounded skeleton" />
          <div className="h-8 w-16 rounded skeleton" />
        </div>
        <div className="h-8 w-16 rounded skeleton" />
      </div>
    </div>
  )
}
