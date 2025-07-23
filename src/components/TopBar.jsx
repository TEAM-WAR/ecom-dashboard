import React from 'react';
import { Layout, Avatar, Dropdown, Space, Badge } from 'antd';
import { 
  UserOutlined, 
  BellOutlined, 
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  MenuOutlined
} from '@ant-design/icons';

const { Header } = Layout;

const TopBar = ({ onMenuClick, isMobile }) => {
  const userMenuItems = [
    {
      key: 'profile',
      label: 'Mon Profil',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: 'Paramètres',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Déconnexion',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <Header 
      style={{ 
        padding: '0 16px',
        background: '#001529',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isMobile && (
          <MenuOutlined 
            style={{ 
              color: '#fff', 
              fontSize: '20px', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background-color 0.3s',
              ':hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
            onClick={onMenuClick}
          />
        )}
        <SearchOutlined style={{ 
          color: '#fff', 
          fontSize: isMobile ? '16px' : '18px', 
          cursor: 'pointer',
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px' }}>
        <Badge count={5} size="small">
          <BellOutlined style={{ 
            color: '#fff', 
            fontSize: isMobile ? '16px' : '18px', 
            cursor: 'pointer',
            transition: 'color 0.3s',
            ':hover': {
              color: '#1890ff',
            }
          }} />
        </Badge>

        <Dropdown
          menu={{ 
            items: userMenuItems,
            style: { fontFamily: "'Poppins', sans-serif" }
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar 
              style={{ 
                backgroundColor: '#87d068',
                cursor: 'pointer',
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
              }} 
              icon={<UserOutlined />} 
            />
            {!isMobile && (
              <span style={{ 
                color: '#fff', 
                marginLeft: '8px',
                fontSize: '14px',
                fontWeight: 500,
              }}>Admin</span>
            )}
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default TopBar; 