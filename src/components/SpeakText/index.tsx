import React, {useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {canSpeak, speak, stopSpeaking} from '@site/src/lib/speech';
import styles from './styles.module.css';

/**
 * Khung bài nói / bài viết mẫu có nút nghe. Đọc toàn bộ chữ bên trong,
 * bỏ qua khối <details> (bản dịch) và phần tử có class "no-speak".
 */
export default function SpeakText({title, children}: {title?: string; children: ReactNode}): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(canSpeak());
    return () => stopSpeaking();
  }, []);

  const text = () => {
    const clone = ref.current?.cloneNode(true) as HTMLElement | undefined;
    if (!clone) return '';
    clone.querySelectorAll('details, .no-speak').forEach((el) => el.remove());
    return clone.innerText || clone.textContent || '';
  };

  const toggle = () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    speak(text(), {rate, onEnd: () => setPlaying(false)});
  };

  return (
    <div className={styles.box}>
      <div className={styles.bar}>
        <span className={styles.title}>{title ?? 'Bài mẫu'}</span>
        {supported && (
          <>
            <select
              aria-label="Tốc độ đọc"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className={styles.rate}>
              <option value={0.7}>Chậm</option>
              <option value={0.9}>Vừa</option>
              <option value={1.05}>Tự nhiên</option>
            </select>
            <button type="button" className="button button--sm button--primary" onClick={toggle}>
              {playing ? '⏹ Dừng' : '🔊 Nghe'}
            </button>
          </>
        )}
      </div>
      <div ref={ref} className={styles.body}>
        {children}
      </div>
    </div>
  );
}
