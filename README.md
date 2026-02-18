# EarthSocial

A 3D social media platform built with React, Three.js, and TypeScript. Connect with others in an immersive virtual space where interactions come alive through stunning 3D visuals and fluid animations.

![EarthSocial Banner](https://via.placeholder.com/1200x400?text=EarthSocial+3D+Social+Platform)

## ✨ Features

- **3D Virtual Environment** - Explore a visually stunning 3D world
- **Real-time Interactions** - Connect with users through immersive experiences
- **Fluid Animations** - Smooth, performant animations using Framer Motion
- **Modern Tech Stack** - Built with React 18, TypeScript, and Vite
- **Responsive Design** - Works seamlessly across all devices
- **3D Graphics** - Powered by Three.js and React Three Fiber

## 🛠 Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **3D Graphics:** Three.js, @react-three/fiber, @react-three/drei
- **Animations:** Framer Motion
- **Data Fetching:** @tanstack/react-query
- **Icons:** Lucide React
- **Styling:** Tailwind CSS
- **Deployment:** GitHub Pages

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/zml1997-stl/earthsocial.git
cd earthsocial

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# App Configuration
VITE_APP_NAME=EarthSocial
VITE_APP_VERSION=1.0.0

# API Configuration (if needed)
VITE_API_URL=https://api.example.com
VITE_API_KEY=your_api_key_here

# Optional: Analytics
VITE_GA_TRACKING_ID=
```

## 📂 Project Structure

```
earthsocial/
├── src/
│   ├── assets/         # Static assets (images, fonts, etc.)
│   ├── components/    # Reusable React components
│   ├── data/          # Static data and mock data
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── styles/        # Global styles and CSS
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Public assets
├── index.html         # HTML entry point
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## 🔧 Deployment

### GitHub Pages

This project is configured for deployment to GitHub Pages.

```bash
# Build and deploy
npm run build

# The built files will be in the dist/ folder
# Configure GitHub Pages to serve from /docs or use the dist folder
```

### Custom Domain

To use a custom domain:
1. Go to repository Settings → Pages
2. Enter your custom domain under "Custom domain"
3. Create a CNAME record pointing to `zml1997-stl.github.io`

## 🔐 Security Notes

- Never commit sensitive data (API keys, secrets) to the repository
- Use environment variables for sensitive configuration
- Review `.env.example` for required variables
- Keep dependencies up to date for security patches

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Three.js](https://threejs.org/)
- [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)

---

Built with 💚 by the EarthSocial Team
