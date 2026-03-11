/**
 * 📚 第四阶段 - 认证 API 服务
 */

const API_BASE = 'http://localhost:3000'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  access_token: string
  user: {
    id: number
    email: string
    name: string
  }
}

export const authApi = {
  async login(data: LoginData): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || '登录失败')
    }
    return res.json()
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || '注册失败')
    }
    return res.json()
  },
}
