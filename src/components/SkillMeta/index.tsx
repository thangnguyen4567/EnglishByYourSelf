import React from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import topicsData from '@site/src/data/topics.json';
import {SKILLS, findTopic} from '@site/src/data/skills';
import {useProgress} from '@site/src/lib/progress';
import styles from './styles.module.css';

const grammar = topicsData as Record<string, {short: string; path: string}>;

/** Dải thông tin đầu trang chủ đề nói/viết: giai đoạn, ngữ pháp cần dùng, đánh dấu hoàn thành, bài trước/sau. */
export default function SkillMeta({id}: {id: string}): ReactNode {
  const [progress, update] = useProgress();
  const found = findTopic(id);
  if (!found) return null;
  const {skill, topic} = found;
  const s = SKILLS[skill];
  const stage = s.stages.find((x) => x.no === topic.stage);
  const idx = s.topics.findIndex((t) => t.id === id);
  const prev = s.topics[idx - 1];
  const next = s.topics[idx + 1];
  const done = !!progress.skills?.[id];

  return (
    <div className={styles.meta}>
      <div className={styles.row}>
        <span className={styles.no}>{String(topic.no).padStart(2, '0')}</span>
        <span className={styles.chip}>
          Giai đoạn {topic.stage}: {stage?.title}
        </span>
        <span className={styles.spacer} />
        {prev && (
          <Link className={styles.nav} to={`${s.base}/${prev.slug}`} title={prev.title}>
            ← {String(prev.no).padStart(2, '0')}
          </Link>
        )}
        {next && (
          <Link className={styles.nav} to={`${s.base}/${next.slug}`} title={next.title}>
            {String(next.no).padStart(2, '0')} →
          </Link>
        )}
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Ngữ pháp nên dùng:</span>
        {topic.grammar.map((g) => (
          <Link key={g} className={styles.gram} to={grammar[g]?.path ?? '#'}>
            {g} · {grammar[g]?.short}
          </Link>
        ))}
      </div>
      <label className={clsx(styles.done, done && styles.isDone)}>
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => update((p) => ({...p, skills: {...p.skills, [id]: e.target.checked}}))}
        />
        {done ? 'Đã luyện xong chủ đề này' : 'Đánh dấu đã luyện xong'}
      </label>
    </div>
  );
}
