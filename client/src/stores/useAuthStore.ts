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
  permissions: string[]
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
