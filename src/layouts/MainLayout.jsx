import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumb, Drawer } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import useResponsive from '../hooks/useResponsive';

const { Content } = Layout;

const MainLayout = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  // Fermer automatiquement la sidebar sur les petits écrans
  useEffect(() => {
    if (!isMobile) {
      setSidebarCollapsed(isTablet);
    }
  }, [isMobile, isTablet]);

  // Fermer le drawer mobile lors du changement de route
  useEffect(() => {
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  }, [location.pathname, isMobile]);

  const getBreadcrumbItems = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return [
      { title: 'Accueil' },
      ...paths.map(path => ({
        title: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
      }))
    ];
  };

  const handleToggleSidebar = (collapsed) => {
    if (isMobile) {
      setMobileDrawerVisible(!mobileDrawerVisible);
    } else {
      setSidebarCollapsed(collapsed);
    }
  };

  const renderSidebar = () => {
    const sidebarProps = {
      collapsed: sidebarCollapsed,
      onCollapse: handleToggleSidebar,
      isMobile
    };

    if (isMobile) {
      return (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          width="100%"
          bodyStyle={{ 
            padding: 0, 
            height: '100%',
            background: '#001529'
          }}
          contentWrapperStyle={{ 
            height: '100%'
          }}
          maskStyle={{
            background: 'rgba(0, 0, 0, 0.8)'
          }}
        >
          <Sidebar {...sidebarProps} />
        </Drawer>
      );
    }

    return <Sidebar {...sidebarProps} />;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {renderSidebar()}
      <Layout style={{ 
        marginLeft: isMobile ? 0 : (sidebarCollapsed ? '80px' : '300px'),
        transition: isMobile ? 'none' : 'margin-left 0.2s',
        background: '#f0f2f5',
      }}>
        <TopBar 
          onMenuClick={() => handleToggleSidebar(!sidebarCollapsed)}
          isMobile={isMobile}
        />
        <Content style={{ 
          margin: isMobile ? '12px' : '24px 16px',
          minHeight: 'calc(100vh - 112px)',
          transition: 'margin 0.2s'
        }}>
          <Breadcrumb style={{ 
            marginBottom: isMobile ? 12 : 16,
            padding: '8px 16px',
            background: '#fff',
            borderRadius: '4px',
            fontSize: isMobile ? '12px' : '14px',
            whiteSpace: 'nowrap',
            overflow: 'auto',
          }}>
            {getBreadcrumbItems().map((item, index) => (
              <Breadcrumb.Item key={index}>{item.title}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div style={{ 
            padding: isMobile ? 16 : 24, 
            background: '#fff', 
            borderRadius: 4,
            minHeight: 360,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 