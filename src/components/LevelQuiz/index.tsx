import React from 'react';
import type {ReactNode} from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Quiz, {type Question} from '@site/src/components/Quiz';
import {useProgress} from '@site/src/lib/progress';
import styles from './styles.module.css';

type Level = 'easy' | 'normal' | 'hard';
type Props = {topic: string; data: Record<Level, Question[]>};

const LEVELS: {key: Level; label: string; icon: string; hint: string}[] = [
  {key: 'easy', label: 'Dễ', icon: '🟢', hint: 'Nhận biết công thức và dấu hiệu cơ bản.'},
  {key: 'normal', label: 'Trung bình', icon: '🟡', hint: 'Phủ định, câu hỏi, phân biệt các dạng dễ nhầm, ngữ cảnh.'},
  {key: 'hard', label: 'Khó', icon: '🔴', hint: 'Ngoại lệ, tìm lỗi sai, chọn câu đồng nghĩa – dạng đề thi.'},
];

/** Bài kiểm tra 3 cấp độ của một chủ đề; điểm cao nhất từng cấp hiện trên tab. */
export default function LevelQuiz({topic, data}: Props): ReactNode {
  const [progress] = useProgress();
  const id = (level: Level) => `${topic}-${level}`;

  return (
    <Tabs groupId={`level-quiz-${topic}`} queryString={false} className={styles.tabs}>
      {LEVELS.filter((l) => data[l.key]?.length).map((l) => {
        const best = progress.tests[id(l.key)];
        const label = best ? `${l.icon} ${l.label} · ${best.best}/${best.total}` : `${l.icon} ${l.label}`;
        return (
          <TabItem key={l.key} value={l.key} label={label} default={l.key === 'easy'}>
            <p className={styles.hint}>
              <b>{data[l.key].length} câu</b> · {l.hint} Làm hết rồi bấm <b>Nộp bài</b>; mục tiêu ≥ 80%.
            </p>
            <Quiz mode="exam" questions={data[l.key]} storageId={id(l.key)} hideReview />
          </TabItem>
        );
      })}
    </Tabs>
  );
}
