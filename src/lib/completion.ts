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

// Bài có nhiều mức hoàn thành: đánh dấu riêng từng mức ở `done["<pluginId>:<docId>#<level>"]`.
// Chủ đề tính là xong khi đủ mọi mức. Khóa cũ `done["<pluginId>:<docId>"]` (đánh dấu cả bài) = đủ mọi mức.
//  - Phản xạ: 3 mức như ReflexDrill (Cơ bản / Trung bình / Nâng cao); chỉ tính vào tổng tiến độ khi đủ 3 mức.
//  - Ngữ pháp: 3 mức theo bài kiểm tra cấp độ (Dễ / Trung bình / Khó); mỗi mức đóng góp một phần
//    khác nhau vào tổng tiến độ (weight, cộng lại = 1).
export type LevelDef = {key: string; label: string; icon: string; weight: number; hint: string};
type LevelSet = {levels: LevelDef[]; partial: boolean};

const REFLEX: LevelSet = {
  partial: false,
  levels: [
    {key: 'basic', label: 'Cơ bản', icon: '🔵', weight: 1 / 3, hint: 'Câu 1–10'},
    {key: 'medium', label: 'Trung bình', icon: '🟡', weight: 1 / 3, hint: 'Câu 11–20'},
    {key: 'advanced', label: 'Nâng cao', icon: '🔴', weight: 1 / 3, hint: 'Câu 21–30'},
  ],
};

const GRAMMAR: LevelSet = {
  partial: true,
  levels: [
    {key: 'easy', label: 'Dễ', icon: '🟢', weight: 0.2, hint: 'Hiểu công thức, đạt ≥ 80% bài kiểm tra cấp Dễ'},
    {key: 'normal', label: 'Trung bình', icon: '🟡', weight: 0.3, hint: 'Phân biệt dạng dễ nhầm, đạt ≥ 80% cấp Trung bình'},
    {key: 'hard', label: 'Khó', icon: '🔴', weight: 0.5, hint: 'Ngoại lệ, tìm lỗi sai, đạt ≥ 80% cấp Khó'},
  ],
};

type LessonRef = Omit<Lesson, 'section'>;
const doneKey = (l: LessonRef) => `${l.pluginId}:${l.docId}`;

/** Các mức hoàn thành của bài (null = bài chỉ có một nút đánh dấu). */
export function levelSet(l: LessonRef): LevelSet | null {
  if (l.pluginId === 'reflex') return REFLEX;
  if (classify(l.pluginId, l.docId) === 'grammar') return GRAMMAR;
  return null;
}
export const hasLevels = (l: LessonRef) => !!levelSet(l);

export function isLevelDone(p: Progress, l: LessonRef, level: string): boolean {
  return !!p.done?.[doneKey(l)] || !!p.done?.[`${doneKey(l)}#${level}`];
}

export function setLevelDone(p: Progress, l: LessonRef, level: string, value: boolean): Progress {
  const k = doneKey(l);
  const done = {...p.done};
  if (done[k]) {
    delete done[k];
    for (const lv of levelSet(l)?.levels ?? []) done[`${k}#${lv.key}`] = true;
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
  const set = levelSet(l);
  if (set) return set.levels.every((lv) => isLevelDone(p, l, lv.key));
  return !!p.done?.[doneKey(l)];
}

/** Phần đóng góp của bài vào tổng tiến độ (0–1): tổng trọng số các mức đã xong, hoặc 0/1. */
export function credit(p: Progress, l: LessonRef): number {
  const set = levelSet(l);
  if (set?.partial) return set.levels.reduce((s, lv) => s + (isLevelDone(p, l, lv.key) ? lv.weight : 0), 0);
  return isDone(p, l) ? 1 : 0;
}

export function setDone(p: Progress, l: LessonRef, value: boolean): Progress {
  if (l.pluginId === 'speaking') {
    const id = speakingId(l.path);
    if (id) return {...p, skills: {...p.skills, [id]: value}};
  }
  const set = levelSet(l);
  if (set) return set.levels.reduce((acc, lv) => setLevelDone(acc, l, lv.key, value), p);
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

/** done = số bài xong hẳn; credit = tổng phần đóng góp (tính cả mức đã xong của bài chưa xong hẳn). */
export type Stat = {done: number; credit: number; total: number};

export function summarize(p: Progress, lessons: Lesson[]): {sections: Record<Section, Stat>; overall: Stat} {
  const empty = (): Stat => ({done: 0, credit: 0, total: 0});
  const sections = Object.fromEntries(SECTIONS.map((s) => [s.key, empty()])) as Record<Section, Stat>;
  for (const l of lessons) {
    const st = sections[l.section];
    st.total++;
    st.credit += credit(p, l);
    if (isDone(p, l)) st.done++;
  }
  const overall = Object.values(sections).reduce(
    (a, s) => ({done: a.done + s.done, credit: a.credit + s.credit, total: a.total + s.total}),
    empty(),
  );
  return {sections, overall};
}

export const percent = ({credit, total}: Stat) => (total ? Math.round((credit / total) * 100) : 0);
