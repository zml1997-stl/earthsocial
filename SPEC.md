# EarthSocial - Technical Specification

**Version:** 1.0  
**Date:** 2026-02-18  
**Status:** Architecture Document  
**Author:** System Architect

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EARTHSOCIAL ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                    ┌──────────────────────────────────┐  │
│  │   CLIENT    │                    │           INFRASTRUCTURE         │  │
│  │  (Browser)  │                    │                                  │  │
│  │             │                    │  ┌────────────────────────────┐  │  │
│  │ ┌─────────┐ │   HTTPS (TLS 1.3)  │  │      GITHUB PAGES          │  │  │
│  │ │  React  │ │◄──────────────────►│  │   (Static Asset Hosting)   │  │  │
│  │ │   App   │ │                    │  │   • index.html             │  │  │
│  │ └─────────┘ │                    │  │   • JS bundles             │  │  │
│  │             │                    │  │   • CSS assets             │  │  │
│  │ ┌─────────┐ │                    │  │   • Images/Media           │  │  │
│  │ │ Three.js│ │                    │  └────────────────────────────┘  │  │
│  │ │  Globe  │ │                    │                                   │  │
│  │ └─────────┘ │                    │  ┌────────────────────────────┐  │  │
│  └─────────────┘                    │  │      NOTION API            │  │  │
│                                      │  │   (Database Backend)       │  │  │
│                                      │  │   • Posts Database        │  │  │
│                                      │  │   • Users Database        │  │  │
│                                      │  │   • Comments Database     │  │  │
│                                      │  └────────────────────────────┘  │  │
│                                      └──────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         BUILD PROCESS                                │   │
│  │  Vite + TypeScript ──► Environment Injection ──► Static Export     │   │
│  │                         (API keys embedded at build time)          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 System Components

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM COMPONENT DIAGRAM                           │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                        FRONTEND LAYER                                 │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │ │
│  │  │   Pages    │  │ Components │  │   Hooks    │  │   Stores   │   │ │
│  │  │            │  │            │  │            │  │            │   │ │
│  │  │ • Home     │  │ • Globe3D  │  │ • usePosts │  │ • userStore│   │ │
│  │  │ • Profile  │  │ • PostCard │  │ • useUser  │  │ • postStore│   │ │
│  │  │ • Explore  │  │ • Navbar   │  │ • useNotion│  │ • uiStore  │   │ │
│  │  │ • Settings │  │ • Modal    │  │            │  │            │   │ │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘   │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                    │                                       │
│                                    ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                        SERVICE LAYER                                 │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │ │
│  │  │  NotionClient  │  │  AuthService   │  │  CacheService  │        │ │
│  │  │                │  │                │  │                │        │ │
│  │  │ • fetchPosts   │  │ • validateToken│  │ • localStorage │        │ │
│  │  │ • fetchUser    │  │ • sessionMgmt  │  │ • memoryCache  │        │ │
│  │  │ • createPost   │  │                │  │                │        │ │
│  │  │ • updatePost   │  │                │  │                │        │ │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                    │                                       │
│                                    ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                        DATA LAYER                                     │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │ │
│  │  │  Environment   │  │  Notion API    │  │  Local State  │        │ │
│  │  │  Variables     │  │  (External)    │  │  (Zustand)    │        │ │
│  │  │                │  │                │  │                │        │ │
│  │  │ • VITE_API_KEY │  │ • Posts DB     │  │ • userSession │        │ │
│  │  │ • VITE_NOTION  │  │ • Users DB     │  │ • cachedPosts │        │ │
│  │  │   _DB_ID       │  │ • Comments DB  │  │ • uiState     │        │ │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Hierarchy

### 2.1 React Component Tree

