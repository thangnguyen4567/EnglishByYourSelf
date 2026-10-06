import React from 'react';
import type {ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * Từ vựng in đậm trong đoạn văn; rê chuột (hoặc chạm trên điện thoại) để xem nghĩa.
 *
 * <Vocab m="giảm thiểu (rủi ro)">mitigate</Vocab>
 */
export default function Vocab({m, children}: {m: string; children: ReactNode}): ReactNode {
  return (
    <strong className={styles.word} tabIndex={0} aria-label={`${String(children)}: ${m}`}>
      {children}
      {/* no-speak: SpeakText bỏ qua phần nghĩa khi đọc to */}
      <span className={`${styles.tip} no-speak`} role="tooltip">
        {m}
      </span>
    </strong>
  );
}
