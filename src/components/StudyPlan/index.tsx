import React, {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {PLAN, WEEKS, type Block, type PlanDay} from '@site/src/data/plan60';
import {useProgress} from '@site/src/lib/progress';
import styles from './styles.module.css';

const ICON: Record<Block['kind'], string> = {
  vocab: '🔁',
  grammar: '📘',
  test: '📝',
  speaking: '🗣️',
  reflex: '⚡',
  prep: '📒',
};

// Ngày theo giờ máy người học (không dùng UTC để tránh lệch ngày buổi sáng sớm ở VN)
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Ngày thứ mấy của lộ trình tính từ ngày bắt đầu (1-based, giới hạn 1–60). */
function dayFromStart(start?: string): number | null {
  if (!start) return null;
  const diff = Math.floor((Date.parse(today()) - Date.parse(start)) / 86400000) + 1;
  return Math.min(60, Math.max(1, diff));
}

function DayCard({day, done, isToday, onToggle}: {day: PlanDay; done: boolean; isToday: boolean; onToggle: (v: boolean) => void}) {
  const minutes = day.blocks.reduce((s, b) => s + b.minutes, 0);
  return (
    <details className={clsx(styles.day, done && styles.done, isToday && styles.today)} open={isToday} id={`ngay-${day.day}`}>
      <summary>
        <span className={styles.dayNo}>Ngày {day.day}</span>
        {day.sunday && <span className={styles.sun}>Ôn tập</span>}
        {isToday && <span className={styles.todayTag}>Hôm nay</span>}
        <span className={styles.focus}>{day.focus}</span>
        <span className={styles.min}>~{minutes}'</span>
        {done && <span className={styles.check}>✔</span>}
      </summary>
      <ol className={styles.blocks}>
        {day.blocks.map((b, i) => (
          <li key={i} className={styles[b.kind]}>
            <div className={styles.bHead}>
              <span>
                {ICON[b.kind]} <b>{b.title}</b>
              </span>
              <span className={styles.bMin}>{b.minutes}'</span>
            </div>
            {b.links.length > 0 && (
              <div className={styles.links}>
                {b.links.map((l) => (
                  <Link key={l.to + l.label} to={l.to}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
            <div className={styles.how}>{b.how}</div>
          </li>
        ))}
      </ol>
      <label className={styles.mark}>
        <input type="checkbox" checked={done} onChange={(e) => onToggle(e.target.checked)} />
        {done ? 'Đã hoàn thành ngày này' : 'Đánh dấu đã hoàn thành'}
      </label>
    </details>
  );
}

export default function StudyPlan(): ReactNode {
  const [progress, update] = useProgress();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const doneMap = progress.plan60 ?? {};
  const doneCount = PLAN.filter((d) => doneMap[d.day]).length;
  const current = mounted ? dayFromStart(progress.plan60Start) : null;
  const firstUndone = PLAN.find((d) => !doneMap[d.day])?.day;

  const toggle = (day: number, v: boolean) => update((p) => ({...p, plan60: {...(p.plan60 ?? {}), [day]: v}}));
  const start = () => update((p) => ({...p, plan60Start: today()}));
  const reset = () => {
    if (window.confirm('Đặt lại ngày bắt đầu và xóa toàn bộ đánh dấu của lộ trình 60 ngày?')) {
      update((p) => ({...p, plan60: {}, plan60Start: undefined}));
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.status}>
        <div className={styles.bar}>
          <span>
            Đã xong <b>{doneCount}</b>/60 ngày
          </span>
          <progress value={doneCount} max={60} />
        </div>
        <div className={styles.actions}>
          {progress.plan60Start ? (
            <>
              <span>
                Bắt đầu: <b>{progress.plan60Start.split('-').reverse().join('/')}</b>
                {current && (
                  <>
                    {' '}
                    · Hôm nay là <a href={`#ngay-${current}`}>ngày {current}</a>
                  </>
                )}
                {firstUndone && firstUndone !== current && (
                  <>
                    {' '}
                    · Ngày chưa xong đầu tiên: <a href={`#ngay-${firstUndone}`}>ngày {firstUndone}</a>
                  </>
                )}
              </span>
              <button type="button" className="button button--sm button--link" onClick={reset}>
                Đặt lại
              </button>
            </>
          ) : (
            <button type="button" className="button button--sm button--primary" onClick={start}>
              ▶ Bắt đầu lộ trình từ hôm nay
            </button>
          )}
        </div>
      </div>

      {WEEKS.map((w) => {
        const days = PLAN.filter((d) => d.week === w.no);
        const wDone = days.filter((d) => doneMap[d.day]).length;
        return (
          <section key={w.no} className={styles.week}>
            <header>
              <span className={styles.weekNo}>Tuần {w.no}</span>
              <b>{w.title}</b>
              <span className={styles.wCount}>
                {wDone}/{days.length}
              </span>
            </header>
            <p className={styles.goal}>🎯 {w.goal}</p>
            {days.map((d) => (
              <DayCard key={d.day} day={d} done={!!doneMap[d.day]} isToday={current === d.day} onToggle={(v) => toggle(d.day, v)} />
            ))}
          </section>
        );
      })}
    </div>
  );
}
