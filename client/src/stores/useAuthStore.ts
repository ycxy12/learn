/**
 * 📚 第四阶段 - Zustand 用户状态管理
 * 
 * 💡 知识点：
 * - create 创建 store
 * - persist 中间件持久化到 localStorage
 * - 类型安全的状态管理
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  
  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      login: (user, token) => set({
        user,
        token,
        isLoggedIn: true,
      }),

      logout: () => set({
        user: null,
        token: null,
        isLoggedIn: false,
      }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'auth-storage',  // localStorage key
    }
  )
)

/**
 * 带认证的 fetch 封装
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  
  const res = await fetch(url, { ...options, headers })
  
  // 如果 401，自动登出
  if (res.status === 401) {
    useAuthStore.getState().logout()
  }
  
  return res
}
