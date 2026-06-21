# SCHOOL101 - Global MCP for Education

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18+-green)

**A unified Model Context Protocol (MCP) server that consolidates global educational platforms, enabling AI agents to seamlessly integrate with Canvas LMS, K-12 standards databases, assessment tools, and educational data analytics.**

> Deploy once. Integrate everywhere. Transform education through standardized AI orchestration.

---

## 🎯 Overview

SCHOOL101 solves the fragmentation problem in educational technology by providing a **single, standardized MCP interface** to dozens of EdTech platforms. Instead of building bespoke integrations for each tool, AI agents (Claude, GitHub Copilot, etc.) now query a unified gateway.

### What It Does

- **🎓 Canvas LMS Integration**: Read courses, assignments, submissions; write grades with safeguards
- **📚 K-12 Standards Alignment**: Query academic standards, align content with learning outcomes
- **🧮 Math Problem Solving**: Step-by-step math tutoring with persistent progress
- **📊 Education Data Analytics**: Analyze student progress, identify learning gaps, generate insights
- **🔬 Microsoft Learn Access**: Search and fetch official Microsoft documentation
- **♿ Accessibility & Special Ed**: Differentiate content for diverse learning needs
- **🎯 Assessment Generation**: Create standards-aligned quizzes and rubrics
- **👥 Classroom Analytics**: Cohort analysis, equity gap identification, intervention targeting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Canvas API token (optional, for Canvas features)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/school101-mcp.git
cd school101-mcp

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Configuration (.env)

```env
# Canvas LMS (optional)
CANVAS_API_TOKEN=your_canvas_token_here
CANVAS_INSTANCE_URL=https://yourschool.instructure.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/school101
REDIS_URL=redis://localhost:6379

# API Keys
MICROSOFT_LEARN_API_KEY=your_key_here
SEMANTIC_SCHOLAR_API_KEY=your_key_here
WOLFRAM_API_KEY=your_key_here

# Server Configuration
PORT=3000
MCP_TRANSPORT=stdio  # or 'http' or 'sse'
ENVIRONMENT=development
```

### Start the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## 📋 Integrated Educational Services

### 1. **Canvas LMS** (Instructure)
```typescript
// List student courses
await client.tools.call('canvas_get_courses', {
  api_token: process.env.CANVAS_API_TOKEN,
  canvas_url: process.env.CANVAS_INSTANCE_URL,
  include_enrollments: true
})

// Get assignments
await client.tools.call('canvas_get_assignments', {
  api_token: token,
  canvas_url: url,
  course_id: '12345'
})

// Submit assignment (requires explicit confirm_write=true)
await client.tools.call('canvas_submit_assignment', {
  api_token: token,
  canvas_url: url,
  course_id: '12345',
  assignment_id: '67890',
  submission_content: 'Student submission',
  confirm_write: true  // DESTRUCTIVE: requires approval
})
```

### 2. **K-12 Academic Standards**
```typescript
// Search Common Core standards
await client.tools.call('k12_standards_search', {
  subject: 'mathematics',
  grade_level: '5',
  query: 'fractions and decimals',
  standards_framework: 'common_core'
})

// Align content with standards
await client.tools.call('k12_align_content', {
  content_title: 'Introduction to Fractions',
  content_type: 'lesson',
  standard_ids: ['CCSS.MATH.3.NF.A.1', 'CCSS.MATH.3.NF.A.2'],
  grade_level: '3'
})
```

### 3. **Math Problem Solving**
```typescript
// Solve with step-by-step breakdown
await client.tools.call('math_solve_step_by_step', {
  problem: 'Solve for x: 2x + 5 = 13',
  problem_type: 'algebra',
  show_work: true,
  difficulty_level: 'intermediate'
})

// Generate practice problems
await client.tools.call('math_practice_generate', {
  topic: 'quadratic_equations',
  quantity: 10,
  difficulty: 'hard',
  student_id: 'STU_12345'
})
```

### 4. **Student Progress Tracking**
```typescript
// Track individual student progress
await client.tools.call('student_progress_track', {
  student_id: 'STU_12345',
  time_period: 'semester',
  metrics: [
    'assignment_completion',
    'grade_trend',
    'learning_gaps',
    'mastery_level'
  ]
})

// Analyze entire cohort
await client.tools.call('cohort_analytics', {
  course_id: 'COURSE_789',
  cohort_type: 'grade_level',
  analysis_type: [
    'performance_distribution',
    'engagement_patterns',
    'equity_gaps',
    'intervention_targets'
  ]
})
```