```
App
├── Router (React Router v6)
│   ├── Layout
│   │   ├── Navbar
│   │   │   ├── Logo
│   │   │   ├── SearchBar
│   │   │   ├── NavigationLinks
│   │   │   └── UserMenu
│   │   │
│   │   └── Footer
│   │
│   ├── HomePage
│   │   ├── HeroSection
│   │   │   └── Globe3D (Three.js / React Three Fiber)
│   │   │       ├── EarthSphere
│   │   │       ├── AtmosphereGlow
│   │   │       ├── StarField
│   │   │       └── CameraControls
│   │   │
│   │   └── FeedSection
│   │       └── PostList
│   │           └── PostCard
│   │               ├── PostHeader
│   │               │   ├── Avatar
│   │               │   ├── Username
│   │               │   └── Timestamp
│   │               ├── PostContent
│   │               │   ├── TextContent
│   │               │   ├── MediaGallery
│   │               │   └── LocationTag
│   │               └── PostActions
│   │                   ├── LikeButton
│   │                   ├── CommentButton
│   │                   └── ShareButton
│   │
│   ├── ProfilePage
│   │   ├── ProfileHeader
│   │   │   ├── CoverPhoto
│   │   │   ├── Avatar
│   │   │   ├── DisplayName
│   │   │   ├── Bio
│   │   │   └── Stats
│   │   │
│   │   └── ProfileContent
│   │       ├── UserPosts
│   │       └── MediaGrid
│   │
│   ├── ExplorePage
│   │   ├── SearchFilters
│   │   ├── TrendingTopics
│   │   └── ExploreGrid
│   │
│   └── SettingsPage
│       ├── AccountSettings
│       ├── PrivacySettings
│       └── NotificationSettings
│
├── SharedComponents
│   ├── Button
│   ├── Input
│   ├── Modal
│   ├── Toast
│   ├── LoadingSpinner
│   └── ErrorBoundary
│
└── Context
    ├── AuthContext
    └── ThemeContext
```

### 2.2 Component Responsibilities

| Component | Responsibility | Public API |
|-----------|---------------|------------|
| `Globe3D` | Renders 3D spinning Earth with Three.js | `onLocationClick(lat, lng)`, `autoRotate`, `zoomLevel` |
| `PostCard` | Displays individual post | `post: Post`, `onLike()`, `onComment()` |
| `PostList` | Manages post collection with infinite scroll | `fetchNextPage()`, `refresh()` |
| `NotionClient` | API communication with Notion | `getPosts()`, `createPost()`, `updatePost()` |
| `userStore` | Global user state (Zustand) | `user`, `setUser()`, `logout()` |

---

## 3. Data Flow

### 3.1 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA FLOW DIAGRAM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  USER ACTION                                                                 │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      COMPONENT LAYER                                 │   │
│  │   User clicks "Load Posts" ──► PostList Component                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      HOOK LAYER (usePosts)                          │   │
│  │   • Check cache (Zustand/React Query)                              │   │
│  │   • If cached: return cached data                                   │   │
│  │   • If not cached: trigger fetch                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      SERVICE LAYER (NotionClient)                   │   │
│  │   • Build Notion API request                                        │   │
│  │   • Add authorization header (API key)                             │   │
│  │   • Make HTTP request to Notion API                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      NETWORK LAYER                                  │   │
│  │                                                                       │   │
│  │   Browser ───────────────────────────────────────────► Notion API    │   │
│  │   (HTTPS/TLS 1.3)                                              │   │
│  │   GET /v1/databases/{db_id}/query                              │   │
│  │   Authorization: Bearer {NOTION_API_KEY}                       │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      RESPONSE PROCESSING                            │   │
│  │                                                                       │   │
│  │   Notion Response ──► Parse ──► Transform ──► Cache ──► UI Update  │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  UI RE-RENDER                                                                  │
│       │                                                                     │
│       ▼                                                                     │
│  PostList displays new posts                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Notion Database Schema

