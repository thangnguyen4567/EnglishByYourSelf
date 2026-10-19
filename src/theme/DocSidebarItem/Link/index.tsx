import React from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@theme-original/DocSidebarItem/Link';
import type LinkType from '@theme/DocSidebarItem/Link';
import type {WrapperProps} from '@docusaurus/types';
import {useActivePlugin} from '@docusaurus/plugin-content-docs/client';
import {useProgress} from '@site/src/lib/progress';
import {classify, credit, isDone} from '@site/src/lib/completion';

type Props = WrapperProps<typeof LinkType>;

/** Thêm dấu ✔ cạnh bài đã hoàn thành trên thanh bên; ◐ cho bài ngữ pháp mới xong một phần các mức. */
export default function LinkWrapper(props: Props): ReactNode {
  const [progress] = useProgress();
  const pluginId = useActivePlugin()?.pluginId ?? 'default';
  const {item} = props;
  const docId = item.docId;
  const ref = docId && classify(pluginId, docId) ? {pluginId, docId, path: item.href} : null;
  const state = !ref ? null : isDone(progress, ref) ? 'sidebar-done' : credit(progress, ref) > 0 ? 'sidebar-partial' : null;
  return <Link {...props} item={state ? {...item, className: clsx(item.className, state)} : item} />;
}