### 5. **Curriculum & Lesson Planning**
```typescript
// Search open educational resources
await client.tools.call('curriculum_search', {
  query: 'photosynthesis',
  subject: 'science',
  grade_level: '6',
  resource_type: 'lesson',
  include_standards: true
})

// Generate complete lesson plan
await client.tools.call('lesson_plan_generate', {
  topic: 'The Water Cycle',
  grade_level: '5',
  duration_minutes: 45,
  standards: ['NGSS.5-ESS2-1'],
  learning_styles: ['visual', 'kinesthetic']
})
```

### 6. **Assessment & Grading**
```typescript
// Generate standards-aligned assessment
await client.tools.call('assessment_generate', {
  topic: 'mitochondria_function',
  question_count: 15,
  question_types: ['multiple_choice', 'short_answer'],
  difficulty_curve: true,
  bloom_level: 'analyze'
})

// Create grading rubric
await client.tools.call('rubric_create', {
  rubric_title: 'Essay Writing Rubric',
  criteria: [
    {
      criterion: 'Thesis Clarity',
      levels: ['Beginning', 'Developing', 'Proficient', 'Advanced'],
      points: [0, 5, 10, 15]
    }
  ],
  total_points: 100
})
```

### 7. **Special Education & Accessibility**
```typescript
// Differentiate content for learners with ADHD
await client.tools.call('differentiate_content', {
  content: 'Long paragraph about photosynthesis...',
  adaptations: [
    'simplify_language',
    'break_into_chunks',
    'add_visuals'
  ],
  learning_profile: 'ADHD'
})
```

### 8. **Microsoft Learn Integration**
```typescript
// Search Microsoft Learn
await client.tools.call('microsoft_learn_search', {
  query: 'async/await in JavaScript',
  language: 'javascript',
  difficulty: 'intermediate'
})

// Fetch complete module
await client.tools.call('microsoft_learn_fetch_module', {
  module_id: 'learn-module-12345',
  include_exercises: true,
  include_quiz: true
})
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                   AI Agents                              │
│        (Claude, Copilot, Custom Applications)            │
└─────────────────┬───────────────────────────────────────┘
                  │
         MCP Protocol (JSON-RPC)
                  │
┌─────────────────▼───────────────────────────────────────┐
│         SCHOOL101 MCP Server (Node.js)                   │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┬──────────────┬──────────────┐           │
│  │ Tool Layer  │Resource Layer│ Prompt Layer │           │
│  └─────────────┴──────────────┴──────────────┘           │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Canvas │K-12 │ Math │ Assessment │ Analytics  │    │
│  │ Router │Standards│ Solver│ Generator │Engine   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Authentication │Authorization │Request Validation  │  │
│  │ Row-Level Security │Rate Limiting │Audit Logging  │  │
│  └──────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────┼──────────────────────┬─────────────────┐
│                 │                      │                 │
▼                 ▼                      ▼                 ▼
Canvas      K-12 Standards         Education Data      Microsoft Learn
LMS API     Knowledge Graph        Analytics APIs       Documentation
(REST)      (GraphQL/REST)         (PostgreSQL)         (REST)
```

### Request Flow with Safety

```
User Query
    │
    ▼
┌─────────────────────────┐
│ Authentication Check    │ ◄─ User-bound OAuth 2.0
│ (User-specific token)   │
└────────┬────────────────┘
         │
    ▼────▼
┌─────────────────────────┐
│ Tool Analysis           │
│ Destructive? (write)    │
└────────┬────────────────┘
         │
    ▼────▼───────────────────┐
    │                        │
    (read-safe)        (destructive)
    │                        │
    ▼                        ▼
┌──────────────┐    ┌─────────────────────────────┐
│ Execute Tool │    │ Require confirm_write=true  │
│ Immediately  │    │ AND human verification UI   │
└──────────────┘    └─────────────────────────────┘
    │                        │
    └────────────┬───────────┘
                 │
                 ▼
         ┌──────────────────┐
         │ Log Audit Trail  │
         │ Update Metrics   │
         └────────┬─────────┘
                  │
                  ▼
            Return Result
```

---

## 🔐 Security & Privacy

### User-Bound Permissions
Every tool operation uses the authenticated user's credentials, never a global admin token.

