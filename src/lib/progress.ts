import {useCallback, useEffect, useState} from 'react';

// Tiến độ học lưu trong localStorage của trình duyệt (chỉ trên máy người học).
const KEY = 'ngu-phap-30-ngay:v1';

export type DayState = {done?: boolean; rating?: number};
export type TestState = {best: number; last: number; total: number; date: string};
export type Progress = {
  startDate?: string;
  days: Record<number, DayState>;
  tests: Record<string, TestState>;
  /** Chủ đề luyện nói / viết đã hoàn thành, vd. {'noi-01': true} */
  skills: Record<string, boolean>;
};

const EMPTY: Progress = {days: {}, tests: {}, skills: {}};
const EVENT = 'ngu-phap-progress-change';

function read(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? {...EMPTY, ...JSON.parse(raw)} : EMPTY;
  } catch {
    return EMPTY;
  }
}

function write(p: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // private mode / storage bị chặn: bỏ qua, trang vẫn hoạt động
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);

  useEffect(() => {
    const sync = () => setProgress(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => write(fn(read())), []);
  return [progress, update] as const;
}

export function recordTest(id: string, correct: number, total: number) {
  const p = read();
  const prev = p.tests[id];
  p.tests = {
    ...p.tests,
    [id]: {
      best: Math.max(prev?.best ?? 0, correct),
      last: correct,
      total,
      date: new Date().toISOString().slice(0, 10),
    },
  };
  write(p);
}

export const PASS_RATE = 0.8;

export function rating(rate: number): {label: string; tone: 'success' | 'info' | 'warning' | 'danger'} {
  if (rate >= 0.9) return {label: 'Xuất sắc 🏆', tone: 'success'};
  if (rate >= PASS_RATE) return {label: 'Đạt ✔', tone: 'info'};
  if (rate >= 0.6) return {label: 'Cần ôn lại chủ đề sai', tone: 'warning'};
  return {label: 'Học lại tuần này', tone: 'danger'};
}
