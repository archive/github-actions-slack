# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A GitHub Action that sends messages, reactions, threads, and block-based messages to Slack via the Slack API. Written in JavaScript with one runtime dependency: `@actions/core`.

- **Action entry point:** `dist/index.cjs` (compiled bundle — never edit this directly)
- **Source entry point:** `index.js` → `src/invoke.js`

## Commands

```bash
npm test                   # Run Jest unit tests (src/ only)
npm run test-debug         # Debug Jest with Node inspector
npm run lint               # ESLint with auto-fix
npm run build              # Compile dist/index.cjs via esbuild (required before deploy)
```

Integration test (requires real Slack token):
```bash
# PowerShell
$env:BOT_USER_OAUTH_ACCESS_TOKEN="<token>"; $env:CHANNEL="<channel-id>"; node integration-test/end-to-end.js

# bash/macOS
BOT_USER_OAUTH_ACCESS_TOKEN=<token> CHANNEL=<channel-id> node integration-test/end-to-end.js
```

**After any source change, run `npm run build` to update `dist/index.cjs`.** The action runs from `dist/index.cjs`, not the source files.

## Architecture

`src/invoke.js` reads the `slack-function` input and routes to one of three handlers:

| `slack-function` value   | Handler module        | Slack API          |
| ------------------------ | --------------------- | ------------------ |
| `send-message` (default) | `src/message/`        | `chat.postMessage` |
| `send-reaction`          | `src/reaction/`       | `reactions.add`    |
| `update-message`         | `src/update-message/` | `chat.update`      |

Each handler follows the same pattern:

- `build-*.js` — constructs the payload from action inputs
- `index.js` — reads inputs via `src/context.js`, calls build, posts via `src/integration/slack-api.js`, sets outputs

**Optional parameters** are passed as `slack-optional-<param_name>` inputs and merged directly onto the payload object. This is how the action supports the full Slack API surface without hardcoding every parameter.

**Multi-channel support:** `slack-channel` accepts comma-separated channel IDs. The output `slack-results` contains an array; `slack-result` contains the last result.

**`src/context.js`** is a thin wrapper over `@actions/core` — all input/output goes through it, making it easy to mock in tests.

**`src/util/escaper.js`** handles newline/tab escape restoration since GitHub Actions strips literal newlines from inputs.

## Key constraint

Use channel IDs (e.g. `CPPUV5KU0`), not channel names — required by the current Slack API.
