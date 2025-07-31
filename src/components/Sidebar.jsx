import React from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  InboxOutlined,
  ShopOutlined,
  WalletOutlined,
  WarningOutlined,
  WhatsAppOutlined,
  UserOutlined,
  ExportOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse, isMobile }) => {
  const location = useLocation();

  const getSelectedKeys = () => {
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    return pathParts.length > 0 ? [pathParts[0]] : ['dashboard'];
  };

  const menuItems = [
    // 1. Dashboard en premier pour la vue d'ensemble
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      children: [
        { key: 'performance', label: 'Vue globale des performances', path: '/dashboard/performance' },
        { key: 'livraison', label: 'Taux de livraison', path: '/dashboard/livraison' },
        { key: 'retour', label: 'Taux de retour', path: '/dashboard/retour' },
        { key: 'produits', label: 'Meilleurs produits', path: '/dashboard/produits' },
        { key: 'statistiques', label: 'Statistiques par période', path: '/dashboard/statistiques' },
      ],
    },
    // 2. Stock & Produits - base de l'activité
    {
      key: 'stock',
      icon: <ShopOutlined />,
      label: 'Stock & Produits',
      children: [
        { key: 'produits', label: 'Liste des produits', path: '/stock/produits' },
        { key: 'mouvements', label: 'Entrées / Sorties', path: '/stock/mouvements' },
        { key: 'categories', label: 'Catégories de produits', path: '/stock/categories' },
        { key: 'etat', label: 'État du stock', path: '/stock/etat' },
      ],
    },
    // 3. Gestion des Colis - opérations quotidiennes
    {
      key: 'colis',
      icon: <InboxOutlined />,
      label: 'Gestion des Colis',
      children: [
        { key: 'suivi', label: 'Suivi des colis', path: '/colis/suivi' },
        { key: 'scans', label: 'Scans & statuts', path: '/colis/scans' },
        { key: 'historique', label: 'Historique des livraisons', path: '/colis/historique' },
        { key: 'retours', label: 'Retours & récupération', path: '/colis/retours' },
      ],
    },
    // 4. Financier - suivi des résultats
    {
      key: 'financier',
      icon: <WalletOutlined />,
      label: 'Financier',
      children: [
        { key: 'depenses', label: 'Dépenses publicitaires', path: '/financier/depenses' },
        { key: 'couts', label: 'Coût des stocks', path: '/financier/couts' },
        { key: 'marge', label: 'Calcul de marge', path: '/financier/marge' },
        { key: 'export-stats', label: 'Export des statistiques', path: '/financier/export' },
      ],
    },
    // 5. WhatsApp Client - communication client
    {
      key: 'whatsapp',
      icon: <WhatsAppOutlined />,
      label: 'WhatsApp Client',
      children: [
        { key: 'messages-auto', label: 'Messages automatisés', path: '/whatsapp/messages-auto' },
        { key: 'modeles', label: 'Modèles de messages', path: '/whatsapp/modeles' },
        { key: 'conversations', label: 'Historique des conversations', path: '/whatsapp/conversations' },
      ],
    },
    // 6. Alertes - surveillance et notifications
    {
      key: 'alertes',
      icon: <WarningOutlined />,
      label: 'Alertes',
      children: [
        { key: 'retours-non-recuperes', label: 'Retours non récupérés', path: '/alertes/retours' },
        { key: 'alertes-client', label: 'Alertes par client', path: '/alertes/client' },
        { key: 'historique-alertes', label: 'Historique des alertes', path: '/alertes/historique' },
      ],
    },
    // 7. Exports & Rapports - analyse et reporting
    {
      key: 'exports',
      icon: <ExportOutlined />,
      label: 'Exports & Rapports',
      children: [
        { key: 'export-pdf', label: 'Export PDF / Excel', path: '/exports/pdf-excel' },
        { key: 'rapport-mensuel', label: 'Rapport mensuel', path: '/exports/mensuel' },
        { key: 'rapport-personnalise', label: 'Rapport personnalisé', path: '/exports/personnalise' },
      ],
    },
    // 8. Utilisateurs - gestion des accès
    {
      key: 'utilisateurs',
      icon: <UserOutlined />,
      label: 'Utilisateurs',
      children: [
        { key: 'liste', label: 'Liste des utilisateurs', path: '/utilisateurs/liste' },
        { key: 'roles', label: 'Rôles & permissions', path: '/utilisateurs/roles' },
        { key: 'actions', label: 'Suivi des actions', path: '/utilisateurs/actions' },
      ],
    },
    // 9. Paramètres - configuration système
    {
      key: 'parametres',
      icon: <SettingOutlined />,
      label: 'Paramètres',
      children: [
        { key: 'apis', label: 'Intégration APIs', path: '/parametres/apis' },
        { key: 'messages', label: 'Personnalisation messages', path: '/parametres/messages' },
        { key: 'securite', label: 'Authentification / Sécurité', path: '/parametres/securite' },
      ],
    },
  ];

  const renderMenuItem = (item) => {
    if (item.children) {
      return (
        <Menu.SubMenu 
          key={item.key} 
          icon={
            <Tooltip placement="right" title={collapsed && !isMobile ? item.label : ''}>
              {item.icon}
            </Tooltip>
          }
          title={item.label}
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
          }}
        >
          {item.children.map((child) => (
            <Menu.Item 
              key={child.key}
              style={{
                fontFamily: "'Poppins', sans-serif",
                padding: isMobile ? '12px 24px' : undefined,
                height: isMobile ? 'auto' : undefined,
                lineHeight: isMobile ? '1.5' : undefined,
              }}
              onClick={() => isMobile && onCollapse(true)}
            >
              <Link to={child.path}>{child.label}</Link>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item 
        key={item.key} 
        icon={
          <Tooltip placement="right" title={collapsed && !isMobile ? item.label : ''}>
            {item.icon}
          </Tooltip>
        }
        style={{
          fontFamily: "'Poppins', sans-serif",
          padding: isMobile ? '12px 24px' : undefined,
          height: isMobile ? 'auto' : undefined,
          lineHeight: isMobile ? '1.5' : undefined,
        }}
        onClick={() => isMobile && onCollapse(true)}
      >
        <Link to={item.path}>{item.label}</Link>
      </Menu.Item>
    );
  };

  const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    fontFamily: "'Poppins', sans-serif",
    background: '#001529',
    ...(isMobile && {
      position: 'absolute',
      height: '100%',
      zIndex: 1001,
    })
  };

  const headerStyle = {
    height: isMobile ? 56 : 64,
    margin: isMobile ? '8px' : '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
    padding: collapsed && !isMobile ? '0' : '0 16px',
  };

  const titleStyle = {
    color: 'white',
    margin: 0,
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: '0.5px',
  };

  const toggleButtonStyle = {
    color: 'white',
    fontSize: isMobile ? '16px' : '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? '28px' : '32px',
    height: isMobile ? '28px' : '32px',
    borderRadius: '4px',
    transition: 'all 0.3s',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
  };

  return (
    <Sider 
      collapsible={!isMobile}
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={300}
      collapsedWidth={isMobile ? 0 : 80}
      style={siderStyle}
      trigger={null}
    >
      <div style={headerStyle}>
        {(!collapsed || isMobile) && <h1 style={titleStyle}>Colixy</h1>}
        {!isMobile && (
          <div style={toggleButtonStyle} onClick={() => onCollapse(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        )}
      </div>
      <Menu
        theme="dark"
        selectedKeys={getSelectedKeys()}
        mode="inline"
        style={{
          borderRight: 0,
          fontFamily: "'Poppins', sans-serif",
          paddingBottom: '24px',
        }}
        inlineCollapsed={collapsed && !isMobile}
      >
        {menuItems.map(renderMenuItem)}
      </Menu>
    </Sider>
  );
};

export default Sidebar; 