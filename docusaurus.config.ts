import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Ngữ pháp tiếng Anh',
  tagline: '29 chủ đề trọng tâm · 5 bài kiểm tra tự chấm điểm',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages (user site): https://<username>.github.io/ – workflow đặt SITE_URL tự động khi build.
  url: process.env.SITE_URL ?? 'https://example.github.io',
  baseUrl: process.env.BASE_URL ?? '/',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
  },

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap',
  ],

  markdown: {
    mermaid: true,
    mdx1Compat: { headingIds: true },
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: ['/docs', '/luyen-noi', '/luyen-phan-xa'],
        docsDir: ['docs', 'speaking', 'reflex'],
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: false,
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      { id: 'speaking', path: 'speaking', routeBasePath: 'luyen-noi', sidebarPath: './sidebarsSkill.ts' },
    ],
    [
      '@docusaurus/plugin-content-docs',
      { id: 'reflex', path: 'reflex', routeBasePath: 'luyen-phan-xa', sidebarPath: './sidebarsSkill.ts' },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    navbar: {
      title: 'Tiếng Anh',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/docs/lo-trinh-2-thang', label: '📅 Lộ trình', position: 'left' },
        { to: '/docs/ngu-phap', label: 'Ngữ pháp', position: 'left', activeBasePath: 'docs/ngu-phap' },
        { to: '/docs/bai-kiem-tra', label: 'Kiểm tra', position: 'left', activeBasePath: 'docs/bai-kiem-tra' },
        { to: '/docs/tra-cuu/bang-tra-cuu', label: 'Tra cứu', position: 'left', activeBasePath: 'docs/tra-cuu' },
        { to: '/docs/tra-cuu/tu-vung-dang-hoc', label: '📒 Từ vựng', position: 'left' },
        { to: '/luyen-noi', label: '🗣️ Luyện nói', position: 'left', activeBasePath: 'luyen-noi' },
        { to: '/luyen-phan-xa', label: '⚡ Phản xạ', position: 'left', activeBasePath: 'luyen-phan-xa' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Bắt đầu',
          items: [
      { label: 'Giới thiệu', to: '/docs' },
      { label: 'Phương pháp học', to: '/docs/phuong-phap-hoc' },
      { label: 'Lộ trình 2 tháng', to: '/docs/lo-trinh-2-thang' },
      { label: 'Từ vựng đang học', to: '/docs/tra-cuu/tu-vung-dang-hoc' },
          ],
  },
        {
  title: 'Ngữ pháp',
    items: [
      { label: 'Bản đồ 29 chủ đề', to: '/docs/ngu-phap' },
      { label: 'Tổng hợp 12 thì', to: '/docs/ngu-phap/tong-hop-12-thi' },
      { label: 'Bảng tra cứu nhanh', to: '/docs/tra-cuu/bang-tra-cuu' },
    ],
        },
{
  title: 'Kỹ năng',
    items: [
      { label: 'Luyện nói', to: '/luyen-noi' },
      { label: 'Luyện phản xạ', to: '/luyen-phan-xa' },
    ],
        },
{
  title: 'Luyện tập',
    items: [
      { label: 'Bài kiểm tra', to: '/docs/bai-kiem-tra' },
      { label: 'Sổ tay lỗi thường gặp', to: '/docs/tra-cuu/loi-thuong-gap' },
    ],
        },
      ],
copyright: `Ngữ pháp tiếng Anh · ${new Date().getFullYear()}`,
    },
prism: {
  theme: prismThemes.github,
    darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
