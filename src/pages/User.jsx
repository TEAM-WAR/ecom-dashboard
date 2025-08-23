import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip,
  InputNumber,
  Select,
  DatePicker,
  Avatar,
  Typography,
  Divider,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EyeOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import userService from '../services/userService';

const { Title, Text } = Typography;
const { Option } = Select;

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('Ajouter un utilisateur');
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({});

  // Fetch users
  const fetchUsers = async (page = 1, pageSize = 10, search = '', filterParams = {}) => {
    try {
      setLoading(true);
      const params = {
        page,
        pageSize,
        search,
        ...filterParams
      };
      
      const response = await userService.getAllUsers(params);
      console.log('Users response:', response); // Debug log
      setUsers(response.data || []);
      setPagination({
        current: response.page || 1,
        pageSize: response.pageSize || 10,
        total: response.total || 0,
      });
    } catch (error) {
      message.error(error.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle table change (pagination, filters, sorter)
  const handleTableChange = (paginationInfo, filters) => {
    fetchUsers(
      paginationInfo.current,
      paginationInfo.pageSize,
      searchText,
      filters
    );
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    fetchUsers(1, pagination.pageSize, value, filters);
  };

  // Handle filters (for future use)
  const _handleFilters = (filterParams) => {
    setFilters(filterParams);
    fetchUsers(1, pagination.pageSize, searchText, filterParams);
  };

  // Open modal for create/edit
  const showModal = (user = null) => {
    setEditingUser(user);
    setModalTitle(user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur');
    setModalVisible(true);
    
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        role: user.role || 'admin',
      });
    } else {
      form.resetFields();
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        const userId = editingUser._id || editingUser.id;
        await userService.updateUser(userId, values);
        message.success('Utilisateur modifié avec succès');
      } else {
        await userService.createUser(values);
        message.success('Utilisateur créé avec succès');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchUsers(pagination.current, pagination.pageSize, searchText, filters);
    } catch (error) {
      message.error(error.message || 'Erreur lors de l\'opération');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      console.log('Deleting user with ID:', id); // Debug log
      await userService.deleteUser(id);
      message.success('Utilisateur supprimé avec succès');
      fetchUsers(pagination.current, pagination.pageSize, searchText, filters);
    } catch (error) {
      message.error(error.message || 'Erreur lors de la suppression');
    }
  };

  // Handle view user details
  const handleView = async (id) => {
    try {
      const user = await userService.getUserById(id);
      Modal.info({
        title: 'Détails de l\'utilisateur',
        width: 600,
        content: (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Nom:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Téléphone:</strong> {user.telephone}</p>
              </Col>
              <Col span={12}>
                <p><strong>Rôle:</strong> <Tag color="blue">{user.role || 'admin'}</Tag></p>
                <p><strong>Créé le:</strong> {dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                <p><strong>Dernière connexion:</strong> {user.lastLogin ? dayjs(user.lastLogin).format('DD/MM/YYYY HH:mm') : 'Jamais'}</p>
              </Col>
            </Row>
          </div>
        ),
      });
    } catch (error) {
      message.error(error.message || 'Erreur lors du chargement des détails');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Utilisateur',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar 
            style={{ backgroundColor: '#87d068' }} 
            icon={<UserOutlined />} 
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <MailOutlined /> {record.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
      render: (telephone) => (
        <Space>
          <PhoneOutlined />
          {telephone}
        </Space>
      ),
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'super_admin' ? 'red' : 'blue'}>
          {role === 'super_admin' ? 'Super Admin' : 'Admin'}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Super Admin', value: 'super_admin' },
      ],
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_, record) => (
        <Badge 
          status={record.lastLogin ? 'success' : 'default'} 
          text={record.lastLogin ? 'Actif' : 'Inactif'} 
        />
      ),
    },
    {
      title: 'Dernière connexion',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin) => (
        lastLogin ? dayjs(lastLogin).format('DD/MM/YYYY HH:mm') : 'Jamais'
      ),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Voir les détails">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleView(record._id || record.id)}
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
              onConfirm={() => {
                console.log('Record being deleted:', record); // Debug log
                handleDelete(record._id || record.id);
              }}
              okText="Oui"
              cancelText="Non"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Statistics
  const stats = {
    total: pagination.total,
    active: users.filter(user => user.lastLogin).length,
    inactive: users.filter(user => !user.lastLogin).length,
    superAdmins: users.filter(user => user.role === 'super_admin').length,
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Gestion des Utilisateurs</Title>
      
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Utilisateurs"
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Utilisateurs Actifs"
              value={stats.active}
              valueStyle={{ color: '#3f8600' }}
              prefix={<Badge status="success" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Utilisateurs Inactifs"
              value={stats.inactive}
              valueStyle={{ color: '#cf1322' }}
              prefix={<Badge status="default" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Super Admins"
              value={stats.superAdmins}
              valueStyle={{ color: '#1890ff' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="Rechercher par nom, email ou téléphone..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ maxWidth: '400px' }}
            />
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<FilterOutlined />}
                onClick={() => {
                  // Add filter modal here if needed
                  message.info('Filtres avancés à implémenter');
                }}
              >
                Filtres
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => fetchUsers(pagination.current, pagination.pageSize, searchText, filters)}
                loading={loading}
              >
                Actualiser
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => showModal()}
              >
                Ajouter un utilisateur
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey={(record) => record._id || record.id}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} sur ${total} utilisateurs`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ role: 'admin' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Nom complet"
                rules={[
                  { required: true, message: 'Veuillez saisir le nom' },
                  { min: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nom complet" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Rôle"
                rules={[{ required: true, message: 'Veuillez sélectionner un rôle' }]}
              >
                <Select placeholder="Sélectionner un rôle">
                  <Option value="admin">Admin</Option>
                  <Option value="super_admin">Super Admin</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Veuillez saisir l\'email' },
                  { type: 'email', message: 'Veuillez saisir un email valide' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="email@exemple.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="telephone"
                label="Téléphone"
                rules={[
                  { required: true, message: 'Veuillez saisir le téléphone' },
                  { pattern: /^[0-9+\-\s()]+$/, message: 'Veuillez saisir un numéro valide' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="+1234567890" />
              </Form.Item>
            </Col>
          </Row>

          {!editingUser && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Mot de passe"
                  rules={[
                    { required: true, message: 'Veuillez saisir le mot de passe' },
                    { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                  ]}
                >
                  <Input.Password placeholder="Mot de passe" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Veuillez confirmer le mot de passe' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirmer le mot de passe" />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Divider />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                Annuler
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;