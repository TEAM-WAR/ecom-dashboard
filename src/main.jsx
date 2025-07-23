import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import frFR from 'antd/locale/fr_FR';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={frFR}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
