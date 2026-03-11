/**
 * 登录/注册页面（Ant Design 风格）
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Tabs, Alert, Typography } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useAuthStore } from '../stores/useAuthStore'
import { useMenuStore } from '../stores/useMenuStore'
import { authApi } from '../services/authApi'

const { Title, Text } = Typography

export default function AuthPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const fetchMenus = useMenuStore((s) => s.fetchMenus)

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form] = Form.useForm()

  const handleSubmit = async (values: Record<string, string>) => {
    setError(null)
    setLoading(true)
    try {
      let result
      if (mode === 'login') {
        result = await authApi.login({ email: values.email, password: values.password })
      } else {
        result = await authApi.register({
          email: values.email,
          password: values.password,
          name: values.name,
        })
      }
      login(result.user, result.access_token)
      await fetchMenus()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const tabItems = [
    { key: 'login', label: '登录' },
    { key: 'register', label: '注册' },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Card
        style={{ width: 400, borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        styles={{ body: { padding: '32px 32px 24px' } }}
      >
        {/* Logo / 标题 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <AppstoreOutlined style={{ fontSize: 40, color: '#1677ff' }} />
          <Title level={3} style={{ marginTop: 12, marginBottom: 4 }}>
            Admin 管理系统
          </Title>
          <Text type="secondary">React + NestJS 全栈学习项目</Text>
        </div>

        {/* 切换标签 */}
        <Tabs
          activeKey={mode}
          onChange={(k) => {
            setMode(k as 'login' | 'register')
            setError(null)
            form.resetFields()
          }}
          items={tabItems}
          centered
          style={{ marginBottom: 24 }}
        />

        {/* 错误提示 */}
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        {/* 表单 */}
        <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
          {mode === 'register' && (
            <Form.Item
              name="name"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效邮箱' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 位' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码（至少 6 位）" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ height: 44 }}
            >
              {mode === 'login' ? '登录' : '注册'}
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16, fontSize: 12 }}>
          💡 密码使用 bcrypt 加密存储
        </Text>
      </Card>
    </div>
  )
}
