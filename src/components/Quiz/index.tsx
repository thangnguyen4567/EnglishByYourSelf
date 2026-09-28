import React, {useMemo, useState} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import testsData from '@site/src/data/tests.json';
import topicsData from '@site/src/data/topics.json';
import {PASS_RATE, rating, recordTest} from '@site/src/lib/progress';
import styles from './styles.module.css';

type Question = {
  no: number;
  code: string;
  q: string;
  options: Record<string, string>;
  answer: string;
  explain: string;
  source?: string;
  level?: Level;
};
type Level = 'basic' | 'normal' | 'hard';
type Test = {id: string; name: string; questions: Question[]};
type Topic = {code: string; short: string; path: string};

const tests = testsData as Test[];
const topics = topicsData as Record<string, Topic>;
const LETTERS = ['A', 'B', 'C', 'D'];
const LEVEL_INFO: Record<Level, {label: string; icon: string; cls: string}> = {
  basic: {label: 'Cơ bản', icon: '🔵', cls: 'lvBasic'},
  normal: {label: 'Trung bình', icon: '🟡', cls: 'lvNormal'},
  hard: {label: 'Khó', icon: '🔴', cls: 'lvHard'},
};

export type {Question};

type Props = {
  mode: 'exam' | 'practice';
  /** Bài kiểm tra tuần / cuối khóa (lấy từ tests.json). */
  testId?: string;
  /** Mã chủ đề: lọc câu hỏi từ các bài kiểm tra (practice). */
  topic?: string;
  /** Truyền trực tiếp danh sách câu hỏi (vd. bài kiểm tra theo cấp độ). */
  questions?: Question[];
  /** Khóa lưu điểm trong tiến độ; mặc định = testId. */
  storageId?: string;
  /** Ẩn mục "Cần ôn lại" (khi mọi câu cùng một chủ đề). */
  hideReview?: boolean;
};

/** Hiển thị "___" trong câu hỏi thành ô trống. */
function QuestionText({text}: {text: string}) {
  const parts = text.split(/_{2,}/);
  return (
    <>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {p}
          {i < parts.length - 1 && <span className={styles.blank} aria-label="chỗ trống" />}
        </React.Fragment>
      ))}
    </>
  );
}

function TopicTag({code}: {code: string}) {
  const t = topics[code];
  return t ? (
    <Link className={styles.tag} to={t.path} title={t.short}>
      {code}
    </Link>
  ) : (
    <span className={styles.tag}>{code}</span>
  );
}

