import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

/**
 * Install command block. Renders the default command passed as children, unless the
 * deployment sets a full replacement command in window.__RUNTIME_CONFIG__[envKey]
 * (static/config.js locally; generated from container env vars in Docker — see
 * docker/entrypoint.sh).
 *
 * Usage in MDX:
 *   <InstallCommand envKey="INSTALL_CMD_RPM_AGENT" language="bash">{`default command`}</InstallCommand>
 */
export default function InstallCommand({ envKey, language = 'bash', title, children }) {
  const [override, setOverride] = useState('');

  useEffect(() => {
    const value = window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__[envKey];
    if (typeof value === 'string' && value.trim()) setOverride(value.trim());
  }, [envKey]);

  return (
    <CodeBlock language={language} title={title}>
      {override || String(children).trim()}
    </CodeBlock>
  );
}
