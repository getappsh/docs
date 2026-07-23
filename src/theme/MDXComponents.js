import MDXComponents from '@theme-original/MDXComponents';
import DecisionTree from '@site/src/components/DecisionTree';

export default {
  ...MDXComponents,
  // Makes <DecisionTree id="..." /> available in every .mdx file without an import.
  DecisionTree,
};