#### Posts Database
```
┌────────────────────────────────────────────────────────────────────────────┐
│                         POSTS DATABASE SCHEMA                              │
├──────────────────────┬─────────────────────┬─────────────────────────────┤
│ Property             │ Type                │ Description                  │
├──────────────────────┼─────────────────────┼─────────────────────────────┤
│ ID                   │ Title (Notion ID)   │ Unique post identifier       │
│ Content              │ Rich Text           │ Post body text               │
│ Author               │ Person              │ Post creator                 │
│ Created Time         │ Created Time        │ Creation timestamp           │
│ Last Edited Time     │ Last Edited Time    │ Last modification time       │
│ Status               │ Select              │ draft | published | archived │
│ Tags                 │ Multi-select        │ Categories                   │
│ Location             │ Text                │ Geographic location          │
│ Media URLs           │ URLs                │ Attached images/videos       │
│ Like Count           │ Number              │ Likes received               │
│ Comment Count        │ Number              │ Comments received            │
└──────────────────────┴─────────────────────┴─────────────────────────────┘
```

#### Users Database
```
┌────────────────────────────────────────────────────────────────────────────┐
│                         USERS DATABASE SCHEMA                              │
├──────────────────────┬─────────────────────┬─────────────────────────────┤
│ Property             │ Type                │ Description                  │
├──────────────────────┼─────────────────────┼─────────────────────────────┤
│ ID                   │ Title (Notion ID)   │ Unique user identifier       │
│ Display Name         │ Rich Text           │ User's display name          │
│ Email                │ Email               │ Contact email                │
│ Avatar URL           │ URL                 │ Profile picture link        │
│ Bio                  │ Rich Text           │ User biography              │
│ Location             │ Text                │ User's location              │
│ Joined Date          │ Created Time        │ Account creation date        │
│ Role                 │ Select              │ user | moderator | admin    │
│ Following            │ Relation            │ Users this user follows      │
│ Followers            │ Relation            │ Users following this user    │
└──────────────────────┴─────────────────────┴─────────────────────────────┘
```

### 3.3 API Endpoints (Notion API)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/databases/{posts_db_id}/query` | Fetch posts with filters |
| `POST` | `/v1/pages` | Create new post |
| `PATCH` | `/v1/pages/{page_id}` | Update existing post |
| `DELETE` | `/v1/pages/{page_id}` | Delete (archive) post |
| `POST` | `/v1/databases/{users_db_id}/query` | Fetch user data |

---

## 4. Security Model

### 4.1 Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY MODEL                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                     PROTOTYPE (Current)                              │ │
│  │                                                                       │ │
│  │   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐         │ │
│  │   │   Build     │      │   Static    │      │  Browser    │         │ │
│  │   │   Process   │─────►│   Hosting   │─────►│  Execution  │         │ │
│  │   │             │      │             │      │             │         │ │
│  │   │ Vite env    │      │ GitHub      │      │ JS Bundle   │         │ │
│  │   │ injection  │      │ Pages       │      │ (deobfusc.)│         │ │
│  │   └─────────────┘      └─────────────┘      └─────────────┘         │ │
│  │         │                    │                    │                   │ │
│  │         ▼                    ▼                    ▼                   │ │
│  │   ┌─────────────────────────────────────────────────────────────┐    │ │
│  │   │              SECURITY LIMITATION                            │    │ │
│  │   │  • API keys embedded in JS bundle (visible in devtools)    │    │ │
│  │   │  • Anyone with browser access can extract keys              │    │ │
│  │   │  • No server-side validation                                │    │ │
│  │   │  • Rate limiting handled client-side only                   │    │ │
│  │   └─────────────────────────────────────────────────────────────┘    │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│                                    ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                     PRODUCTION (Recommended)                         │ │
│  │                                                                       │ │
│  │   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐         │ │
│  │   │   Browser   │─────►│   Serverless│─────►│  Notion API  │         │ │
│  │   │             │      │   Function  │      │             │         │ │
│  │   │ API Request │      │             │      │             │         │ │
│  │   │ (no keys)   │      │ Vercel/     │      │             │         │ │
│  │   │             │      │ Cloudflare  │      │             │         │ │
│  │   └─────────────┘      └─────────────┘      └─────────────┘         │ │
│  │         │                    │                    │                   │ │
│  │         ▼                    ▼                    ▼                   │ │
│  │   ┌─────────────────────────────────────────────────────────────┐    │ │
│  │   │              SECURITY IMPROVEMENTS                          │    │ │
│  │   │  • API keys never exposed to client                        │    │ │
│  │   │  • Server-side request validation                          │    │ │
│  │   │  • Rate limiting on server                                 │    │ │
│  │   │  • CORS policy enforcement                                  │    │ │
│  │   │  • Request logging & monitoring                             │    │ │
│  │   └─────────────────────────────────────────────────────────────┘    │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Security Measures

