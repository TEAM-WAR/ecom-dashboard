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
  Upload,
  Image,
  Grid,
  Typography,
  Divider,
  Spin,
  Dropdown
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  UploadOutlined,
  LoadingOutlined,
  MoreOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import apiClient from '../services/apiClient';

const { Option } = Select;
const { TextArea } = Input;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const screens = useBreakpoint();

  // Load products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data.data || []);
    } catch (error) {
      message.error('Failed to load products');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !filters.search ||
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory = !filters.category || product.category === filters.category;

    const matchesPrice = (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));

    const matchesStock = (!filters.minStock || product.stockQuantity >= parseFloat(filters.minStock)) &&
      (!filters.maxStock || product.stockQuantity <= parseFloat(filters.maxStock));

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // Show modal for create/edit
  const showModal = (product = null) => {
    setEditingProduct(product);
    setImageFile(null);
    setImageUploading(false);
    setExistingImageUrl(product?.imageUrl || null);

    if (product) {
      const category = categories.find(cat => cat._id === product.category);
      form.setFieldsValue({
        ...product,
        category: category ? category.name : product.category
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingProduct(null);
    setImageFile(null);
    setImageUploading(false);
    setExistingImageUrl(null);
    form.resetFields();
  };

  // Handle image upload
  const handleImageUpload = (info) => {
    const { file } = info;

    if (file.status === 'uploading') {
      setImageUploading(true);
      return;
    }

    if (file.status === 'removed') {
      setImageFile(null);
      setImageUploading(false);
      return;
    }

    if (file.status === 'error') {
      setImageUploading(false);
      message.error('File selection failed');
      return;
    }

    // Get the actual file
    const selectedFile = file.originFileObj || file;

    if (selectedFile) {
      // Validate file type
      const isImage = selectedFile.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return;
      }

      // Validate file size (max 5MB)
      const isLt5M = selectedFile.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return;
      }

      setImageFile(selectedFile);
      setImageUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const productData = {
        ...values,
        price: parseFloat(values.price),
        stockQuantity: parseInt(values.stockQuantity) || 0
      };

      // Convert category name to ID
      if (values.category) {
        const selectedCategory = categories.find(cat => cat.name === values.category);
        if (selectedCategory) {
          productData.category = selectedCategory._id;
        }
      }

      // Handle image upload
      if (imageFile) {
        setImageUploading(true);
        try {
          const formData = new FormData();
          formData.append('image', imageFile);

          const imageResponse = await apiClient.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          productData.imageUrl = imageResponse.data.url;
        } catch (error) {
          message.error('Error uploading image');
          console.error('Image upload error:', error);
          setImageUploading(false);
          return;
        } finally {
          setImageUploading(false);
        }
      }

      if (editingProduct) {
        await apiClient.put(`/products/${editingProduct._id}`, productData);
        message.success('Product updated successfully');
      } else {
        await apiClient.post('/products', productData);
        message.success('Product created successfully');
      }

      handleCancel();
      fetchProducts();
    } catch (error) {
      message.error(editingProduct ? 'Update failed' : 'Creation failed');
      console.error('Error:', error);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    try {
      await apiClient.delete(`/products/${productId}`);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Delete failed');
      console.error('Error:', error);
    }
  };

  // Responsive table columns
  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 80,
        render: (imageUrl) => (
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {imageUrl ? (
              <Image
                src={`${import.meta.env.VITE_APP_API_URL_IMAGES}${imageUrl}`}
                alt="Product"
                className="w-full h-full object-cover"
                preview={false}
                width={50}
                fallback="https://via.placeholder.com/32"
              />
            ) : (
              <UploadOutlined className="text-gray-400 text-sm" />
            )}
          </div>
        )
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text) => <Text strong>{text}</Text>
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        sorter: (a, b) => a.price - b.price,
        render: (price) => (
          <Text strong type="success">
            {price.toFixed(2)} TND
          </Text>
        )
      },
      {
        title: 'Stock',
        dataIndex: 'stockQuantity',
        key: 'stockQuantity',
        sorter: (a, b) => a.stockQuantity - b.stockQuantity,
        render: (stockQuantity) => (
          <Tag color={stockQuantity > 0 ? 'green' : 'red'}>
            {stockQuantity} units
          </Tag>
        )
      }
    ];

    const extraColumns = [
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (categoryId) => {
          const category = categories.find(cat => cat._id === categoryId);
          return (
            <Tag color="blue">{category ? category.name : 'Unknown'}</Tag>
          );
        }
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
      },
      {
        title: 'Actions',
        key: 'actions',
        fixed: 'right',
        width: 120,
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
              title="Delete this product?"
              description="Are you sure you want to delete this product?"
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

    return screens.md ? [...baseColumns, ...extraColumns] : [
      ...baseColumns,
      {
        title: 'Actions',
        key: 'actions',
        fixed: 'right',
        width: 100,
        render: (_, record) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit',
                  icon: <EditOutlined />,
                  onClick: () => showModal(record)
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(record._id)
                }
              ]
            }}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        )
      }
    ];
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Title level={3} className="mb-1">Product Management</Title>
          <Text type="secondary">Manage your product catalog</Text>
        </div>

        {/* Filters */}
        <Card 
          className="mb-6"
          bodyStyle={{ padding: screens.xs ? '16px 12px' : '16px 24px' }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Search products..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Category"
                allowClear
                value={filters.category}
                onChange={(value) => setFilters({ ...filters, category: value })}
                style={{ width: '100%' }}
                options={categories.map(cat => ({
                  value: cat._id,
                  label: cat.name
                }))}
              />
            </Col>
            <Col xs={12} sm={12} md={3}>
              <InputNumber
                placeholder="Min price"
                min={0}
                value={filters.minPrice}
                onChange={(value) => setFilters({ ...filters, minPrice: value })}
                style={{ width: '100%' }}
                addonBefore="TND"
              />
            </Col>
            <Col xs={12} sm={12} md={3}>
              <InputNumber
                placeholder="Max price"
                min={0}
                value={filters.maxPrice}
                onChange={(value) => setFilters({ ...filters, maxPrice: value })}
                style={{ width: '100%' }}
                addonBefore="TND"
              />
            </Col>
            <Col xs={12} sm={12} md={3}>
              <InputNumber
                placeholder="Min stock"
                min={0}
                value={filters.minStock}
                onChange={(value) => setFilters({ ...filters, minStock: value })}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={12} sm={12} md={3}>
              <InputNumber
                placeholder="Max stock"
                min={0}
                value={filters.maxStock}
                onChange={(value) => setFilters({ ...filters, maxStock: value })}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={24} md={2}>
              <Space wrap>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setFilters({
                      search: '',
                      category: '',
                      minPrice: '',
                      maxPrice: '',
                      minStock: '',
                      maxStock: ''
                    });
                  }}
                >
                  {screens.md ? 'Reset' : ''}
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showModal()}
                >
                  {screens.md ? 'Add Product' : 'Add'}
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Products Table */}
        <Card
          bodyStyle={{ padding: screens.xs ? 0 : 16 }}
          className="shadow-sm"
        >
          <Table
            columns={getColumns()}
            dataSource={filteredProducts}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} products`,
              size: screens.xs ? 'small' : 'default'
            }}
            scroll={{ x: true }}
            size={screens.xs ? 'small' : 'middle'}
            bordered={!screens.xs}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={
            <div className="flex items-center">
              {editingProduct ? (
                <>
                  <EditOutlined className="mr-2" />
                  Edit Product
                </>
              ) : (
                <>
                  <PlusOutlined className="mr-2" />
                  Add Product
                </>
              )}  
            </div>
          }
          open={modalVisible}
          onCancel={handleCancel}
          footer={null}
          width={screens.md ? 700 : '90%'}
          destroyOnClose
          centered
        >
          <Divider className="mt-0" />
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              stockQuantity: 0
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Product Name"
                  rules={[{ required: true, message: 'Name is required' }]}
                >
                  <Input placeholder="Enter product name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: 'Price is required' }]}
                >
                  <InputNumber
                    placeholder="0.00"
                    min={0}
                    step={0.01}
                    style={{ width: '100%' }}
                    addonBefore="TND"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Category is required' }]}
                >
                  <Select
                    placeholder="Select category"
                    options={categories.map(cat => ({
                      value: cat.name,
                      label: cat.name
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="stockQuantity"
                  label="Stock Quantity"
                  rules={[{ required: true, message: 'Stock quantity is required' }]}
                >
                  <InputNumber
                    placeholder="0"
                    min={0}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Description is required' }]}
            >
              <TextArea
                rows={4}
                placeholder="Enter product description..."
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item label="Product Image">
              <div className="space-y-4">
                <Upload
                  name="image"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleImageUpload}
                  accept="image/*"
                >
                  {imageUploading ? (
                    <div className="flex items-center justify-center h-full">
                      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      {imageFile || existingImageUrl ? (
                        <Image
                          src={imageFile ? URL.createObjectURL(imageFile) : existingImageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          preview={false}
                        />
                      ) : (
                        <>
                          <UploadOutlined className="text-2xl" />
                          <div className="mt-2">Upload Image</div>
                        </>
                      )}
                    </div>
                  )}
                </Upload>

     

                <Text type="secondary" className="text-xs">
                  Accepted formats: JPG, PNG, GIF. Max size: 5MB
                </Text>
              </div>
            </Form.Item>

            <Divider />
            <Form.Item className="mb-0">
              <Space className="float-right">
                <Button onClick={handleCancel} disabled={imageUploading}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={imageUploading}
                  disabled={imageUploading}
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Products;