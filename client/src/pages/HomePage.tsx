/**
 * 📚 第四阶段 - 首页组件 (含用户状态)
 */

import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export default function HomePage() {
  const { user, isLoggedIn, logout } = useAuthStore()

  return (
    <div className="page">
      {/* 用户状态栏 */}
      <div className="user-bar">
        {isLoggedIn ? (
          <div className="user-info">
            <span>👤 {user?.name}</span>
            <button className="btn-link" onClick={logout}>退出</button>
          </div>
        ) : (
          <Link to="/auth" className="btn-link">登录 / 注册</Link>
        )}
      </div>

      <h1>🚀 React + NestJS 全栈学习</h1>
      <p className="subtitle">第四阶段：Zustand 状态管理、JWT 认证、Swagger 文档</p>

      <div className="card-grid">
        <Link to="/todos" className="nav-card">
          <span className="card-icon">📝</span>
          <h3>Todo 应用</h3>
          <p>全栈 CRUD 实战项目</p>
        </Link>

        <Link to="/auth" className="nav-card">
          <span className="card-icon">🔐</span>
          <h3>用户认证</h3>
          <p>登录、注册、JWT</p>
        </Link>

        <a href="http://localhost:3000/api" target="_blank" className="nav-card">
          <span className="card-icon">📚</span>
          <h3>API 文档</h3>
          <p>Swagger 自动生成</p>
        </a>

        <Link to="/examples" className="nav-card">
          <span className="card-icon">💡</span>
          <h3>基础示例</h3>
          <p>React 组件学习</p>
        </Link>
      </div>

      <div className="card">
        <h3>📖 学习进度</h3>
        <ul className="feature-list">
          <li>✅ 第一阶段 - React 组件、NestJS 模块</li>
          <li>✅ 第二阶段 - useEffect、路由、DTO、TypeORM</li>
          <li>✅ 第三阶段 - 自定义 Hook、筛选搜索</li>
          <li>✅ 第四阶段 - Zustand、JWT、Swagger</li>
        </ul>
      </div>
    </div>
  )
}
