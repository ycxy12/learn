/**
 * 菜单管理页面
 * 树形表格 + Modal 新增/编辑/删除
 */

import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Popconfirm,
  Space,
  Tag,
  Typography,
  message,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { menuApi, type MenuItem, type CreateMenuData } from '@/services/menuApi'
import { useMenuStore } from '@/stores/useMenuStore'

const { Title } = Typography

// 将平铺列表构建为带 children 的树形
function buildTree(items: MenuItem[]): MenuItem[] {
  const map: Record<number, MenuItem> = {}
  items.forEach((i) => (map[i.id] = { ...i, children: [] }))
  const roots: MenuItem[] = []
  items.forEach((i) => {
    if (i.parentId && map[i.parentId]) {
      map[i.parentId].children!.push(map[i.id])
    } else {
      roots.push(map[i.id])
    }
  })
  // 移除空 children
  const clean = (nodes: MenuItem[]): MenuItem[] =>
    nodes.map((n) => ({ ...n, children: n.children?.length ? clean(n.children) : undefined }))
  return clean(roots)
}

export default function MenuManagePage() {
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)
  const [form] = Form.useForm()
  const { fetchMenus } = useMenuStore()

  const loadMenus = useCallback(async () => {
    setLoading(true)
    try {
      const data = await menuApi.getAll()
      setMenus(data)
    } catch {
      message.error('加载菜单失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMenus()
  }, [loadMenus])

  const openAdd = () => {
    setEditingMenu(null)
    form.resetFields()
    form.setFieldsValue({ isVisible: true, sort: 0 })
    setModalOpen(true)
  }

  const openEdit = (record: MenuItem) => {
    setEditingMenu(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await menuApi.remove(id)
      message.success('删除成功')
      await loadMenus()
      await fetchMenus() // 更新侧边栏
    } catch {
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values: CreateMenuData = await form.validateFields()
      if (editingMenu) {
        await menuApi.update(editingMenu.id, values)
        message.success('更新成功')
      } else {
        await menuApi.create(values)
        message.success('新增成功')
      }
      setModalOpen(false)
      await loadMenus()
      await fetchMenus() // 更新侧边栏
    } catch {
      // 表单验证失败
    }
  }

  const treeData = buildTree(menus)

  // 父菜单选项（仅顶级）
  const parentOptions = menus
    .filter((m) => !m.parentId)
    .map((m) => ({ value: m.id, label: m.name }))

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      key: 'path',
      render: (v: string) => v ? <Tag>{v}</Tag> : '-',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (v: string) => v || '-',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      render: (v: string) => v || '-',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '显示',
      dataIndex: 'isVisible',
      key: 'isVisible',
      width: 80,
      render: (v: boolean) => <Tag color={v ? 'success' : 'default'}>{v ? '显示' : '隐藏'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: unknown, record: MenuItem) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="删除后无法恢复，且子菜单将失去父级关联"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            okType="danger"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>菜单管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadMenus}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            新增菜单
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={treeData}
        rowKey="id"
        loading={loading}
        expandable={{ defaultExpandAllRows: true }}
        pagination={false}
        bordered
        size="middle"
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingMenu ? '编辑菜单' : '新增菜单'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingMenu ? '保存' : '新增'}
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="如：用户管理" />
          </Form.Item>

          <Form.Item name="path" label="路由路径">
            <Input placeholder="如：/users（需以 / 开头）" />
          </Form.Item>

          <Form.Item name="component" label="组件路径">
            <Input placeholder="由于页面懒加载配置，此处请填写如：System/Menu/index" />
          </Form.Item>

          <Form.Item name="icon" label="图标名称">
            <Input placeholder="如：UserOutlined（Ant Design 图标名）" />
          </Form.Item>

          <Form.Item name="parentId" label="父菜单（不选则为顶级）">
            <Select
              allowClear
              placeholder="请选择父菜单"
              options={parentOptions}
            />
          </Form.Item>

          <Form.Item name="sort" label="排序（数字小排前）">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="isVisible" label="是否显示" valuePropName="checked">
            <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
