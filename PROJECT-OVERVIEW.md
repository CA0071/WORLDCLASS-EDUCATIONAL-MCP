# PROJECT OVERVIEW

## Directory map
- `src/index.ts` - Worker entrypoint
- `src/server/` - MCP JSON-RPC routing and tool dispatch
- `src/tools/` - Tool registry and validation
- `src/domain/` - Education domain logic modules
- `src/security/` - Auth, access policy, approval gate, audit hooks
- `src/integrations/` - Canvas/Google Classroom placeholders
- `src/android/` - Android contract helpers and examples
- `src/tests/` - Unit tests for validation and tool registration

## Responsibilities
- **Server layer**: protocol handling, endpoint exposure, error mapping
- **Tool layer**: schema validation + orchestration
- **Domain layer**: reusable pedagogical logic
- **Security layer**: centralized trust boundaries
- **Integration layer**: forward-compatible adapters (TODO)
- **Android layer**: stable payload contracts for app consumption

## SCHOOLME101 positioning in v1
This foundation prioritizes practical tools for learners and educators in African contexts, starts with CAPS-oriented metadata for South Africa, and keeps integration/security hooks ready for production hardening.

## Current educational capability surface
- **27 MCP tools** across curriculum, study, STEM, language, assessment, progress, teacher, and accessibility domains
- **Teacher-facing progress workflows** include `record_student_progress`, `get_student_progress_history`, `class_progress_summary`, `recommend_interventions`, and `teacher_dashboard`
- **Storage-aware behavior** keeps progress history and dashboard tools safe in local/dev deployments by returning informative fallback notes when D1 is not configured
- **Future-facing integrations** remain scaffolded in `src/integrations/` so Worker routing, security boundaries, and Android contracts stay stable while LMS/auth/persistence hardening evolves
