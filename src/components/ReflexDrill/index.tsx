import React, {useEffect, useMemo, useState} from 'react';
import type {ReactNode} from 'react';
import {canSpeak, speak} from '@site/src/lib/speech';
import styles from './styles.module.css';

export type ReflexItem = {vi: string; hints: string[]; en: string; level?: string};

type Filter = 'all' | 'basic' | 'medium' | 'advanced';

/** Mức độ của câu: không có `level` = cơ bản, `B1` = trung bình, còn lại (B2…) = nâng cao. */
const levelOf = (it: ReflexItem): Exclude<Filter, 'all'> =>
  !it.level ? 'basic' : it.level === 'B1' ? 'medium' : 'advanced';

const LEVEL_LABEL = {medium: 'Trung bình', advanced: 'Nâng cao'} as const;

/**
 * Bài luyện phản xạ: nhìn câu tiếng Việt + gợi ý từ vựng → nói to và viết câu tiếng Anh ra vở → mở đáp án để so.
 *
 * import data from '@site/src/data/reflex/01-gia-dinh.json';
 * <ReflexDrill items={data.items} />
 */
export default function ReflexDrill({items}: {items: ReflexItem[]}): ReactNode {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [showHints, setShowHints] = useState(true);
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));
  const [supported, setSupported] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const hasLevels = items.some((it) => it.level);

  useEffect(() => setSupported(canSpeak()), []);

  const visible = order.filter((i) => filter === 'all' || levelOf(items[i]) === filter);
  const allOpen = visible.every((i) => open.has(i));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const shuffle = () => {
    const next = [...order];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setOrder(next);
    setOpen(new Set());
  };

  const vocab = useMemo(() => [...new Set(items.flatMap((it) => it.hints))], [items]);

  return (
    <div>
      <div className={styles.toolbar}>
        <button type="button" className="button button--sm button--primary" onClick={() => setOpen(allOpen ? new Set() : new Set(visible))}>
          {allOpen ? '🙈 Ẩn tất cả đáp án' : '👁 Hiện tất cả đáp án'}
        </button>
        <button type="button" className="button button--sm button--secondary" onClick={() => setShowHints((v) => !v)}>
          {showHints ? '🧠 Ẩn gợi ý (khó hơn)' : '💡 Hiện gợi ý'}
        </button>
        <button type="button" className="button button--sm button--secondary" onClick={shuffle}>
          🔀 Xáo trộn
        </button>
        <button type="button" className="button button--sm button--secondary" onClick={() => setOrder(items.map((_, i) => i))}>
          ↺ Thứ tự gốc
        </button>
        {hasLevels && (
          <select aria-label="Mức độ" className={styles.filter} value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            <option value="all">Tất cả câu</option>
            <option value="basic">Cơ bản</option>
            <option value="medium">Trung bình</option>
            <option value="advanced">Nâng cao</option>
          </select>
        )}
      </div>

      <ol className={styles.list}>
        {visible.map((i, pos) => {
          const it = items[i];
          const isOpen = open.has(i);
          return (
            <li key={i} className={styles.item}>
              <div className={styles.head}>
                <span className={styles.no}>{pos + 1}.</span>
                <span className={styles.vi}>{it.vi}</span>
                {it.level && (
                  <span className={`${styles.badge} ${levelOf(it) === 'medium' ? styles.badgeMedium : ''}`}>{LEVEL_LABEL[levelOf(it) as 'medium' | 'advanced']}</span>
                )}
              </div>
              {showHints && (
                <div className={styles.hints}>
                  {it.hints.map((h) => (
                    <span key={h} className={styles.chip}>
                      {h}
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.answerRow}>
                <button type="button" className={styles.reveal} onClick={() => toggle(i)}>
                  {isOpen ? 'Ẩn đáp án' : 'Xem đáp án'}
                </button>
                {isOpen && (
                  <>
                    <span className={styles.en}>{it.en}</span>
                    {supported && (
                      <button type="button" className={styles.speak} title="Nghe" aria-label="Nghe câu tiếng Anh" onClick={() => speak(it.en, {rate: 0.9})}>
                        🔊
                      </button>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <h2 id="tu-vung-chu-de">Từ vựng trong bài ({vocab.length})</h2>
      <p>Ôn nhanh: nhìn từng từ, tự đặt một câu khác với câu ở trên.</p>
      <div className={`${styles.hints} ${styles.vocab}`}>
        {vocab.map((h) => (
          <span key={h} className={styles.chip}>
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}
