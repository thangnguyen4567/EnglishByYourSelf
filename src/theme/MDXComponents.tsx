import MDXComponents from '@theme-original/MDXComponents';
import VocabList from '@site/src/components/VocabList';
import SpeakText from '@site/src/components/SpeakText';
import SkillMeta from '@site/src/components/SkillMeta';
import SkillRoadmap from '@site/src/components/SkillRoadmap';

// Component dùng được trực tiếp trong mọi file .mdx mà không cần import.
export default {
  ...MDXComponents,
  VocabList,
  SpeakText,
  SkillMeta,
  SkillRoadmap,
};
