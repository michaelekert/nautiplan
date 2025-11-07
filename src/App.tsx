import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SkipperView from './pages/SkipperView'
import StudyView from './pages/StudyView'
import PassagePlan from './components/PassagePlan'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useAuthContext } from './context/AuthContext'

type ProtectedRouteProps = { children: React.ReactNode }

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuthContext()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/passage-view" element={<ProtectedRoute><PassagePlan /></ProtectedRoute>} />
      <Route path="/skipper-view" element={<ProtectedRoute><SkipperView /></ProtectedRoute>} />
      <Route path="/study-view" element={<ProtectedRoute><StudyView /></ProtectedRoute>} />
    </Routes>
  )
}