```typescript
// ✅ CORRECT: User-bound OAuth
const result = await canvas.courses.list(user.oauth_token);

// ❌ WRONG: Global admin key
const result = await canvas.courses.list(process.env.GLOBAL_ADMIN_TOKEN);
```

### Destructive Operations Require Confirmation
```typescript
// State-mutating operations must include explicit human approval
await client.tools.call('canvas_submit_assignment', {
  // ... parameters ...
  confirm_write: true  // Required; triggers UI verification
})
```

### Row-Level Security (RLS)
Database policies ensure students can only access their own data.

```sql
-- Example PostgreSQL RLS policy
CREATE POLICY "Students see only own data"
ON student_records
USING (student_id = auth.uid());
```

### API Key Rotation
- Canvas tokens rotate monthly via Postgres scheduler
- All API keys encrypted in transit (HTTPS) and at rest
- Audit logging for all API access

---

## 📊 Database Schema

### PostgreSQL Tables

```sql
-- Students and profiles
CREATE TABLE students (
  id UUID PRIMARY KEY,
  canvas_id VARCHAR(50),
  name VARCHAR(255),
  learning_profile JSONB,
  accessibility_needs TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Academic progress tracking
CREATE TABLE student_progress (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  assignment_id VARCHAR(50),
  score DECIMAL(5,2),
  completion_date TIMESTAMP,
  time_spent_minutes INTEGER,
  learning_gaps TEXT[]
);

-- Learning standards alignment
CREATE TABLE standards_alignments (
  id UUID PRIMARY KEY,
  content_id VARCHAR(50),
  standard_id VARCHAR(50),
  alignment_strength DECIMAL(3,2),
  subject VARCHAR(100),
  grade_level VARCHAR(10)
);

-- Audit log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  user_id UUID,
  action VARCHAR(255),
  resource VARCHAR(255),
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ☁️ Cloudflare Deployment

### Option 1: Cloudflare Workers (Recommended for Serverless)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Create wrangler.toml
cat > wrangler.toml << 'EOF'
name = "school101-mcp"
type = "javascript"
account_id = "your_account_id"
workers_dev = true
route = "school101.example.com/*"
zone_id = "your_zone_id"

[env.production]
name = "school101-mcp-prod"
routes = [
  { pattern = "api.yourdomain.com/*", zone_id = "your_zone_id" }
]

[[kv_namespaces]]
binding = "CACHE"
id = "your_kv_namespace_id"

[build]
command = "npm run build"
cwd = "./"
main = "dist/index.js"
EOF

# Deploy
npm run deploy:cloudflare
```

### Option 2: Cloudflare Pages with Functions

```bash
# Create functions directory
mkdir -p functions

# Create MCP endpoint function
cat > functions/mcp.js << 'EOF'
export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method === 'POST') {
    const body = await request.json();
    // Handle MCP JSON-RPC request
    const result = await handleMCPRequest(body, env);
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('SCHOOL101 MCP Server', { status: 200 });
}

async function handleMCPRequest(request, env) {
  // Route to appropriate handler
  return { jsonrpc: '2.0', result: null };
}
EOF

# Deploy
wrangler pages deploy
```

### Environment Variables on Cloudflare

```bash
wrangler secret put CANVAS_API_TOKEN
wrangler secret put DATABASE_URL
wrangler secret put REDIS_URL
wrangler secret put MICROSOFT_LEARN_API_KEY
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific integration
npm test -- canvas.test.ts

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Example Test

```typescript
import { initializeSchool101MCP } from '../school101-mcp-server';

describe('Canvas Integration', () => {
  it('should retrieve courses for authenticated user', async () => {
    const mcp = initializeSchool101MCP();
    const result = await mcp.handleRequest('canvas_get_courses', {
      api_token: process.env.TEST_CANVAS_TOKEN,
      canvas_url: process.env.TEST_CANVAS_URL
    });
    
    expect(result.success).toBe(true);
    expect(result.courses).toHaveLength(3);
  });
});
```

---

## 📚 Documentation

### Tool Documentation
Each tool includes:
- **Description**: What the tool does
- **Parameters**: Required and optional inputs (with types)
- **Returns**: Output schema and examples
- **Permissions**: Required user roles
- **Rate Limits**: API quotas
- **Cost**: If applicable

### Resource Documentation
- **Student Profile**: Cached student data structure
- **Classroom Context**: Course metadata, rosters, standards
- **Standards Database**: K-12 learning outcomes knowledge graph

### Prompt Templates
Pre-built prompts for common workflows:
- `create_lesson_plan`: Generate comprehensive lesson
- `analyze_student_progress`: Data-driven student insights
- `identify_learning_gaps`: Cohort gap analysis with interventions

---

## 🎓 Use Cases

### 1. AI School Tutor
```typescript
// Claude acts as personalized tutor
const tutor = new AITutor(school101MCP);

