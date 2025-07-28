import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Tabs,
    message
} from 'antd';
import {
    BarcodeOutlined,
    FilterOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

// Import des composants séparés
import CreateColisModal from './CreateColisModal';
import ColisFilters from './ColisFilters';
import ColisTable from './ColisTable';
import ColisStats from './ColisStats';

const { Title, Text } = Typography;

const Colis = () => {
    const [colis, setColis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
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

    // Load colis
    const fetchColis = async () => {
        setLoading(true);
        try {
            const params = {
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

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            // Pour la création, envoyer seulement le code-barres
            const createData = {
                code_barre: values.code_barre
            };
            await apiClient.post('/colis', createData);
            message.success('Colis créé avec succès');
            handleCancel();
            fetchColis();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Échec de la création';
            message.error(errorMessage);
            console.error('Error:', error);
        }
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
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Title level={3} className="mb-1">Gestion des Colis</Title>
                    <Text type="secondary">Suivi et gestion des envois</Text>
                </div>

                {/* Tabs */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'colis',
                            label: (
                                <span>
                                    <BarcodeOutlined />
                                    Colis
                                </span>
                            )
                        },
                        {
                            key: 'stats',
                            label: (
                                <span>
                                    <FilterOutlined />
                                    Statistiques
                                </span>
                            )
                        }
                    ]}
                />

                {activeTab === 'colis' ? (
                    <>
                        {/* Filters */}
                        <ColisFilters
                            filters={filters}
                            setFilters={setFilters}
                            onReset={handleResetFilters}
                            onNewColis={showModal}
                        />

                        {/* Colis Table */}
                        <Card>
                            <ColisTable
                                data={colis}
                                loading={loading}
                                onDelete={handleDelete}
                            />
                        </Card>
                    </>
                ) : (
                    <ColisStats
                        stats={stats}
                        loading={statsLoading}
                    />
                )}

                {/* Create Modal */}
                <CreateColisModal
                    visible={modalVisible}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Colis;