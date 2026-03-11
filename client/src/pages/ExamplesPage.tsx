/**
 * 📚 React 进阶 - 基础示例页面
 * 
 * 将第一阶段的示例移到单独的页面
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'

// 按钮组件
interface ButtonProps {
  text: string
  onClick: () => void
  variant?: 'primary' | 'danger'
}

function Button({ text, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {text}
    </button>
  )
}

// 计数器组件
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="example-section">
      <h4>🔢 计数器</h4>
      <p>当前计数: <strong>{count}</strong></p>
      <div className="button-group">
        <Button text="-1" onClick={() => setCount(count - 1)} variant="danger" />
        <Button text="+1" onClick={() => setCount(count + 1)} />
        <Button text="重置" onClick={() => setCount(0)} variant="danger" />
      </div>
    </div>
  )
}

// 输入框组件
function TextInput() {
  const [text, setText] = useState('')

  return (
    <div className="example-section">
      <h4>📝 输入框</h4>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="在这里输入..."
        className="input"
      />
      <p>你输入的内容: <strong>{text || '(空)'}</strong></p>
    </div>
  )
}

// 列表渲染组件
function ListDemo() {
  const [items, setItems] = useState(['React', 'NestJS', 'TypeScript'])
  const [input, setInput] = useState('')

  const addItem = () => {
    if (input.trim()) {
      setItems([...items, input.trim()])
      setInput('')
    }
  }

  return (
    <div className="example-section">
      <h4>📋 列表渲染</h4>
      <div className="todo-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder="添加项目..."
          className="input"
        />
        <Button text="添加" onClick={addItem} />
      </div>
      <ul className="simple-list">
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button
              className="btn-remove"
              onClick={() => setItems(items.filter((_, i) => i !== index))}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ExamplesPage() {
  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/">首页</Link>
        <span> / </span>
        <span>基础示例</span>
      </nav>

      <h1>📚 基础示例</h1>
      <p className="subtitle">第一阶段学习的组件示例</p>

      <div className="card">
        <Counter />
      </div>

      <div className="card">
        <TextInput />
      </div>

      <div className="card">
        <ListDemo />
      </div>
    </div>
  )
}
