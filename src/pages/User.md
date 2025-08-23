# Gestion des Utilisateurs - Documentation

## Vue d'ensemble

Le système de gestion des utilisateurs permet aux administrateurs de gérer tous les utilisateurs de l'application avec des opérations CRUD complètes.

## Fonctionnalités

### 1. Tableau de bord des utilisateurs
- **Statistiques en temps réel** : Total, actifs, inactifs, super admins
- **Recherche avancée** : Par nom, email ou téléphone
- **Pagination** : Navigation facile avec options de taille de page
- **Filtres** : Par rôle (Admin/Super Admin) et statut
- **Tri** : Par date de dernière connexion

### 2. Opérations CRUD

#### Créer un utilisateur
- Formulaire modal avec validation
- Champs requis : nom, email, téléphone, mot de passe
- Sélection du rôle (Admin/Super Admin)
- Validation des mots de passe

#### Modifier un utilisateur
- Pré-remplissage des données existantes
- Modification des informations de base
- Pas de modification du mot de passe (utiliser le profil)

#### Supprimer un utilisateur
- Confirmation avant suppression
- Protection contre la suppression accidentelle

#### Voir les détails
- Modal avec informations complètes
- Date de création et dernière connexion
- Informations de contact

### 3. Gestion du profil utilisateur

#### Mon Profil
- **Informations personnelles** : Modifier nom, email, téléphone
- **Changement de mot de passe** : Ancien + nouveau mot de passe
- **Interface en onglets** : Navigation facile entre les sections

## Structure des données

### Utilisateur
```javascript
{
  id: string,
  name: string,
  email: string,
  telephone: string,
  role: 'admin' | 'super_admin',
  createdAt: Date,
  lastLogin: Date | null
}
```

### Rôles
- **Admin** : Accès standard à l'application
- **Super Admin** : Accès complet + gestion des autres utilisateurs

## API Endpoints

### Utilisateurs
- `GET /admin/all` - Liste des utilisateurs avec pagination
- `GET /admin/:id` - Détails d'un utilisateur
- `POST /admin/register` - Créer un utilisateur
- `PUT /admin/:id` - Modifier un utilisateur
- `DELETE /admin/:id` - Supprimer un utilisateur

### Profil utilisateur
- `GET /admin/profile` - Profil de l'utilisateur connecté
- `PUT /admin/profile` - Modifier le profil
- `PUT /admin/change-password` - Changer le mot de passe

## Interface utilisateur

### Composants principaux

1. **User.jsx** - Gestion des utilisateurs
   - Tableau avec actions
   - Statistiques
   - Recherche et filtres
   - Modals de création/modification

2. **UserProfile.jsx** - Profil utilisateur
   - Informations personnelles
   - Changement de mot de passe
   - Interface en onglets

3. **userService.js** - Service API
   - Toutes les opérations CRUD
   - Gestion des erreurs
   - Intégration avec l'API

### Navigation

- **Menu principal** : Utilisateurs > Liste
- **Profil** : Clic sur avatar > Mon Profil
- **Actions rapides** : Boutons dans le tableau

## Sécurité

### Permissions
- Seuls les Super Admins peuvent gérer les utilisateurs
- Les utilisateurs normaux peuvent modifier leur propre profil
- Protection des routes avec authentification

### Validation
- Validation côté client et serveur
- Vérification des mots de passe
- Validation des emails et téléphones

## Utilisation

### Pour les Super Admins

1. **Accéder à la gestion** : Menu Utilisateurs > Liste
2. **Créer un utilisateur** : Bouton "Ajouter un utilisateur"
3. **Modifier** : Clic sur l'icône de modification
4. **Supprimer** : Clic sur l'icône de suppression (avec confirmation)
5. **Voir les détails** : Clic sur l'icône de visualisation

### Pour tous les utilisateurs

1. **Accéder au profil** : Clic sur avatar > Mon Profil
2. **Modifier les informations** : Onglet "Informations personnelles"
3. **Changer le mot de passe** : Onglet "Changer le mot de passe"

## Messages d'erreur

### Erreurs courantes
- "Admin already exists with this email or telephone"
- "Invalid credentials"
- "No admin found with these credentials"
- "Not authorized to view all admins"

### Gestion des erreurs
- Messages d'erreur contextuels
- Validation en temps réel
- Feedback utilisateur immédiat

## Personnalisation

### Thème
- Utilisation d'Ant Design
- Couleurs cohérentes avec l'application
- Icônes et badges pour une meilleure UX

### Responsive
- Adaptation mobile et desktop
- Tableau avec scroll horizontal
- Modals adaptatives

## Maintenance

### Logs
- Toutes les opérations sont loggées
- Traçabilité des modifications
- Historique des connexions

### Sauvegarde
- Données utilisateurs critiques
- Sauvegarde régulière recommandée
- Export possible pour audit
