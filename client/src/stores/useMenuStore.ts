/**
 * 菜单状态管理 Store
 */

import { create } from 'zustand'
import { menuApi, type MenuItem } from '../services/menuApi'

interface MenuState {
  menus: MenuItem[]
  loading: boolean
  fetchMenus: () => Promise<void>
  clearMenus: () => void
}

export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  loading: false,

  fetchMenus: async () => {
    try {
      set({ loading: true })
      const data = await menuApi.getAll()
      set({ menus: data })
    } catch {
      // 静默处理，未登录时可能失败
    } finally {
      set({ loading: false })
    }
  },

  clearMenus: () => set({ menus: [] }),
}))
