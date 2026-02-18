// Notion API Service - Simplified for prototype
// Uses mock data for now, Notion integration can be enabled later

import type { User, Post, Comment } from '../types';

const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'earthexplorer',
    displayName: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Exploring our beautiful planet 🌍',
    followers: 12400,
    following: 342,
    posts: 156,
    verified: true,
  },
  {
    id: '2',
    username: 'spacelover',
    displayName: 'Maya Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
    bio: 'Dreaming of the stars ✨',
    followers: 8900,
    following: 567,
    posts: 89,
    verified: true,
  },
  {
    id: '3',
    username: 'naturewalker',
    displayName: 'Jordan Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
    bio: 'Conservationist & photographer 📸',
    followers: 5600,
    following: 234,
    posts: 203,
    verified: false,
  },
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: MOCK_USERS[0],
    content: 'Just witnessed the most incredible sunset over the Pacific. Sometimes you just need to pause and appreciate the beauty of our planet. 🌅',
    image: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800',
    likes: 1234,
    comments: 89,
    bookmarks: 234,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    liked: false,
    bookmarked: false,
  },
  {
    id: '2',
    author: MOCK_USERS[1],
    content: 'Did you know that the Amazon rainforest produces 20% of the world\'s oxygen? Protecting it is protecting all of us. #ClimateAction #Amazon',
    likes: 2567,
    comments: 145,
    bookmarks: 456,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    liked: true,
    bookmarked: false,
  },
  {
    id: '3',
    author: MOCK_USERS[2],
    content: 'Spent the morning tracking a family of elephants in the savanna. These creatures amaze me every single time. 🐘',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800',
    likes: 3456,
    comments: 234,
    bookmarks: 567,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    liked: false,
    bookmarked: true,
  },
  {
    id: '4',
    author: MOCK_USERS[0],
    content: 'The Northern Lights are on my bucket list! Anyone else seen them in person? 🌌',
    likes: 987,
    comments: 167,
    bookmarks: 123,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    liked: false,
    bookmarked: false,
  },
];

const MOCK_COMMENTS: Record<string, Comment[]> = {
  '1': [
    { id: 'c1', author: MOCK_USERS[1], content: 'Absolutely stunning! 😍', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), likes: 23 },
    { id: 'c2', author: MOCK_USERS[2], content: 'Nature at its finest', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), likes: 12 },
  ],
  '2': [
    { id: 'c3', author: MOCK_USERS[0], content: 'So important! Thank you for sharing 🙏', createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), likes: 45 },
  ],
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const notionService = {
  // Users
  async getUser(_id: string): Promise<User> {
    await delay(300);
    return MOCK_USERS[0];
  },

  async getCurrentUser(): Promise<User> {
    await delay(300);
    return MOCK_USERS[0];
  },

  // Posts
  async getFeed(_options?: { limit?: number }): Promise<Post[]> {
    await delay(500);
    return MOCK_POSTS;
  },

  async getPost(id: string): Promise<Post | null> {
    await delay(300);
    return MOCK_POSTS.find(p => p.id === id) || null;
  },

  async createPost(content: string, image?: string): Promise<Post> {
    await delay(500);
    const newPost: Post = {
      id: String(Date.now()),
      author: MOCK_USERS[0],
      content,
      image,
      likes: 0,
      comments: 0,
      bookmarks: 0,
      createdAt: new Date().toISOString(),
      liked: false,
      bookmarked: false,
    };
    MOCK_POSTS.unshift(newPost);
    return newPost;
  },

  async likePost(id: string): Promise<void> {
    await delay(200);
    const post = MOCK_POSTS.find(p => p.id === id);
    if (post) {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
    }
  },

  async bookmarkPost(id: string): Promise<void> {
    await delay(200);
    const post = MOCK_POSTS.find(p => p.id === id);
    if (post) {
      post.bookmarked = !post.bookmarked;
      post.bookmarks += post.bookmarked ? 1 : -1;
    }
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    await delay(300);
    return MOCK_COMMENTS[postId] || [];
  },

  async createComment(postId: string, content: string): Promise<Comment> {
    await delay(400);
    const newComment: Comment = {
      id: String(Date.now()),
      author: MOCK_USERS[0],
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    if (!MOCK_COMMENTS[postId]) {
      MOCK_COMMENTS[postId] = [];
    }
    MOCK_COMMENTS[postId].push(newComment);
    return newComment;
  },
};
