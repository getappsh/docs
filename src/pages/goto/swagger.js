import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

export default function GotoSwagger() {
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const base = window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.SERVER_API_URL;
    if (base) {
      window.location.replace(base.replace(/\/$/, '') + '/docs');
    } else {
      setMissing(true);
    }
  }, []);

  return (
    <Layout title="Swagger">
      <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p>{missing ? 'Server API URL is not configured for this deployment.' : 'Redirecting to the Server Swagger UI…'}</p>
      </main>
    </Layout>
  );
}
