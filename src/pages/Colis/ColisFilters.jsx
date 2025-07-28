import React from 'react';
import {
    Card,
    Row,
    Col,
    Input,
    Select,
    DatePicker,
    Button,
    Space
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    PlusOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ColisFilters = ({ filters, setFilters, onReset, onNewColis }) => {
    return (
        <Card className="mb-6">
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={6}>
                    <Input
                        placeholder="Rechercher (nom, code, facture)"
                        prefix={<SearchOutlined />}
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Statut"
                        allowClear
                        value={filters.statut}
                        onChange={(value) => setFilters({ ...filters, statut: value })}
                        style={{ width: '100%' }}
                        options={[
                            { value: 'en_attente', label: 'En attente' },
                            { value: 'en_transit', label: 'En transit' },
                            { value: 'livre', label: 'Livré' },
                            { value: 'retourne', label: 'Retourné' },
                            { value: 'annule', label: 'Annulé' }
                        ]}
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Mode paiement"
                        allowClear
                        value={filters.payement_mode}
                        onChange={(value) => setFilters({ ...filters, payement_mode: value })}
                        style={{ width: '100%' }}
                        options={[
                            { value: '0', label: 'Chèque' },
                            { value: '2', label: 'Espèce' },
                            { value: '3', label: 'Aucun Préférence' }
                        ]}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
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
                            onClick={onReset}
                        >
                            Réinitialiser
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onNewColis}
                        >
                            Nouveau Colis
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

export default ColisFilters; 