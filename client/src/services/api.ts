/**
 * 📚 React 进阶 - API 服务封装
 * 
 * 将 API 调用封装成独立模块，便于复用和维护
 */

const API_BASE = 'http://localhost:3000';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const todoApi = {
  /**
   * 获取所有 Todo
   */
  async getAll(): Promise<Todo[]> {
    const res = await fetch(`${API_BASE}/todos`);
    if (!res.ok) throw new Error('获取失败');
    return res.json();
  },

  /**
   * 获取单个 Todo
   */
  async getById(id: number): Promise<Todo> {
    const res = await fetch(`${API_BASE}/todos/${id}`);
    if (!res.ok) throw new Error('获取失败');
    return res.json();
  },

  /**
   * 创建 Todo
   */
  async create(data: { title: string; description?: string }): Promise<Todo> {
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('创建失败');
    return res.json();
  },

  /**
   * 更新 Todo
   */
  async update(id: number, data: Partial<Todo>): Promise<Todo> {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('更新失败');
    return res.json();
  },

  /**
   * 切换完成状态
   */
  async toggle(id: number): Promise<Todo> {
    const res = await fetch(`${API_BASE}/todos/${id}/toggle`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('切换失败');
    return res.json();
  },

  /**
   * 删除 Todo
   */
  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('删除失败');
  },
};
