import React, { useEffect, useState } from 'react';

/**
 * "Open in Swagger" button. Reads the base URL from window.__RUNTIME_CONFIG__.SERVER_API_URL
 * (see docker/entrypoint.sh) rather than a build-time value, so the same built image can point
 * at a different server per deployment. Renders nothing until that's available client-side, to
 * avoid a server/client render mismatch.
 */
export default function SwaggerLink({ path, label = 'Open in Swagger ↗' }) {
  const [href, setHref] = useState(null);

  useEffect(() => {
    const base = window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.SERVER_API_URL;
    if (base) {
      setHref(base.replace(/\/$/, '') + path);
    }
  }, [path]);

  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="button button--outline button--primary"
      style={{ marginBottom: '1rem' }}
    >
      {label}
    </a>
  );
}
