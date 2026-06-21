# SCHOOL101 Quick Start Guide

Welcome to **SCHOOL101 - Global MCP for Education**! 🎓

This guide will get you up and running in 5 minutes.

---

## 📋 What's Included

You have received a complete, production-ready MCP server with:

✅ **Core Files**
- `school101-mcp-server.ts` - Main MCP server implementation (45+ education tools)
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `docker-compose.yml` - Local development environment

✅ **Documentation**
- `README.md` - Complete feature documentation and usage examples
- `ROADMAP.md` - 5-phase development plan (24-36 months)
- `DEPLOYMENT.md` - Comprehensive deployment guide

✅ **Configuration**
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `wrangler.toml` - Cloudflare Workers configuration
- `Dockerfile` - Container configuration

---

## 🚀 Option 1: Local Development (5 minutes)

### Prerequisites
- Node.js 18+
- npm
- Git

### Setup

```bash
# 1. Clone your project
git clone <your-repo-url>
cd school101-mcp

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your Canvas API token, etc.

# 4. Start development server
npm run dev

# Server runs at http://localhost:3000
```

---

## 🐳 Option 2: Docker Setup (5 minutes)

### Prerequisites
- Docker
- Docker Compose

### Setup

```bash
# 1. Start all services (PostgreSQL, Redis, MCP Server)
docker-compose up -d

# 2. Check if everything is running
docker-compose ps

# 3. View logs
docker-compose logs -f app

# Server runs at http://localhost:3000
# Database: PostgreSQL at localhost:5432
# Cache: Redis at localhost:6379
```

---

## ☁️ Option 3: Cloudflare Deployment (10 minutes)

### Prerequisites
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

### Setup

```bash
# 1. Login to Cloudflare
wrangler login

# 2. Create KV namespaces
wrangler kv:namespace create "CACHE"
wrangler kv:namespace create "AUTH_TOKENS"
wrangler kv:namespace create "RATE_LIMIT"

# Update wrangler.toml with the namespace IDs

# 3. Add secrets
wrangler secret put CANVAS_API_TOKEN
# Paste your token, press Enter twice

wrangler secret put CANVAS_INSTANCE_URL
# Paste your Canvas URL (e.g., https://school.instructure.com)

# 4. Deploy
wrangler deploy --env production

# Your API is now live at: https://api.yourdomain.com
```

---

## 📚 Key Features Overview

### Canvas LMS Integration (116 tools)
```javascript
// Get student courses
await mcp.tools.call('canvas_get_courses', {
  api_token: process.env.CANVAS_API_TOKEN,
  canvas_url: process.env.CANVAS_INSTANCE_URL
})
```

### K-12 Standards Search
```javascript
// Find Common Core standards
await mcp.tools.call('k12_standards_search', {
  subject: 'mathematics',
  grade_level: '5',
  query: 'fractions',
  standards_framework: 'common_core'
})
```

### Math Problem Solver
```javascript
// Step-by-step math tutoring
await mcp.tools.call('math_solve_step_by_step', {
  problem: '2x + 5 = 13',
  problem_type: 'algebra',
  show_work: true
})
```

### Student Progress Tracking
```javascript
// Analyze student performance
await mcp.tools.call('student_progress_track', {
  student_id: 'STU_12345',
  time_period: 'semester',
  metrics: ['assignment_completion', 'grade_trend', 'learning_gaps']
})
```

### Lesson Planning
```javascript
// Auto-generate lesson plans
await mcp.tools.call('lesson_plan_generate', {
  topic: 'The Water Cycle',
  grade_level: '5',
  duration_minutes: 45,
  standards: ['NGSS.5-ESS2-1']
})
```

### And much more! (45+ total tools)
See `README.md` for complete tool documentation.

---

## 🔐 Security First

### User-Bound Permissions
- Every API call uses the authenticated user's credentials
- No global admin keys exposed
- OAuth 2.0 for Canvas authentication

