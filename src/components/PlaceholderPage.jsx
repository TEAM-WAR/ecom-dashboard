import React from 'react';
import { Result } from 'antd';
import { useLocation } from 'react-router-dom';

const PlaceholderPage = () => {
  const location = useLocation();
  const pageName = location.pathname
    .split('/')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '))
    .join(' > ');

  return (
    <Result
      status="info"
      title={`Page ${pageName}`}
      subTitle="Cette page est en cours de développement. Le contenu sera bientôt disponible."
    />
  );
};

export default PlaceholderPage; 