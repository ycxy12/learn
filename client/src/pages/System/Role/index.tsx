/**
 * 角色管理页面
 * 列表表格 + Modal 新增/编辑/删除
 */

import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  Space,
  Typography,
  message,
  Tree,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { roleApi, type Role, type CreateRoleDto } from '@/services/roleApi'
import { menuApi, type MenuItem } from '@/services/menuApi'

const { Title, Text } = Typography

export default function RoleManagePage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [form] = Form.useForm()

  const [rightsModalOpen, setRightsModalOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [menuTreeData, setMenuTreeData] = useState<MenuItem[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [menusLoading, setMenusLoading] = useState(false)

  const loadRoles = useCallback(async () => {
    setLoading(true)
    try {
      const data = await roleApi.findAll()
      setRoles(data)
    } catch {
      message.error('加载角色失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRoles()
  }, [loadRoles])

  const openAdd = () => {
    setEditingRole(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: Role) => {
    setEditingRole(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await roleApi.remove(id)
      message.success('删除成功')
      await loadRoles()
    } catch {
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values: CreateRoleDto = await form.validateFields()
      if (editingRole) {
        await roleApi.update(editingRole.id, values)
        message.success('更新成功')
      } else {
        await roleApi.create(values)
        message.success('新增成功')
      }
      setModalOpen(false)
      await loadRoles()
    } catch {
      // 表单验证失败
    }
  }

  const openRights = async (record: Role) => {
    setCurrentRole(record)
    setRightsModalOpen(true)
    setMenusLoading(true)
    try {
      const tree = await menuApi.getTree()
      setMenuTreeData(tree)

      const roleMenus = await roleApi.getMenus(record.id)
      const keys = roleMenus.map((m) => m.id)
      setCheckedKeys(keys)
    } catch {
      message.error('获取权限数据失败')
    } finally {
      setMenusLoading(false)
    }
  }

  const handleRightsSubmit = async () => {
    if (!currentRole) return
    try {
      await roleApi.assignMenus(currentRole.id, checkedKeys.map(Number))
      message.success('更新权限成功')
      setRightsModalOpen(false)
    } catch {
      message.error('更新权限失败')
    }
  }

  const onCheck = (checkedKeysValue: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    if (Array.isArray(checkedKeysValue)) {
      setCheckedKeys(checkedKeysValue)
    } else {
      setCheckedKeys(checkedKeysValue.checked)
    }
  }

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 200,
      render: (v: string) => <Text code>{v}</Text>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (v: string) => v || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: unknown, record: Role) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SafetyCertificateOutlined />}
            onClick={() => openRights(record)}
          >
            权限
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除此角色吗？"
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
        <Title level={4} style={{ margin: 0 }}>角色管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadRoles}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            新增角色
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        bordered
        size="middle"
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingRole ? '保存' : '新增'}
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="如：管理员" />
          </Form.Item>

          <Form.Item
            name="code"
            label="角色编码"
            rules={[
              { required: true, message: '请输入角色编码' },
              { pattern: /^[a-zA-Z_]+$/, message: '角色编码只能包含英文字母和下划线' }
            ]}
          >
            <Input placeholder="如：admin (仅英文字母和下划线)" />
          </Form.Item>

          <Form.Item name="description" label="角色描述">
            <Input.TextArea placeholder="请输入角色描述" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限分配弹窗 */}
      <Modal
        title={`分配权限: ${currentRole?.name || ''}`}
        open={rightsModalOpen}
        onOk={handleRightsSubmit}
        onCancel={() => setRightsModalOpen(false)}
        okText="保存权限"
        cancelText="取消"
        destroyOnHidden
      >
        <div style={{ marginTop: 16, maxHeight: 400, overflow: 'auto' }}>
          {menusLoading ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>加载中...</div>
          ) : (
            <Tree
              checkable
              defaultExpandAll
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              treeData={menuTreeData}
              fieldNames={{ title: 'name', key: 'id', children: 'children' }}
            />
          )}
        </div>
      </Modal>
    </div>
  )
}
