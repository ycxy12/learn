/**
 * 动态路由：根据 useMenuStore 中的菜单数据动态渲染路由
 */

import React, { Suspense, useMemo } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useMenuStore } from '../stores/useMenuStore'
import { Result, Button, Spin } from 'antd'

// 收集所有 page 组件 (注：生产环境下这会被 Rollup 处理为按需加载分块)
const modules = import.meta.glob('../pages/**/*.tsx')

function PlaceholderPage({ name, message }: { name: string; message?: string }) {
  const navigate = useNavigate()
  return (
    <Result
      status="info"
      title={`${name}`}
      subTitle={message || "该页面由菜单管理动态生成，暂未绑定实际组件。"}
      extra={
        <Button type="primary" onClick={() => navigate('/dashboard')}>
          返回仪表盘
        </Button>
      }
    />
  )
}

function PageLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '300px' }}>
      <Spin size="large" />
    </div>
  )
}

export default function DynamicRoutes() {
  const menus = useMenuStore((s) => s.menus)
  
  // 过滤有路径、非静态已注册路径的菜单项
  const staticPaths = new Set(['/dashboard', '/todos', '/menus', '/login'])
  const dynamicMenus = menus.filter(
    (m) => m.path && !staticPaths.has(m.path) && m.isVisible,
  )

  const routes = useMemo(() => {
    return dynamicMenus.map((m) => {
      // 若没有配置组件路径
      if (!m.component) {
        return (
          <Route
            key={m.id}
            path={m.path!.replace(/^\//, '')}
            element={<PlaceholderPage name={m.name} />}
          />
        )
      }

      // 组装文件匹配路径规则，假设组件都在 src/pages 目录下
      const matchPath = `../pages/${m.component}.tsx`
      const importFunc = modules[matchPath]

      if (!importFunc) {
        return (
           <Route
            key={m.id}
            path={m.path!.replace(/^\//, '')}
            element={<PlaceholderPage name={m.name} message={`未找到关联的组件文件: ${m.component}.tsx`} />}
          />
        )
      }

      // 如果找到了，通过 React.lazy 进行懒加载
      const LazyComponent = React.lazy(importFunc as () => Promise<{ default: React.ComponentType<unknown> }>)

      return (
        <Route
            key={m.id}
            path={m.path!.replace(/^\//, '')}
            element={
              <Suspense fallback={<PageLoading />}>
                <LazyComponent />
              </Suspense>
            }
          />
      )
    })
  }, [dynamicMenus])

  if (dynamicMenus.length === 0) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="页面不存在"
      />
    )
  }

  return (
    <Routes>
      {routes}
      <Route
        path="*"
        element={
          <Result
            status="404"
            title="404"
            subTitle="页面不存在"
          />
        }
      />
    </Routes>
  )
}
