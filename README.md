# plugin-content-openspec

Docusaurus plugin for transforming OpenSpec paired documents (spec.md + design.md) into MDX pages. Scans a directory for specification subdirectories, extracts requirements and scenarios, and generates browsable spec documentation with auto-generated landing pages and relationship graphs.

[![Test](https://github.com/joestump/plugin-content-openspec/actions/workflows/test.yml/badge.svg)](https://github.com/joestump/plugin-content-openspec/actions/workflows/test.yml)

## Installation

```bash
npm install plugin-content-openspec lib-artifact-transforms
```

## Quick Start

In `docusaurus.config.ts`:

```typescript
import type { Config } from '@docusaurus/types';

const config: Config = {
  plugins: [
    [
      'plugin-content-openspec',
      {
        specsDir: 'docs/openspec/specs',
      },
    ],
  ],
};

export default config;
```

Then create your first spec in `docs/openspec/specs/SPEC-0001-auth/spec.md`:

```markdown
---
status: proposed
---

# SPEC-0001: Authentication System

## Overview

Define the authentication and authorization system for the application.

### Requirement: Support OAuth 2.0

Users must be able to authenticate using OAuth 2.0 providers (Google, GitHub).

#### Scenario: User logs in with GitHub

Given a user on the login page  
When they click "Login with GitHub"  
Then they are redirected to GitHub's OAuth flow  
And upon completion, they are authenticated in the application

### Requirement: Support session management

The application must maintain secure sessions for authenticated users.
```

And the paired `docs/openspec/specs/SPEC-0001-auth/design.md`:

```markdown
# SPEC-0001: Authentication System — Design

## Architecture

We will use the `passport.js` OAuth strategy for authentication.

## Session storage

Sessions will be stored in Redis with a 24-hour TTL.

## Security considerations

- Tokens will be httpOnly and secure
- CSRF protection via SameSite cookies
```

## Features

- **Automatic scanning**: Discovers OpenSpec spec directories with `spec.md` and paired `design.md`
- **Paired documents**: Reads both specification requirements and design rationale
- **Metadata extraction**: Parses YAML frontmatter for status, date, and dependencies
- **Landing page**: Auto-generates a table of all specs with requirement and scenario counts
- **Individual pages**: Creates MDX pages for each spec with formatted requirements and scenarios
- **Requirement tracking**: Extracts `### Requirement:` headings and associated scenarios
- **Scenario extraction**: Finds `#### Scenario:` subsections (Gherkin-style syntax)
- **Relationship graphs**: Renders dependency graphs using Mermaid (via `lib-artifact-transforms`)
- **Cross-references**: Links to related ADRs and other specs

## Configuration

### Options

```typescript
interface PluginOptions {
  /**
   * Directory containing spec subdirectories (relative to project root)
   * Each subdirectory should contain spec.md and design.md
   * @default 'docs/openspec/specs'
   */
  specsDir?: string;
}
```

### Example configurations

**Single spec directory (default):**
```typescript
['plugin-content-openspec', { specsDir: 'docs/openspec/specs' }]
```

**Custom spec directory:**
```typescript
['plugin-content-openspec', { specsDir: 'architecture/specifications' }]
```

## Spec File Format

OpenSpec uses a **paired document pattern**: each specification has two files in its own subdirectory.

### Directory structure

```
docs/openspec/specs/
├── SPEC-0001-auth/
│   ├── spec.md      # Requirements and scenarios
│   └── design.md    # Design rationale and architecture
├── SPEC-0002-api/
│   ├── spec.md
│   └── design.md
```

### spec.md format (Requirements)

```markdown
---
status: accepted
---

# SPEC-0001: Authentication System

## Overview

Brief description of what this specification covers.

### Requirement: Support OAuth 2.0

Description of the requirement.

#### Scenario: User logs in with GitHub

Gherkin-style scenario description.

### Requirement: Support JWT tokens

Another requirement.
```

### design.md format (Rationale)

```markdown
# SPEC-0001: Authentication System — Design

## Architecture

Explain the architectural approach.

## Implementation notes

Technical details and rationale.

## Alternatives considered

Why we chose this approach over other options.
```

## Frontmatter fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | Lifecycle: `proposed`, `review`, `accepted`, `implemented`, `superseded`, `deprecated`, `rejected` |
| `date` | string | No | ISO 8601 date (YYYY-MM-DD) or RFC 3339 |
| `superseded-by` | string | No | ID of the superseding spec (e.g., `SPEC-0005`) |
| `depends-on` | string[] | No | Array of spec IDs or ADR IDs this depends on |
| `related-to` | string[] | No | Array of related artifact IDs |

## Generated Output

This plugin generates:

1. **Landing page** at `/docs/openspec/specs/` — Table of all specs with requirement counts
2. **Individual spec pages** at `/docs/openspec/specs/spec-0001-auth/`, etc.
3. **Requirement breakdown** — Each requirement extracted and displayed as a subsection
4. **Scenario tables** — Each scenario indexed and cross-referenceable
5. **Design pages** — Design rationale paired with each spec
6. **Relationship graphs** — Mermaid SVG showing dependencies and relationships

## Development

### Running tests

```bash
npm test
```

### Building

```bash
npm run build
```

### Watch mode (during development)

```bash
npm run watch
```

## Testing

This plugin includes comprehensive test coverage:

```bash
npm test -- --coverage
```

Coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Integration with other plugins

This plugin works best alongside:

- [`plugin-content-adrs`](https://github.com/joestump/plugin-content-adrs) — Architecture Decision Records
- [`plugin-content-skills`](https://github.com/joestump/plugin-content-skills) — Claude skills documentation
- [`lib-artifact-transforms`](https://github.com/joestump/lib-artifact-transforms) — Shared artifact processing utilities

## Troubleshooting

**Q: Specs not appearing in the sidebar**  
A: Ensure your spec subdirectories have `spec.md` files. The plugin requires the paired document structure.

**Q: Requirements not being extracted**  
A: Check that your requirements use the `### Requirement:` heading format. The plugin is case-sensitive.

**Q: Design pages not showing**  
A: Verify that each spec subdirectory has a `design.md` file. If missing, only the spec.md content will be shown.

**Q: Relationship graphs not rendering**  
A: Check that frontmatter dependencies reference valid spec or ADR IDs, and that Mermaid support is enabled in Docusaurus.

## License

MIT