#### Build-Time Security (Prototype)
- Environment variables injected at build time via Vite
- API keys replaced with placeholder during bundling
- Source maps disabled in production builds
- Bundle analysis for sensitive data exposure

#### Runtime Security (Prototype)
- HTTPS enforced (GitHub Pages)
- Content Security Policy (CSP) headers
- Notion API key scope minimized (read-only where possible)
- Request rate limiting (client-side)

#### Production Recommendations
- **Serverless Proxy**: Deploy Vercel/Cloudflare function as API gateway
- **Environment Variables**: Store keys in serverless function env vars
- **Authentication**: Implement OAuth or JWT for user sessions
- **Rate Limiting**: Server-side rate limiting per IP/user
- **CORS**: Strict origin allowlist
- **Monitoring**: Log all API requests for audit trail

### 4.3 Threat Model

| Threat | Prototype | Production |
|--------|-----------|------------|
| API key extraction | ❌ Vulnerable | ✅ Protected |
| DDoS attacks | ❌ No protection | ✅ Rate limiting |
| XSS attacks | ✅ React sanitizes | ✅ React + CSP |
| CSRF attacks | ✅ Stateless | ✅ CSRF tokens |
| Data leakage | ❌ All data visible | ✅ Granular access |

---

## 5. File Structure

### 5.1 Project Directory Structure

```
earthsocial/
├── SPEC.md                          # This specification
├── README.md                        # Project overview
│
├── .github/
│   └── workflows/
│       └── deploy.yml               # GitHub Pages deployment
│
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── main.tsx                     # Entry point
│   ├── App.tsx                      # Root component
│   ├── index.css                    # Global styles
│   │
│   ├── components/
│   │   ├── globe/
│   │   │   ├── Globe3D.tsx          # Main 3D globe component
│   │   │   ├── EarthSphere.tsx     # Earth mesh
│   │   │   ├── AtmosphereGlow.tsx  # Atmospheric effect
│   │   │   ├── StarField.tsx       # Background stars
│   │   │   └── GlobeControls.tsx  # Camera controls
│   │   │
│   │   ├── posts/
│   │   │   ├── PostList.tsx        # Post collection
│   │   │   ├── PostCard.tsx        # Individual post
│   │   │   ├── PostCreate.tsx     # Create post form
│   │   │   └── PostActions.tsx    # Like/comment/share
│   │   │
│   │   ├── user/
│   │   │   ├── ProfileHeader.tsx   # Profile display
│   │   │   ├── Avatar.tsx         # User avatar
│   │   │   └── UserCard.tsx       # User preview
│   │   │
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ExplorePage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── hooks/
│   │   ├── usePosts.ts             # Post data fetching
│   │   ├── useUser.ts              # User data fetching
│   │   └── useNotion.ts            # Generic Notion API
│   │
│   ├── services/
│   │   ├── notionClient.ts          # Notion API client
│   │   ├── authService.ts           # Authentication
│   │   └── cacheService.ts          # Caching layer
│   │
│   ├── stores/
│   │   ├── userStore.ts            # User state (Zustand)
│   │   ├── postStore.ts            # Posts state
│   │   └── uiStore.ts              # UI state
│   │
│   ├── types/
│   │   ├── post.ts                 # Post type definitions
│   │   ├── user.ts                 # User type definitions
│   │   └── notion.ts               # Notion API types
│   │
│   ├── utils/
│   │   ├── notionHelpers.ts        # Notion data transformation
│   │   ├── formatters.ts           # Date/text formatting
│   │   └── validation.ts           # Input validation
│   │
│   └── constants/
│       ├── notion.ts               # Notion config
│       └── theme.ts                # Design tokens
│
├── index.html                       # HTML template
│
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js
├── .env.example                     # Environment template
└── .gitignore
```

