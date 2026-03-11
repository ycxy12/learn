/**
 * Todo 管理页面（Ant Design 风格）
 */

import { useState, useMemo } from 'react'
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  Modal,
  Form,
  Radio,
  message,
  Typography,
  Checkbox,
} from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { useTodos } from '../hooks/useTodos'
import type { Todo } from '../services/api'

const { Title } = Typography
const { Search } = Input
const { TextArea } = Input

type FilterType = 'all' | 'active' | 'completed'

export default function TodoPage() {
  const { todos, loading, error, addTodo, updateTodo, toggleTodo, deleteTodo, reload } = useTodos()

  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [form] = Form.useForm()

  const filteredTodos = useMemo(() => {
    return todos
      .filter((t) => {
        if (filter === 'active') return !t.completed
        if (filter === 'completed') return t.completed
        return true
      })
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
  }, [todos, filter, search])

  const stats = useMemo(
    () => ({
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      active: todos.filter((t) => !t.completed).length,
    }),
    [todos],
  )

  const openAdd = () => {
    setEditingTodo(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (todo: Todo) => {
    setEditingTodo(todo)
    form.setFieldsValue({ title: todo.title, description: todo.description })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingTodo) {
        await updateTodo(editingTodo.id, values)
        message.success('更新成功')
      } else {
        await addTodo(values.title)
        message.success('添加成功')
      }
      setModalOpen(false)
    } catch {
      // 表单验证失败
    }
  }

  const handleDelete = async (id: number) => {
    await deleteTodo(id)
    message.success('删除成功')
  }

  const handleClearCompleted = async () => {
    const completed = todos.filter((t) => t.completed)
    for (const todo of completed) {
      await deleteTodo(todo.id)
    }
    message.success(`已清除 ${completed.length} 条已完成任务`)
  }

  const columns = [
    {
      title: '',
      key: 'check',
      width: 48,
      render: (_: unknown, record: Todo) => (
        <Checkbox
          checked={record.completed}
          onChange={() => toggleTodo(record.id)}
        />
      ),
    },
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Todo) => (
        <span style={{ textDecoration: record.completed ? 'line-through' : 'none', color: record.completed ? '#999' : undefined }}>
          {text}
        </span>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: unknown, record: Todo) => (
        <Tag color={record.completed ? 'success' : 'processing'}>
          {record.completed ? '已完成' : '进行中'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (v: string) => new Date(v).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Todo) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="确认删除此任务？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            okType="danger"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Todo 管理
        </Title>
        <Space>
          {stats.completed > 0 && (
            <Popconfirm
              title={`确认清除全部 ${stats.completed} 条已完成任务？`}
              onConfirm={handleClearCompleted}
              okText="清除"
              okType="danger"
              cancelText="取消"
            >
              <Button danger>清除已完成 ({stats.completed})</Button>
            </Popconfirm>
          )}
          <Button icon={<ReloadOutlined />} onClick={reload}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            新增任务
          </Button>
        </Space>
      </div>

      {/* 搜索和筛选 */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="搜索任务..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        <Radio.Group
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="all">全部 ({stats.total})</Radio.Button>
          <Radio.Button value="active">进行中 ({stats.active})</Radio.Button>
          <Radio.Button value="completed">已完成 ({stats.completed})</Radio.Button>
        </Radio.Group>
      </Space>

      {/* 错误提示 */}
      {error && (
        <div style={{ color: '#ff4d4f', marginBottom: 12 }}>
          ⚠️ {error}{' '}
          <Button type="link" size="small" onClick={reload}>
            重试
          </Button>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={filteredTodos}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        bordered
        size="middle"
        locale={{ emptyText: search ? '没有找到匹配的任务' : '暂无任务，点击"新增任务"开始' }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingTodo ? '编辑任务' : '新增任务'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingTodo ? '保存' : '新增'}
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>
          <Form.Item name="description" label="任务描述">
            <TextArea rows={3} placeholder="选填" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
