import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Dàn ý nói theo 3 cấp mở rộng. Dùng trong .mdx:
 *
 * <Outline id="noi-01-p2" title="Describe yourself…">
 *   <Step label="Mở bài" ask="Bạn là ai?" keys="Minh · 26 · Hai Phong" frame="Hi, I'm … I'm from …" more="Vì sao chuyển lên Hà Nội?" />
 * </Outline>
 *
 * Ý riêng của người học lưu trong localStorage theo `id` + thứ tự bước.
 */

type Level = 1 | 2 | 3;

const LEVELS: {no: Level; name: string; guide: string; seconds: number}[] = [
  {no: 1, name: 'Dàn ý', guide: 'Ghi 2–4 từ khóa cho mỗi ý. Nói mỗi ý đúng 1 câu.', seconds: 30},
  {no: 2, name: 'Câu khung', guide: 'Dùng câu khung, mỗi ý nói 2 câu: ý chính + 1 chi tiết.', seconds: 60},
  {no: 3, name: 'Mở rộng', guide: 'Thêm lý do, ví dụ, cảm xúc – mỗi ý 3–4 câu. Nối các ý bằng từ nối.', seconds: 120},
];

const Ctx = createContext<{id: string; level: Level}>({id: '', level: 1});

const storeKey = (id: string, i: number) => `outline:${id}:${i}`;

function load(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}

function save(key: string, value: string) {
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    // storage bị chặn: ghi chú chỉ tồn tại trong phiên này
  }
}

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Đồng hồ đếm ngược: chuẩn bị 1 phút, sau đó nói theo thời lượng của cấp đang chọn. */
function Timer({speakSeconds}: {speakSeconds: number}) {
  const [phase, setPhase] = useState<'idle' | 'prep' | 'speak' | 'done'>('idle');
  const [left, setLeft] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);

  const run = (p: 'prep' | 'speak', secs: number) => {
    clearInterval(timer.current);
    setPhase(p);
    setLeft(secs);
    timer.current = setInterval(() => {
      setLeft((x) => {
        if (x > 1) return x - 1;
        clearInterval(timer.current);
        if (p === 'prep') setTimeout(() => run('speak', speakSeconds), 0);
        else setPhase('done');
        return 0;
      });
    }, 1000);
  };

  const stop = () => {
    clearInterval(timer.current);
    setPhase('idle');
  };

  return (
    <div className={styles.timer}>
      {phase === 'idle' && (
        <>
          <button type="button" className="button button--sm button--secondary" onClick={() => run('prep', 60)}>
            ⏱ Chuẩn bị 1' rồi nói
          </button>
          <button type="button" className="button button--sm button--secondary" onClick={() => run('speak', speakSeconds)}>
            🎙 Nói ngay ({fmt(speakSeconds)})
          </button>
        </>
      )}
      {(phase === 'prep' || phase === 'speak') && (
        <>
          <span className={clsx(styles.clock, phase === 'speak' && styles.speaking)}>
            {phase === 'prep' ? 'Chuẩn bị' : 'Đang nói'} · {fmt(left)}
          </span>
          <button type="button" className="button button--sm button--link" onClick={stop}>
            Dừng
          </button>
        </>
      )}
      {phase === 'done' && (
        <>
          <span className={styles.clock}>✔ Hết giờ – nghe lại bản ghi âm và nói lại lần 2</span>
          <button type="button" className="button button--sm button--link" onClick={stop}>
            Làm lại
          </button>
        </>
      )}
    </div>
  );
}

export function Outline({id, title, children}: {id: string; title?: string; children: ReactNode}): ReactNode {
  const [level, setLevel] = useState<Level>(1);
  const current = LEVELS[level - 1];
  let i = 0;
  const steps = React.Children.map(children, (child) =>
    React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{index?: number}>, {index: ++i}) : null,
  );

  const clearNotes = () => {
    if (!window.confirm('Xóa toàn bộ ý bạn đã ghi trong dàn ý này?')) return;
    for (let n = 1; n <= i; n++) save(storeKey(id, n), '');
    window.dispatchEvent(new CustomEvent('outline-clear', {detail: id}));
  };

  return (
    <Ctx.Provider value={{id, level}}>
      <div className={styles.box}>
        <div className={styles.head}>
          <span className={styles.badge}>🧭 Dàn ý</span>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.levels} role="tablist" aria-label="Cấp mở rộng">
          {LEVELS.map((l) => (
            <button
              key={l.no}
              type="button"
              role="tab"
              aria-selected={level === l.no}
              className={clsx(styles.level, level === l.no && styles.active)}
              onClick={() => setLevel(l.no)}>
              Cấp {l.no} · {l.name}
            </button>
          ))}
        </div>
        <p className={styles.guide}>
          <b>Cấp {level}:</b> {current.guide} Mục tiêu khoảng <b>{fmt(current.seconds)}</b>.
        </p>
        <ol className={styles.steps}>{steps}</ol>
        <div className={styles.foot}>
          <Timer key={level} speakSeconds={current.seconds} />
          <button type="button" className={clsx('button button--sm button--link', styles.clear)} onClick={clearNotes}>
            Xóa ý của tôi
          </button>
        </div>
      </div>
    </Ctx.Provider>
  );
}

export function Step({
  label,
  ask,
  keys,
  frame,
  more,
  index = 0,
}: {
  label: string;
  ask?: string;
  keys?: string;
  frame?: string;
  more?: string;
  index?: number;
}): ReactNode {
  const {id, level} = useContext(Ctx);
  const key = storeKey(id, index);
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(load(key));
    const onClear = (e: Event) => {
      if ((e as CustomEvent).detail === id) setNote('');
    };
    window.addEventListener('outline-clear', onClear);
    return () => window.removeEventListener('outline-clear', onClear);
  }, [key, id]);

  return (
    <li className={styles.step}>
      <div className={styles.label}>{label}</div>
      {ask && <div className={styles.ask}>{ask}</div>}
      {keys && (
        <div className={styles.keys}>
          <span className={styles.tag}>Ví dụ</span> {keys}
        </div>
      )}
      {level >= 2 && frame && (
        <div className={styles.frame}>
          <span className={styles.tag}>Câu khung</span> <i>{frame}</i>
        </div>
      )}
      {level >= 3 && more && (
        <div className={styles.more}>
          <span className={styles.tag}>Mở rộng</span> {more}
        </div>
      )}
      <textarea
        className={styles.note}
        rows={level === 1 ? 1 : 2}
        placeholder={level === 1 ? 'Từ khóa của tôi…' : 'Ý của tôi (tiếng Anh, viết tắt cũng được)…'}
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          save(key, e.target.value);
        }}
      />
    </li>
  );
}

export default Outline;
