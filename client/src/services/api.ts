/**
 * 📚 React 进阶 - API 服务封装
 * 
 * 将 API 调用封装成独立模块，便于复用和维护
 */

import request from '../utils/request';

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
    return request.get('/todos');
  },

  /**
   * 获取单个 Todo
   */
  async getById(id: number): Promise<Todo> {
    return request.get(`/todos/${id}`);
  },

  /**
   * 创建 Todo
   */
  async create(data: { title: string; description?: string }): Promise<Todo> {
    return request.post('/todos', data);
  },

  /**
   * 更新 Todo
   */
  async update(id: number, data: Partial<Todo>): Promise<Todo> {
    return request.put(`/todos/${id}`, data);
  },

  /**
   * 切换完成状态
   */
  async toggle(id: number): Promise<Todo> {
    return request.put(`/todos/${id}/toggle`);
  },

  /**
   * 删除 Todo
   */
  async delete(id: number): Promise<void> {
    return request.delete(`/todos/${id}`);
  },
};
