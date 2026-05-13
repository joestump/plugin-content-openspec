# plugin-content-openspec

Docusaurus plugin for transforming OpenSpec paired documents into MDX pages.

## Installation

```bash
npm install plugin-content-openspec lib-artifact-transforms
```

## Usage

In `docusaurus.config.ts`:

```typescript
export default {
  plugins: [
    [
      'plugin-content-openspec',
      {
        specsDir: 'docs/openspec/specs',
      },
    ],
  ],
};
```

## Features

- Scans a directory for OpenSpec paired documents (spec.md + design.md)
- Extracts requirements and scenarios from spec.md
- Extracts rationale and decision context from design.md
- Generates a landing page with a specs table (with requirement/scenario counts)
- Generates individual spec pages with inline requirement/scenario breakdown
- Integrates with `lib-artifact-transforms` for relationship graph visualization

## Options

- `specsDir` (string, default: `'docs/openspec/specs'`) — Path to directory containing spec subdirectories

## License

MIT
