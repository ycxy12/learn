/**
 * 用户 API 服务
 */

import request from '../utils/request'

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
    return request.get('/users')
  },

  /** 新增用户 */
  async create(data: CreateUserData): Promise<UserItem> {
    return request.post('/users', data)
  },

  /** 更新用户 */
  async update(id: number, data: Partial<CreateUserData>): Promise<UserItem> {
    return request.put(`/users/${id}`, data)
  },

  /** 删除用户 */
  async remove(id: number): Promise<void> {
    return request.delete(`/users/${id}`)
  },
}
