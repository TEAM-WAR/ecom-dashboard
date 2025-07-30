import React from 'react';
import {
    Table,
    Space,
    Button,
    Popconfirm,
    Tooltip,
    Tag,
    Typography,
    QRCode,
    Card,
    Row,
    Col,
    Image,
    Divider
} from 'antd';
import {
    DeleteOutlined,
    InboxOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const ColisTable = ({ data, loading, onDelete }) => {
    // Expandable row configuration
    const expandedRowRender = (record) => {
        const products = record.Prodcuts || [];
        
        if (products.length === 0) {
            return (
                <Card size="small" style={{ margin: '0 16px' }}>
                    <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                        <InboxOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                        <div>Aucun produit associé</div>
                    </div>
                </Card>
            );
        }

        return (
            <Card 
                size="small" 
                style={{ 
                    margin: '0 16px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{ padding: '16px' }}>
                    <div style={{ 
                        marginBottom: '16px', 
                        fontWeight: '600', 
                        color: '#1890ff',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <ShoppingOutlined style={{ marginRight: '8px', fontSize: '16px' }} />
                        Produits ({products.length})
                    </div>
                    <div style={{ 
                        maxHeight: '400px', 
                        overflowY: 'auto',
                        borderRadius: '6px',
                        border: '1px solid #f0f0f0'
                    }}>
                        {products.map((product, index) => (
                            <div 
                                key={product._id || index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '16px',
                                    borderBottom: index < products.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                                    transition: 'background-color 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fafafa' : 'white';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    {product.prodcut_id?.imageUrl ? (
                                        <Image
                                            src={import.meta.env.VITE_APP_API_URL_IMAGES + product.prodcut_id.imageUrl}
                                            alt={product.prodcut_id.name}
                                            width={40}
                                            height={40}
                                            style={{ 
                                                objectFit: 'cover', 
                                                borderRadius: '6px',
                                                border: '1px solid #e8e8e8'
                                            }}
                                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                                        />
                                    ) : (
                                        <div 
                                            style={{ 
                                                width: 40, 
                                                height: 40, 
                                                backgroundColor: '#f0f0f0', 
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #e8e8e8'
                                            }}
                                        >
                                            <InboxOutlined style={{ color: '#999', fontSize: '18px' }} />
                                        </div>
                                    )}
                                    <div style={{ marginLeft: '16px', flex: 1 }}>
                                        <div style={{ 
                                            fontWeight: '600', 
                                            fontSize: '14px', 
                                            marginBottom: '4px',
                                            color: '#262626'
                                        }}>
                                            {product.prodcut_id?.name || 'Produit inconnu'}
                                        </div>
                                        <div style={{ 
                                            fontSize: '13px', 
                                            color: '#595959', 
                                            marginBottom: '2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <span>Prix: {product.prodcut_id?.price ? `${product.prodcut_id.price} TND` : 'Non disponible'}</span>
                                            <span style={{ color: '#d9d9d9' }}>•</span>
                                            <span>Qté: <strong>{product.quantity}</strong></span>
                                        </div>
                                        {product.prodcut_id?.description && (
                                            <div style={{ 
                                                fontSize: '12px', 
                                                color: '#8c8c8c',
                                                marginTop: '4px',
                                                lineHeight: '1.4'
                                            }}>
                                                {product.prodcut_id.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center',
                                    marginLeft: '16px'
                                }}>
                                    <Tag 
                                        color="blue" 
                                        style={{ 
                                            margin: 0,
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            padding: '4px 8px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {product.quantity}
                                    </Tag>
                                    <Text style={{ 
                                        fontSize: '10px', 
                                        color: '#8c8c8c',
                                        marginTop: '2px'
                                    }}>
                                        Quantité
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    };

    const columns = [
        {
            title: 'Code Barre',
            dataIndex: 'code_barre',
            key: 'code_barre',
            render: (code) => (
                <Space>
                    <QRCode value={code} size={40} />
                    <Text copyable>{code}</Text>
                </Space>
            )
        },
        {
            title: 'Destinataire',
            dataIndex: 'nom_destinataire',
            key: 'nom_destinataire',
            render: (text, record) => (
                <div>
                    <Text strong>{text}</Text>
                    <br />
                    <Text type="secondary">{record.tel_destinataire}</Text>
                </div>
            )
        },
        {
            title: 'Adresse',
            dataIndex: 'adresse_destinataire',
            key: 'adresse_destinataire',
            ellipsis: true
        },
        {
            title: 'Désignation',
            dataIndex: 'designation',
            key: 'designation',
            render: (designation) => {
                if (!designation) return '-';
                // Truncate to 50 characters and add ellipsis
                const truncated = designation.length > 50 
                    ? designation.substring(0, 50) + '...' 
                    : designation;
                return (
                    <Tooltip title={designation} placement="topLeft">
                        <Text style={{ fontSize: '12px' }}>{truncated}</Text>
                    </Tooltip>
                );
            },
            width: 200
        },
        {
            title: 'Mode Paiement',
            dataIndex: 'payement_mode',
            key: 'payement_mode',
            render: (mode) => {
                const modeMap = {
                    '0': 'Chèque',
                    '2': 'Espèce',
                    '3': 'Aucun Préférence'
                };
                return modeMap[mode] || mode;
            },
            filters: [
                { text: 'Chèque', value: '0' },
                { text: 'Espèce', value: '2' },
                { text: 'Aucun Préférence', value: '3' }
            ],
            onFilter: (value, record) => record.payement_mode === value
        },
        {
            title: 'Montant',
            dataIndex: 'montant_reception',
            key: 'montant_reception',
            render: (amount) => `${amount} TND`,
            sorter: (a, b) => a.montant_reception - b.montant_reception
        },
        {
            title: 'Statut',
            dataIndex: 'etat_str',
            key: 'etat_str',
            render: (etat_str) => {
                const statusMap = {
                    'En attente': { color: 'orange' },
                    'En transit': { color: 'blue' },
                    'Livré': { color: 'green' },
                    'Livré clôturé': { color: 'green' },
                    'Retourné': { color: 'red' },
                    'Annulé': { color: 'gray' }
                };
                return <Tag color={statusMap[etat_str]?.color || 'default'}>{etat_str}</Tag>;
            },
            filters: [
                { text: 'En attente', value: 'En attente' },
                { text: 'En transit', value: 'En transit' },
                { text: 'Livré', value: 'Livré' },
                { text: 'Livré clôturé', value: 'Livré clôturé' },
                { text: 'Retourné', value: 'Retourné' },
                { text: 'Annulé', value: 'Annulé' }
            ],
            onFilter: (value, record) => record.etat_str === value
        },
        {
            title: 'Date',
            dataIndex: 'date_creation',
            key: 'date_creation',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => new Date(a.date_creation) - new Date(b.date_creation)
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Popconfirm
                        title="Supprimer ce colis?"
                        onConfirm={() => onDelete(record._id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Tooltip title="Supprimer">
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
        <Table
            columns={columns}
            dataSource={data}
            rowKey="_id"
            loading={loading}
            expandable={{
                expandedRowRender,
                expandIcon: ({ expanded, onExpand, record }) => (
                    <Button
                        type="text"
                        size="small"
                        onClick={(e) => onExpand(record, e)}
                        style={{ marginRight: 8 }}
                    >
                        {expanded ? '▼' : '▶'}
                    </Button>
                ),
                rowExpandable: (record) => record.Prodcuts && record.Prodcuts.length > 0
            }}
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `${total} colis`
            }}
            scroll={{ x: true }}
        />
    );
};

export default ColisTable; 