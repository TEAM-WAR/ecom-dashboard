# Guide de Déploiement - Ecom Dashboard

## Vue d'ensemble

Cette application React est déployée avec Docker et Nginx pour une performance optimale en production.

## Prérequis

- Docker installé sur le serveur
- Au moins 2GB de RAM disponible
- Port 80 disponible

## Déploiement Rapide

### 1. Utilisation du script de déploiement (Recommandé)

```bash
# Rendre le script exécutable (première fois seulement)
chmod +x deploy.sh

# Démarrer l'application
./deploy.sh start

# Vérifier le statut
./deploy.sh status

# Voir les logs
./deploy.sh logs

# Arrêter l'application
./deploy.sh stop

# Redémarrer l'application
./deploy.sh restart

# Reconstruire et redémarrer (après modifications du code)
./deploy.sh rebuild
```

### 2. Déploiement manuel avec Docker

```bash
# Construire l'image
docker build --target production -t ecom-dashboard:latest .

# Démarrer le conteneur
docker run -d --name ecom-dashboard -p 80:80 --restart unless-stopped ecom-dashboard:latest

# Vérifier le statut
docker ps

# Voir les logs
docker logs ecom-dashboard

# Arrêter le conteneur
docker stop ecom-dashboard
docker rm ecom-dashboard
```

### 3. Déploiement avec Docker Compose

```bash
# Démarrer en mode production
docker-compose --profile production up -d

# Démarrer en mode développement
docker-compose up -d

# Arrêter tous les services
docker-compose down
```

## Configuration

### Variables d'environnement

L'application utilise les variables d'environnement suivantes :

- `NODE_ENV`: Environnement (development/production)
- `VITE_API_URL`: URL de l'API backend (optionnel)

### Configuration Nginx

Le fichier `nginx.conf` contient la configuration optimisée pour :
- Compression gzip
- Cache des assets statiques
- Support du routing côté client (React Router)
- Headers de sécurité
- Optimisations de performance

## Monitoring

### Vérification de la santé

```bash
# Test de connectivité
curl -I http://localhost

# Health check du conteneur
docker inspect ecom-dashboard | grep Health -A 10
```

### Logs

```bash
# Logs en temps réel
./deploy.sh logs

# Logs avec timestamps
docker logs -t ecom-dashboard

# Logs des dernières 100 lignes
docker logs --tail 100 ecom-dashboard
```

## Maintenance

### Mise à jour de l'application

```bash
# 1. Arrêter l'application
./deploy.sh stop

# 2. Mettre à jour le code source
git pull origin main

# 3. Reconstruire et redémarrer
./deploy.sh rebuild
```

### Nettoyage

```bash
# Supprimer les images non utilisées
docker image prune -f

# Supprimer les conteneurs arrêtés
docker container prune -f

# Nettoyage complet (attention !)
docker system prune -a -f
```

## Dépannage

### Problèmes courants

1. **Port 80 déjà utilisé**
   ```bash
   # Vérifier ce qui utilise le port 80
   sudo netstat -tlnp | grep :80
   
   # Arrêter nginx système si nécessaire
   sudo systemctl stop nginx
   ```

2. **Erreur de mémoire lors du build**
   ```bash
   # Augmenter la mémoire disponible pour Docker
   # Ou utiliser un serveur avec plus de RAM
   ```

3. **Application ne répond pas**
   ```bash
   # Vérifier le statut du conteneur
   ./deploy.sh status
   
   # Vérifier les logs
   ./deploy.sh logs
   
   # Redémarrer l'application
   ./deploy.sh restart
   ```

### Logs d'erreur

Les logs sont disponibles dans :
- Conteneur Docker : `docker logs ecom-dashboard`
- Nginx : `/var/log/nginx/` (dans le conteneur)

## Sécurité

- L'application s'exécute avec un utilisateur non-root
- Headers de sécurité configurés dans Nginx
- Conteneur isolé avec Docker
- Redémarrage automatique en cas de crash

## Performance

- Compression gzip activée
- Cache des assets statiques (1 an)
- Cache HTML (1 heure)
- Optimisations Nginx pour les applications React

## Support

Pour toute question ou problème :
1. Vérifier les logs : `./deploy.sh logs`
2. Vérifier le statut : `./deploy.sh status`
3. Consulter cette documentation
4. Contacter l'équipe de développement 