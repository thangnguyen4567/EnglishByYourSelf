import {useCallback, useEffect, useState} from 'react';
import {loadRemote, saveProgress} from './store';

// Tiến độ học lưu trên MongoDB qua API (xem src/lib/store.ts và server/).
// Khóa localStorage cũ – chỉ còn dùng để chuyển dữ liệu lên máy chủ ở lần đầu.
const LEGACY_KEY = 'ngu-phap-30-ngay:v1';

export type DayState = {done?: boolean; rating?: number};
export type TestState = {best: number; last: number; total: number; date: string};
export type Progress = {
  startDate?: string;
  days: Record<number, DayState>;
  tests: Record<string, TestState>;
  /** Chủ đề luyện nói / viết đã hoàn thành, vd. {'noi-01': true} */
  skills: Record<string, boolean>;
  /** Lộ trình 60 ngày: ngày đã hoàn thành, vd. {1: true} */
  plan60?: Record<number, boolean>;
  /** Ngày bắt đầu lộ trình 60 ngày (YYYY-MM-DD) */
  plan60Start?: string;
  /** Trang bài học đã hoàn thành (ngữ pháp, phản xạ, kiểm tra), khóa "<pluginId>:<docId>" – xem src/lib/completion.ts */
  done?: Record<string, boolean>;
};

const EMPTY: Progress = {days: {}, tests: {}, skills: {}};
const EVENT = 'ngu-phap-progress-change';

let cache: Progress = EMPTY;
let ready: Promise<void> | undefined;

function readLegacy(): Progress | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    return raw ? {...EMPTY, ...JSON.parse(raw)} : null;
  } catch {
    return null;
  }
}

/** Tải tiến độ từ máy chủ một lần; nếu máy chủ chưa có thì chuyển dữ liệu localStorage cũ lên. */
function ensureLoaded(): Promise<void> {
  ready ??= loadRemote()
    .then(({progress}) => {
      if (progress) {
        cache = {...EMPTY, ...(progress as Progress)};
      } else {
        const legacy = readLegacy();
        if (legacy) {
          cache = legacy;
          saveProgress(legacy);
        }
      }
    })
    .catch((err) => console.warn('Không tải được tiến độ từ máy chủ:', err))
    .finally(() => window.dispatchEvent(new Event(EVENT)));
  return ready;
}

function write(p: Progress) {
  cache = p;
  saveProgress(p);
  window.dispatchEvent(new Event(EVENT));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);

  useEffect(() => {
    const sync = () => setProgress(cache);
    sync();
    window.addEventListener(EVENT, sync);
    void ensureLoaded();
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    void ensureLoaded().then(() => write(fn(cache)));
  }, []);
  return [progress, update] as const;
}

export function recordTest(id: string, correct: number, total: number) {
  void ensureLoaded().then(() => {
    const prev = cache.tests[id];
    write({
      ...cache,
      tests: {
        ...cache.tests,
        [id]: {
          best: Math.max(prev?.best ?? 0, correct),
          last: correct,
          total,
          date: new Date().toISOString().slice(0, 10),
        },
      },
    });
  });
}

export const PASS_RATE = 0.8;

export function rating(rate: number): {label: string; tone: 'success' | 'info' | 'warning' | 'danger'} {
  if (rate >= 0.9) return {label: 'Xuất sắc 🏆', tone: 'success'};
  if (rate >= PASS_RATE) return {label: 'Đạt ✔', tone: 'info'};
  if (rate >= 0.6) return {label: 'Cần ôn lại chủ đề sai', tone: 'warning'};
  return {label: 'Học lại tuần này', tone: 'danger'};
}
