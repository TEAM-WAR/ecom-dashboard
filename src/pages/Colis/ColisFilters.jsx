import React from 'react';
import {
    Card,
    Row,
    Col,
    Input,
    Select,
    DatePicker,
    Button,
    Space,
    Grid,
    Tooltip
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    PlusOutlined,
    SyncOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const ColisFilters = ({ filters, setFilters, onReset, onNewColis, onUpdatePendingStatus, updateStatusLoading, isRetour = false }) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isSmallMobile = screens.xs;

    return (
        <Card
            className="mb-4"
            bodyStyle={{
                padding: isSmallMobile ? '8px' : '16px',
                borderRadius: '8px'
            }}
            style={{
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
            }}
        >
            <Row gutter={[16, 16]} align="middle">
                {/* Search Input */}
                <Col xs={24} sm={12} md={6} lg={5}>
                    <Input
                        placeholder="Rechercher..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        allowClear
                        size={isMobile ? 'small' : 'middle'}
                        className="hover:border-blue-300 focus:border-blue-400"
                    />
                </Col>

                {/* Status Select */}
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Select
                        placeholder="Statut"
                        allowClear
                        value={filters.statut}
                        onChange={(value) => setFilters({ ...filters, statut: value })}
                        style={{ width: '100%' }}
                        size={isMobile ? 'small' : 'middle'}
                        className="filter-select"
                        dropdownStyle={{ borderRadius: '8px' }}
                        options={[
                            { value: 'en_attente', label: 'En attente' },
                            { value: 'en_transit', label: 'En transit' },
                            { value: 'livre', label: 'Livré' },
                            { value: 'retourne', label: 'Retourné' },
                            { value: 'annule', label: 'Annulé' }
                        ]}
                    />
                </Col>

                {/* Payment Mode Select */}
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Select
                        placeholder="Paiement"
                        allowClear
                        value={filters.payement_mode}
                        onChange={(value) => setFilters({ ...filters, payement_mode: value })}
                        style={{ width: '100%' }}
                        size={isMobile ? 'small' : 'middle'}
                        className="filter-select"
                        dropdownStyle={{ borderRadius: '8px' }}
                        options={[
                            { value: '0', label: 'Chèque' },
                            { value: '2', label: 'Espèce' },
                            { value: '3', label: 'Aucun Préférence' }
                        ]}
                    />
                </Col>

                {/* Date Range Picker */}
                <Col xs={24} sm={12} md={6} lg={5}>
                    <RangePicker
                        style={{ width: '100%' }}
                        value={filters.dateRange}
                        onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
                        showTime={{ format: 'HH:mm' }}
                        format="DD/MM/YYYY HH:mm"
                        size={isMobile ? 'small' : 'middle'}
                        className="w-full hover:border-blue-300"
                        popupStyle={{ borderRadius: '8px' }}
                    />
                </Col>

                {/* Action Buttons - Responsive layout */}
                <Col xs={24} sm={24} md={24} lg={5}>
                    <Space
                        direction={isMobile ? 'vertical' : 'horizontal'}
                        style={{
                            width: '100%',
                            justifyContent: isMobile ? 'flex-start' : 'flex-end',
                            gap: isSmallMobile ? '8px' : '12px'
                        }}
                        wrap
                    >


                        {
                            isRetour && (
                                <Tooltip title="Créer un nouveau retour" placement="top" key="new-retour">
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={onNewColis}
                                        size={isMobile ? 'small' : 'middle'}
                                        block={isMobile}
                                        className="filter-button"
                                    >
                                        {isMobile ? (isSmallMobile ? <PlusOutlined /> : 'Nouveau Retour') : 'Nouveau Retour'}
                                    </Button>
                                </Tooltip>
                            )
                        }


                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

export default ColisFilters;