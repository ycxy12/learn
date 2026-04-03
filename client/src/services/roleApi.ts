/**
 * 角色 API 服务
 */

import request from '../utils/request'
import { type MenuItem } from './menuApi'

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
    return request.get('/role')
  },

  /** 获取单个角色 */
  async findOne(id: number): Promise<Role> {
    return request.get(`/role/${id}`)
  },

  /** 创建角色 */
  async create(data: CreateRoleDto): Promise<Role> {
    return request.post('/role', data)
  },

  /** 更新角色 */
  async update(id: number, data: UpdateRoleDto): Promise<Role> {
    return request.patch(`/role/${id}`, data)
  },

  /** 删除角色 */
  async remove(id: number): Promise<void> {
    return request.delete(`/role/${id}`)
  },

  /** 获取角色的菜单权限 */
  async getMenus(id: number): Promise<MenuItem[]> {
    return request.get(`/role/${id}/menus`)
  },

  /** 分配角色的菜单权限 */
  async assignMenus(id: number, menuIds: number[]): Promise<MenuItem[]> {
    return request.post(`/role/${id}/menus`, { menuIds })
  },
}
