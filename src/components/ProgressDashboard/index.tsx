import React from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import roadmap from '@site/src/data/roadmap.json';
import testsData from '@site/src/data/tests.json';
import {PASS_RATE, useProgress} from '@site/src/lib/progress';
import styles from './styles.module.css';

const tests = testsData as {id: string; name: string; day: number; questions: unknown[]}[];
const TOTAL = roadmap.length;

function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d;
}

const fmt = (d: Date) => d.toLocaleDateString('vi-VN', {weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric'});

/** Bảng điều khiển tiến độ – tương đương sheet "Tổng quan" trong file Excel. */
export default function ProgressDashboard(): ReactNode {
  const [p, update] = useProgress();
  const doneDays = roadmap.filter((d) => p.days[d.day]?.done).length;
  const ratings = Object.values(p.days).map((d) => d.rating).filter((r): r is number => !!r);
  const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '–';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIndex = p.startDate
    ? Math.floor((today.getTime() - addDays(p.startDate, 0).getTime()) / 86400000) + 1
    : null;
  const todayDay = todayIndex && todayIndex >= 1 && todayIndex <= TOTAL ? roadmap[todayIndex - 1] : null;
  const nextDay = roadmap.find((d) => !p.days[d.day]?.done);

  const final = p.tests['cuoi-khoa'];
  const passed = tests.filter((t) => {
    const s = p.tests[t.id];
    return s && s.best / s.total >= PASS_RATE;
  }).length;
  const conclusion = !final
    ? 'Hoàn thành lộ trình và làm Bài kiểm tra Cuối Khóa để có kết luận.'
    : final.best / final.total >= PASS_RATE && passed === tests.length
      ? '🎉 Chúc mừng! Bạn đã nắm vững ngữ pháp nền tảng – chuyển sang luyện đề / viết / nói.'
      : final.best / final.total >= PASS_RATE
        ? 'Đạt bài cuối khóa, nhưng còn bài kiểm tra tuần chưa đạt – ôn lại tuần đó.'
        : 'Chưa đạt 80% – ôn lại các chủ đề có câu sai rồi làm lại bài.';

  const weekSlug = (w: string) => (w === 'Tổng kết' ? 'tuan-4' : w.toLowerCase().replace('tuần ', 'tuan-'));

  return (
    <div className={styles.wrap}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <label htmlFor="start-date">Ngày bắt đầu</label>
          <input
            id="start-date"
            type="date"
            value={p.startDate ?? ''}
            onChange={(e) => update((x) => ({...x, startDate: e.target.value || undefined}))}
          />
          {p.startDate && <small>Kết thúc dự kiến: {fmt(addDays(p.startDate, TOTAL - 1))}</small>}
        </div>
        <div className={styles.stat}>
          <span>Số ngày hoàn thành</span>
          <strong>
            {doneDays}/{TOTAL}
          </strong>
          <progress value={doneDays} max={TOTAL} />
        </div>
        <div className={styles.stat}>
          <span>Tự đánh giá trung bình</span>
          <strong>{avg}</strong>
          <small>thang 1–5</small>
        </div>
        <div className={styles.stat}>
          <span>Bài kiểm tra đạt</span>
          <strong>
            {passed}/{tests.length}
          </strong>
          <small>ngưỡng ≥ 80%</small>
        </div>
      </div>

      {(todayDay || nextDay) && (
        <div className={clsx('alert alert--info', styles.today)}>
          {todayDay && (
            <>
              Hôm nay là <b>Ngày {todayDay.day}</b> theo lịch:{' '}
              <Link to={`/docs/lo-trinh/${weekSlug(todayDay.week)}#ngay-${todayDay.day}`}>{todayDay.topic}</Link>.{' '}
            </>
          )}
          {nextDay && (
            <>
              Ngày tiếp theo chưa hoàn thành:{' '}
              <Link to={`/docs/lo-trinh/${weekSlug(nextDay.week)}#ngay-${nextDay.day}`}>
                Ngày {nextDay.day} – {nextDay.topic}
              </Link>
            </>
          )}
        </div>
      )}

      <div className={styles.grid} aria-label="Lịch 30 ngày">
        {roadmap.map((d) => {
          const s = p.days[d.day];
          return (
            <Link
              key={d.day}
              to={`/docs/lo-trinh/${weekSlug(d.week)}#ngay-${d.day}`}
              title={`Ngày ${d.day}: ${d.topic}`}
              className={clsx(styles.cell, d.isTest && styles.test, s?.done && styles.cellDone, todayDay?.day === d.day && styles.now)}>
              {d.day}
            </Link>
          );
        })}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Bài kiểm tra</th>
            <th>Làm vào</th>
            <th>Số câu</th>
            <th>Điểm cao nhất</th>
            <th>Lần gần nhất</th>
            <th>Kết quả</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => {
            const s = p.tests[t.id];
            const ok = s && s.best / s.total >= PASS_RATE;
            return (
              <tr key={t.id}>
                <td>
                  <Link to={`/docs/bai-kiem-tra/${t.id}`}>{t.name}</Link>
                </td>
                <td>Ngày {t.day}</td>
                <td>{t.questions.length}</td>
                <td>{s ? `${s.best}/${s.total} (${Math.round((s.best / s.total) * 100)}%)` : '–'}</td>
                <td>{s ? `${s.last}/${s.total} · ${s.date}` : '–'}</td>
                <td>{!s ? 'Chưa làm' : ok ? <b className={styles.ok}>ĐẠT ✔</b> : <b className={styles.bad}>CHƯA ĐẠT</b>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className={styles.conclusion}>
        <b>Kết luận:</b> {conclusion}
      </p>
      <p className={styles.note}>
        Tiến độ được lưu trong trình duyệt trên máy này.{' '}
        <button
          type="button"
          className={styles.link}
          onClick={() => window.confirm('Xoá toàn bộ tiến độ và điểm số?') && update(() => ({days: {}, tests: {}, skills: {}}))}>
          Xoá tiến độ
        </button>
      </p>
    </div>
  );
}
