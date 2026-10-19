import React from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useProgress} from '@site/src/lib/progress';
import {SECTIONS, credit, isDone, isLevelDone, levelSet, percent, setDone, setLevelDone, summarize, useLessons, type Lesson} from '@site/src/lib/completion';
import styles from './styles.module.css';

/**
 * Nút đánh dấu hoàn thành ở cuối mỗi trang bài học + tiến độ phần đó và tổng tiến độ.
 * Bài có nhiều mức (ngữ pháp: Dễ / Trung bình / Khó · phản xạ: Cơ bản / Trung bình / Nâng cao) đánh dấu riêng từng mức;
 * đủ mọi mức = xong bài. Với ngữ pháp, mỗi mức cộng một phần khác nhau vào tổng tiến độ.
 */
export default function LessonDone({lesson}: {lesson: Lesson}): ReactNode {
  const [progress, update] = useProgress();
  const lessons = useLessons();
  const done = isDone(progress, lesson);
  const {sections, overall} = summarize(progress, lessons);
  const sec = SECTIONS.find((s) => s.key === lesson.section)!;
  const stat = sections[lesson.section];
  const set = levelSet(lesson);
  const mine = Math.round(credit(progress, lesson) * 100);

  return (
    <div className={clsx(styles.box, done && styles.isDone)}>
      {set ? (
        <div className={styles.levelBox}>
          <div className={styles.levels} role="group" aria-label="Mức đã hoàn thành">
            {set.levels.map((lv) => {
              const on = isLevelDone(progress, lesson, lv.key);
              return (
                <button
                  key={lv.key}
                  type="button"
                  title={lv.hint}
                  className={clsx('button button--sm', on ? 'button--success' : 'button--outline button--primary')}
                  aria-pressed={on}
                  onClick={() => update((p) => setLevelDone(p, lesson, lv.key, !on))}
                >
                  {on ? '✅' : lv.icon} {lv.label}
                  {set.partial && <span className={styles.weight}>+{Math.round(lv.weight * 100)}%</span>}
                </button>
              );
            })}
          </div>
          <span className={styles.mine}>
            {done ? '✅ Đã xong cả 3 mức' : set.partial ? `Bài này: ${mine}%` : 'Xong khi đủ 3 mức'}
          </span>
        </div>
      ) : (
        <button
          type="button"
          className={clsx('button', done ? 'button--success' : 'button--primary', styles.btn)}
          aria-pressed={done}
          onClick={() => update((p) => setDone(p, lesson, !done))}
        >
          {done ? '✅ Đã hoàn thành' : '☐ Đánh dấu hoàn thành'}
        </button>
      )}
      <div className={styles.stats}>
        <span>
          {sec.icon} {sec.label}: <b>{stat.done}</b>/{stat.total} xong · {percent(stat)}%
        </span>
        <span>
          Tổng tiến độ: <b>{percent(overall)}%</b>
        </span>
        <progress value={overall.credit} max={overall.total || 1} />
        {set?.partial && (
          <span className={styles.undo}>
            Mỗi mức cộng một phần vào tiến độ: Dễ 20% · Trung bình 30% · Khó 50%. Bấm lại để bỏ đánh dấu.
          </span>
        )}
        {!set?.partial && done && <span className={styles.undo}>Bấm lại để bỏ đánh dấu.</span>}
      </div>
      <Link to="/#tien-do" className={styles.link}>
        Xem tiến độ →
      </Link>
    </div>
  );
}
