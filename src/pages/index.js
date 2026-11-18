import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import Icon from '@site/src/components/Icon';
import ProductCard from '@site/src/components/ProductCard';
import { PRODUCTS } from '@site/src/data/products';

import styles from './index.module.css';

const LIFECYCLE = [
  {
    title: 'Catalog',
    desc: 'Authors upload binaries, YAML manifests, images, and container charts as versioned releases.',
    to: '/docs/root/user-docs/admin/catalog/catalog-overview',
  },
  {
    title: 'Discovery',
    desc: 'The platform orchestrator enumerates the devices that match.',
    to: '/docs/root/technician/agent/platform/platform-architecture',
  },
  {
    title: 'Offering',
    desc: 'Policies and restrictions decide what is offered; operators approve before anything ships.',
    to: '/docs/root/user-docs/admin/create-and-manage-rule/rules-overview',
  },
  {
    title: 'Delivery',
    desc: 'Resources ship resumable, retried, and verified — online, via a CDN agent, or on removable media.',
    to: '/docs/root/user-docs/admin/catalog/multiple-software-delivery',
  },
  {
    title: 'Deploy',
    desc: 'The agent verifies the signature and runs the release’s install.yaml with Orchestrator V2.',
    to: '/docs/root/user-docs/developer/deploy/v2/deploy-v2-overview',
  },
  {
    title: 'Monitor',
    desc: 'Telemetry, health, and alerting continue as an independent lifecycle after Deploy.',
    to: '/docs/root/technician/agent/observability/telemetry',
  },
];

const CONNECTIVITY = [
  {
    icon: 'wifi',
    title: 'Connected',
    desc: 'Agents detect the network on their own and sync offerings, configs, and status within seconds.',
    to: '/docs/root/technician/agent/fleet-connectivity/connectivity-scanner',
  },
  {
    icon: 'server',
    title: 'Proxy & CDN',
    desc: 'A local agent fronts the server for a site — caching artifacts and serving configuration nearby.',
    to: '/docs/root/technician/agent/fleet-connectivity/cdn-configure',
  },
  {
    icon: 'network',
    title: 'Agent-to-Agent',
    desc: 'A parent agent stands in for the server and actively manages a fleet of child agents.',
    to: '/docs/root/technician/agent/fleet-connectivity/a2a-parent-management',
  },
  {
    icon: 'usb',
    title: 'Air-gapped',
    desc: 'Releases travel on removable media into fully disconnected networks — same policies apply.',
    to: '/docs/root/technician/agent/deployment/disconnectedEnvioremnt',
  },
];

const ROLES = [
  {
    role: 'Developer',
    desc: 'Create projects, compose releases, and write install manifests.',
    to: '/docs/category/developer',
    cta: 'Developer guide',
  },
  {
    role: 'Admin',
    desc: 'Manage platforms, types, groups, rules, and the Catalog.',
    to: '/docs/category/admin',
    cta: 'Admin guide',
  },
  {
    role: 'End user',
    desc: 'Browse the Store and install apps on your own devices.',
    to: '/docs/category/space',
    cta: 'Space guide',
  },
  {
    role: 'Technician',
    desc: 'Install, configure, and connect agents and servers in the field.',
    to: '/docs/category/technician-manual',
    cta: 'Technician manual',
  },
];

const FEATURED = PRODUCTS.filter((p) => p.featured);

