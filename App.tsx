import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './src/contexts/AuthContext'
import { Header } from "./components/Header";
import { HeroSectionV2 } from "./components/HeroSectionV2";
import { StakingCalculator } from "./components/StakingCalculator";
import { Leaderboard } from "./components/Leaderboard";
import { WhyDestiny } from "./components/WhyDestiny";
import { Roadmap } from "./components/Roadmap";
import { SponsorsMarquee } from "./components/SponsorsMarquee";
import { Footer } from "./components/Footer";
import { LoginPage } from './src/pages/LoginPage'
import { RegisterPage } from './src/pages/RegisterPage'
import { ResetPasswordPage } from './src/pages/ResetPasswordPage'
import { DashboardPage } from './src/pages/DashboardPage'
import { ProtectedRoute } from './src/components/auth/ProtectedRoute'

function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSectionV2 />
        <StakingCalculator />
        <Leaderboard />
        <WhyDestiny />
        <SponsorsMarquee />
        <Roadmap />
      </main>
      <Footer />
    </>
  )
}


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0D0D1A] text-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/kabinet" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