### 5.2 Key File Descriptions

| File | Purpose |
|------|---------|
| `src/main.tsx` | React app entry, providers setup |
| `src/App.tsx` | Router setup, layout wrapper |
| `src/components/globe/Globe3D.tsx` | Three.js Earth with animations |
| `src/services/notionClient.ts` | Notion API communication |
| `src/stores/userStore.ts` | Global user state |
| `vite.config.ts` | Build config, env injection |
| `.env.example` | Required environment variables |

---

## 6. Technology Stack

### 6.1 Dependencies

#### Core
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.22.0"
}
```

#### Build Tools
```json
{
  "vite": "^5.4.0",
  "typescript": "~5.5.0",
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.0"
}
```

#### 3D Graphics
```json
{
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.96.0"
}
```

#### Styling
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0"
}
```

#### State Management
```json
{
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.24.0"
}
```

#### HTTP & Utilities
```json
{
  "axios": "^1.6.0",
  "date-fns": "^3.3.0",
  "clsx": "^2.1.0"
}
```

### 6.2 Version Compatibility Matrix

| Package | Version | Node.js | Purpose |
|---------|---------|---------|---------|
| React | ^18.3.1 | ≥18.0.0 | UI Framework |
| Vite | ^5.4.0 | ≥18.0.0 | Build Tool |
| TypeScript | ~5.5.0 | ≥18.0.0 | Type Safety |
| Three.js | ^0.160.0 | ≥18.0.0 | 3D Graphics |
| React Three Fiber | ^8.15.0 | ≥18.0.0 | React-Three Bindings |
| Tailwind CSS | ^3.4.0 | ≥18.0.0 | Styling |
| Zustand | ^4.5.0 | ≥18.0.0 | State Management |
| React Query | ^5.24.0 | ≥18.0.0 | Server State |

### 6.3 Environment Variables

```
# Required (must be set before build)
VITE_NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
VITE_NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxx
VITE_NOTION_USERS_DB_ID=xxxxxxxxxxxxxxxxxxxxxx

# Optional
VITE_APP_TITLE=EarthSocial
VITE_API_URL=https://api.notion.com/v1
```

---

## 7. Architecture Decision Records

### ADR-001: Use React Three Fiber for 3D Globe
- **Decision**: Use `@react-three/fiber` over vanilla Three.js
- **Rationale**: Declarative component model aligns with React patterns; better lifecycle management
- **Status**: Accepted

### ADR-002: Use Zustand for Global State
- **Decision**: Use Zustand over Redux/Context
- **Rationale**: Simpler API, less boilerplate, better TypeScript support, no providers needed
- **Status**: Accepted

### ADR-003: Use React Query for Server State
- **Decision**: Use `@tanstack/react-query` for API data
- **Rationale**: Built-in caching, deduping, background refetch, loading states
- **Status**: Accepted

### ADR-004: Notion as Primary Database
- **Decision**: Use Notion API as backend
- **Rationale**: No separate backend needed, familiar to team, rapid prototyping
- **Limitations**: Rate limits (3 requests/sec), latency, not ideal for high traffic
- **Status**: Accepted (prototype)

---

## 8. Next Steps

1. **Initialize Project**: Set up Vite + React + TypeScript
2. **Configure Tailwind**: Implement design system tokens
3. **Build 3D Globe**: Create spinning Earth component
4. **Connect Notion**: Implement NotionClient service
5. **Create UI Components**: Build reusable component library
6. **Implement Pages**: Create all route pages
7. **Deploy to GitHub Pages**: Set up CI/CD pipeline

---

*End of Specification*
