export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  followers: number
  following: number
  posts: number
  verified: boolean
}

export interface Post {
  id: string
  author: User
  content: string
  image?: string
  likes: number
  comments: number
  bookmarks: number
  createdAt: string
  liked: boolean
  bookmarked: boolean
}

export interface Comment {
  id: string
  author: User
  content: string
  createdAt: string
  likes: number
}