// Student: "Help me understand photosynthesis"
const response = await tutor.chat(studentMessage);
// Tutor searches Khan Academy, generates diagrams,
// creates flashcards, tracks progress
```

### 2. Teacher Administrative Assistant
```typescript
// Teacher: "Grade these 30 essays and identify patterns"
const grader = new TeacherAssistant(school101MCP);

// Analyzes submissions, applies rubric,
// identifies common misconceptions, suggests interventions
```

### 3. Parent Engagement Dashboard
```typescript
// Parent: "How is my child doing in math?"
const parentBot = new ParentAssistant(school101MCP);

// Retrieves Canvas grades, analyzes trends,
// provides specific growth areas and resources
```

### 4. District Data Intelligence
```typescript
// Administrator: "Which schools need reading support?"
const analyst = new DataAnalyst(school101MCP);

// Queries student cohort metrics across district,
// identifies equity gaps, recommends resource allocation
```

---

## 🛣️ Development Roadmap

### Phase 1: Foundation (Current)
- ✅ Canvas LMS core integration (read/write with safeguards)
- ✅ K-12 standards knowledge graph
- ✅ Math problem solver
- ✅ Basic student progress tracking
- ✅ Assessment generator
- Target: August 2024

### Phase 2: Expansion (Q3-Q4 2024)
- 🔄 **Google Classroom Integration**
- 🔄 **Blackboard Integration**
- 🔄 **Moodle LMS Support**
- 🔄 **Gradescope Advanced Features**
- 🔄 **Advanced Accessibility (WCAG AAA)**
- 🔄 **Video Learning Content Search**
- 🔄 **AI-Powered Feedback System**
- Target: December 2024

### Phase 3: Intelligence (2025)
- 🔄 **Predictive Student Risk Alerts**
- 🔄 **Personalized Learning Pathways**
- 🔄 **Cross-Platform Student Profile Sync**
- 🔄 **Multi-Language Support** (20+ languages)
- 🔄 **Advanced Differential Learning**
- 🔄 **Teacher Peer Collaboration Network**
- 🔄 **Real-Time Classroom Analytics**
- Target: Mid-2025

### Phase 4: Ecosystem (2025-2026)
- 🔄 **Parent Communication API**
- 🔄 **Student Mental Health Integration**
- 🔄 **Career Pathway Guidance**
- 🔄 **School Finance Integration**
- 🔄 **Attendance & Behavior Tracking**
- 🔄 **Higher Ed Transfer Pathways**
- 🔄 **Global Standards Library** (50+ countries)
- Target: EOY 2025

### Phase 5: Specialized Domains (2026+)
- 🔄 **Special Education IEP Management**
- 🔄 **English Language Learner (ELL) Support**
- 🔄 **Gifted & Talented Programs**
- 🔄 **Career & Technical Education (CTE)**
- 🔄 **Higher Education Research Integration**
- 🔄 **Nursing & Healthcare Education**
- 🔄 **Corporate Learning Management**

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

### Development Setup
```bash
git clone https://github.com/yourusername/school101-mcp.git
npm install
npm run dev
```

### Code Standards
- TypeScript strict mode
- 80% test coverage minimum
- ESLint + Prettier formatting
- Comprehensive docstrings

---

## 📞 Support & Community

- **Documentation**: https://docs.school101.ai
- **GitHub Issues**: https://github.com/yourusername/school101-mcp/issues
- **Community Discord**: https://discord.gg/school101
- **Email**: support@school101.ai

---

## 📄 License

MIT License - see [LICENSE.md](./LICENSE.md)

---

## 🙏 Acknowledgments

Built on the Model Context Protocol standard by Anthropic, integrating best practices from:
- Canvas LMS ecosystem
- Common Core Standards Initiative
- Modern Learning Conservancy
- Open Education Foundation

---

**Making AI-powered education accessible, safe, and effective for everyone.**

🎓 **SCHOOL101** — Unify. Integrate. Transform.
