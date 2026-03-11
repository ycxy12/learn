/**
 * 📚 React 实战 - useTodos 自定义 Hook
 * 
 * 💡 知识点：
 * - 将状态逻辑从组件中提取出来
 * - useCallback 缓存函数，避免不必要的重渲染
 * - 统一管理 loading 和 error 状态
 */

import { useState, useEffect, useCallback } from 'react'
import { todoApi } from '../services/api'
import type { Todo } from '../services/api'

export interface UseTodosReturn {
  todos: Todo[]
  loading: boolean
  error: string | null
  addTodo: (title: string) => Promise<void>
  updateTodo: (id: number, data: Partial<Todo>) => Promise<void>
  toggleTodo: (id: number) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
  reload: () => Promise<void>
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * 加载所有 Todo
   * 使用 useCallback 缓存函数
   */
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await todoApi.getAll()
      setTodos(data)
    } catch {
      setError('加载失败，请确保后端已启动')
    } finally {
      setLoading(false)
    }
  }, [])

  // 组件挂载时加载数据
  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  /**
   * 添加新 Todo
   */
  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = await todoApi.create({ title })
      setTodos(prev => [newTodo, ...prev])
    } catch {
      setError('添加失败')
      throw new Error('添加失败')
    }
  }, [])

  /**
   * 更新 Todo
   */
  const updateTodo = useCallback(async (id: number, data: Partial<Todo>) => {
    try {
      const updated = await todoApi.update(id, data)
      setTodos(prev => prev.map(t => t.id === id ? updated : t))
    } catch {
      setError('更新失败')
      throw new Error('更新失败')
    }
  }, [])

  /**
   * 切换完成状态
   */
  const toggleTodo = useCallback(async (id: number) => {
    try {
      const updated = await todoApi.toggle(id)
      setTodos(prev => prev.map(t => t.id === id ? updated : t))
    } catch {
      setError('切换状态失败')
    }
  }, [])

  /**
   * 删除 Todo
   */
  const deleteTodo = useCallback(async (id: number) => {
    try {
      await todoApi.delete(id)
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch {
      setError('删除失败')
    }
  }, [])

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    reload: loadTodos,
  }
}
