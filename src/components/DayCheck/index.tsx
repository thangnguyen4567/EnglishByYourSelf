import React from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import {useProgress} from '@site/src/lib/progress';
import styles from './styles.module.css';

/** Đánh dấu hoàn thành + tự đánh giá (1–5) cho một ngày học. */
export default function DayCheck({day}: {day: number}): ReactNode {
  const [progress, update] = useProgress();
  const state = progress.days[day] ?? {};

  const set = (patch: {done?: boolean; rating?: number}) =>
    update((p) => ({...p, days: {...p.days, [day]: {...p.days[day], ...patch}}}));

  return (
    <div className={clsx(styles.box, state.done && styles.done)}>
      <label className={styles.check}>
        <input type="checkbox" checked={!!state.done} onChange={(e) => set({done: e.target.checked})} />
        {state.done ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
      </label>
      <span className={styles.rate}>
        Tự đánh giá:
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} sao`}
            className={clsx(styles.star, (state.rating ?? 0) >= n && styles.on)}
            onClick={() => set({rating: state.rating === n ? undefined : n})}>
            ★
          </button>
        ))}
      </span>
    </div>
  );
}
