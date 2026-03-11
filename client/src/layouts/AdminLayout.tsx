/**
 * Admin 管理后台布局
 * Sider（动态菜单） + Header（用户信息） + Content
 */

import React, { useState, useEffect } from 'react'
import { Layout, Menu, Avatar, Dropdown, Button, theme, Typography } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  CheckSquareOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useMenuStore } from '../stores/useMenuStore'

const { Sider, Header, Content } = Layout
const { Text } = Typography

import type { MenuProps } from 'antd'

import * as Icons from '@ant-design/icons'

const renderIcon = (iconName: string | undefined): React.ReactNode => {
  if (!iconName) return null
  const IconsAny = Icons as Record<string, unknown>
  const AntdIcon = IconsAny[iconName] as React.ComponentType | undefined
  return AntdIcon ? React.createElement(AntdIcon) : null
}

// 静态固定菜单（始终存在）
const STATIC_MENUS = [
  { key: '/dashboard', label: '仪表盘', icon: <DashboardOutlined /> },
  { key: '/todos', label: 'Todo 管理', icon: <CheckSquareOutlined /> },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { menus, fetchMenus } = useMenuStore()

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  useEffect(() => {
    fetchMenus()
  }, [fetchMenus])

  // 动态菜单项（来自后端，去掉已在静态菜单中的路径）
  const staticPaths = new Set(STATIC_MENUS.map((m) => m.key))
  
  const buildMenuTree = () => {
    const validMenus = menus.filter(
      (m) => m.isVisible && (!m.path || !staticPaths.has(m.path))
    )
    
    // 按照 sort 字段升序排序
    validMenus.sort((a, b) => (a.sort || 0) - (b.sort || 0))

    type TreeNode = {
      key: string
      label: string
      icon: React.ReactNode | null
      children: TreeNode[]
      parentId?: number
    }

    const map: Record<number, TreeNode> = {}
    validMenus.forEach((m) => {
      map[m.id] = {
        key: m.path || `sub-${m.id}`, // 若目录无路由时使用生成的标识符
        label: m.name,
        icon: renderIcon(m.icon) ?? (m.parentId ? null : <AppstoreOutlined />),
        children: [],
        parentId: m.parentId,
      }
    })

    const roots: TreeNode[] = []
    validMenus.forEach((m) => {
      const node = map[m.id]
      if (node.parentId && map[node.parentId]) {
        map[node.parentId].children.push(node)
      } else {
        roots.push(node)
      }
    })

    type MenuItemType = Required<MenuProps>['items'][number]

    const clean = (nodes: TreeNode[]): MenuItemType[] =>
      nodes.map((n) => {
        if (n.children.length > 0) {
          return {
            key: n.key,
            label: n.label,
            icon: n.icon,
            children: clean(n.children),
          } as MenuItemType
        }
        return {
          key: n.key,
          label: n.label,
          icon: n.icon,
        } as MenuItemType
      })

    return clean(roots)
  }

  const dynamicMenuItems = buildMenuTree()

  const allMenuItems = [...STATIC_MENUS, ...dynamicMenuItems]

  const handleLogout = () => {
    logout()
    useMenuStore.getState().clearMenus()
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
      danger: true,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.1)' }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
        >
          <AppstoreOutlined style={{ fontSize: 22, color: '#1677ff' }} />
          {!collapsed && (
            <Text
              strong
              style={{ color: '#fff', marginLeft: 10, fontSize: 16, whiteSpace: 'nowrap' }}
            >
              Admin 后台
            </Text>
          )}
        </div>

        {/* 导航菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={allMenuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>

      <Layout>
        {/* 顶部 Header */}
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18 }}
          />

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
              <Text>{user?.name ?? user?.email ?? '用户'}</Text>
            </div>
          </Dropdown>
        </Header>

        {/* 内容区 */}
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: 8,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
