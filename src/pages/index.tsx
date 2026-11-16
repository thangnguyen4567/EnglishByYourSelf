import type {ReactNode} from 'react';
import {Redirect} from '@docusaurus/router';

// Trang mặc định khi mở link là lộ trình học.
export default function Home(): ReactNode {
  return <Redirect to="/docs/lo-trinh-2-thang" />;
}
