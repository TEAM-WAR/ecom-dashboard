import React from 'react';
import {
    Table,
    Space,
    Button,
    Popconfirm,
    Tooltip,
    Tag,
    Typography,
    QRCode
} from 'antd';
import {
    DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const ColisTable = ({ data, loading, onDelete }) => {
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
            ellipsis: true
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