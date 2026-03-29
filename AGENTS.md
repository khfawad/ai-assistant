# AGENTS.md

This file provides guidance for AI coding agents working in this repository.

## Project Overview

Node.js ES Modules project — an AI personal assistant that uses LLM agents, tools,
and memory to optimize daily decision-making and task execution. Entry point is
`src/index.js`.

## Quick Start

```bash
nvm use                    # Activate Node.js 20
cp env.example .env        # Copy env template and add your API keys
npm install                # Install dependencies
npm start                  # Run the assistant
```

## Commands

| Command                  | Description                          |
| ------------------------ | ------------------------------------ |
| `npm start`              | Run the application                  |
| `npm run lint`           | Check for linting errors in `src/`   |
| `npm run lint:fix`       | Auto-fix linting errors in `src/`    |
| `npm run format`         | Format all JS files in `src/`        |
| `npm run format:check`   | Check formatting without writing     |

Run all commands from the project root. No test framework is installed.

## Code Style

### Language & Modules
- JavaScript only (.js files), no TypeScript.
- ES Modules (`import`/`export`), not CommonJS. `"type": "module"` in package.json.
- Always include `.js` extension in import paths: `import { foo } from "./bar.js"`.

### Naming
- `camelCase` for variables, functions, and file names.
- `PascalCase` only for classes or constructor functions.
- Directory names are lowercase single words: `agent/`, `services/`, `tools/`.
- Use verb-noun for exported functions: `runPlanner`, `fetchData`, `buildPrompt`.

### Formatting
- 2-space indentation (no tabs).
- Single quotes for strings.
- Trailing semicolons.
- Blank line between imports and code body.
- Prettier enforces formatting — always run `npm run format` before committing.

### Code Example
```javascript
import { client } from '../services/openai.js';

export async function runPlanner(input) {
  const res = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      { role: 'system', content: 'You are a productivity assistant.' },
      { role: 'user', content: input },
    ],
  });

  return res.choices[0].message.content;
}
```

### Imports
- Group imports in this order, separated by blank lines:
  1. Node built-ins
  2. Third-party packages
  3. Local modules (relative paths)
- Use named exports over default exports.
- Keep files small and focused (single responsibility).

### Error Handling
- Use `try/catch` around async operations, especially API calls.
- Log errors with `console.error()` before re-throwing or returning.
- Prefer descriptive error messages over generic ones.

## Architecture

```
src/
├── index.js          # Entry point — wires agents together
├── services/         # External API client wrappers
│   └── openai.js     # OpenAI client initialization
├── agent/            # LLM orchestration logic
│   └── planner.js    # Planning agent that uses services
├── tools/            # Tool integrations the agent can invoke
└── memory/           # Persistence and memory layer
```

- Services initialize clients at module level and export them.
- Agents import services and orchestrate LLM calls.
- Tools are pure functions that agents can invoke.
- Inject dependencies via imports, not constructor parameters.

## Environment

- Node.js 20 (see `.nvmrc`). Run `nvm use` to activate.
- Environment variables loaded from `.env` via `dotenv`. Never commit `.env`.
- Use `process.env.VARIABLE_NAME` to access env vars.

## Linting & Formatting

- ESLint v10 flat config (`eslint.config.mjs`) — run `npm run lint` to check.
- Prettier for formatting — run `npm run format` to auto-fix.
- ESLint config extends `@eslint/js` recommended rules and `eslint-config-prettier`.
- Run `npm run lint:fix` and `npm run format` before committing changes.

## Dependencies

- Only two runtime dependencies: `openai` (API client) and `dotenv` (env loading).
- Do not add dependencies without checking if the functionality can be achieved
  with Node.js built-ins or existing packages.
- When adding a dependency, prefer well-maintained, popular packages.

## Common Tasks

### Adding a new agent
1. Create a new file in `src/agent/` with a descriptive name.
2. Export a single async function that takes input and returns output.
3. Import services from `../services/` as needed.
4. Wire it up in `src/index.js` or the calling agent.

### Adding a new tool
1. Create a new file in `src/tools/`.
2. Export a function that the agent can invoke.
3. Keep the function pure — accept inputs, return results, handle errors.

### Adding a new service
1. Create a new file in `src/services/`.
2. Initialize the client at module level.
3. Export the client or wrapper functions as named exports.
4. Load config from environment variables, not hardcoded values.

## File Conventions

- One primary export per file.
- Files should be under 100 lines — split if larger.
- Use descriptive file names that match the export: `planner.js` exports `runPlanner`.
- No index.js barrel files — import directly from the module.

## Security

- Never log or print API keys, tokens, or secrets.
- Validate all external input before passing to LLM prompts.
- Never execute untrusted code or shell commands from LLM output.
- Review tool outputs before acting on them.

## What to Avoid

- Do not use `require()` or `module.exports` — ESM only.
- Do not commit `.env` files or API keys.
- Do not add TypeScript, JSX, or transpilation — plain JavaScript.
- Do not use `console.log` for debugging in committed code.
- Do not create deeply nested directory structures.
- Do not install testing frameworks without discussion.
- Do not add build steps or bundlers — the project runs directly on Node.js.
