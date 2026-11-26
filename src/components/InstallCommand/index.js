import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * Install command block. Shows, in order of precedence:
 *   1. window.__RUNTIME_CONFIG__[envKey] — set at container start in Docker
 *      (docker/entrypoint.sh) or in static/config.js locally;
 *   2. process.env[envKey] at build/start time — from .env or the shell
 *      (exposed via customFields.installCommands in docusaurus.config.js);
 *   3. the default command passed as children.
 *
 * Usage in MDX:
 *   <InstallCommand envKey="INSTALL_CMD_RPM_AGENT" language="bash">{`default command`}</InstallCommand>
 */
export default function InstallCommand({ envKey, language = 'bash', title, children }) {
  const { siteConfig } = useDocusaurusContext();
  const buildValue = clean(siteConfig.customFields?.installCommands?.[envKey]);
  const [runtimeValue, setRuntimeValue] = useState('');

  useEffect(() => {
    setRuntimeValue(clean(window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__[envKey]));
  }, [envKey]);

  return (
    <CodeBlock language={language} title={title}>
      {runtimeValue || buildValue || String(children).trim()}
    </CodeBlock>
  );
}
