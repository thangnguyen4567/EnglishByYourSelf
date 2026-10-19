import React from 'react';
import type {ReactNode} from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';
import {useActivePlugin, useDoc} from '@docusaurus/plugin-content-docs/client';
import LessonDone from '@site/src/components/LessonDone';
import SpeakingLog from '@site/src/components/SpeakingLog';
import {classify, speakingId} from '@site/src/lib/completion';

type Props = WrapperProps<typeof FooterType>;

/**
 * Cuối mọi trang bài học (ngữ pháp, luyện nói, phản xạ, kiểm tra): nút "Đánh dấu hoàn thành".
 * Trang chủ đề luyện nói có thêm ô "Bài nói của tôi" để lưu bài nói.
 */
export default function FooterWrapper(props: Props): ReactNode {
  const {metadata} = useDoc();
  const pluginId = useActivePlugin()?.pluginId ?? 'default';
  const section = classify(pluginId, metadata.id);
  const topicId = section === 'speaking' ? speakingId(metadata.permalink) : undefined;
  return (
    <>
      {topicId && <SpeakingLog topicId={topicId} />}
      {section && <LessonDone lesson={{pluginId, docId: metadata.id, path: metadata.permalink, section}} />}
      <Footer {...props} />
    </>
  );
}
