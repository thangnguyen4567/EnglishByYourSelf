import React from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@theme-original/DocSidebarItem/Link';
import type LinkType from '@theme/DocSidebarItem/Link';
import type {WrapperProps} from '@docusaurus/types';
import {useActivePlugin} from '@docusaurus/plugin-content-docs/client';
import {useProgress} from '@site/src/lib/progress';
import {classify, isDone} from '@site/src/lib/completion';

type Props = WrapperProps<typeof LinkType>;

/** Thêm dấu ✔ cạnh bài đã hoàn thành trên thanh bên. */
export default function LinkWrapper(props: Props): ReactNode {
  const [progress] = useProgress();
  const pluginId = useActivePlugin()?.pluginId ?? 'default';
  const {item} = props;
  const docId = item.docId;
  const done = !!docId && !!classify(pluginId, docId) && isDone(progress, {pluginId, docId, path: item.href});
  return <Link {...props} item={done ? {...item, className: clsx(item.className, 'sidebar-done')} : item} />;
}
