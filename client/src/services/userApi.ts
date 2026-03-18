/**
 * 用户 API 服务
 */

import { fetchWithAuth } from '../stores/useAuthStore'

const API_BASE = 'http://localhost:3000'

export interface UserItem {
  id: number
  email: string
  name: string
  createdAt: string
  password?: string
  roles?: { id: number; name: string; code: string }[]
}

export interface CreateUserData {
  email: string
  name: string
  password?: string
  roleIds?: number[]
}

export const userApi = {
  /** 获取所有用户 */
  async getAll(): Promise<UserItem[]> {
    const res = await fetchWithAuth(`${API_BASE}/users`)
    if (!res.ok) throw new Error('获取用户失败')
    return res.json()
  },

  /** 新增用户 */
  async create(data: CreateUserData): Promise<UserItem> {
    const res = await fetchWithAuth(`${API_BASE}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || '新增用户失败')
    }
    return res.json()
  },

  /** 更新用户 */
  async update(id: number, data: Partial<CreateUserData>): Promise<UserItem> {
    const res = await fetchWithAuth(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || '更新用户失败')
    }
    return res.json()
  },

  /** 删除用户 */
  async remove(id: number): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('删除用户失败')
  },
}
