/**
 * 路由守卫：未登录自动重定向到 /login
 */
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}
