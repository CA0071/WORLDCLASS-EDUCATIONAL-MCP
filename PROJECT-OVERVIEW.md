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
