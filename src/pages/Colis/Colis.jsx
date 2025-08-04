import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Tabs,
    message,
    Space,
    Button,
    Grid,
    Row,
    Col
} from 'antd';
import {
    BarcodeOutlined,
    FilterOutlined,
    PlusOutlined,
    SyncOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

// Import des composants séparés
import CreateColisModal from './CreateColisModal';
import ReviewColisModal from './ReviewColisModal';
import ColisFilters from './ColisFilters';
import ColisTable from './ColisTable';
import ColisStats from './ColisStats';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Colis = () => {
    const [colis, setColis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [colisData, setColisData] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        statut: '',
        payement_mode: '',
        minMontant: '',
        maxMontant: '',
        dateRange: []
    });
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('colis');
    const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
    const screens = useBreakpoint();

    // Load colis
    const fetchColis = async () => {
        setLoading(true);
        try {
            const params = {
                statut: 'en_attente',
                ...(filters.search && { search: filters.search }),
                ...(filters.statut && { statut: filters.statut }),
                ...(filters.payement_mode && { payement_mode: filters.payement_mode }),
                ...(filters.minMontant && { minMontant: filters.minMontant }),
                ...(filters.maxMontant && { maxMontant: filters.maxMontant }),
                ...(filters.dateRange?.length === 2 && {
                    dateDebut: filters.dateRange[0].toISOString(),
                    dateFin: filters.dateRange[1].toISOString()
                })
            };

            const response = await apiClient.get('/colis', { params });
            setColis(response.data.data || []);
        } catch (error) {
            message.error('Erreur lors du chargement des colis');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load stats
    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const response = await apiClient.get('/colis/stats');
            setStats(response.data.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const updatePendingStatus = async () => {
        setUpdateStatusLoading(true);
        try {
            await apiClient.patch('/colis/update-pending-status');
            message.success('Status mis à jour avec succès');
            fetchColis();
        } catch (error) {
            message.error('Erreur lors de la mise à jour des statuts');
            console.error('Error updating all status:', error);
        } finally {
            setUpdateStatusLoading(false);
        }
    };

    useEffect(() => {
        fetchColis();
    }, [filters]);

    useEffect(() => {
        if (activeTab === 'stats') {
            fetchStats();
        }
    }, [activeTab]);

    // Show modal for create
    const showModal = () => {
        setModalVisible(true);
    };

    // Close modal
    const handleCancel = () => {
        setModalVisible(false);
    };

    // Handle form submission - Step 1: Get colis data from barcode
    const handleSubmit = async (values) => {
        try {
            // Pour la création, envoyer seulement le code-barres
            const createData = {
                code_barre: values.code_barre
            };
            const response = await apiClient.post('/colis', createData);
            console.log(response.data.data);

            // Store the colis data and show review modal
            setColisData(response.data.data);
            setModalVisible(false);
            setReviewModalVisible(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Échec de la création';
            message.error(errorMessage);
            console.error('Error:', error);
        }
    };

    // Handle review modal submission - Step 2: Confirm creation with edited data
    const handleReviewSubmit = async (values) => {
        console.log("values", values);
        try {
            const confirmData = {
                ...values,
                code_barre: colisData.code_barre,
                etat_str: colisData.etat_str,
                etat: colisData.etat,
            };
            await apiClient.post('/colis/confirm', confirmData);
            message.success('Colis créé avec succès');
            setReviewModalVisible(false);
            setColisData(null);
            fetchColis();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Échec de la confirmation';
            message.error(errorMessage);
            console.error('Error:', error);
        }
    };

    // Close review modal
    const handleReviewCancel = () => {
        setReviewModalVisible(false);
        setColisData(null);
    };

    // Delete colis
    const handleDelete = async (colisId) => {
        try {
            await apiClient.delete(`/colis/${colisId}`);
            message.success('Colis supprimé avec succès');
            fetchColis();
        } catch (error) {
            message.error('Échec de la suppression');
            console.error('Error:', error);
        }
    };

    // Reset filters
    const handleResetFilters = () => {
        setFilters({
            search: '',
            statut: '',
            payement_mode: '',
            minMontant: '',
            maxMontant: '',
            dateRange: []
        });
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header with responsive layout */}
                <Row justify="space-between" align="middle" className="mb-6">
                    <Col>
                        <Title level={3} className="mb-1">Gestion des Colis</Title>
                        <Text type="secondary">Suivi et gestion des envois</Text>
                    </Col>
                    <Col>
                        <Space>
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />} 
                                onClick={showModal}
                                size={screens.md ? 'middle' : 'small'}
                            >
                                {screens.md ? 'Nouveau Colis' : 'Nouveau'}
                            </Button>
                            <Button 
                                icon={<SyncOutlined />} 
                                onClick={updatePendingStatus}
                                size={screens.md ? 'middle' : 'small'}
                            >
                                {screens.md ? 'Mettre à jour les statuts' : 'MAJ Statuts'}
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {/* Tabs */}
                <Card bordered={false} className="mb-4">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            {
                                key: 'colis',
                                label: (
                                    <span>
                                        <BarcodeOutlined className={!screens.md ? 'mr-0' : 'mr-2'} />
                                        {screens.md && 'Colis'}
                                    </span>
                                )
                            },
                            {
                                key: 'stats',
                                label: (
                                    <span>
                                        <FilterOutlined className={!screens.md ? 'mr-0' : 'mr-2'} />
                                        {screens.md && 'Statistiques'}
                                    </span>
                                )
                            }
                        ]}
                    />
                </Card>

                {activeTab === 'colis' ? (
                    <>
                                                 {/* Filters */}
                         <Card className="mb-4">
                             <ColisFilters
                                 filters={filters}
                                 setFilters={setFilters}
                                 onReset={handleResetFilters}
                                 onUpdatePendingStatus={updatePendingStatus}
                                 updateStatusLoading={updateStatusLoading}
                                 responsive={!screens.md}
                             />
                         </Card>

                        {/* Colis Table */}
                        <Card>
                            <ColisTable
                                data={colis}
                                loading={loading}
                                onDelete={handleDelete}
                                responsive={!screens.md}
                            />
                        </Card>
                    </>
                ) : (
                    <Card>
                        <ColisStats
                            stats={stats}
                            loading={statsLoading}
                            responsive={!screens.md}
                        />
                    </Card>
                )}

                {/* Create Modal */}
                <CreateColisModal
                    visible={modalVisible}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    loading={loading}
                />

                {/* Review Modal */}
                <ReviewColisModal
                    visible={reviewModalVisible}
                    onCancel={handleReviewCancel}
                    onSubmit={handleReviewSubmit}
                    colisData={colisData}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Colis;