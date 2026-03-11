/**
 * 📚 React 实战 - TodoItem 组件
 * 
 * 💡 知识点：
 * - 组件拆分，职责单一
 * - 双击编辑功能
 * - 受控输入框
 */

import { useState } from 'react'
import type { Todo } from '../services/api'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void>
  onDelete: (id: number) => void
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.title)

  /**
   * 保存编辑
   */
  const handleSave = async () => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== todo.title) {
      await onUpdate(todo.id, { title: trimmed })
    } else {
      setEditText(todo.title)  // 恢复原值
    }
    setEditing(false)
  }

  /**
   * 键盘事件处理
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditText(todo.title)
      setEditing(false)
    }
  }

  /**
   * 双击进入编辑模式
   */
  const handleDoubleClick = () => {
    if (!todo.completed) {
      setEditing(true)
      setEditText(todo.title)
    }
  }

  if (editing) {
    return (
      <li className="todo-item editing">
        <input
          type="text"
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </li>
    )
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <label className="todo-label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span
          className={todo.completed ? 'line-through' : ''}
          onDoubleClick={handleDoubleClick}
          title="双击编辑"
        >
          {todo.title}
        </span>
      </label>
      <button className="btn-remove" onClick={() => onDelete(todo.id)}>
        ❌
      </button>
    </li>
  )
}
