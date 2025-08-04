#!/bin/bash

# Script de déploiement pour ecom-dashboard
# Usage: ./deploy.sh [start|stop|restart|build|logs|status]

set -e

CONTAINER_NAME="ecom-dashboard"
IMAGE_NAME="ecom-dashboard:latest"
PORT=80

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction pour arrêter le conteneur
stop_container() {
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        log_info "Arrêt du conteneur $CONTAINER_NAME..."
        docker stop $CONTAINER_NAME
        docker rm $CONTAINER_NAME
        log_info "Conteneur $CONTAINER_NAME arrêté et supprimé"
    else
        log_warn "Conteneur $CONTAINER_NAME n'est pas en cours d'exécution"
    fi
}

# Fonction pour construire l'image
build_image() {
    log_info "Construction de l'image Docker..."
    docker build --target production -t $IMAGE_NAME .
    log_info "Image $IMAGE_NAME construite avec succès"
}

# Fonction pour démarrer le conteneur
start_container() {
    log_info "Démarrage du conteneur $CONTAINER_NAME..."
    docker run -d \
        --name $CONTAINER_NAME \
        -p $PORT:80 \
        --restart unless-stopped \
        $IMAGE_NAME
    
    log_info "Conteneur $CONTAINER_NAME démarré sur le port $PORT"
    log_info "Application accessible sur: http://localhost:$PORT"
}

# Fonction pour afficher le statut
show_status() {
    echo "=== Statut de l'application ecom-dashboard ==="
    echo ""
    
    # Statut du conteneur
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        log_info "Conteneur $CONTAINER_NAME est en cours d'exécution"
        docker ps -f name=$CONTAINER_NAME
    else
        log_warn "Conteneur $CONTAINER_NAME n'est pas en cours d'exécution"
    fi
    
    echo ""
    
    # Test de connectivité
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT | grep -q "200"; then
        log_info "Application répond correctement sur http://localhost:$PORT"
    else
        log_error "Application ne répond pas sur http://localhost:$PORT"
    fi
}

# Fonction pour afficher les logs
show_logs() {
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        docker logs -f $CONTAINER_NAME
    else
        log_error "Conteneur $CONTAINER_NAME n'est pas en cours d'exécution"
        exit 1
    fi
}

# Gestion des arguments
case "${1:-}" in
    "start")
        stop_container
        start_container
        show_status
        ;;
    "stop")
        stop_container
        ;;
    "restart")
        stop_container
        start_container
        show_status
        ;;
    "build")
        build_image
        ;;
    "rebuild")
        stop_container
        build_image
        start_container
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|build|rebuild|logs|status}"
        echo ""
        echo "Commandes disponibles:"
        echo "  start   - Démarrer l'application"
        echo "  stop    - Arrêter l'application"
        echo "  restart - Redémarrer l'application"
        echo "  build   - Construire l'image Docker"
        echo "  rebuild - Reconstruire et redémarrer l'application"
        echo "  logs    - Afficher les logs en temps réel"
        echo "  status  - Afficher le statut de l'application"
        exit 1
        ;;
esac 