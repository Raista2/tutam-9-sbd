import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import NavBar from './NavBar'
import CardGrid from './pages/Card'
import Login from './pages/Login'
import Register from './pages/Register'
import Gacha from './pages/Gacha'
import './App.css'

// App content that uses the auth context
function AppContent() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <NavBar user={user} onLogout={logout} />
      
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<CardGrid />} />
          <Route path="/login" element={user ? <Navigate to="/gacha" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/gacha" /> : <Register />} />
          <Route path="/gacha" element={user ? <Gacha /> : <Navigate to="/login" />} />
        </Routes>
      </div>

      <footer className="bg-gray-800 text-white py-4 text-center mt-auto">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} M Raihan Mustofa | Fate/Grand Order Fan Site</p>
          <p className="text-gray-400 text-sm mt-1">All trademarks and copyrights belong to their respective owners.</p>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;