import type { LoadContext, Plugin } from '@docusaurus/types';

export interface PluginOptions {
  specsDir?: string;
}

export interface PluginConfig extends PluginOptions {}

const defaultConfig: PluginConfig = {
  specsDir: 'docs/openspec/specs',
};

export default function pluginContentOpenspec(
  context: LoadContext,
  options: PluginConfig,
): Plugin<void> {
  const config = { ...defaultConfig, ...options };

  return {
    name: 'docusaurus-plugin-content-openspec',
    async loadContent() {
      // TODO: Scan specsDir for spec.md files (paired with design.md)
      // Extract requirements, scenarios, status
      return { specs: [] };
    },
    async contentLoaded({ content, actions }) {
      // TODO: Generate MDX pages for each spec
      // Create landing page with specs table
      // Create individual spec pages with requirements/scenarios breakdown
    },
  };
}
