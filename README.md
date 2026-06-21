# SCHOOLME101 MCP Server v1

Production-ready TypeScript MCP server foundation for Cloudflare Workers, focused on Africa and South Africa education, with Android-ready contracts.

## Highlights
- Cloudflare Worker MCP transport (`POST /mcp`)
- 25 validated education tools for Grade R-12 and tertiary contexts
- South Africa CAPS-first curriculum metadata with Africa extension placeholders
- Security-by-default hooks: token verification, role checks, approval gate, audit logging
- Android integration contracts and offline sync hook conventions

## Architecture
- `src/server` - MCP transport, JSON-RPC handling, route registration
- `src/tools` - tool catalog, validation schemas, execution mapping
- `src/domain` - curriculum, assessment, progress, language, STEM, teacher, accessibility logic
- `src/security` - auth, policy, approval, audit hooks
- `src/integrations` - Canvas/Google Classroom placeholders
- `src/android` - endpoint conventions and JSON contract examples

## Tool Catalog
1. list_curriculum_frameworks
2. get_subjects_by_grade
3. get_learning_objectives
4. create_study_plan
5. spaced_repetition_schedule
6. generate_revision_pack
7. solve_math_stepwise
8. generate_math_practice
9. explain_science_concept
10. generate_science_quiz
11. language_reading_passage
12. language_comprehension_questions
13. grammar_practice_generator
14. generate_exam_paper
15. generate_assignment
16. rubric_generator
17. mark_scheme_generator
18. record_student_progress
19. identify_learning_gaps
20. recommend_interventions
21. class_progress_summary
22. lesson_plan_generator
23. classroom_activity_generator
24. simplify_text_for_level
25. dyslexia_friendly_format

All tools are strongly validated using Zod and include locale/country/grade/phase language context support.

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
- **Token verification hook**: `src/security/auth.ts` (JWT required outside explicit `development`/`dev`/`local`/`test` environments)
- **Role-aware authorization**: `student`, `teacher`, `lecturer`, `admin`
- **Approval gate**: hook available for future destructive tools
- **Audit trail stub**: tool usage event logging in `src/security/audit.ts`
- **Persistence transparency**: `record_student_progress` reports whether a D1 write was actually persisted
- **Rate limit strategy**: configured via `RATE_LIMIT_*` vars, enforce using Cloudflare edge controls/WAF

## Android Integration Notes
- Endpoints: `/mcp`, `/health`, `/android/contracts`
- Contract helpers: `src/android/contracts.ts`
- Token handling: send a bearer token in the `Authorization` header
- Offline sync hook: operation IDs + retry/backoff + idempotency key

## Scripts
- `npm run dev` - local worker via Wrangler
- `npm run build` - compile TypeScript
- `npm run typecheck` - strict static checks
- `npm run lint` - alias for typecheck
- `npm test` - unit tests
- `npm run deploy` - Cloudflare production deploy
