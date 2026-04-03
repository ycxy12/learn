/**
 * 菜单 API 服务
 */

import request from '../utils/request'

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
    return request.get('/menus')
  },

  /** 获取菜单树 */
  async getTree(): Promise<MenuItem[]> {
    return request.get('/menus/tree')
  },

  /** 新增菜单 */
  async create(data: CreateMenuData): Promise<MenuItem> {
    return request.post('/menus', data)
  },

  /** 更新菜单 */
  async update(id: number, data: Partial<CreateMenuData>): Promise<MenuItem> {
    return request.put(`/menus/${id}`, data)
  },

  /** 删除菜单 */
  async remove(id: number): Promise<void> {
    return request.delete(`/menus/${id}`)
  },
}
