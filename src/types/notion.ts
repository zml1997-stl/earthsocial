// Notion API Type Definitions for EarthSocial

// Base types
export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    id: string;
  };
  last_edited_by: {
    id: string;
  };
}

export interface NotionProperty {
  id: string;
  type: string;
  [key: string]: unknown;
}

// Users Database: username, avatar, bio, joined date, followers count
export interface User {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  joinedDate: string;
  followersCount: number;
  followingCount?: number;
}

export interface UserProperties {
  username: { title: { plain_text: string }[] };
  avatar: { files: { file?: { url: string }; external?: { url: string } }[] };
  bio: { rich_text: { plain_text: string }[] };
  "joined date": { date: { start: string } };
  "followers count": { number: number };
}

// Posts Database: author, content, image, created at, likes count, bookmarks count
export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  createdAt: string;
  likesCount: number;
  bookmarksCount: number;
}

export interface PostProperties {
  author: { relation: { id: string }[] };
  content: { rich_text: { plain_text: string }[] };
  image: { files: { file?: { url: string }; external?: { url: string } }[] };
  "created at": { created_time: string };
  "likes count": { number: number };
  "bookmarks count": { number: number };
}

// Comments Database: author, post (relation), content, created at
export interface Comment {
  id: string;
  author: User;
  post: Post;
  content: string;
  createdAt: string;
}

export interface CommentProperties {
  author: { relation: { id: string }[] };
  post: { relation: { id: string }[] };
  content: { rich_text: { plain_text: string }[] };
  "created at": { created_time: string };
}

// Likes Database: user, post, created at
export interface Like {
  id: string;
  user: User;
  post: Post;
  createdAt: string;
}

export interface LikeProperties {
  user: { relation: { id: string }[] };
  post: { relation: { id: string }[] };
  "created at": { created_time: string };
}

// Following Database: follower, following, created at
export interface Follow {
  id: string;
  follower: User;
  following: User;
  createdAt: string;
}

export interface FollowProperties {
  follower: { relation: { id: string }[] };
  following: { relation: { id: string }[] };
  "created at": { created_time: string };
}

// Database IDs (to be set after creation)
export interface DatabaseIds {
  users: string;
  posts: string;
  comments: string;
  likes: string;
  following: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NotionError {
  message: string;
  code: string;
  status: number;
}
