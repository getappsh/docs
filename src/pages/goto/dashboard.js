import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

export default function GotoDashboard() {
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const url = window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.DASHBOARD_URL;
    if (url) {
      window.location.replace(url);
    } else {
      setMissing(true);
    }
  }, []);

  return (
    <Layout title="Dashboard">
      <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p>{missing ? 'Dashboard URL is not configured for this deployment.' : 'Redirecting to the GetApp Dashboard…'}</p>
      </main>
    </Layout>
  );
}
