# QUICKSTART (5 minutes)

## 1) Install
```bash
npm install
```

## 2) Configure env
```bash
cp .env.example .env.local
```
Set at minimum:
- `AUTH_BYPASS_TOKEN`
- `APPROVAL_BYPASS_CODE`

## 3) Run locally
```bash
npm run dev
```
Worker starts on `http://localhost:8787`.

## 4) Verify endpoints
- `GET /health`
- `GET /android/contracts`
- `POST /mcp`

## 5) Sample MCP call
```bash
curl -X POST http://localhost:8787/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_curriculum_frameworks","arguments":{"country":"ZA","locale":"en-ZA"}}}'
```
Pass your bearer token in an `Authorization` header when calling protected tools.

## Cloudflare deploy
```bash
npm run deploy
```
