import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Space,
    Table,
    Select,
    InputNumber,
    Typography,
    Card,
    Row,
    Col,
    message
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;

const ReviewColisModal = ({ visible, onCancel, onSubmit, colisData, loading }) => {
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Load products
    const fetchProducts = async () => {
        setProductsLoading(true);
        try {
            const response = await apiClient.get('/products');
            setProducts(response.data.data || []);
        } catch (error) {
            message.error('Erreur lors du chargement des produits');
            console.error('Error:', error);
        } finally {
            setProductsLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchProducts();
            if (colisData) {
                // Initialize form with colis data
                form.setFieldsValue({
                    nom_destinataire: colisData.nom_destinataire,
                    adresse_destinataire: colisData.adresse_destinataire,
                    tel_destinataire: colisData.tel_destinataire,
                    designation: colisData.designation,
                    montant_reception: colisData.montant_reception,
                    payement_mode: colisData.payement_mode,
                    facture: colisData.facture,
                    cheque: colisData.cheque,
                    motif: colisData.motif
                });

                // Initialize selected products
                if (colisData.Prodcuts) {
                    setSelectedProducts(colisData.Prodcuts.map(product => ({
                        ...product,
                        key: product.prodcut_id
                    })));
                }
            }
        }
    }, [visible, colisData]);

    const handleCancel = () => {
        form.resetFields();
        setSelectedProducts([]);
        onCancel();
    };

    const handleSubmit = async (values) => {
        try {
            const submitData = {
                ...values,
                Prodcuts: selectedProducts
            };
            await onSubmit(submitData);
            handleCancel();
        } catch (error) {
            message.error('Erreur lors de la création du colis');
        }
    };

    // Add product to list
    const addProduct = () => {
        const newProduct = {
            key: Date.now(),
            prodcut_id: '',
            quantity: 1
        };
        setSelectedProducts([...selectedProducts, newProduct]);
    };

    // Remove product from list
    const removeProduct = (key) => {
        setSelectedProducts(selectedProducts.filter(product => product.key !== key));
    };

    // Update product in list
    const updateProduct = (key, field, value) => {
        setSelectedProducts(selectedProducts.map(product => 
            product.key === key ? { ...product, [field]: value } : product
        ));
    };

    // Product table columns
    const productColumns = [
        {
            title: 'Produit',
            dataIndex: 'prodcut_id',
            key: 'prodcut_id',
            render: (value, record) => (
                <Select
                    value={value}
                    placeholder="Sélectionner un produit"
                    style={{ width: '100%' }}
                    onChange={(val) => updateProduct(record.key, 'prodcut_id', val)}
                    loading={productsLoading}
                >
                    {products.map(product => (
                        <Option key={product._id} value={product._id}>
                            {product.name}
                        </Option>
                    ))}
                </Select>
            )
        },
        {
            title: 'Quantité',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 120,
            render: (value, record) => (
                <InputNumber
                    min={1}
                    value={value}
                    onChange={(val) => updateProduct(record.key, 'quantity', val)}
                    style={{ width: '100%' }}
                />
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeProduct(record.key)}
                />
            )
        }
    ];

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <EditOutlined className="mr-2" />
                    Révision du Colis
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* Recipient Information */}
                <Card title="Informations du Destinataire" className="mb-4">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="nom_destinataire"
                                label="Nom du Destinataire"
                                rules={[{ required: true, message: 'Le nom est requis' }]}
                            >
                                <Input placeholder="Nom complet" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="tel_destinataire"
                                label="Téléphone"
                                rules={[{ required: true, message: 'Le téléphone est requis' }]}
                            >
                                <Input placeholder="Numéro de téléphone" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="adresse_destinataire"
                        label="Adresse"
                        rules={[{ required: true, message: 'L\'adresse est requise' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Adresse complète" />
                    </Form.Item>
                </Card>

                {/* Package Details */}
                <Card title="Détails du Colis" className="mb-4">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="montant_reception"
                                label="Montant de Réception"
                                rules={[{ required: true, message: 'Le montant est requis' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Montant"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="payement_mode"
                                label="Mode de Paiement"
                                rules={[{ required: true, message: 'Le mode de paiement est requis' }]}
                            >
                                <Select placeholder="Sélectionner le mode de paiement">
                                    <Option value="1">Espèces</Option>
                                    <Option value="2">Chèque</Option>
                                    <Option value="3">Carte</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="facture"
                                label="Facture"
                            >
                                <Input placeholder="Numéro de facture" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="cheque"
                                label="Chèque"
                            >
                                <Input placeholder="Numéro de chèque" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="designation"
                        label="Désignation"
                        rules={[{ required: true, message: 'La désignation est requise' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Description détaillée du contenu" />
                    </Form.Item>
                    <Form.Item
                        name="motif"
                        label="Motif"
                    >
                        <Input.TextArea rows={2} placeholder="Motif (optionnel)" />
                    </Form.Item>
                </Card>

                {/* Products Section */}
                <Card 
                    title="Produits" 
                    className="mb-4"
                    extra={
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={addProduct}
                        >
                            Ajouter un produit
                        </Button>
                    }
                >
                    <Table
                        dataSource={selectedProducts}
                        columns={productColumns}
                        pagination={false}
                        size="small"
                        rowKey="key"
                    />
                </Card>

                <Form.Item className="mb-0">
                    <Space className="float-right">
                        <Button onClick={handleCancel}>
                            Annuler
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Confirmer la Création
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ReviewColisModal; 