# SCHOOL101 Deployment Guide

Complete instructions for deploying SCHOOL101 - Global MCP for Education across different environments.

---

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Docker Deployment](#docker-deployment)
3. [Cloudflare Workers Deployment](#cloudflare-workers-deployment)
4. [Production Deployment](#production-deployment)
5. [Database Setup](#database-setup)
6. [Security Configuration](#security-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: Latest version
- **Docker** (optional, for running services)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/school101-mcp.git
cd school101-mcp
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

### Step 4: Start Development Services (Optional)

Using Docker Compose:

```bash
# Start all services (PostgreSQL, Redis, ChromaDB, etc.)
docker-compose up -d

# Verify services are running
docker-compose ps
```

### Step 5: Initialize Database

```bash
# Run migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### Step 6: Start Development Server

```bash
# Development mode with hot reload
npm run dev

# Server will be available at http://localhost:3000
```

### Step 7: Verify Installation

```bash
# Test MCP server
curl -X POST http://localhost:3000/mcp/tools \
  -H "Content-Type: application/json"

# Should return list of available tools
```

---

## Docker Deployment

### Option 1: Using Docker Compose (Recommended for Development)

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Option 2: Docker Only (Production-like)

```bash
# Build image
docker build -t school101-mcp:latest .

# Run container
docker run -d \
  --name school101-mcp \
  -p 3000:3000 \
  --env-file .env \
  --health-cmd='curl -f http://localhost:3000/health || exit 1' \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  school101-mcp:latest

# View logs
docker logs -f school101-mcp

# Stop container
docker stop school101-mcp
docker rm school101-mcp
```

### Docker Network Setup

```bash
# Create custom network
docker network create school101-network

# Run PostgreSQL
docker run -d \
  --name school101-postgres \
  --network school101-network \
  -e POSTGRES_USER=school101 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=school101_dev \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Run Redis
docker run -d \
  --name school101-redis \
  --network school101-network \
  redis:7-alpine

# Run MCP app
docker run -d \
  --name school101-mcp \
  --network school101-network \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://school101:password@school101-postgres:5432/school101_dev \
  -e REDIS_URL=redis://school101-redis:6379 \
  school101-mcp:latest
```

---

## Cloudflare Workers Deployment

### Prerequisites

- Cloudflare account (free tier supported)
- Wrangler CLI installed: `npm install -g wrangler`
- Domain added to Cloudflare

### Step 1: Setup Cloudflare

```bash
# Login to Cloudflare
wrangler login

# Verify authentication
wrangler whoami
```

### Step 2: Configure wrangler.toml

Edit `wrangler.toml` with your settings:

```toml
[env.production]
name = "school101-mcp-prod"
route = "https://api.yourdomain.com/*"
zone_id = "YOUR_ZONE_ID"  # From Cloudflare dashboard
```

Get your Zone ID from Cloudflare dashboard → Domain Overview → Copy Zone ID

### Step 3: Create KV Namespaces

```bash
# Create KV namespaces for caching and state
wrangler kv:namespace create "CACHE"
wrangler kv:namespace create "AUTH_TOKENS"
wrangler kv:namespace create "RATE_LIMIT"

# For production
wrangler kv:namespace create "CACHE" --preview false
wrangler kv:namespace create "AUTH_TOKENS" --preview false
wrangler kv:namespace create "RATE_LIMIT" --preview false
```

Update `wrangler.toml` with the returned namespace IDs.

### Step 4: Create D1 Database (Optional)

```bash
# Create D1 database
wrangler d1 create school101-prod

# Get database ID from output and update wrangler.toml
```

### Step 5: Add Secrets

```bash
# Add environment secrets
wrangler secret put CANVAS_API_TOKEN
# Paste your Canvas API token

wrangler secret put CANVAS_INSTANCE_URL
# Enter: https://yourschool.instructure.com

wrangler secret put DATABASE_URL
# Enter your PostgreSQL connection string

wrangler secret put REDIS_URL
# Enter your Redis connection string

# Add more secrets as needed
wrangler secret put MICROSOFT_LEARN_API_KEY
wrangler secret put WOLFRAM_API_KEY
```

### Step 6: Deploy to Cloudflare

```bash
# Deploy to production
wrangler deploy --env production

# View deployment status
wrangler deployments list --env production

# Monitor logs
wrangler tail --env production
```

### Step 7: Test Deployment

```bash
# Test API endpoint
curl https://api.yourdomain.com/mcp/tools \
  -H "Content-Type: application/json"

# Check health
curl https://api.yourdomain.com/health
```

### Cloudflare Workers Limitations

⚠️ **Note**: Cloudflare Workers have some limitations:
- Maximum execution time: 30 seconds (request timeout)
- Memory limit: 128 MB
- Not suitable for long-running processes

**Solution**: Use Cloudflare Workers as API gateway + external database for heavy lifting

---

## Production Deployment

### Option 1: AWS ECS (Recommended)

```bash
# Login to AWS ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Build and push Docker image
docker build -t school101-mcp:1.0.0 .
docker tag school101-mcp:1.0.0 YOUR_AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/school101-mcp:1.0.0
docker push YOUR_AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/school101-mcp:1.0.0

# Create ECS task definition (save as task-definition.json)
# See AWS documentation for full structure

# Create ECS cluster
aws ecs create-cluster --cluster-name school101-prod

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster school101-prod \
  --service-name school101-mcp \
  --task-definition school101-mcp:1 \
  --desired-count 3 \
  --launch-type FARGATE \
  --network-configuration awsvpcConfiguration="{subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

### Option 2: Google Cloud Run

```bash
# Build image
gcloud builds submit --tag gcr.io/PROJECT_ID/school101-mcp

# Deploy to Cloud Run
gcloud run deploy school101-mcp \
  --image gcr.io/PROJECT_ID/school101-mcp \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --set-env-vars DATABASE_URL=$DATABASE_URL,REDIS_URL=$REDIS_URL \
  --allow-unauthenticated

# View deployed service
gcloud run services list
```

### Option 3: Kubernetes (DigitalOcean, GKE, EKS)

```bash
# Create deployment
kubectl create deployment school101-mcp \
  --image=school101-mcp:latest \
  --replicas=3

# Expose as service
kubectl expose deployment school101-mcp \
  --type=LoadBalancer \
  --port=80 \
  --target-port=3000

# Apply configuration
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment status
kubectl get deployments
kubectl get services
kubectl logs deployment/school101-mcp
```

### Option 4: Traditional VPS (DigitalOcean, Linode, AWS EC2)

```bash
# SSH into server
ssh root@server_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/yourusername/school101-mcp.git
cd school101-mcp

# Install dependencies
npm install --production

# Install PM2 for process management
sudo npm install -g pm2

# Start application with PM2
pm2 start npm --name "school101-mcp" -- start

# Save PM2 configuration
pm2 save
sudo pm2 startup

# Setup Nginx reverse proxy
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/school101-mcp
```

Nginx configuration:

```nginx
upstream school101_backend {
    server localhost:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://school101_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/school101-mcp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## Database Setup

### PostgreSQL Production Setup

```bash
# Create database and user
createdb school101_prod
createuser school101_admin
psql -U postgres -d school101_prod -c "GRANT ALL PRIVILEGES ON DATABASE school101_prod TO school101_admin;"

# Enable pgvector extension (for semantic search)
psql -U postgres -d school101_prod -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Run migrations
npm run db:migrate -- --env production

# Verify tables
psql -U school101_admin -d school101_prod -c "\dt"
```

### Database Backups

```bash
# Daily backup
pg_dump -U school101_admin -h localhost school101_prod | gzip > backup_$(date +%Y%m%d).sql.gz

# Schedule with cron
0 2 * * * pg_dump -U school101_admin -h localhost school101_prod | gzip > /backups/backup_$(date +\%Y\%m\%d).sql.gz

# Restore from backup
gunzip < backup_20240101.sql.gz | psql -U school101_admin -d school101_prod
```

### Redis Configuration

```bash
# Production Redis configuration
# /etc/redis/redis.conf

# Set maxmemory and eviction policy
maxmemory 2gb
maxmemory-policy allkeys-lru

# Enable persistence
save 900 1
save 300 10
save 60 10000

# Restart Redis
sudo systemctl restart redis-server
```

---

## Security Configuration

### SSL/TLS Certificates

```bash
# Generate self-signed certificate (development)
openssl req -x509 -newkey rsa:4096 -nodes \
  -out certs/cert.pem -keyout certs/key.pem -days 365

# Using Let's Encrypt (production)
certbot certonly --standalone \
  -d api.school101.ai \
  -d *.school101.ai
```

### Environment Variables Security

```bash
# Never commit .env files
git update-index --assume-unchanged .env

# For Cloudflare Workers
wrangler secret put JWT_SECRET

# For traditional servers, use systemd environment files
sudo nano /etc/systemd/system/school101-mcp.service

# [Service]
# EnvironmentFile=/etc/school101/.env
```

### Firewall Configuration

```bash
# UFW Firewall (Ubuntu)
sudo ufw enable
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 3000/tcp    # App (internal only: 127.0.0.1)

# AWS Security Groups
# Inbound: Port 80 (HTTP), Port 443 (HTTPS) from 0.0.0.0/0
# Inbound: Port 3000 from load balancer security group
# Outbound: All traffic
```

### API Rate Limiting

Configured in `.env`:

```env
RATE_LIMIT_RPM=100  # 100 requests per minute per IP
```

### CORS Configuration

```typescript
// In server configuration
const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGINS?.split(','),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};
```

---

## Monitoring & Logging

### Application Monitoring

```bash
# Using PM2 monitoring dashboard
pm2 monit

# Using PM2 Plus (Requires account)
pm2 plus

# Logs
pm2 logs school101-mcp
pm2 logs school101-mcp --lines 100
pm2 logs school101-mcp --err
```

### Cloudflare Analytics

```bash
# View worker logs
wrangler tail --env production

# Filter by status code
wrangler tail --env production --status 500
```

### Prometheus Metrics (Advanced)

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'school101-mcp'
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: '/metrics'
```

### ELK Stack (Elasticsearch, Logstash, Kibana)

```bash
# Docker Compose setup (see docker-compose.yml)
docker-compose up -d elasticsearch logstash kibana

# Configure logstash to forward logs from MCP
# App will forward logs → Logstash → Elasticsearch → Kibana
```

---

## Troubleshooting

### Common Issues

#### Issue: "Cannot connect to database"

```bash
# Check database connection string
echo $DATABASE_URL

# Verify PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check firewall
sudo ufw status
```

#### Issue: "Redis connection failed"

```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Check Redis configuration
redis-cli CONFIG GET "*"

# Clear Redis cache
redis-cli FLUSHDB
```

#### Issue: "High memory usage"

```bash
# Check Node.js process
ps aux | grep node

# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm start

# Monitor memory in real-time
watch -n 1 'free -h'
```

#### Issue: "Slow API responses"

```bash
# Check database slow queries
# PostgreSQL log_statement
sudo nano /etc/postgresql/*/main/postgresql.conf
# log_statement = 'all'
# log_duration = on

# Check indexes
psql -U school101_admin -d school101_prod -c "\d+ students"

# Create missing indexes
psql -U school101_admin -d school101_prod -f sql/indexes.sql
```

### Health Checks

```bash
# API health check
curl http://localhost:3000/health

# Database health check
curl http://localhost:3000/health/db

# Redis health check
curl http://localhost:3000/health/redis

# All services
curl http://localhost:3000/health/all
```

---

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules configured
- [ ] Backups scheduled
- [ ] Monitoring/logging setup
- [ ] Health checks passing
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] CDN configured (if using Cloudflare)
- [ ] DNS records configured
- [ ] Documentation updated

---

## Support

For deployment issues:
1. Check application logs: `docker-compose logs app`
2. Check database connectivity
3. Review firewall rules
4. Verify environment variables
5. Contact: deploy@school101.ai

Happy deploying! 🚀
