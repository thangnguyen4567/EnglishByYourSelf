import MDXComponents from '@theme-original/MDXComponents';
import VocabList from '@site/src/components/VocabList';
import Vocab from '@site/src/components/Vocab';
import SpeakText from '@site/src/components/SpeakText';
import SkillMeta from '@site/src/components/SkillMeta';
import SkillRoadmap from '@site/src/components/SkillRoadmap';
import ReflexDrill from '@site/src/components/ReflexDrill';
import {Outline, Step} from '@site/src/components/Outline';

// Component dùng được trực tiếp trong mọi file .mdx mà không cần import.
export default {
  ...MDXComponents,
  VocabList,
  Vocab,
  SpeakText,
  SkillMeta,
  SkillRoadmap,
  ReflexDrill,
  Outline,
  Step,
};
