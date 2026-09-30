import React from 'react';
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import topicsData from '@site/src/data/topics.json';
import pagesData from '@site/src/data/pages.json';
import styles from './styles.module.css';

type Topic = {code: string; short: string; group: string; path: string; day: number | null};
type Page = {code: string; label: string; short: string; path: string};
const topics = topicsData as Record<string, Topic>;
const pages = pagesData as Page[];

/**
 * Dải thông tin đầu trang chủ đề: mã, nhóm, trang trước/sau.
 * `label` phân biệt các trang tách ra từ cùng một mã (vd. G01a, G01b).
 */
export default function TopicMeta({code, label}: {code: string; label?: string}): ReactNode {
  const t = topics[code];
  if (!t) return null;
  const idx = pages.findIndex((p) => p.label === (label ?? code));
  const prev = pages[idx - 1];
  const next = pages[idx + 1];

  return (
    <div className={styles.meta}>
      <span className={styles.code}>{label ?? t.code}</span>
      <span className={styles.chip}>Nhóm: {t.group}</span>
      <span className={styles.spacer} />
      {prev && (
        <Link className={styles.nav} to={prev.path} title={prev.short}>
          ← {prev.label}
        </Link>
      )}
      {next && (
        <Link className={styles.nav} to={next.path} title={next.short}>
          {next.label} →
        </Link>
      )}
    </div>
  );
}
