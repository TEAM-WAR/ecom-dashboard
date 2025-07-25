import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  Row,
  Col,
  message,
  Popconfirm,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import apiClient from '../services/apiClient';

const { TextArea } = Input;

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // Load categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      message.error('Error loading categories');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories
  const filteredCategories = categories.filter(category => {
    return !searchText || 
      category.name.toLowerCase().includes(searchText.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchText.toLowerCase());
  });

  // Show modal for create/edit
  const showModal = (category = null) => {
    setEditingCategory(category);
    
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        await apiClient.put(`/categories/${editingCategory._id}`, values);
        message.success('Category updated successfully');
      } else {
        await apiClient.post('/categories', values);
        message.success('Category created successfully');
      }

      handleCancel();
      fetchCategories();
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
      console.error('Error:', error);
    }
  };

  // Delete category
  const handleDelete = async (categoryId) => {
    try {
      await apiClient.delete(`/categories/${categoryId}`);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      message.error('Delete failed');
      console.error('Error:', error);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || <span className="text-gray-400">No description</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Category Management
          </h1>
          <p className="text-gray-600">
            Manage your product categories
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={18} md={10}>
              <Input
                placeholder="Search categories..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={6} md={14} className="text-right">
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSearchText('');
                    fetchCategories();
                  }}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showModal()}
                >
                  Add Category
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Categories Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} categories`
            }}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={editingCategory ? 'Edit Category' : 'Add Category'}
          open={modalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: 'Name is required' },
                { max: 50, message: 'Name cannot exceed 50 characters' }
              ]}
            >
              <Input placeholder="Category name" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { max: 200, message: 'Description cannot exceed 200 characters' }
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Category description..."
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Category;