import React from 'react';
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import topicsData from '@site/src/data/topics.json';
import {SKILLS, type SkillKey} from '@site/src/data/skills';
import {useProgress} from '@site/src/lib/progress';
import styles from './styles.module.css';

const grammar = topicsData as Record<string, {short: string; path: string}>;

/** Lộ trình các giai đoạn và chủ đề của kỹ năng nói/viết, kèm tiến độ đã luyện. */
export default function SkillRoadmap({skill}: {skill: SkillKey}): ReactNode {
  const [progress] = useProgress();
  const s = SKILLS[skill];
  const done = s.topics.filter((t) => progress.skills?.[t.id]).length;

  return (
    <div className={styles.wrap}>
      <div className={styles.progress}>
        <span>
          Đã luyện <b>{done}</b>/{s.topics.length} chủ đề
        </span>
        <progress value={done} max={s.topics.length} />
      </div>
      {s.stages.map((st) => (
        <section key={st.no} className={styles.stage}>
          <header>
            <span className={styles.stageNo}>Giai đoạn {st.no}</span>
            <b>{st.title}</b>
          </header>
          <p className={styles.goal}>
            🎯 {st.goal}
            <br />
            📘 Ngữ pháp trọng tâm: {st.grammar}
          </p>
          <ol className={styles.list}>
            {s.topics
              .filter((t) => t.stage === st.no)
              .map((t) => (
                <li key={t.id} value={t.no} className={progress.skills?.[t.id] ? styles.done : undefined}>
                  <Link to={`${s.base}/${t.slug}`}>
                    {t.title} <span className={styles.en}>({t.en})</span>
                  </Link>
                  <span className={styles.grams}>
                    {t.grammar.map((g) => (
                      <Link key={g} to={grammar[g]?.path ?? '#'} title={grammar[g]?.short}>
                        {g}
                      </Link>
                    ))}
                  </span>
                  {progress.skills?.[t.id] && <span className={styles.check}>✔</span>}
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
