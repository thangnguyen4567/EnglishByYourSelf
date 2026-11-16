import React from 'react';
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

function DayCard({day, done, isToday, locked, onToggle}: {day: PlanDay; done: boolean; isToday: boolean; locked: boolean; onToggle: (v: boolean) => void}) {
  const minutes = day.blocks.reduce((s, b) => s + b.minutes, 0);
  if (locked) {
    return (
      <div className={clsx(styles.day, styles.locked)} id={`ngay-${day.day}`}>
        <div className={styles.lockedRow}>
          <span className={styles.dayNo}>Ngày {day.day}</span>
          <span className={styles.focus}>{day.focus}</span>
          <span className={styles.check}>🔒</span>
        </div>
      </div>
    );
  }
  return (
    <details className={clsx(styles.day, done && styles.done, isToday && styles.today)} open={isToday} id={`ngay-${day.day}`}>
      <summary>
        <span className={styles.dayNo}>Ngày {day.day}</span>
        {day.sunday && <span className={styles.sun}>Ôn tập</span>}
        {isToday && <span className={styles.todayTag}>Đang học</span>}
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

  const doneMap = progress.plan60 ?? {};
  const doneCount = PLAN.filter((d) => doneMap[d.day]).length;
  // Mở theo tiến độ: ngày đầu tiên chưa xong là ngày đang học; các ngày sau đó bị khóa đến khi xong ngày này.
  const currentDay = PLAN.find((d) => !doneMap[d.day]);
  const current = currentDay?.day;

  const toggle = (day: number, v: boolean) => update((p) => ({...p, plan60: {...(p.plan60 ?? {}), [day]: v}}));
  const reset = () => {
    if (window.confirm('Xóa toàn bộ đánh dấu của lộ trình 60 ngày và học lại từ ngày 1?')) {
      update((p) => ({...p, plan60: {}}));
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
          <span>
            {current ? (
              <>
                Đang học: <a href={`#ngay-${current}`}>ngày {current}</a> · Hoàn thành ngày này để mở ngày tiếp theo
              </>
            ) : (
              <>🎉 Đã hoàn thành cả lộ trình</>
            )}
          </span>
          {doneCount > 0 && (
            <button type="button" className="button button--sm button--link" onClick={reset}>
              Đặt lại
            </button>
          )}
        </div>
      </div>
      {currentDay && (
        <section className={styles.week}>
          <header>
            <span className={styles.weekNo}>Tuần {currentDay.week}</span>
            <b>Ngày đang học</b>
          </header>
          <DayCard day={currentDay} done={false} isToday locked={false} onToggle={(v) => toggle(currentDay.day, v)} />
        </section>
      )}

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
            {days.map((d) =>
              d.day === current ? (
                <div key={d.day} className={styles.day}>
                  <div className={styles.lockedRow}>
                    <span className={styles.dayNo}>Ngày {d.day}</span>
                    <span className={styles.focus}>{d.focus}</span>
                    <a href={`#ngay-${d.day}`}>↑ đang học ở đầu trang</a>
                  </div>
                </div>
              ) : (
                <DayCard key={d.day} day={d} done={!!doneMap[d.day]} isToday={false} locked={!doneMap[d.day] && !!current && d.day > current} onToggle={(v) => toggle(d.day, v)} />
              ),
            )}
          </section>
        );
      })}
    </div>
  );
}