function DashboardShot() {
  return (
    <div className={styles.heroRight}>
      <div className={styles.mock}>
        <div className={styles.mockTop}>
          <span className={clsx(styles.dot, styles.dotRed)} />
          <span className={clsx(styles.dot, styles.dotYellow)} />
          <span className={clsx(styles.dot, styles.dotGreen)} />
          <span className={styles.mockTitle}>dashboard.getapp.sh</span>
        </div>
        <img src="/img/dashboard-login.png" alt="GetApp Platform sign-in screen" className={styles.mockImage} />
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="GetApp is a lifecycle and management platform for digital assets across heterogeneous, often air-gapped device fleets."
    >
      <header className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <div className={styles.kicker}>GetApp · Managed digital assets</div>

              <h1 className={styles.heroTitle}>
                Lifecycle and management for every <span className={styles.accent}>digital asset</span> on every platform.
              </h1>

              <p className={styles.heroSubtitle}>
                Catalog binaries, manifests, images, and charts; discover and target devices; deliver over any network — even
                disconnected ones — then deploy and keep watching. Built for heterogeneous, often air-gapped fleets.
              </p>

              <div className={styles.ctaRow}>
                <Link className={clsx('button button--primary button--lg', styles.ctaPrimary)} to="/docs/root/getting-started">
                  Get started
                </Link>
                <Link className={clsx('button button--secondary button--lg', styles.ctaSecondary)} to="/products">
                  Explore products
                </Link>
              </div>

              <div className={styles.heroMeta}>
                <span className={styles.metaPill}>Six-stage pipeline</span>
                <span className={styles.metaPill}>Reliable on any network</span>
                <span className={styles.metaPill}>Air-gapped ready</span>
                <span className={styles.metaPill}>Runtime monitoring</span>
              </div>
            </div>

            <DashboardShot />
          </div>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>The six-stage pipeline</h2>
              <p className={styles.sectionSubtitle}>
                Every release moves through the same lifecycle, from <b>Catalog</b> to <b>Monitor</b> — predictable even when
                devices are offline, mixed, or unreliable.
              </p>
            </div>

            <ol className={styles.lifecycle}>
              {LIFECYCLE.map((step, i) => (
                <li key={step.title}>
                  <Link to={step.to} className={styles.lifecycleStep}>
                    <span className={styles.stepNum}>{i + 1}</span>
                    <span className={styles.stepTitle}>{step.title}</span>
                    <span className={styles.stepDesc}>{step.desc}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className="container">
            <div className={styles.sectionHeadRow}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>The platform, in products</h2>
                <p className={styles.sectionSubtitle}>
                  Use the whole platform end to end, or start with the piece you need.
                </p>
              </div>
              <Link to="/products" className={styles.seeAll}>
                See all {PRODUCTS.length} products <Icon name="arrow" size={16} />
              </Link>
            </div>

            <div className={styles.productGrid}>
              {FEATURED.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Built for networks that drop out</h2>
              <p className={styles.sectionSubtitle}>
                Stationary or tactical, always-on or never-on — the same release reaches the device through whichever path exists.
              </p>
            </div>

            <div className={styles.connGrid}>
              {CONNECTIVITY.map((c) => (
                <Link key={c.title} to={c.to} className={styles.connCard}>
                  <span className={styles.connIcon}>
                    <Icon name={c.icon} />
                  </span>
                  <span className={styles.connTitle}>{c.title}</span>
                  <span className={styles.connDesc}>{c.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Find your path</h2>
              <p className={styles.sectionSubtitle}>The docs are organized by who you are and what you do in GetApp.</p>
            </div>

            <div className={styles.roleGrid}>
              {ROLES.map((r) => (
                <div key={r.role} className={styles.roleCard}>
                  <h3 className={styles.roleTitle}>{r.role}</h3>
                  <p className={styles.roleDesc}>{r.desc}</p>
                  <Link to={r.to} className={styles.roleLink}>
                    {r.cta} <Icon name="arrow" size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className="container">
            <div className={styles.finalInner}>
              <div>
                <h2 className={styles.finalTitle}>Ship your first release</h2>
                <p className={styles.finalSubtitle}>
                  Install the Agent on one device, see it connect to the server, and deliver a release to it.
                </p>
              </div>

              <div className={styles.ctaRow}>
                <Link className={clsx('button button--primary button--lg', styles.ctaPrimary)} to="/docs/root/getting-started">
                  Start now
                </Link>
                <Link className="button button--secondary button--lg" to="/docs/category/troubleshooting">
                  Troubleshooting
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
