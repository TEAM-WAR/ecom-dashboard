import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Divider,
  Typography,
  Avatar,
  Space,
  Tabs
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  SaveOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Initialize form with current user data
  React.useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
        telephone: user.telephone,
      });
    }
  }, [user, profileForm]);

  // Handle profile update
  const handleProfileUpdate = async (values) => {
    try {
      setLoading(true);
      await updateProfile(values);
      message.success('Profil mis à jour avec succès');
    } catch (error) {
      message.error(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (values) => {
    try {
      setPasswordLoading(true);
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      message.success('Mot de passe modifié avec succès');
      passwordForm.resetFields();
    } catch (error) {
      message.error(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Mon Profil</Title>
      
      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Avatar 
                size={120} 
                style={{ backgroundColor: '#87d068', marginBottom: '16px' }}
                icon={<UserOutlined />} 
              />
              <Title level={3}>{user.name}</Title>
              <Text type="secondary">{user.email}</Text>
              <br />
              <Text type="secondary">{user.telephone}</Text>
              <br />
              <Text type="secondary">
                Rôle: {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col span={16}>
          <Card>
            <Tabs defaultActiveKey="profile">
              <TabPane 
                tab={
                  <span>
                    <UserOutlined />
                    Informations personnelles
                  </span>
                } 
                key="profile"
              >
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileUpdate}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="Nom complet"
                        rules={[
                          { required: true, message: 'Veuillez saisir le nom' },
                          { min: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                        ]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Nom complet" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Veuillez saisir l\'email' },
                          { type: 'email', message: 'Veuillez saisir un email valide' }
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="email@exemple.com" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="telephone"
                    label="Téléphone"
                    rules={[
                      { required: true, message: 'Veuillez saisir le téléphone' },
                      { pattern: /^[0-9+\-\s()]+$/, message: 'Veuillez saisir un numéro valide' }
                    ]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="+1234567890" />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      Sauvegarder les modifications
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane 
                tab={
                  <span>
                    <KeyOutlined />
                    Changer le mot de passe
                  </span>
                } 
                key="password"
              >
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handlePasswordChange}
                >
                  <Form.Item
                    name="oldPassword"
                    label="Ancien mot de passe"
                    rules={[
                      { required: true, message: 'Veuillez saisir l\'ancien mot de passe' }
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="Ancien mot de passe" 
                    />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="Nouveau mot de passe"
                    rules={[
                      { required: true, message: 'Veuillez saisir le nouveau mot de passe' },
                      { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="Nouveau mot de passe" 
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Confirmer le nouveau mot de passe"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Veuillez confirmer le nouveau mot de passe' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="Confirmer le nouveau mot de passe" 
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={passwordLoading}
                      icon={<KeyOutlined />}
                    >
                      Changer le mot de passe
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
