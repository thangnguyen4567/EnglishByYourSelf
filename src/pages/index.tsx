import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import topicsData from '@site/src/data/topics.json';
import pagesData from '@site/src/data/pages.json';
import tests from '@site/src/data/tests.json';

import styles from './index.module.css';

type Topic = {code: string; short: string; group: string; path: string};
const topics = Object.values(topicsData as Record<string, Topic>);
// Trang chủ đề (một mã có thể tách thành nhiều trang, vd. G01a, G01b)
const groupOf = Object.fromEntries(topics.map((t) => [t.code, t.group]));
const pages = (pagesData as {code: string; label: string; short: string; path: string}[]).map((p) => ({
  ...p,
  group: groupOf[p.code],
}));
const questionCount = tests.reduce((n, t) => n + t.questions.length, 0);

const GROUPS: {name: string; label: string; icon: string}[] = [
  {name: 'Nền tảng', label: 'Nền tảng', icon: '🧱'},
  {name: 'Thì', label: 'Các thì', icon: '⏳'},
  {name: 'Động từ', label: 'Động từ', icon: '⚙️'},
  {name: 'Danh từ', label: 'Danh từ & Đại từ', icon: '📦'},
  {name: 'Tính/Trạng từ', label: 'Tính từ & Trạng từ', icon: '🎨'},
  {name: 'Giới từ', label: 'Giới từ', icon: '📍'},
  {name: 'Cấu trúc câu', label: 'Cấu trúc câu', icon: '🔄'},
  {name: 'Câu phức', label: 'Câu phức', icon: '🔗'},
  {name: 'Nâng cao', label: 'Nâng cao', icon: '🚀'},
];

const STEPS = [
  {icon: '📚', title: 'Sổ tay ngữ pháp', to: '/docs/ngu-phap',
    text: '29 chủ đề chia 9 nhóm. Mỗi chủ đề: cấu trúc, cách dùng, dấu hiệu, ví dụ, lỗi thường gặp.'},
  {icon: '📝', title: 'Bài kiểm tra', to: '/docs/bai-kiem-tra',
    text: `${tests.length} bài test (${questionCount} câu) tự chấm điểm, có giải thích và gợi ý chủ đề cần ôn.`},
  {icon: '📒', title: 'Từ vựng đang học', to: '/docs/tra-cuu/tu-vung-dang-hoc',
    text: 'Sổ từ vựng cá nhân: từ loại, phiên âm, nghĩa và câu ví dụ có phát âm.'},
  {icon: '🗣️', title: 'Luyện nói', to: '/luyen-noi',
    text: '26 chủ đề theo 5 giai đoạn – gồm 10 chủ đề luyện phỏng vấn Fullstack Developer: từ vựng có phát âm, mẫu câu, câu trả lời mẫu có âm thanh.'},
  {icon: '✍️', title: 'Luyện viết', to: '/luyen-viet',
    text: '16 bài từ câu → đoạn văn → email → bài luận: bố cục, từ vựng, bài mẫu có phân tích và đề luyện tập.'},
  {icon: '⚡', title: 'Luyện phản xạ', to: '/luyen-phan-xa',
    text: '30 chủ đề đời sống × 30 câu (có 10 câu nâng cao): nhìn câu tiếng Việt + gợi ý từ vựng → nói & viết ra tiếng Anh → mở đáp án để so.'},
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Trang chủ" description={siteConfig.tagline}>
      <header className={clsx('hero', styles.hero)}>
        <div className="container">
          <Heading as="h1" className={styles.title}>
            Ngữ pháp <span>tiếng Anh</span>
          </Heading>
          <p className={styles.subtitle}>
            Học theo thứ tự từ từ loại → các thì → câu phức → cấu trúc nâng cao.
          </p>
          <div className={styles.stats}>
            <div><b>{topics.length}</b>chủ đề</div>
            <div><b>{tests.length}</b>bài kiểm tra</div>
            <div><b>{questionCount}</b>câu hỏi</div>
          </div>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs/ngu-phap">
              Vào học ngay →
            </Link>
            <Link className="button button--secondary button--lg" to="/docs">
              Cách dùng tài liệu
            </Link>
          </div>
        </div>
      </header>

      <main className="container margin-vert--xl">
        <section className={styles.steps}>
          {STEPS.map((s) => (
            <Link key={s.to} to={s.to} className={styles.card}>
              <span className={styles.icon}>{s.icon}</span>
              <Heading as="h3">{s.title}</Heading>
              <p>{s.text}</p>
            </Link>
          ))}
        </section>

        <section className="margin-top--xl">
          <Heading as="h2" className="text--center">9 nhóm ngữ pháp</Heading>
          <p className="text--center">Sắp xếp từ đơn vị nhỏ đến lớn – nhóm sau xây trên nền nhóm trước.</p>
          <div className={styles.groups}>
            {GROUPS.map((g, i) => {
              const members = pages.filter((t) => t.group === g.name);
              return (
                <div key={g.name} className={styles.group}>
                  <div className={styles.groupHead}>
                    <span>{g.icon}</span>
                    <b>
                      {i + 1}. {g.label}
                    </b>
                  </div>
                  <ul>
                    {members.map((t) => (
                      <li key={t.label}>
                        <Link to={t.path}>
                          <code>{t.label}</code> {t.short}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </Layout>
  );
}
