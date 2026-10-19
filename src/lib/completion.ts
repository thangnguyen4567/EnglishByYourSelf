import {usePluginData} from '@docusaurus/useGlobalData';
import {SKILLS} from '@site/src/data/skills';
import type {Progress} from './progress';
import type {IndexedDoc} from '@site/plugins/lesson-index';

// Đánh dấu hoàn thành từng trang bài học (ngữ pháp, luyện nói, phản xạ, kiểm tra) và tính tổng tiến độ.
// Trang luyện nói dùng chung cờ `skills[noi-xx]` với ô đánh dấu ở đầu trang (SkillMeta);
// các phần còn lại lưu ở `done["<pluginId>:<docId>"]`.

export type Section = 'grammar' | 'speaking' | 'reflex' | 'test';

export const SECTIONS: {key: Section; label: string; icon: string; to: string}[] = [
  {key: 'grammar', label: 'Ngữ pháp', icon: '📘', to: '/docs/ngu-phap'},
  {key: 'speaking', label: 'Luyện nói', icon: '🗣️', to: '/luyen-noi'},
  {key: 'reflex', label: 'Phản xạ', icon: '⚡', to: '/luyen-phan-xa'},
  {key: 'test', label: 'Kiểm tra', icon: '📝', to: '/docs/bai-kiem-tra'},
];

export type Lesson = {pluginId: string; docId: string; path: string; section: Section; title?: string; group?: string};

/** Trang nào là một bài học cần đánh dấu; trang tổng quan / hướng dẫn trả về null. */
export function classify(pluginId: string, docId: string): Section | null {
  if (docId === 'index' || docId.endsWith('/index')) return null;
  if (pluginId === 'default') {
    if (docId.startsWith('ngu-phap/')) return 'grammar';
    if (docId.startsWith('bai-kiem-tra/')) return 'test';
    return null;
  }
  // Bài nói / phản xạ nằm trong thư mục con; dan-y, phuong-phap… ở gốc là trang hướng dẫn.
  if (pluginId === 'speaking' && docId.includes('/')) return 'speaking';
  if (pluginId === 'reflex' && docId.includes('/')) return 'reflex';
  return null;
}

const speakingBySlug = new Map(SKILLS.noi.topics.map((t) => [t.slug, t.id]));
/** Mã chủ đề nói (vd. noi-01) từ đường dẫn trang luyện nói. */
export const speakingId = (path: string) => speakingBySlug.get(path.replace(/\/$/, '').split('/').pop() ?? '');

// Bài phản xạ đánh dấu riêng từng mức (cùng cách chia mức với ReflexDrill): `done["reflex:<docId>#<level>"]`.
// Chủ đề tính là xong khi đủ cả 3 mức. Khóa cũ `done["reflex:<docId>"]` (đánh dấu cả bài) = đủ 3 mức.
export type Level = 'basic' | 'medium' | 'advanced';
export const LEVELS: {key: Level; label: string}[] = [
  {key: 'basic', label: 'Cơ bản'},
  {key: 'medium', label: 'Trung bình'},
  {key: 'advanced', label: 'Nâng cao'},
];

type LessonRef = Omit<Lesson, 'section'>;
const doneKey = (l: LessonRef) => `${l.pluginId}:${l.docId}`;
export const hasLevels = (l: LessonRef) => l.pluginId === 'reflex';

export function isLevelDone(p: Progress, l: LessonRef, level: Level): boolean {
  return !!p.done?.[doneKey(l)] || !!p.done?.[`${doneKey(l)}#${level}`];
}

export function setLevelDone(p: Progress, l: LessonRef, level: Level, value: boolean): Progress {
  const k = doneKey(l);
  const done = {...p.done};
  if (done[k]) {
    delete done[k];
    for (const lv of LEVELS) done[`${k}#${lv.key}`] = true;
  }
  if (value) done[`${k}#${level}`] = true;
  else delete done[`${k}#${level}`];
  return {...p, done};
}

export function isDone(p: Progress, l: LessonRef): boolean {
  if (l.pluginId === 'speaking') {
    const id = speakingId(l.path);
    if (id) return !!p.skills?.[id];
  }
  if (hasLevels(l)) return LEVELS.every((lv) => isLevelDone(p, l, lv.key));
  return !!p.done?.[doneKey(l)];
}

export function setDone(p: Progress, l: LessonRef, value: boolean): Progress {
  if (l.pluginId === 'speaking') {
    const id = speakingId(l.path);
    if (id) return {...p, skills: {...p.skills, [id]: value}};
  }
  if (hasLevels(l)) return LEVELS.reduce((acc, lv) => setLevelDone(acc, l, lv.key, value), p);
  const done = {...p.done};
  if (value) done[doneKey(l)] = true;
  else delete done[doneKey(l)];
  return {...p, done};
}

/** Toàn bộ bài học trên site theo thứ tự thanh bên (plugins/lesson-index.ts – tự cập nhật khi thêm trang mới). */
export function useLessons(): Lesson[] {
  const {docs} = usePluginData('lesson-index') as {docs: IndexedDoc[]};
  const out: Lesson[] = [];
  for (const d of docs) {
    const section = classify(d.pluginId, d.id);
    if (section) out.push({pluginId: d.pluginId, docId: d.id, path: d.path, section, title: d.title, group: d.group});
  }
  return out;
}

export type Stat = {done: number; total: number};

export function summarize(p: Progress, lessons: Lesson[]): {sections: Record<Section, Stat>; overall: Stat} {
  const sections = Object.fromEntries(SECTIONS.map((s) => [s.key, {done: 0, total: 0}])) as Record<Section, Stat>;
  for (const l of lessons) {
    sections[l.section].total++;
    if (isDone(p, l)) sections[l.section].done++;
  }
  const overall = Object.values(sections).reduce((a, s) => ({done: a.done + s.done, total: a.total + s.total}), {done: 0, total: 0});
  return {sections, overall};
}

export const percent = ({done, total}: Stat) => (total ? Math.round((done / total) * 100) : 0);
