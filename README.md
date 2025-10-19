# Destiny Crypto Platform v0.3

🚀 **Modern Cryptocurrency Staking Platform** built with React, Vite, TypeScript, and Supabase.

## ✨ Features

- 🔐 **Secure Authentication** with Supabase Auth
- 💰 **Crypto Staking** - Locked & Flexible staking options
- 📊 **Real-time Dashboard** with portfolio tracking
- 💱 **Live Crypto Prices** from CoinGecko API
- 🎨 **Modern UI** with Tailwind CSS & Framer Motion
- 📱 **Responsive Design** for all devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Components
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/sylarzxc/Destiny.git
   cd Destiny/version\ 0.3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── cabinet/         # Main app components
│   ├── ui/             # Reusable UI components
│   └── animations/     # Animation components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utilities and configurations
└── styles/             # Global styles
```

## 🎯 Key Features

### Dashboard
- Real-time portfolio value tracking
- Crypto balance overview
- Recent staking activity
- Interactive charts with historical data

### Staking
- **Locked Staking**: Fixed-term staking with higher APY
- **Flexible Staking**: No-lock staking with daily rewards
- Real-time profit calculations
- Multiple crypto support (ETH, BTC, USDT, BNB, MATIC)

### Authentication
- Secure user registration/login
- Profile management
- Role-based access control

## 🌐 Live Demo

[Deploy on Vercel](https://vercel.com) or [Netlify](https://netlify.com) for instant hosting.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@destiny-crypto.com or create an issue on GitHub.

---

**Built with ❤️ by Sylar**
