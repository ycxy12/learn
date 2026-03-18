/**
 * 角色 API 服务
 */

import { fetchWithAuth } from '../stores/useAuthStore'
import { type MenuItem } from './menuApi'


const API_BASE = 'http://localhost:3000'

export interface Role {
  id: number
  name: string
  code: string
  description?: string
}

export interface CreateRoleDto {
  name: string
  code: string
  description?: string
}

export type UpdateRoleDto = Partial<CreateRoleDto>

export const roleApi = {
  /** 获取所有角色 */
  async findAll(): Promise<Role[]> {
    const res = await fetchWithAuth(`${API_BASE}/role`)
    if (!res.ok) throw new Error('获取角色失败')
    return res.json()
  },

  /** 获取单个角色 */
  async findOne(id: number): Promise<Role> {
    const res = await fetchWithAuth(`${API_BASE}/role/${id}`)
    if (!res.ok) throw new Error('获取详情失败')
    return res.json()
  },

  /** 创建角色 */
  async create(data: CreateRoleDto): Promise<Role> {
    const res = await fetchWithAuth(`${API_BASE}/role`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('创建角色失败')
    return res.json()
  },

  /** 更新角色 */
  async update(id: number, data: UpdateRoleDto): Promise<Role> {
    const res = await fetchWithAuth(`${API_BASE}/role/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('更新角色失败')
    return res.json()
  },

  /** 删除角色 */
  async remove(id: number): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/role/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('删除角色失败')
  },

  /** 获取角色的菜单权限 */
  async getMenus(id: number): Promise<MenuItem[]> {
    const res = await fetchWithAuth(`${API_BASE}/role/${id}/menus`)
    if (!res.ok) throw new Error('获取角色菜单失败')
    return res.json()
  },

  /** 分配角色的菜单权限 */
  async assignMenus(id: number, menuIds: number[]): Promise<MenuItem[]> {
    const res = await fetchWithAuth(`${API_BASE}/role/${id}/menus`, {
      method: 'POST',
      body: JSON.stringify({ menuIds }),
    })
    if (!res.ok) throw new Error('分配角色菜单失败')
    return res.json()
  },
}
