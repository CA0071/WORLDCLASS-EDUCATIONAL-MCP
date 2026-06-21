# SCHOOLME101 MCP Server v1

Production-ready TypeScript MCP server foundation for Cloudflare Workers, focused on Africa and South Africa education, with Android-ready contracts.

## Highlights
- Cloudflare Worker MCP transport (`POST /mcp`)
- 27 validated education tools across curriculum, study, STEM, language, assessment, progress, teacher, and accessibility workflows
- South Africa CAPS-first curriculum metadata with Africa extension placeholders
- Security-by-default hooks: token verification, role checks, approval gate, audit logging
- Optional D1-backed teacher progress history and dashboard flows, with Android integration contracts and offline sync hook conventions

## Architecture
- `src/server` - MCP transport, JSON-RPC handling, route registration
- `src/tools` - tool catalog, validation schemas, execution mapping
- `src/domain` - curriculum, assessment, progress, language, STEM, teacher, accessibility logic
- `src/security` - auth, policy, approval, audit hooks
- `src/integrations` - Canvas/Google Classroom placeholders
- `src/android` - endpoint conventions and JSON contract examples

## Tool Catalog
### Curriculum
1. list_curriculum_frameworks
2. get_subjects_by_grade
3. get_learning_objectives

### Study and Revision
4. create_study_plan
5. spaced_repetition_schedule
6. generate_revision_pack

### STEM
7. solve_math_stepwise
8. generate_math_practice
9. explain_science_concept
10. generate_science_quiz

### Language
11. language_reading_passage
12. language_comprehension_questions
13. grammar_practice_generator

### Assessment
14. generate_exam_paper
15. generate_assignment
16. rubric_generator
17. mark_scheme_generator

### Progress and Analytics
18. record_student_progress
19. identify_learning_gaps
20. recommend_interventions
21. class_progress_summary
22. get_student_progress_history
23. teacher_dashboard

### Teacher Workflow
24. lesson_plan_generator
25. classroom_activity_generator

### Accessibility
26. simplify_text_for_level
27. dyslexia_friendly_format

All tools are strongly validated using Zod and include locale/country/grade/phase/language context support. Progress history and dashboard tools degrade safely when D1 is not configured.

## MCP Examples
### Initialize
```json
{"jsonrpc":"2.0","id":1,"method":"initialize"}
```

### List tools
```json
{"jsonrpc":"2.0","id":2,"method":"tools/list"}
```

### Call tool
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "create_study_plan",
    "arguments": {
      "topic": "Linear Equations",
      "weeks": 4,
      "locale": "en-ZA",
      "country": "ZA",
      "grade": "8",
      "phase": "senior",
      "language": "English"
    }
  }
}
```

## Security Model
- **Token verification hook**: `src/security/auth.ts` (stub; replace with JWT/OIDC)
- **Role-aware authorization**: `student`, `teacher`, `lecturer`, `admin`
- **Approval gate**: destructive tool `record_student_progress` requires approval code
- **Audit trail stub**: tool usage event logging in `src/security/audit.ts`
- **Rate limit strategy**: configured via `RATE_LIMIT_*` vars, enforce using Cloudflare edge controls/WAF

## Android Integration Notes
- Endpoints: `/mcp`, `/health`, `/android/contracts`
- Contract helpers: `src/android/contracts.ts`
- Token handling: send a bearer token in the `Authorization` header
- Offline sync hook: operation IDs + retry/backoff + idempotency key
- D1-backed progress workflows are optional in local/dev mode and return safe stub notes when storage is not configured

## Scripts
- `npm run dev` - local worker via Wrangler
- `npm run build` - compile TypeScript
- `npm run typecheck` - strict static checks
- `npm run lint` - alias for typecheck
- `npm test` - unit tests
- `npm run deploy` - Cloudflare production deploy
