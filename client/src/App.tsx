/**
 * 主应用路由配置（Ant Design 管理后台）
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import AuthGuard from './components/AuthGuard'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import TodoPage from './pages/TodoPage'
import DynamicRoutes from './router/DynamicRoutes'

function App() {
  return (
    <Routes>
      {/* 登录页（独立，不走 Layout） */}
      <Route path="/login" element={<AuthPage />} />

      {/* 管理后台（需登录） */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <AdminLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="todos" element={<TodoPage />} />

        {/* 动态路由：根据菜单数据生成 */}
        <Route path="/*" element={<DynamicRoutes />} />
      </Route>
    </Routes>
  )
}

export default App
