# Services API

Ce dossier contient tous les services API pour l'application Colixy.

## Structure

```
services/
├── apiClient.js          # Configuration Axios avec intercepteurs
├── productService.js     # Services pour les produits
├── categoryService.js    # Services pour les catégories
├── index.js             # Export centralisé
└── README.md            # Documentation
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# API Configuration
VITE_APP_API_URL=http://localhost:5000/api
VITE_APP_API_KEY=your-api-key-here

# App Configuration
VITE_APP_NAME=Colixy
VITE_APP_VERSION=1.0.0
```

## Utilisation

### Import des services

```javascript
// Import d'un service spécifique
import { productService } from '../services';

// Import de tous les services
import { productService, categoryService, apiClient } from '../services';
```

### Exemples d'utilisation

#### Produits

```javascript
// Récupérer tous les produits
const products = await productService.getAllProducts();

// Récupérer avec filtres
const filteredProducts = await productService.getAllProducts({
  category: 'Electronics',
  minPrice: 10,
  maxPrice: 100,
  inStock: true
});

// Créer un produit
const newProduct = await productService.createProduct({
  name: 'Nouveau produit',
  price: 29.99,
  category: 'Electronics',
  description: 'Description du produit'
});

// Mettre à jour un produit
const updatedProduct = await productService.updateProduct(productId, {
  name: 'Produit modifié',
  price: 39.99
});

// Supprimer un produit
await productService.deleteProduct(productId);
```

#### Catégories

```javascript
// Récupérer toutes les catégories
const categories = await categoryService.getAllCategories();

// Créer une catégorie
const newCategory = await categoryService.createCategory({
  name: 'Nouvelle catégorie',
  description: 'Description de la catégorie'
});

// Mettre à jour une catégorie
const updatedCategory = await categoryService.updateCategory(categoryId, {
  name: 'Catégorie modifiée'
});

// Supprimer une catégorie
await categoryService.deleteCategory(categoryId);
```

## Fonctionnalités

### Intercepteurs

- **Request Interceptor** : Ajoute automatiquement la clé API dans les headers
- **Response Interceptor** : Gère les erreurs HTTP et les redirections

### Gestion d'erreurs

Le service gère automatiquement :
- Erreurs 401 (Non autorisé)
- Erreurs 403 (Interdit)
- Erreurs 404 (Non trouvé)
- Erreurs 500 (Erreur serveur)
- Erreurs de réseau

### Credentials

Les requêtes incluent automatiquement les credentials pour les requêtes cross-origin.

## Ajout de nouveaux services

Pour ajouter un nouveau service :

1. Créez un nouveau fichier `newService.js`
2. Importez `apiClient`
3. Exportez les fonctions du service
4. Ajoutez l'export dans `index.js`

Exemple :

```javascript
// newService.js
import apiClient from './apiClient';

export const newService = {
  getAll: async () => {
    return apiClient.get('/endpoint');
  },
  
  create: async (data) => {
    return apiClient.post('/endpoint', data);
  }
};

export default newService;
```

```javascript
// index.js
export { default as newService } from './newService';
export { newService } from './newService';
``` 