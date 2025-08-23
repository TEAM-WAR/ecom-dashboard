import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard/performance';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await login({
        email: values.email,
        password: values.password
      });
      
      message.success('Connexion réussie !');
      
      // Redirect to the intended page or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard/performance';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Échec de la connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Left Section - Login Form */}
      <div style={{
        width: '40%',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        position: 'relative'
      }}>
        {/* Logo/Brand */}
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          <h1 style={{
            color: '#ff6b35',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0
          }}>
            Colixy
          </h1>
        </div>

        {/* Welcome Message */}
        <div style={{ 
          marginBottom: '40px',
          textAlign: 'center',
          width: '100%'
        }}>
          <p style={{
            color: '#666',
            fontSize: '16px',
            margin: '0 0 8px 0'
          }}>
            Welcome back !!!
          </p>
          <h2 style={{
            color: '#333',
            fontSize: '32px',
            fontWeight: 'bold',
            margin: 0
          }}>
            Sign in
          </h2>
        </div>

        {/* Login Form */}
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          style={{ 
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto'
          }}
          initialValues={{
            email: 'test@gmail.com',
            password: 'password123'
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: '24px' }}
            rules={[
              { required: true, message: 'Veuillez saisir votre email!' },
              { type: 'email', message: 'Veuillez saisir un email valide!' }
            ]}
          >
            <Input
              size="large"
              style={{
                height: '50px',
                borderRadius: '8px',
                border: '1px solid #e1e5e9',
                backgroundColor: '#f8f9fa',
                fontSize: '16px'
              }}
              placeholder="test@gmail.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
              }}>
                <span>Password</span>
                <a href="#" style={{
                  color: '#666',
                  fontSize: '14px',
                  textDecoration: 'none'
                }}>
                  Forgot Password?
                </a>
              </div>
            }
            style={{ marginBottom: '32px' }}
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe!' }]}
          >
            <Input.Password
              size="large"
              style={{
                height: '50px',
                borderRadius: '8px',
                border: '1px solid #e1e5e9',
                backgroundColor: '#f8f9fa',
                fontSize: '16px'
              }}
              placeholder="••••••••"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '32px' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
                             style={{
                 width: '100%',
                 height: '50px',
                 borderRadius: '8px',
                 backgroundColor: '#1890ff',
                 border: 'none',
                 fontSize: '16px',
                 fontWeight: '600',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '8px'
               }}
            >
              SIGN IN
              <ArrowRightOutlined />
            </Button>
          </Form.Item>
        </Form>

                {/* Sign Up Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          width: '100%'
        }}>
          <p style={{
            color: '#666',
            fontSize: '14px',
            margin: 0
          }}>
            I don't have an account?{' '}
            <a href="#" style={{
              color: '#ff6b35',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Sign up
            </a>
          </p>
        </div>
      </div>

             {/* Right Section - Illustration */}
       <div style={{
         width: '60%',
         background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         position: 'relative',
         overflow: 'hidden'
       }}>
                 {/* Background Grid Pattern */}
         <div style={{
           position: 'absolute',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           backgroundImage: `
             linear-gradient(rgba(24, 144, 255, 0.1) 1px, transparent 1px),
             linear-gradient(90deg, rgba(24, 144, 255, 0.1) 1px, transparent 1px)
           `,
           backgroundSize: '40px 40px',
           opacity: 0.3
         }} />

        {/* Main Illustration */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '60px'
        }}>
          {/* Shopping Cart */}
          <div style={{
            position: 'relative',
            marginBottom: '40px'
          }}>
            {/* Cart Body */}
            <div style={{
              width: '120px',
              height: '80px',
              border: '3px solid #333',
              borderRadius: '8px 8px 0 0',
              position: 'relative'
            }}>
              {/* Cart Handle */}
              <div style={{
                width: '60px',
                height: '20px',
                border: '3px solid #333',
                borderBottom: 'none',
                borderRadius: '20px 20px 0 0',
                position: 'absolute',
                top: '-20px',
                left: '30px'
              }} />
              
              {/* Cart Items */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                display: 'flex',
                gap: '8px'
              }}>
                                 {/* Blue Sphere */}
                 <div style={{
                   width: '20px',
                   height: '20px',
                   backgroundColor: '#1890ff',
                   borderRadius: '50%'
                 }} />
                {/* Turquoise Rectangle */}
                <div style={{
                  width: '16px',
                  height: '24px',
                  backgroundColor: '#20c997',
                  borderRadius: '4px'
                }} />
                {/* Blue Rectangle */}
                <div style={{
                  width: '18px',
                  height: '22px',
                  backgroundColor: '#007bff',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
            
            {/* Cart Wheels */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '-8px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '3px solid #333',
                borderRadius: '50%',
                backgroundColor: '#fff'
              }} />
              <div style={{
                width: '20px',
                height: '20px',
                border: '3px solid #333',
                borderRadius: '50%',
                backgroundColor: '#fff'
              }} />
            </div>
          </div>

          {/* Person */}
          <div style={{
            position: 'relative'
          }}>
            {/* Head */}
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#ffdbac',
              borderRadius: '50%',
              marginBottom: '8px'
            }} />
            
                         {/* Body */}
             <div style={{
               width: '80px',
               height: '100px',
               backgroundColor: '#1890ff',
               borderRadius: '20px 20px 0 0',
               position: 'relative'
             }}>
              {/* White Undershirt */}
              <div style={{
                width: '60px',
                height: '40px',
                backgroundColor: '#fff',
                borderRadius: '15px 15px 0 0',
                position: 'absolute',
                top: '10px',
                left: '10px'
              }} />
            </div>
            
            {/* Arms */}
            <div style={{
              position: 'absolute',
              top: '80px',
              left: '-10px',
              width: '100px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
                             <div style={{
                 width: '12px',
                 height: '60px',
                 backgroundColor: '#1890ff',
                 borderRadius: '6px'
               }} />
               <div style={{
                 width: '12px',
                 height: '60px',
                 backgroundColor: '#1890ff',
                 borderRadius: '6px'
               }} />
            </div>
            
            {/* Package in hand */}
            <div style={{
              position: 'absolute',
              top: '120px',
              left: '-20px',
              width: '30px',
              height: '25px',
              backgroundColor: '#8b4513',
              borderRadius: '4px'
            }} />
            
            {/* Legs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                width: '20px',
                height: '60px',
                backgroundColor: '#333',
                borderRadius: '10px'
              }} />
              <div style={{
                width: '20px',
                height: '60px',
                backgroundColor: '#333',
                borderRadius: '10px'
              }} />
            </div>
          </div>
        </div>

                 {/* Decorative Element */}
         <div style={{
           position: 'absolute',
           bottom: '40px',
           left: '40px',
           width: '40px',
           height: '40px',
           backgroundColor: '#333',
           borderRadius: '50%',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center'
         }}>
           <div style={{
             width: '20px',
             height: '20px',
             backgroundColor: '#1890ff',
             borderRadius: '50%'
           }} />
         </div>
      </div>
    </div>
  );
};

export default Login; 