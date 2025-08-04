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
import apiClient from '../services/apiClient';

// Import des composants séparés
import CreateColisModal from './Colis/CreateColisModal';
import ColisFilters from './Colis/ColisFilters';
import ColisTable from './Colis/ColisTable';
import ColisStats from './Colis/ColisStats';

const { Title, Text } = Typography;

const ColisRetour = () => {
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
        statut: 'retourne',
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
      message.error('Erreur lors du chargement des colis de retour');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await apiClient.get('/colis-retour/stats');
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

  // Handle form submission - Mark colis as returned
  const handleSubmit = async (values) => {
    try {
      const response = await apiClient.patch(`/colis/${values.code_barre}/mark-as-returned`);
      console.log(response.data.data);

      message.success('Colis marqué comme retourné avec succès');
      setModalVisible(false);
      fetchColis();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Échec du marquage comme retourné';
      message.error(errorMessage);
      console.error('Error:', error);
    }
  };

  // Delete colis
  const handleDelete = async (colisId) => {
    try {
      await apiClient.delete(`/colis/${colisId}`);
      message.success('Colis de retour supprimé avec succès');
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
          <Title level={3} className="mb-1">Gestion des Colis de Retour</Title>
          <Text type="secondary">Suivi et gestion des retours</Text>
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
                  Colis de Retour
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
              isRetour={true}
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

export default ColisRetour;