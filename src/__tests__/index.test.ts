import pluginContentOpenspec from '../index';

describe('plugin-content-openspec', () => {
  describe('module export', () => {
    it('should export a default function', () => {
      expect(typeof pluginContentOpenspec).toBe('function');
    });

    it('should return a plugin object with required methods', () => {
      const mockContext = {
        siteDir: '/tmp/site',
        generatedFilesDir: '/tmp/generated',
        outDir: '/tmp/out',
        baseUrl: '/',
        i18n: { currentLocale: 'en' },
      } as any;

      const plugin = pluginContentOpenspec(mockContext, { specsDir: 'docs/openspec/specs' });

      expect(plugin.name).toBe('docusaurus-plugin-content-openspec');
      expect(typeof plugin.loadContent).toBe('function');
      expect(typeof plugin.contentLoaded).toBe('function');
    });
  });

  describe('options merging', () => {
    it('should use default specsDir when not provided', () => {
      const mockContext = {
        siteDir: '/tmp/site',
        generatedFilesDir: '/tmp/generated',
        outDir: '/tmp/out',
        baseUrl: '/',
        i18n: { currentLocale: 'en' },
      } as any;

      const plugin = pluginContentOpenspec(mockContext, {});

      expect(plugin.name).toBe('docusaurus-plugin-content-openspec');
    });

    it('should use custom specsDir when provided', () => {
      const mockContext = {
        siteDir: '/tmp/site',
        generatedFilesDir: '/tmp/generated',
        outDir: '/tmp/out',
        baseUrl: '/',
        i18n: { currentLocale: 'en' },
      } as any;

      const plugin = pluginContentOpenspec(mockContext, { specsDir: 'custom/specs' });

      expect(plugin.name).toBe('docusaurus-plugin-content-openspec');
    });
  });

  describe('loadContent', () => {
    it('should return empty specs array when directory does not exist', async () => {
      const mockContext = {
        siteDir: '/nonexistent',
        generatedFilesDir: '/tmp/generated',
        outDir: '/tmp/out',
        baseUrl: '/',
        i18n: { currentLocale: 'en' },
      } as any;

      const plugin = pluginContentOpenspec(mockContext, { specsDir: 'docs/openspec/specs' });
      const content = await plugin.loadContent!();

      expect(content).toEqual({ specs: [] });
    });

    it('should return object with specs array', async () => {
      const mockContext = {
        siteDir: '/tmp/site',
        generatedFilesDir: '/tmp/generated',
        outDir: '/tmp/out',
        baseUrl: '/',
        i18n: { currentLocale: 'en' },
      } as any;

      const plugin = pluginContentOpenspec(mockContext, {});
      const content = await plugin.loadContent!();

      expect(Array.isArray(content.specs)).toBe(true);
      expect(content.specs.length).toBeGreaterThanOrEqual(0);
    });
  });
});
