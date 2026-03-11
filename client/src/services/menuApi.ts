/**
 * 菜单 API 服务
 */

import { fetchWithAuth } from '../stores/useAuthStore'

const API_BASE = 'http://localhost:3000'

export interface MenuItem {
  id: number
  name: string
  path?: string
  icon?: string
  component?: string
  sort: number
  parentId?: number
  isVisible: boolean
  createdAt: string
  updatedAt: string
  children?: MenuItem[]
}

export interface CreateMenuData {
  name: string
  path?: string
  component?: string
  icon?: string
  sort?: number
  parentId?: number
  isVisible?: boolean
}

export const menuApi = {
  /** 获取所有菜单（平铺列表） */
  async getAll(): Promise<MenuItem[]> {
    const res = await fetchWithAuth(`${API_BASE}/menus`)
    if (!res.ok) throw new Error('获取菜单失败')
    return res.json()
  },

  /** 获取菜单树 */
  async getTree(): Promise<MenuItem[]> {
    const res = await fetchWithAuth(`${API_BASE}/menus/tree`)
    if (!res.ok) throw new Error('获取菜单树失败')
    return res.json()
  },

  /** 新增菜单 */
  async create(data: CreateMenuData): Promise<MenuItem> {
    const res = await fetchWithAuth(`${API_BASE}/menus`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('新增菜单失败')
    return res.json()
  },

  /** 更新菜单 */
  async update(id: number, data: Partial<CreateMenuData>): Promise<MenuItem> {
    const res = await fetchWithAuth(`${API_BASE}/menus/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('更新菜单失败')
    return res.json()
  },

  /** 删除菜单 */
  async remove(id: number): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/menus/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('删除菜单失败')
  },
}