export default function Quiz({mode, testId, topic, questions: given, storageId, hideReview}: Props): ReactNode {
  const id = storageId ?? testId;
  const questions = useMemo<Question[]>(() => {
    if (given) return given;
    if (testId) return tests.find((t) => t.id === testId)?.questions ?? [];
    return tests.flatMap((t) =>
      t.questions.filter((q) => q.code === topic).map((q) => ({...q, source: t.name})),
    );
  }, [given, testId, topic]);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter((q, i) => answers[i] === q.answer).length;
  const revealAll = mode === 'exam' && submitted;

  const choose = (i: number, letter: string) => {
    if (mode === 'practice' && answers[i]) return; // luyện tập: chọn 1 lần
    if (mode === 'exam' && submitted) return;
    setAnswers((a) => ({...a, [i]: letter}));
  };

  const submit = () => {
    const missing = questions.length - answeredCount;
    if (missing > 0 && !window.confirm(`Bạn còn ${missing} câu chưa làm. Vẫn nộp bài?`)) return;
    setSubmitted(true);
    if (id) recordTest(id, correctCount, questions.length);
    setTimeout(() => document.getElementById(`quiz-result-${id}`)?.scrollIntoView({behavior: 'smooth', block: 'center'}), 0);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  // Chủ đề sai -> gợi ý ôn tập
  const wrongByTopic = useMemo(() => {
    const m: Record<string, number> = {};
    questions.forEach((q, i) => {
      if (answers[i] !== q.answer) m[q.code] = (m[q.code] ?? 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [questions, answers]);

  // Điểm theo từng phần (chỉ khi bài có nhiều cấp độ)
  const byLevel = useMemo(() => {
    const m = new Map<Level, {ok: number; total: number}>();
    questions.forEach((q, i) => {
      if (!q.level) return;
      const s = m.get(q.level) ?? {ok: 0, total: 0};
      s.total += 1;
      if (answers[i] === q.answer) s.ok += 1;
      m.set(q.level, s);
    });
    return m.size > 1 ? [...m.entries()] : [];
  }, [questions, answers]);

  if (!questions.length) return <p>Chưa có câu hỏi cho chủ đề này.</p>;

  const byLevelEnabled = new Set(questions.map((q) => q.level)).size > 1;
  const rate = correctCount / questions.length;
  const r = rating(rate);

  return (
    <div className={styles.quiz}>
      <div className={styles.bar}>
        {mode === 'exam' ? (
          <span>
            Đã làm <b>{answeredCount}</b>/{questions.length} câu
          </span>
        ) : (
          <span>
            Đúng <b>{correctCount}</b> / {answeredCount} câu đã chọn (tổng {questions.length})
          </span>
        )}
        <progress value={answeredCount} max={questions.length} />
        {answeredCount > 0 && (
          <button className="button button--sm button--secondary" onClick={reset}>
            Làm lại
          </button>
        )}
      </div>

      {revealAll && (
        <div id={`quiz-result-${id}`} className={clsx('alert', `alert--${r.tone}`, styles.result)}>
          <div className={styles.score}>
            {correctCount}/{questions.length}
            <small>{Math.round(rate * 100)}%</small>
          </div>
          <div>
            <strong>{r.label}</strong>
            <p>
              {hideReview
                ? rate >= PASS_RATE
                  ? 'Bạn đã đạt mục tiêu ≥ 80%. Xem lại các câu sai (nếu có) rồi thử cấp độ tiếp theo.'
                  : 'Chưa đạt 80%. Đọc giải thích các câu sai, ôn lại các mục trên trang rồi làm lại.'
                : rate >= PASS_RATE
                  ? 'Bạn đã đạt mục tiêu ≥ 80%. Xem lại các câu sai (nếu có) rồi chuyển sang tuần tiếp theo.'
                  : 'Chưa đạt 80%. Ôn lại các chủ đề dưới đây rồi làm lại bài.'}
            </p>
            {byLevel.length > 0 && (
              <div className={styles.levels}>
                {byLevel.map(([lv, s]) => (
                  <span key={lv}>
                    {LEVEL_INFO[lv].icon} {LEVEL_INFO[lv].label}: <b>{s.ok}/{s.total}</b>
                  </span>
                ))}
              </div>
            )}
            {!hideReview && wrongByTopic.length > 0 && (
              <div>
                <b>Cần ôn lại:</b>{' '}
                {wrongByTopic.map(([code, n]) => (
                  <Link key={code} className={styles.review} to={topics[code]?.path ?? '#'}>
                    {code} · {topics[code]?.short} ({n} câu sai)
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ol className={styles.list}>
        {questions.map((q, i) => {
          const picked = answers[i];
          const show = revealAll || (mode === 'practice' && !!picked);
          const ok = picked === q.answer;
          return (
            <li
              key={`${q.source ?? ''}${q.no}`}
              className={clsx(styles.card, show && (ok ? styles.cardOk : styles.cardBad))}>
              <div className={styles.head}>
                <span className={styles.num}>Câu {i + 1}</span>
                <TopicTag code={q.code} />
                {q.level && byLevelEnabled && (
                  <span className={clsx(styles.level, styles[LEVEL_INFO[q.level].cls])}>
                    {LEVEL_INFO[q.level].label}
                  </span>
                )}
                {q.source && <span className={styles.src}>{q.source}</span>}
              </div>
              <p className={styles.q}>
                <QuestionText text={q.q} />
              </p>
              <div className={styles.options} role="radiogroup">
                {LETTERS.map((L) => {
                  const isPicked = picked === L;
                  const isAnswer = q.answer === L;
                  return (
                    <button
                      key={L}
                      type="button"
                      role="radio"
                      aria-checked={isPicked}
                      disabled={show}
                      onClick={() => choose(i, L)}
                      className={clsx(
                        styles.option,
                        isPicked && styles.picked,
                        show && isAnswer && styles.correct,
                        show && isPicked && !isAnswer && styles.wrong,
                      )}>
                      <span className={styles.letter}>{L}</span>
                      {q.options[L]}
                    </button>
                  );
                })}
              </div>
              {show && (
                <div className={styles.explain}>
                  <b>{ok ? '✔ Đúng.' : picked ? `✘ Sai – đáp án đúng: ${q.answer}.` : `Chưa làm – đáp án: ${q.answer}.`}</b>{' '}
                  {q.explain}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {mode === 'exam' && !submitted && (
        <div className={styles.submit}>
          <button className="button button--primary button--lg" onClick={submit}>
            Nộp bài
          </button>
        </div>
      )}
    </div>
  );
}
