import fs from 'node:fs';
import path from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';

// Thu thập tiêu đề + nhóm (theo _category_.json) của mọi trang docs lúc build, đưa vào global data
// để bảng tiến độ (src/components/OverallProgress) liệt kê từng bài đã xong / chưa xong.

export type IndexedDoc = {pluginId: string; id: string; title: string; path: string; group: string; order: string};

type DocsContent = {
  loadedVersions: {
    isLast?: boolean;
    docs: {
      id: string;
      title: string;
      permalink: string;
      source: string;
      sourceDirName: string;
      sidebarPosition?: number;
      unlisted?: boolean;
      frontMatter: {sidebar_label?: string};
    }[];
  }[];
};

export default function lessonIndex(context: LoadContext): Plugin {
  const labels = new Map<string, {label: string; position: number}>();
  const category = (dir: string) => {
    if (!labels.has(dir)) {
      let info = {label: path.basename(dir), position: 999};
      try {
        const c = JSON.parse(fs.readFileSync(path.join(dir, '_category_.json'), 'utf8'));
        info = {label: c.label ?? info.label, position: c.position ?? 999};
      } catch {
        // thư mục không có _category_.json
      }
      labels.set(dir, info);
    }
    return labels.get(dir)!;
  };
  const pad = (n: number) => String(n).padStart(4, '0');

  return {
    name: 'lesson-index',
    async allContentLoaded({allContent, actions}) {
      const docsPlugins = (allContent['docusaurus-plugin-content-docs'] ?? {}) as Record<string, DocsContent>;
      const docs: IndexedDoc[] = [];
      for (const [pluginId, content] of Object.entries(docsPlugins)) {
        const version = content.loadedVersions.find((v) => v.isLast) ?? content.loadedVersions[0];
        for (const d of version?.docs ?? []) {
          if (d.unlisted) continue;
          const file = path.normalize(d.source.replace(/^@site/, context.siteDir));
          // Chuỗi thư mục từ gốc plugin tới trang; với plugin mặc định bỏ cấp đầu (ngu-phap, bai-kiem-tra).
          const segs = d.sourceDirName === '.' ? [] : d.sourceDirName.split('/');
          const root = path.dirname(file).split(path.sep).slice(0, -segs.length || undefined).join(path.sep);
          const chain = segs.map((_, i) => category(path.join(root, ...segs.slice(0, i + 1))));
          const shown = pluginId === 'default' ? chain.slice(1) : chain;
          docs.push({
            pluginId,
            id: d.id,
            title: d.frontMatter.sidebar_label ?? d.title,
            path: d.permalink,
            group: shown.map((c) => c.label).join(' › '),
            order: [...chain.map((c) => pad(c.position)), pad(d.sidebarPosition ?? 999), d.id].join('/'),
          });
        }
      }
      docs.sort((a, b) => a.order.localeCompare(b.order));
      actions.setGlobalData({docs});
    },
  };
}
