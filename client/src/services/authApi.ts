/**
 * 📚 第四阶段 - 认证 API 服务
 */

import request from '../utils/request'

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
    permissions: string[]
  }
}

export const authApi = {
  async login(data: LoginData): Promise<AuthResponse> {
    return request.post('/auth/login', data)
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return request.post('/auth/register', data)
  },
}
