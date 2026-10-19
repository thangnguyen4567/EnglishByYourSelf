import React, {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import {loadNotes, saveNote} from '@site/src/lib/store';
import styles from './styles.module.css';

/**
 * Ô ghi lại bài nói của người học ở cuối mỗi chủ đề luyện nói.
 * Bản nháp tự lưu (speaking-draft:<id>); bấm "Lưu bài nói" để thêm vào lịch sử (speaking:<id>, mảng JSON).
 * Cả hai lưu trên MongoDB qua API ghi chú (src/lib/store.ts).
 */
type Entry = {at: string; question: string; text: string};

const draftKey = (id: string) => `speaking-draft:${id}`;
const logKey = (id: string) => `speaking:${id}`;

function parse(raw: string | undefined): Entry[] {
  try {
    const v = JSON.parse(raw ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const words = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

function when(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
}

export default function SpeakingLog({topicId}: {topicId: string}): ReactNode {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    void loadNotes().then((n) => {
      if (!alive) return;
      let draft: Partial<Entry> | undefined;
      try {
        draft = JSON.parse(n[draftKey(topicId)] ?? 'null') ?? undefined;
      } catch {
        draft = undefined;
      }
      setQuestion((cur) => cur || draft?.question || '');
      setText((cur) => cur || draft?.text || '');
      setEntries(parse(n[logKey(topicId)]));
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [topicId]);

  const saveDraft = (q: string, t: string) => {
    setSaved(false);
    saveNote(draftKey(topicId), q || t ? JSON.stringify({question: q, text: t}) : '');
  };

  const writeLog = (list: Entry[]) => {
    setEntries(list);
    saveNote(logKey(topicId), list.length ? JSON.stringify(list) : '');
  };

  const submit = () => {
    if (!text.trim()) return;
    writeLog([{at: new Date().toISOString(), question: question.trim(), text: text.trim()}, ...entries]);
    setQuestion('');
    setText('');
    saveDraft('', '');
    setSaved(true);
  };

  const remove = (i: number) => {
    if (!window.confirm('Xóa bài nói này?')) return;
    writeLog(entries.filter((_, j) => j !== i));
  };

  const edit = (i: number) => {
    const e = entries[i];
    setQuestion(e.question);
    setText(e.text);
    saveDraft(e.question, e.text);
    writeLog(entries.filter((_, j) => j !== i));
  };

  return (
    <section className={styles.box}>
      <div className={styles.head}>
        <span className={styles.badge}>🎙 Bài nói của tôi</span>
        <span className={styles.sub}>Nói xong, gõ lại (hoặc dán bản ghi) câu trả lời của bạn để lưu và so sánh tiến bộ.</span>
      </div>
      <input
        className={styles.question}
        placeholder="Câu hỏi đã trả lời (không bắt buộc), vd. Part 1 – Can you tell me a little about yourself?"
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          saveDraft(e.target.value, text);
        }}
      />
      <textarea
        className={styles.text}
        rows={6}
        placeholder={loaded ? 'Gõ bài nói của bạn bằng tiếng Anh…' : 'Đang tải…'}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          saveDraft(question, e.target.value);
        }}
      />
      <div className={styles.foot}>
        <span className={styles.count}>
          {words(text)} từ{text && ' · bản nháp tự lưu'}
        </span>
        {saved && <span className={styles.ok}>✔ Đã lưu</span>}
        <button type="button" className="button button--primary button--sm" disabled={!text.trim()} onClick={submit}>
          💾 Lưu bài nói
        </button>
      </div>

      {entries.length > 0 && (
        <div className={styles.history}>
          <div className={styles.histHead}>Đã lưu {entries.length} bài</div>
          {entries.map((e, i) => (
            <details key={e.at} className={styles.entry} open={i === 0}>
              <summary>
                <span className={styles.date}>{when(e.at)}</span>
                <span className={styles.q}>{e.question || 'Bài nói'}</span>
                <span className={styles.wc}>{words(e.text)} từ</span>
              </summary>
              <p className={styles.body}>{e.text}</p>
              <div className={styles.actions}>
                <button type="button" className="button button--link button--sm" onClick={() => edit(i)}>
                  Sửa
                </button>
                <button type="button" className="button button--link button--sm" onClick={() => remove(i)}>
                  Xóa
                </button>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
