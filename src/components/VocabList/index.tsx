import React, {useEffect, useRef} from 'react';
import type {ReactNode} from 'react';
import {canSpeak, speak} from '@site/src/lib/speech';
import styles from './styles.module.css';

/**
 * Bọc một bảng từ vựng markdown: thêm nút 🔊 vào ô đầu mỗi hàng để nghe phát âm.
 *
 * <VocabList>
 *
 * | Từ / cụm từ | Phiên âm | Nghĩa | Ví dụ |
 * |---|---|---|---|
 * | hometown | /ˈhəʊmtaʊn/ | quê nhà | My hometown is Hue. |
 *
 * </VocabList>
 */
export default function VocabList({children}: {children: ReactNode}): ReactNode {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !canSpeak()) return;
    const added: HTMLButtonElement[] = [];
    root.querySelectorAll('tbody tr').forEach((tr) => {
      const cells = tr.querySelectorAll('td');
      const first = cells[0];
      if (!first || first.querySelector(`.${styles.btn}`)) return;
      const word = first.textContent?.trim() ?? '';
      const last = cells[cells.length - 1];
      const example = cells.length >= 4 ? last.textContent?.trim() ?? '' : '';
      const make = (text: string, title: string, cell: HTMLElement) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = styles.btn;
        b.textContent = '🔊';
        b.title = title;
        b.setAttribute('aria-label', title);
        b.onclick = () => speak(text, {rate: 0.9});
        cell.prepend(b);
        added.push(b);
      };
      make(word, `Nghe: ${word}`, first);
      if (example) make(example, 'Nghe câu ví dụ', last);
    });
    return () => added.forEach((b) => b.remove());
  }, []);

  return (
    <div ref={ref} className={styles.wrap}>
      {children}
    </div>
  );
}
