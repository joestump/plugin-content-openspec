import type { LoadContext, Plugin } from '@docusaurus/types';
import glob from 'fast-glob';
import { readFileSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import { parseFrontmatter, extractStatus, extractField } from 'lib-artifact-transforms';

export interface PluginOptions {
  specsDir?: string;
}

export interface PluginConfig extends PluginOptions {}

const defaultConfig: PluginConfig = {
  specsDir: 'docs/openspec/specs',
};

export interface SpecArtifact {
  id: string;
  title: string;
  status?: string;
  date?: string;
  supersededBy?: string;
  dependsOn?: string[];
  relatedTo?: string[];
  overview?: string;
  requirementCount: number;
  scenarioCount: number;
  hasDesign: boolean;
}

export default function pluginContentOpenspec(
  context: LoadContext,
  options: PluginConfig,
): Plugin<{ specs: SpecArtifact[] }> {
  const config = { ...defaultConfig, ...options };
  const specsDir = join(context.siteDir, config.specsDir!);

  return {
    name: 'docusaurus-plugin-content-openspec',
    async loadContent() {
      try {
        const specs: SpecArtifact[] = [];
        const pattern = join(specsDir, '*/spec.md');
        const files = await glob(pattern);

        for (const file of files.sort()) {
          const content = readFileSync(file, 'utf-8');
          const { metadata, content: body } = parseFrontmatter(content);

          const specDir = dirname(file);
          const specDirName = basename(specDir);
          const id = specDirName.split('-').slice(0, 2).join('-').toUpperCase();

          const titleMatch = body.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1].trim() : id;

          // Count requirements and scenarios
          const requirements = (body.match(/^###\s+Requirement:/gm) || []).length;
          const scenarios = (body.match(/^####\s+Scenario:/gm) || []).length;

          // Extract overview
          const overviewMatch = body.match(
            /##\s+Overview[\s\S]*?(?=##|$)/i,
          );
          const overview = overviewMatch
            ? overviewMatch[0].substring(0, 200)
            : '';

          // Check if design.md exists
          const designPath = join(specDir, 'design.md');
          const hasDesign = existsSync(designPath);

          specs.push({
            id,
            title,
            status: extractStatus(metadata),
            date: extractField<string>(metadata, 'date'),
            supersededBy: extractField<string>(metadata, 'superseded-by'),
            dependsOn: extractField<string[]>(metadata, 'depends-on'),
            relatedTo: extractField<string[]>(metadata, 'related-to'),
            overview,
            requirementCount: requirements,
            scenarioCount: scenarios,
            hasDesign,
          });
        }

        return { specs };
      } catch (error) {
        console.warn(`Error loading specs from ${specsDir}:`, error);
        return { specs: [] };
      }
    },
    async contentLoaded({ content, actions }) {
      // Create routes for each spec
      if (content.specs.length === 0) {
        return;
      }

      for (const spec of content.specs) {
        // This would be expanded to actually create MDX pages
        // For now, the plugin loads and parses the content
      }
    },
  };
}
