# EarthSocial - Notion Backend Schema

This document describes the Notion database schema and API integration for EarthSocial.

## Database Schema

All databases are stored in a parent page in Zach's Notion workspace.

### 1. Users Database
**Database ID:** `30b86170-58ee-810c-b38a-e41ed9fa35c5`

| Property | Type | Description |
|----------|------|-------------|
| username | Title | User's unique username |
| avatar | Files | Profile picture URL |
| bio | Rich Text | User biography |
| joined date | Date | When the user joined |
| followers count | Number | Number of followers |

### 2. Posts Database
**Database ID:** `30b86170-58ee-8157-8848-d14016d04ab9`

| Property | Type | Description |
|----------|------|-------------|
| title | Title | Internal post identifier |
| author | Rich Text | Author's user ID |
| content | Rich Text | Post text content |
| image | Files | Optional image attachment |
| created at | Created Time | Auto-generated timestamp |
| likes count | Number | Number of likes |
| bookmarks count | Number | Number of bookmarks |

### 3. Comments Database
**Database ID:** `30b86170-58ee-81c1-8f24-daab267a82f1`

| Property | Type | Description |
|----------|------|-------------|
| title | Title | Internal comment identifier |
| author | Rich Text | Comment author's user ID |
| post | Rich Text | ID of the post being commented on |
| content | Rich Text | Comment text |
| created at | Created Time | Auto-generated timestamp |

### 4. Likes Database
**Database ID:** `30b86170-58ee-8159-b787-e271a07605e4`

| Property | Type | Description |
|----------|------|-------------|
| title | Title | Internal like identifier |
| user | Rich Text | User who liked |
| post | Rich Text | Post that was liked |
| created at | Created Time | Auto-generated timestamp |

### 5. Following Database
**Database ID:** `30b86170-58ee-819e-bf6e-e36febfe58b6`

| Property | Type | Description |
|----------|------|-------------|
| title | Title | Internal follow identifier |
| follower | Rich Text | User who is following |
| following | Rich Text | User being followed |
| created at | Created Time | Auto-generated timestamp |

## API Proxy Note

### Current Setup (Prototype)
For GitHub Pages static deployment, API calls are made **client-side** directly to Notion API. This is prototype-only and has these limitations:

- **API Key Exposure**: The Notion API key is exposed in client-side code
- **CORS Issues**: Notion API doesn't support cross-origin requests from browsers
- **Rate Limiting**: No server-side caching or rate limit management

### Production Setup (Recommended)
For production, deploy a Vercel/Cloudflare proxy:

```bash
# Example: Vercel serverless function
# /api/notion.ts
export default async function handler(req, res) {
  const response = await fetch('https://api.notion.com/v1' + req.url, {
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
    },
  });
  const data = await response.json();
  res.status(response.status).json(data);
}
```

Benefits of proxy:
- API key stays server-side
- CORS handled properly
- Response caching reduces API calls
- Rate limits managed server-side

## Usage

```typescript
import { notion } from './lib/notion';

// Set API key (or use VITE_NOTION_API_KEY environment variable)
const notion = new NotionService();

// Create a user
const user = await notion.createUser('johndoe', 'Hello world!', 'https://example.com/avatar.jpg');

// Create a post
const post = await notion.createPost(user.id, 'My first post!');

// Like a post
await notion.likePost(user.id, post.id);

// Follow a user
await notion.followUser(followerId, followingId);
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NOTION_API_KEY` | Notion integration token |
| `VITE_NOTION_API_KEY` | For Vite/Vue apps (client-side) |

## Rate Limiting

The service implements client-side rate limiting:
- Max 3 requests per second
- Automatic retry on 429 (rate limited) responses
- 5-second backoff before retry
