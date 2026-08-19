# Duo API Signing

This document explains how Duo's HMAC request signing works in this SDK, why v5 is used unconditionally, and the rules that must be followed when adding or modifying API calls. These constraints have caused real 401 incidents; understanding them prevents repeating those mistakes.

---

## Background: v2 vs v5 signing

Duo supports two signing schemes. This SDK uses **v5 exclusively**. Do not reintroduce v2.

| | v2 | v5 |
|---|---|---|
| Canonical string lines | 5 | 7 |
| Body coverage | No | Yes (SHA-512 hash of body) |
| Header coverage | No | Yes (SHA-512 hash of `''`) |
| HMAC algorithm | SHA-512\* | SHA-512 |
| Required for new endpoints | No | Yes |

\* Duo's official docs describe v2 as SHA-1, but the Duo Node.js reference SDK uses SHA-512 for both; this implementation follows the reference SDK.

Duo is progressively requiring v5 on new endpoints and has deprecated v2 on some existing ones. An integration key configured for v5 will receive 401s on any request signed with v2.

---

## The canonical string

Both versions build a canonical string and sign it with `HMAC-SHA-512`. The key difference is that v5 commits to both the request body and an extra header hash, so the signature covers the full payload.

**v2 (5 lines):**
```
<date>
<METHOD>
<host>
<path>
<url-encoded params>
```

**v5 (7 lines):**
```
<date>
<METHOD>
<host>
<path>
<url-encoded params>          ← must be empty for POST/PUT/PATCH (see below)
<SHA-512 of request body>
<SHA-512 of ''>               ← reserved header hash, always hash of empty string
```

The params line (line 5) is built from the URL query string. For GET and DELETE, parameters go in the URL query string and this line is populated. For POST, PUT, and PATCH, this line **must be empty** — parameters go in the JSON body instead.

---

## The critical rule: POST/PUT/PATCH parameters belong in the JSON body

The most common source of 401s in this codebase is sending POST parameters as URL query string arguments instead of in the JSON body.

**Wrong — causes 401:**
```typescript
// Parameters passed via `params` end up in the URL query string.
// The signature covers an empty body but the server sees parameters in the URL.
await this.httpAgent.post('/admin/v1/users', {}, { params: { username } })
```

**Correct:**
```typescript
// Parameters in the JSON body; the signature covers the serialized body.
await this.httpAgent.post('/admin/v1/users', { username })
```

**Why this causes a 401:** The interceptor in `create-http-agent.ts` computes the v5 signature before the request is sent. For a POST, it hashes the body and puts an empty string in line 5 (the params line). When parameters are in `params` instead of the body, the server reconstructs a different canonical string — it sees the parameters in the URL and an empty body — so the signatures don't match.

The correct patterns by method:

| Method | Parameters go in | Axios call shape |
|--------|-----------------|-----------------|
| GET | URL query string (`params`) | `get(url, { params })` |
| DELETE | URL query string (`params`) | `delete(url, { params })` |
| POST | JSON body (second argument) | `post(url, body)` |
| PUT | JSON body (second argument) | `put(url, body)` |
| PATCH | JSON body (second argument) | `patch(url, body)` |

---

## How the interceptor works

`src/lib/utils/create-http-agent.ts` attaches a request interceptor to every Axios instance returned by `createHttpAgent`. Before each request is sent, the interceptor:

1. Reads `req.method`, `req.url`, and `req.params` (URL query parameters).
2. Serializes `req.data` (the request body) to a string. If the body is an object, it is `JSON.stringify`'d; if absent or `null`, an empty string is used.
3. Calls `signV5` with the method, host, path, URL params, current date, and serialized body.
4. Sets `Authorization` and `Date` headers on the request.

The `sign` (v2) function still exists in `hmac.ts` but is not called anywhere. It is retained only as a reference. Do not use it.

---

## Debugging 401s

When a Duo API call returns 401, check in this order:

1. **Is the `Date` header skewed?** Duo rejects requests where the `Date` header is more than 5 minutes from the server's clock.

2. **Are POST/PUT/PATCH parameters in the body, not the URL?** Look at the Axios call. If it uses `post(url, {}, { params: {...} })` or `post(url, null, { params: {...} })`, that is the bug. Move the parameters to the body: `post(url, {...})`.

3. **Is `req.data` accidentally `null` or `undefined`?** The interceptor treats `null` as an empty body (hashes `''`). If the server expects a non-empty body, the signature will not match. Always pass an explicit object: `post(url, {})` for a no-parameter POST.

4. **Is the integration key configured for the right API?** The Accounts API (`/accounts/v1/...`) was deprecated in June 2026. Existing integrations were migrated to Admin API credentials. An Accounts API path called with Admin API credentials (or vice versa) will 401.
