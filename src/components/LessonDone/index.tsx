import React from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useProgress} from '@site/src/lib/progress';
import {LEVELS, SECTIONS, hasLevels, isDone, isLevelDone, percent, setDone, setLevelDone, summarize, useLessons, type Lesson} from '@site/src/lib/completion';
import styles from './styles.module.css';

/**
 * Nút đánh dấu hoàn thành ở cuối mỗi trang bài học + tiến độ phần đó và tổng tiến độ.
 * Bài phản xạ: đánh dấu riêng từng mức (Cơ bản / Trung bình / Nâng cao); đủ 3 mức = xong chủ đề.
 */
export default function LessonDone({lesson}: {lesson: Lesson}): ReactNode {
  const [progress, update] = useProgress();
  const lessons = useLessons();
  const done = isDone(progress, lesson);
  const {sections, overall} = summarize(progress, lessons);
  const sec = SECTIONS.find((s) => s.key === lesson.section)!;
  const stat = sections[lesson.section];

  return (
    <div className={clsx(styles.box, done && styles.isDone)}>
      {hasLevels(lesson) ? (
        <div className={styles.levels} role="group" aria-label="Mức đã hoàn thành">
          {LEVELS.map((lv) => {
            const on = isLevelDone(progress, lesson, lv.key);
            return (
              <button
                key={lv.key}
                type="button"
                className={clsx('button button--sm', on ? 'button--success' : 'button--outline button--primary')}
                aria-pressed={on}
                onClick={() => update((p) => setLevelDone(p, lesson, lv.key, !on))}
              >
                {on ? '✅' : '☐'} {lv.label}
              </button>
            );
          })}
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
          {sec.icon} {sec.label}: <b>{stat.done}</b>/{stat.total}
        </span>
        <span>
          Tổng tiến độ: <b>{percent(overall)}%</b> ({overall.done}/{overall.total})
        </span>
        <progress value={overall.done} max={overall.total || 1} />
        {done && <span className={styles.undo}>Bấm lại để bỏ đánh dấu.</span>}
      </div>
      <Link to="/#tien-do" className={styles.link}>
        Xem tiến độ →
      </Link>
    </div>
  );
}
