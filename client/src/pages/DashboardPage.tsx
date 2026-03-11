/**
 * 仪表盘首页
 */

import { useEffect, useState } from 'react'
import { Card, Col, Row, Statistic, Typography, List, Tag, Skeleton } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  OrderedListOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '../stores/useAuthStore'
import { todoApi, type Todo } from '../services/api'

const { Title, Text } = Typography

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    todoApi
      .getAll()
      .then(setTodos)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  const active = total - completed
  const recent = todos.slice(0, 5)

  return (
    <div>
      <Title level={4} style={{ marginBottom: 4 }}>
        <SmileOutlined style={{ marginRight: 8 }} />
        欢迎回来，{user?.name ?? user?.email}！
      </Title>
      <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
        这是你的管理后台，今天也要加油哦 🚀
      </Text>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Skeleton loading={loading} active>
              <Statistic
                title="全部任务"
                value={total}
                prefix={<OrderedListOutlined />}
                valueStyle={{ color: '#1677ff' }}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Skeleton loading={loading} active>
              <Statistic
                title="已完成"
                value={completed}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Skeleton loading={loading} active>
              <Statistic
                title="待完成"
                value={active}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Skeleton>
          </Card>
        </Col>
      </Row>

      {/* 最近任务 */}
      <Card title="最近任务" variant="outlined">
        <Skeleton loading={loading} active>
          <List
            dataSource={recent}
            locale={{ emptyText: '暂无任务，去 Todo 管理添加吧！' }}
            renderItem={(item) => (
              <List.Item
                extra={
                  <Tag color={item.completed ? 'success' : 'processing'}>
                    {item.completed ? '已完成' : '进行中'}
                  </Tag>
                }
              >
                <Text delete={item.completed}>{item.title}</Text>
              </List.Item>
            )}
          />
        </Skeleton>
      </Card>
    </div>
  )
}
