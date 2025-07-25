import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Card,
  Row,
  Col,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  DatePicker,
  Statistic,
  Divider,
  Typography,
  Badge,
  Tabs,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import apiClient from '../services/apiClient';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StockTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    product: '',
    dateRange: []
  });
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');

  // Load transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 100,
        ...(filters.type && { type: filters.type }),
        ...(filters.product && { product: filters.product }),
        ...(filters.dateRange?.length === 2 && {
          startDate: filters.dateRange[0].toISOString(),
          endDate: filters.dateRange[1].toISOString()
        })
      };

      const response = await apiClient.get('/transactions', { params });
      setTransactions(response.data.data || []);
    } catch (error) {
      message.error('Failed to load transactions');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load products
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products');
      console.log(response.data.data);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  // Load stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const params = {};
      if (filters.dateRange?.length === 2) {
        params.startDate = filters.dateRange[0].toISOString();
        params.endDate = filters.dateRange[1].toISOString();
      }

      const response = await apiClient.get('/transactions/stats', { params });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    } else {
      fetchStats();
    }
  }, [filters, activeTab]);

  // Show modal for create/edit
  const showModal = (transaction = null) => {
    setEditingTransaction(transaction);
    
    if (transaction) {
      form.setFieldsValue({
        ...transaction,
        product: transaction.product._id
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingTransaction(null);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (editingTransaction) {
        await apiClient.put(`/transactions/${editingTransaction._id}`, values);
        message.success('Transaction updated successfully');
      } else {
        await apiClient.post('/transactions', values);
        message.success('Transaction created successfully');
      }

      handleCancel();
      fetchTransactions();
      fetchStats(); // Refresh stats after transaction change
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        (editingTransaction ? 'Update failed' : 'Creation failed');
      message.error(errorMessage);
      console.error('Error:', error);
    }
  };

  // Delete transaction
  const handleDelete = async (transactionId) => {
    try {
      await apiClient.delete(`/transactions/${transactionId}`);
      message.success('Transaction deleted successfully');
      fetchTransactions();
      fetchStats(); // Refresh stats after deletion
    } catch (error) {
      message.error('Delete failed');
      console.error('Error:', error);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: 'Product',
      dataIndex: ['product', 'name'],
      key: 'product',
      render: (text, record) => (
        <div className="flex items-center">
          <Tag color="blue" className="mr-2">
            {record.product?.stockQuantity} in stock
          </Tag>
          {text}
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag 
          color={type === 'entree' ? 'green' : 'red'} 
          icon={type === 'entree' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        >
          {type === 'entree' ? 'IN' : 'OUT'}
        </Tag>
      ),
      filters: [
        { text: 'IN', value: 'entree' },
        { text: 'OUT', value: 'sortie' }
      ],
      onFilter: (value, record) => record.type === value
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <Text strong={record.type === 'entree'} type={record.type === 'entree' ? 'success' : 'danger'}>
          {record.type === 'entree' ? '+' : '-'}{quantity}
        </Text>
      ),
      sorter: (a, b) => a.quantity - b.quantity
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
            title="Delete this transaction?"
            description="This will also update the product stock"
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
          <Title level={3} className="mb-1">Stock Transactions</Title>
          <Text type="secondary">Manage inventory movements</Text>
        </div>

        {/* Tabs */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'transactions',
              label: (
                <span>
                  <FilterOutlined />
                  Transactions
                </span>
              )
            },
            {
              key: 'stats',
              label: (
                <span>
                  <LineChartOutlined />
                  Statistics
                </span>
              )
            }
          ]}
        />

        {activeTab === 'transactions' ? (
          <>
            {/* Filters */}
            <Card className="mb-6">
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={6}>
                  <Select
                    placeholder="Filter by type"
                    allowClear
                    value={filters.type}
                    onChange={(value) => setFilters({ ...filters, type: value })}
                    style={{ width: '100%' }}
                    options={[
                      { value: 'entree', label: 'IN' },
                      { value: 'sortie', label: 'OUT' }
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Select
                    placeholder="Filter by product"
                    allowClear
                    value={filters.product}
                    onChange={(value) => setFilters({ ...filters, product: value })}
                    style={{ width: '100%' }}
                    options={products.map(p => ({
                      value: p._id,
                      label: p.name
                    }))}
                  />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <RangePicker
                    style={{ width: '100%' }}
                    value={filters.dateRange}
                    onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
                    showTime={{ format: 'HH:mm' }}
                    format="DD/MM/YYYY HH:mm"
                  />
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Space>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        setFilters({
                          search: '',
                          type: '',
                          product: '',
                          dateRange: []
                        });
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => showModal()}
                    >
                      New Transaction
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Transactions Table */}
            <Card>
              <Table
                columns={columns}
                dataSource={transactions}
                rowKey="_id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `${total} transactions`
                }}
                scroll={{ x: true }}
              />
            </Card>
          </>
        ) : (
          <Spin spinning={statsLoading}>
            <Card>
              {stats && (
                <div className="space-y-6">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                      <Card>
                        <Statistic
                          title="Total Transactions"
                          value={stats.totalTransactions}
                          precision={0}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Card>
                        <Statistic
                          title="Total IN"
                          value={stats.totalEntrees}
                          precision={0}
                          valueStyle={{ color: '#3f8600' }}
                          prefix={<ArrowUpOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Card>
                        <Statistic
                          title="Total OUT"
                          value={stats.totalSorties}
                          precision={0}
                          valueStyle={{ color: '#cf1322' }}
                          prefix={<ArrowDownOutlined />}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Divider />

                  <Title level={4}>Net Stock Movement</Title>
                  <Card>
                    <Statistic
                      title="Net Change"
                      value={stats.stockNet}
                      precision={0}
                      valueStyle={{ 
                        color: stats.stockNet >= 0 ? '#3f8600' : '#cf1322' 
                      }}
                      prefix={
                        stats.stockNet >= 0 ? 
                        <ArrowUpOutlined /> : 
                        <ArrowDownOutlined />
                      }
                    />
                  </Card>

                  <Divider />

                  <Title level={4}>Transaction Details</Title>
                  <Table
                    columns={[
                      { title: 'Type', dataIndex: '_id', key: 'type' },
                      { title: 'Count', dataIndex: 'count', key: 'count' },
                      { title: 'Total Quantity', dataIndex: 'totalQuantity', key: 'totalQuantity' }
                    ]}
                    dataSource={stats.details}
                    rowKey="_id"
                    pagination={false}
                  />
                </div>
              )}
            </Card>
          </Spin>
        )}

        {/* Create/Edit Modal */}
        <Modal
          title={
            <div className="flex items-center">
              {editingTransaction ? (
                <>
                  <EditOutlined className="mr-2" />
                  Edit Transaction
                </>
              ) : (
                <>
                  <PlusOutlined className="mr-2" />
                  New Transaction
                </>
              )}
            </div>
          }
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
              name="product"
              label="Product"
              rules={[{ required: true, message: 'Product is required' }]}
            >
              <Select
                placeholder="Select product"
                showSearch
                optionFilterProp="label"
                options={products.map(p => ({
                  value: p._id,
                  label: p.name,
                  stock: p.stockQuantity
                }))}
              />
            </Form.Item>

            <Form.Item
              name="type"
              label="Transaction Type"
              rules={[{ required: true, message: 'Type is required' }]}
            >
              <Select placeholder="Select type">
                <Option value="entree">
                  <Tag color="green">IN</Tag> Stock Entry
                </Option>
                <Option value="sortie">
                  <Tag color="red">OUT</Tag> Stock Exit
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                { required: true, message: 'Quantity is required' },
                { type: 'number', min: 1, message: 'Quantity must be at least 1' }
              ]}
            >
              <InputNumber
                placeholder="Enter quantity"
                min={1}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Divider />

            <Form.Item className="mb-0">
              <Space className="float-right">
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  {editingTransaction ? 'Update' : 'Create'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default StockTransactions;