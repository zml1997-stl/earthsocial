/**
 * Notion API Service for EarthSocial
 * 
 * This module provides a TypeScript interface to Notion databases for the EarthSocial
 * social media platform. It handles CRUD operations, pagination, and rate limiting.
 * 
 * NOTE: For GitHub Pages static deployment, API calls are made client-side.
 * This is prototype-only. Production would need a Vercel/Cloudflare proxy to:
 * - Hide the Notion API key
 * - Handle CORS
 * - Cache responses
 * - Manage rate limits server-side
 * 
 * Usage with proxy:
 *   const PROXY_URL = 'https://your-proxy.vercel.app/api/notion';
 *   const notion = new NotionService(PROXY_URL);
 * 
 * Direct usage (not recommended for production):
 *   const notion = new NotionService();
 */

import type {
  User,
  Post,
  Comment,
  Like,
  Follow,
  DatabaseIds,
  PaginatedResponse,
  NotionError,
} from '../types/notion';

// Environment variable for API key
const NOTION_API_KEY = import.meta.env.VITE_NOTION_API_KEY || import.meta.env.NOTION_API_KEY || '';

// Default Notion API base URL (for direct usage)
const NOTION_API_BASE = 'https://api.notion.com/v1';

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 3, // Notion allows ~3 requests per second on average
  windowMs: 1000,
  retryAfter: 5000, // Wait 5 seconds before retry on rate limit
};

interface RequestQueueItem {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timestamp: number;
}

class NotionService {
  private baseUrl: string;
  private apiKey: string;
  private requestQueue: RequestQueueItem[] = [];
  private lastRequestTime = 0;
  private databaseIds: DatabaseIds | null = null;

  constructor(proxyUrl?: string) {
    this.baseUrl = proxyUrl || NOTION_API_BASE;
    this.apiKey = NOTION_API_KEY || '';
    
    if (!this.apiKey && !proxyUrl) {
      console.warn('Notion API key not configured. Set NOTION_API_KEY environment variable.');
    }
  }

  /**
   * Set database IDs after creation
   */
  setDatabaseIds(ids: DatabaseIds): void {
    this.databaseIds = ids;
  }

  /**
   * Get current database IDs
   */
  getDatabaseIds(): DatabaseIds | null {
    return this.databaseIds;
  }

