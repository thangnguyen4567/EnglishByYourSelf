import React, {useState} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useProgress} from '@site/src/lib/progress';
import {LEVELS, SECTIONS, hasLevels, isDone, isLevelDone, percent, setDone, setLevelDone, summarize, useLessons, type Lesson, type Section} from '@site/src/lib/completion';
import styles from './styles.module.css';

type Filter = 'all' | 'todo' | 'done';
const FILTERS: {key: Filter; label: string}[] = [
  {key: 'all', label: 'Tất cả'},
  {key: 'todo', label: 'Chưa xong'},
  {key: 'done', label: 'Đã xong'},
];

/**
 * Tổng tiến độ toàn khóa: ngữ pháp + luyện nói + phản xạ + kiểm tra (theo nút "Đánh dấu hoàn thành" ở cuối mỗi bài).
 * `detailed`: thêm danh sách từng bài theo nhóm, lọc đã xong / chưa xong và đánh dấu ngay tại đây.
 */
export default function OverallProgress({detailed = false}: {detailed?: boolean}): ReactNode {
  const [progress, update] = useProgress();
  const lessons = useLessons();
  const {sections, overall} = summarize(progress, lessons);
  const [active, setActive] = useState<Section>('grammar');
  const [filter, setFilter] = useState<Filter>('all');

  const shown = lessons.filter((l) => {
    if (l.section !== active) return false;
    const done = isDone(progress, l);
    return filter === 'all' || (filter === 'done' ? done : !done);
  });
  const groups = new Map<string, Lesson[]>();
  for (const l of shown) groups.set(l.group ?? '', [...(groups.get(l.group ?? '') ?? []), l]);

  return (
    <div className={styles.wrap}>
      <div className={styles.total}>
        <div className={styles.pct}>{percent(overall)}%</div>
        <div className={styles.totalText}>
          <b>Tổng tiến độ khóa học</b>
          <span>
            Đã hoàn thành {overall.done}/{overall.total} bài
          </span>
          <progress value={overall.done} max={overall.total || 1} />
        </div>
      </div>
      <div className={styles.grid}>
        {SECTIONS.map((s) => {
          const st = sections[s.key];
          const body = (
            <>
              <span className={styles.head}>
                {s.icon} <b>{s.label}</b>
                <span className={styles.count}>
                  {st.done}/{st.total}
                </span>
              </span>
              <progress value={st.done} max={st.total || 1} />
              <span className={styles.small}>
                {percent(st)}% · còn {st.total - st.done} bài
              </span>
            </>
          );
          return detailed ? (
            <button
              key={s.key}
              type="button"
              className={clsx(styles.card, active === s.key && styles.active)}
              aria-pressed={active === s.key}
              onClick={() => setActive(s.key)}
            >
              {body}
            </button>
          ) : (
            <Link key={s.key} to={s.to} className={styles.card}>
              {body}
            </Link>
          );
        })}
      </div>

      {detailed ? (
        <div className={styles.detail}>
          <div className={styles.filters} role="tablist" aria-label="Lọc bài">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                className={clsx(styles.filter, filter === f.key && styles.on)}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          {shown.length === 0 && (
            <p className={styles.empty}>{filter === 'done' ? 'Chưa có bài nào đánh dấu xong.' : '🎉 Đã xong toàn bộ phần này!'}</p>
          )}
          {[...groups].map(([group, items]) => (
            <div key={group} className={styles.group}>
              {group && <div className={styles.groupHead}>{group}</div>}
              <ul className={styles.list}>
                {items.map((l) => {
                  const done = isDone(progress, l);
                  return (
                    <li key={l.pluginId + l.docId} className={clsx(done && styles.itemDone)}>
                      <input
                        type="checkbox"
                        checked={done}
                        aria-label={`Đánh dấu hoàn thành: ${l.title}`}
                        onChange={(e) => update((p) => setDone(p, l, e.target.checked))}
                      />
                      <Link to={l.path}>{l.title}</Link>
                      {hasLevels(l) && (
                        <span className={styles.levels}>
                          {LEVELS.map((lv) => (
                            <label key={lv.key} title={lv.label}>
                              <input
                                type="checkbox"
                                checked={isLevelDone(progress, l, lv.key)}
                                aria-label={`${lv.label}: ${l.title}`}
                                onChange={(e) => update((p) => setLevelDone(p, l, lv.key, e.target.checked))}
                              />
                              {lv.label[0]}
                            </label>
                          ))}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <p className={styles.hint}>
            Tích ô để đánh dấu ngay tại đây, hoặc bấm <b>Đánh dấu hoàn thành</b> ở cuối mỗi bài. Bài đã xong có dấu ✔ trên thanh bên.
          </p>
        </div>
      ) : (
        <p className={styles.hint}>
          Cuối mỗi bài có nút <b>Đánh dấu hoàn thành</b>. <Link to="/#tien-do">Xem bài nào đã xong / chưa xong →</Link>
        </p>
      )}
    </div>
  );
}
