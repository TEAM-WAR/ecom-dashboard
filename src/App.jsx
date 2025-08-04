import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Products from './pages/Products';
import PlaceholderPage from './components/PlaceholderPage';
import Category from './pages/Category';
import StockTransactions from './pages/StockTransactions.jsx';
import Colis from './pages/Colis/Colis';
import ColisRetour from './pages/ColisRetour';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/login" replace />} />

          {/* Routes Gestion des Colis */}
          <Route path="colis">
            <Route path="suivi" element={<Colis />} />
            <Route path="scans" element={<PlaceholderPage />} />
            <Route path="historique" element={<PlaceholderPage />} />
            <Route path="retours" element={<ColisRetour />} />
          </Route>

          {/* Routes Stock & Produits */}
          <Route path="stock">
            <Route path="produits" element={<Products />} />
            <Route path="mouvements" element={<StockTransactions />} />
            <Route path="categories" element={<Category />} />
            <Route path="etat" element={<PlaceholderPage />} />
          </Route>

          {/* Routes Alertes */}
          <Route path="alertes">
            <Route path="retours" element={<PlaceholderPage />} />
            <Route path="client" element={<PlaceholderPage />} />
            <Route path="historique" element={<PlaceholderPage />} />
          </Route>

          {/* Routes Dashboard */}
          <Route path="dashboard">
            <Route path="performance" element={<PlaceholderPage />} />
            <Route path="livraison" element={<PlaceholderPage />} />
            <Route path="retour" element={<PlaceholderPage />} />
            <Route path="produits" element={<PlaceholderPage />} />
            <Route path="statistiques" element={<PlaceholderPage />} />
          </Route>

          {/* Routes WhatsApp */}
          <Route path="whatsapp">
            <Route path="messages-auto" element={<PlaceholderPage />} />
            <Route path="modeles" element={<PlaceholderPage />} />
            <Route path="conversations" element={<PlaceholderPage />} />
          </Route>

          {/* Routes Utilisateurs */}
          <Route path="utilisateurs">
            <Route path="liste" element={<PlaceholderPage />} />
            <Route path="roles" element={<PlaceholderPage />} />
            <Route path="actions" element={<PlaceholderPage />} />
          </Route>

          {/* Routes Financier */}
          <Route path="financier">
            <Route path="depenses" element={<PlaceholderPage />} />
            <Route path="couts" element={<PlaceholderPage />} />
            <Route path="marge" element={<PlaceholderPage />} />
            <Route path="export" element={<PlaceholderPage />} />
          </Route>

          {/* Routes Exports */}
          <Route path="exports">
            <Route path="pdf-excel" element={<PlaceholderPage />} />
            <Route path="mensuel" element={<PlaceholderPage />} />
            <Route path="personnalise" element={<PlaceholderPage />} />
          </Route>

          {/* Routes Paramètres */}
          <Route path="parametres">
            <Route path="apis" element={<PlaceholderPage />} />
            <Route path="messages" element={<PlaceholderPage />} />
            <Route path="securite" element={<PlaceholderPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