### Destructive Operations Require Approval
```javascript
// Writing grades requires explicit confirmation
await mcp.tools.call('canvas_submit_assignment', {
  api_token: token,
  canvas_url: url,
  course_id: '12345',
  assignment_id: '67890',
  submission_content: 'Student submission',
  confirm_write: true  // MUST be true - triggers UI verification
})
```

### Audit Logging
- All API calls are logged
- Student data access tracked
- FERPA privacy mode available

---

## 📊 Testing the API

### Health Check
```bash
curl http://localhost:3000/health
```

### List Available Tools
```bash
curl -X POST http://localhost:3000/mcp/tools \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Search K-12 Standards
```bash
curl -X POST http://localhost:3000/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "k12_standards_search",
    "params": {
      "subject": "mathematics",
      "query": "fractions"
    }
  }'
```

---

## 📖 Documentation Map

| Document | Purpose |
|----------|---------|
| `README.md` | Feature overview, API documentation, architecture |
| `ROADMAP.md` | 5-phase development plan, future features, timeline |
| `DEPLOYMENT.md` | How to deploy to production (Docker, K8s, AWS, Cloudflare) |
| `QUICKSTART.md` | This file - getting started guide |

---

## 🛠️ Common Tasks

### Add Canvas API Key
```bash
# Edit .env
CANVAS_API_TOKEN=your_token_here
CANVAS_INSTANCE_URL=https://yourschool.instructure.com
```

### Start PostgreSQL Database
```bash
docker-compose up -d postgres
# Database: localhost:5432
# User: school101
# Password: password
```

### View Server Logs
```bash
# Docker Compose
docker-compose logs -f app

# Local development
npm run dev

# PM2 (production)
pm2 logs school101-mcp
```

### Deploy to Production
```bash
# See DEPLOYMENT.md for full instructions

# Cloudflare Workers
wrangler deploy --env production

# Docker
docker build -t school101-mcp:1.0.0 .
docker run -d -p 3000:3000 --env-file .env school101-mcp:1.0.0

# Kubernetes
kubectl apply -f k8s/deployment.yaml
```

---

## 🐛 Troubleshooting

### "Module not found" error
```bash
npm install  # Install dependencies
npm run build  # Build TypeScript
```

### Database connection error
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check connection string in .env
echo $DATABASE_URL
```

### Port already in use
```bash
# Change port in .env
PORT=3001

# Or kill existing process
lsof -ti:3000 | xargs kill -9
```

---

## 📞 Next Steps

1. **Read the full README.md** - Learn all available tools and features
2. **Review ROADMAP.md** - Understand the development vision
3. **Follow DEPLOYMENT.md** - Deploy to your infrastructure
4. **Configure .env** - Add your API keys and credentials
5. **Test the tools** - Use curl examples above
6. **Build your app** - Integrate MCP with Claude or other AI agents

---

## 🎓 Use Cases

### For Students
- AI tutoring with math step-by-step solving
- Assignment deadline tracking
- Learning progress monitoring
- Personalized learning pathways

### For Teachers
- Automated lesson planning
- Bulk grading with AI assistance
- Student progress analytics
- Standards-aligned assessment generation

### For Administrators
- District-wide student analytics
- Attendance and engagement tracking
- Equity gap identification
- Intervention targeting

### For Parents
- Student progress updates
- Assignment tracking
- Learning resource recommendations
- Communication with teachers

---

## 📄 License

MIT License - See LICENSE.md (if included)

---

## 🤝 Support

Questions or issues?

1. Check `README.md` - Most questions are answered there
2. Review `DEPLOYMENT.md` - Deployment-specific issues
3. Check application logs - `docker-compose logs app`
4. Email: support@school101.ai

---

## 🎉 You're Ready!

Everything is set up. Start with:

```bash
# Option 1: Local development
npm run dev

# Option 2: Docker
docker-compose up -d

# Option 3: Cloudflare Workers
wrangler deploy --env production
```

**Welcome to SCHOOL101!** 🎓✨

Transform education through unified AI orchestration.