  /**
   * Rate-limited request handler
   */
  private async makeRequest<T>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        resolve: resolve as (value: unknown) => void,
        reject,
        timestamp: Date.now(),
      });
      this.processQueue(method, endpoint, body);
    });
  }

  private async processQueue<T>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < RATE_LIMIT.windowMs / RATE_LIMIT.maxRequests) {
      await new Promise(r => setTimeout(r, 50));
    }

    this.executeRequest<T>(method, endpoint, body);
  }

  private async executeRequest<T>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<void> {
    const item = this.requestQueue.shift();
    if (!item) return;

    this.lastRequestTime = Date.now();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Notion API key only if not using proxy
    if (this.baseUrl === NOTION_API_BASE && this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
      headers['Notion-Version'] = '2022-06-28';
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (response.status === 429) {
        // Rate limited - retry after delay
        await new Promise(r => setTimeout(r, RATE_LIMIT.retryAfter));
        this.requestQueue.unshift(item);
        this.processQueue(method, endpoint, body);
        return;
      }

      if (!response.ok) {
        const error: NotionError = await response.json();
        throw new Error(error.message || `Notion API error: ${response.status}`);
      }

      const data = await response.json();
      item.resolve(data);
    } catch (error) {
      item.reject(error);
    }
  }

  /**
   * Create a new page in a database
   */
  async createPage(databaseId: string, properties: Record<string, unknown>): Promise<unknown> {
    return this.makeRequest('POST', '/pages', {
      parent: { database_id: databaseId },
      properties,
    });
  }

  /**
   * Query a database with pagination
   */
  async queryDatabase(
    databaseId: string,
    options?: {
      startCursor?: string;
      pageSize?: number;
      filter?: Record<string, unknown>;
      sorts?: Record<string, unknown>[];
    }
  ): Promise<{ results: unknown[]; next_cursor?: string; has_more: boolean }> {
    const params = new URLSearchParams();
    
    if (options?.startCursor) params.set('start_cursor', options.startCursor);
    if (options?.pageSize) params.set('page_size', String(options.pageSize));

    const query: Record<string, unknown> = {};
    if (options?.filter) query.filter = options.filter;
    if (options?.sorts) query.sorts = options.sorts;

    const endpoint = `/databases/${databaseId}/query${params.toString() ? '?' + params : ''}`;
    
    return this.makeRequest('POST', endpoint, Object.keys(query).length ? query : {});
  }

  /**
   * Get a page by ID
   */
  async getPage(pageId: string): Promise<unknown> {
    return this.makeRequest('GET', `/pages/${pageId}`);
  }

  /**
   * Update a page's properties
   */
  async updatePage(pageId: string, properties: Record<string, unknown>): Promise<unknown> {
    return this.makeRequest('PATCH', `/pages/${pageId}`, { properties });
  }

  /**
   * Delete a page (archive in Notion)
   */
  async deletePage(pageId: string): Promise<unknown> {
    return this.makeRequest('PATCH', `/pages/${pageId}`, { archived: true });
  }

  // ============ User Operations ============

  /**
   * Create a new user
   */
  async createUser(username: string, bio?: string, avatar?: string): Promise<User> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const properties: Record<string, unknown> = {
      username: { title: [{ text: { content: username } }] },
      bio: bio ? { rich_text: [{ text: { content: bio } }] } : { rich_text: [] },
      'joined date': { date: { start: new Date().toISOString() } },
      'followers count': { number: 0 },
    };

    if (avatar) {
      properties.avatar = { files: [{ external: { url: avatar } }] };
    }

    const result = await this.createPage(this.databaseIds.users, properties);
    return this.parseUser(result as { properties: Record<string, unknown> });
  }

  /**
   * Get a user by ID
   */
  async getUser(userId: string): Promise<User> {
    const result = await this.getPage(userId);
    return this.parseUser(result as { properties: Record<string, unknown> });
  }

  /**
   * Get all users with pagination
   */
  async getUsers(options?: { startCursor?: string; pageSize?: number }): Promise<PaginatedResponse<User>> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const result = await this.queryDatabase(this.databaseIds.users, options);
    const users = (result.results as { properties: Record<string, unknown> }[]).map(p => this.parseUser(p));

    return {
      data: users,
      nextCursor: result.next_cursor || undefined,
      hasMore: result.has_more,
    };
  }

  /**
   * Update a user
   */
  async updateUser(userId: string, updates: Partial<Pick<User, 'username' | 'bio' | 'avatar'>>): Promise<User> {
    const properties: Record<string, unknown> = {};

    if (updates.username) {
      properties.username = { title: [{ text: { content: updates.username } }] };
    }
    if (updates.bio !== undefined) {
      properties.bio = { rich_text: [{ text: { content: updates.bio } }] };
    }
    if (updates.avatar) {
      properties.avatar = { files: [{ external: { url: updates.avatar } }] };
    }

    await this.updatePage(userId, properties);
    return this.getUser(userId);
  }

  private parseUser(page: { id: string; properties: Record<string, unknown> }): User {
    const props = page.properties;
    return {
      id: page.id,
      username: (props.username as { title: { plain_text: string }[] })?.title?.[0]?.plain_text || '',
      avatar: (props.avatar as { files: { external?: { url: string }; file?: { url: string } }[] })?.files?.[0]?.external?.url || 
              (props.avatar as { files: { external?: { url: string }; file?: { url: string } }[] })?.files?.[0]?.file?.url,
      bio: (props.bio as { rich_text: { plain_text: string }[] })?.rich_text?.[0]?.plain_text,
      joinedDate: (props['joined date'] as { date: { start: string } })?.date?.start || '',
      followersCount: (props['followers count'] as { number: number })?.number || 0,
    };
  }

  // ============ Post Operations ============

  /**
   * Create a new post
   */
  async createPost(authorId: string, content: string, image?: string): Promise<Post> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const properties: Record<string, unknown> = {
      author: { relation: [{ id: authorId }] },
      content: { rich_text: [{ text: { content } }] },
      'created at': { created_time: new Date().toISOString() },
      'likes count': { number: 0 },
      'bookmarks count': { number: 0 },
    };

    if (image) {
      properties.image = { files: [{ external: { url: image } }] };
    }

    const result = await this.createPage(this.databaseIds.posts, properties);
    return this.parsePost(result as { properties: Record<string, unknown> });
  }

  /**
   * Get posts with pagination
   */
  async getPosts(options?: { 
    startCursor?: string; 
    pageSize?: number;
    authorId?: string;
  }): Promise<PaginatedResponse<Post>> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const filter = options?.authorId ? {
      property: 'author',
      relation: { contains: options.authorId },
    } : undefined;

    const result = await this.queryDatabase(this.databaseIds.posts, {
      ...options,
      filter,
      sorts: [{ property: 'created at', direction: 'descending' }],
    });

    const posts = await Promise.all(
      (result.results as { properties: Record<string, unknown> }[]).map(p => this.parsePostWithAuthor(p))
    );

    return {
      data: posts,
      nextCursor: result.next_cursor || undefined,
      hasMore: result.has_more,
    };
  }

  /**
   * Get a post by ID
   */
  async getPost(postId: string): Promise<Post> {
    const result = await this.getPage(postId);
    return this.parsePostWithAuthor(result as { properties: Record<string, unknown> });
  }

  /**
   * Update a post
   */
  async updatePost(postId: string, updates: { content?: string; image?: string }): Promise<Post> {
    const properties: Record<string, unknown> = {};

    if (updates.content) {
      properties.content = { rich_text: [{ text: { content: updates.content } }] };
    }
    if (updates.image) {
      properties.image = { files: [{ external: { url: updates.image } }] };
    }

    await this.updatePage(postId, properties);
    return this.getPost(postId);
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    await this.deletePage(postId);
  }

  private async parsePostWithAuthor(page: { id: string; properties: Record<string, unknown> }): Promise<Post> {
    const post = this.parsePost(page);
    const authorId = (page.properties.author as { relation: { id: string }[] })?.relation?.[0]?.id;
    
    if (authorId) {
      try {
        post.author = await this.getUser(authorId);
      } catch {
        post.author = { id: authorId, username: 'Unknown', joinedDate: '', followersCount: 0 };
      }
    }
    
    return post;
  }

  private parsePost(page: { id: string; properties: Record<string, unknown> }): Post {
    const props = page.properties;
    return {
      id: page.id,
      author: { id: '', username: '', joinedDate: '', followersCount: 0 }, // Will be populated separately
      content: (props.content as { rich_text: { plain_text: string }[] })?.rich_text?.[0]?.plain_text || '',
      image: (props.image as { files: { external?: { url: string }; file?: { url: string } }[] })?.files?.[0]?.external?.url ||
             (props.image as { files: { external?: { url: string }; file?: { url: string } }[] })?.files?.[0]?.file?.url,
      createdAt: (props['created at'] as { created_time: string })?.created_time || '',
      likesCount: (props['likes count'] as { number: number })?.number || 0,
      bookmarksCount: (props['bookmarks count'] as { number: number })?.number || 0,
    };
  }

  // ============ Comment Operations ============

  /**
   * Create a comment
   */
  async createComment(authorId: string, postId: string, content: string): Promise<Comment> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const properties: Record<string, unknown> = {
      author: { relation: [{ id: authorId }] },
      post: { relation: [{ id: postId }] },
      content: { rich_text: [{ text: { content } }] },
      'created at': { created_time: new Date().toISOString() },
    };

    const result = await this.createPage(this.databaseIds.comments, properties);
    return this.parseComment(result as { properties: Record<string, unknown> });
  }

  /**
   * Get comments for a post
   */
  async getCommentsByPost(postId: string, options?: { startCursor?: string; pageSize?: number }): Promise<PaginatedResponse<Comment>> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const result = await this.queryDatabase(this.databaseIds.comments, {
      ...options,
      filter: { property: 'post', relation: { contains: postId } },
      sorts: [{ property: 'created at', direction: ascending }],
    });

    const comments = await Promise.all(
      (result.results as { properties: Record<string, unknown> }[]).map(p => this.parseCommentWithAuthor(p))
    );

    return {
      data: comments,
      nextCursor: result.next_cursor || undefined,
      hasMore: result.has_more,
    };
  }

  private async parseCommentWithAuthor(page: { id: string; properties: Record<string, unknown> }): Promise<Comment> {
    const comment = this.parseComment(page);
    const authorId = (page.properties.author as { relation: { id: string }[] })?.relation?.[0]?.id;
    const postId = (page.properties.post as { relation: { id: string }[] })?.relation?.[0]?.id;

    if (authorId) {
      try {
        comment.author = await this.getUser(authorId);
      } catch {
        comment.author = { id: authorId, username: 'Unknown', joinedDate: '', followersCount: 0 };
      }
    }

    if (postId) {
      try {
        comment.post = await this.getPost(postId);
      } catch {
        comment.post = { id: postId, author: {} as User, content: '', createdAt: '', likesCount: 0, bookmarksCount: 0 };
      }
    }

    return comment;
  }

  private parseComment(page: { id: string; properties: Record<string, unknown> }): Comment {
    const props = page.properties;
    return {
      id: page.id,
      author: { id: '', username: '', joinedDate: '', followersCount: 0 },
      post: { id: '', author: {} as User, content: '', createdAt: '', likesCount: 0, bookmarksCount: 0 },
      content: (props.content as { rich_text: { plain_text: string }[] })?.rich_text?.[0]?.plain_text || '',
      createdAt: (props['created at'] as { created_time: string })?.created_time || '',
    };
  }

  // ============ Like Operations ============

  /**
   * Like a post
   */
  async likePost(userId: string, postId: string): Promise<Like> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const properties: Record<string, unknown> = {
      user: { relation: [{ id: userId }] },
      post: { relation: [{ id: postId }] },
      'created at': { created_time: new Date().toISOString() },
    };

    const result = await this.createPage(this.databaseIds.likes, properties);

    // Update post likes count
    const post = await this.getPost(postId);
    await this.updatePage(postId, {
      'likes count': { number: post.likesCount + 1 },
    });

    return this.parseLike(result as { properties: Record<string, unknown> });
  }

  /**
   * Unlike a post
   */
  async unlikePost(userId: string, postId: string): Promise<void> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    // Find the like
    const result = await this.queryDatabase(this.databaseIds.likes, {
      filter: {
        and: [
          { property: 'user', relation: { contains: userId } },
          { property: 'post', relation: { contains: postId } },
        ],
      },
    });

    if (result.results.length > 0) {
      await this.deletePage(result.results[0].id);

      // Update post likes count
      const post = await this.getPost(postId);
      await this.updatePage(postId, {
        'likes count': { number: Math.max(0, post.likesCount - 1) },
      });
    }
  }

  /**
   * Check if user has liked a post
   */
  async hasLikedPost(userId: string, postId: string): Promise<boolean> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const result = await this.queryDatabase(this.databaseIds.likes, {
      filter: {
        and: [
          { property: 'user', relation: { contains: userId } },
          { property: 'post', relation: { contains: postId } },
        ],
      },
    });

    return result.results.length > 0;
  }

  private parseLike(page: { id: string; properties: Record<string, unknown> }): Like {
    const props = page.properties;
    return {
      id: page.id,
      user: { id: (props.user as { relation: { id: string }[] })?.relation?.[0]?.id || '', username: '', joinedDate: '', followersCount: 0 },
      post: { id: (props.post as { relation: { id: string }[] })?.relation?.[0]?.id || '', author: {} as User, content: '', createdAt: '', likesCount: 0, bookmarksCount: 0 },
      createdAt: (props['created at'] as { created_time: string })?.created_time || '',
    };
  }

  // ============ Follow Operations ============

  /**
   * Follow a user
   */
  async followUser(followerId: string, followingId: string): Promise<Follow> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const properties: Record<string, unknown> = {
      follower: { relation: [{ id: followerId }] },
      following: { relation: [{ id: followingId }] },
      'created at': { created_time: new Date().toISOString() },
    };

    const result = await this.createPage(this.databaseIds.following, properties);
    return this.parseFollow(result as { properties: Record<string, unknown> });
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const result = await this.queryDatabase(this.databaseIds.following, {
      filter: {
        and: [
          { property: 'follower', relation: { contains: followerId } },
          { property: 'following', relation: { contains: followingId } },
        ],
      },
    });

    if (result.results.length > 0) {
      await this.deletePage(result.results[0].id);
    }
  }

  /**
   * Check if following
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const result = await this.queryDatabase(this.databaseIds.following, {
      filter: {
        and: [
          { property: 'follower', relation: { contains: followerId } },
          { property: 'following', relation: { contains: followingId } },
        ],
      },
    });

    return result.results.length > 0;
  }

  /**
   * Get followers of a user
   */
  async getFollowers(userId: string, options?: { startCursor?: string; pageSize?: number }): Promise<PaginatedResponse<User>> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const result = await this.queryDatabase(this.databaseIds.following, {
      ...options,
      filter: { property: 'following', relation: { contains: userId } },
    });

    const userIds = (result.results as { properties: Record<string, unknown> }[]).map(
      p => (p.properties.follower as { relation: { id: string }[] })?.relation?.[0]?.id
    ).filter(Boolean);

    // Fetch user details
    const users = await Promise.all(userIds.map(id => this.getUser(id)));

    return {
      data: users,
      nextCursor: result.next_cursor || undefined,
      hasMore: result.has_more,
    };
  }

  /**
   * Get users that a user is following
   */
  async getFollowing(userId: string, options?: { startCursor?: string; pageSize?: number }): Promise<PaginatedResponse<User>> {
    if (!this.databaseIds) throw new Error('Database IDs not configured');

    const result = await this.queryDatabase(this.databaseIds.following, {
      ...options,
      filter: { property: 'follower', relation: { contains: userId } },
    });

    const userIds = (result.results as { properties: Record<string, unknown> }[]).map(
      p => (p.properties.following as { relation: { id: string }[] })?.relation?.[0]?.id
    ).filter(Boolean);

    const users = await Promise.all(userIds.map(id => this.getUser(id)));

    return {
      data: users,
      nextCursor: result.next_cursor || undefined,
      hasMore: result.has_more,
    };
  }

  private parseFollow(page: { id: string; properties: Record<string, unknown> }): Follow {
    const props = page.properties;
    return {
      id: page.id,
      follower: { id: (props.follower as { relation: { id: string }[] })?.relation?.[0]?.id || '', username: '', joinedDate: '', followersCount: 0 },
      following: { id: (props.following as { relation: { id: string }[] })?.relation?.[0]?.id || '', username: '', joinedDate: '', followersCount: 0 },
      createdAt: (props['created at'] as { created_time: string })?.created_time || '',
    };
  }
}

// Export singleton instance
export const notion = new NotionService();

// Export class for custom configurations
export { NotionService };
