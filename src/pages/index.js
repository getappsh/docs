import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';

import styles from './index.module.css';

const FEATURES = [
  {
    title: 'One catalog, every artifact type',
    description:
      'Binaries, YAML manifests, images, and container charts all go through the same catalog — no bespoke pipeline per artifact type.',
    icon: '📦',
  },
  {
    title: 'Discovery, then approval',
    description:
      'The platform orchestrator enumerates matching devices, and operators approve the offering before anything ships.',
    icon: '🧭',
  },
  {
    title: 'Reliable on any network',
    description:
      'Delivery is built for unreliable and disconnected links, not just the happy path — resumable, retried, and verified.',
    icon: '🚀',
  },
  {
    title: 'Deploy, then keep watching',
    description:
      'Monitor is its own lifecycle: telemetry, health, and alerting continue independently once Deploy finishes.',
    icon: '📈',
  },
  {
    title: 'Built for heterogeneous fleets',
    description:
      'Devices don’t need to be identical or always online — GetApp is designed for mixed, often air-gapped environments.',
    icon: '🧩',
  },
  {
    title: 'Security by design',
    description:
      'Signing, integrity checks, and controlled distribution for sensitive, restricted environments.',
    icon: '🛡️',
  },
];

function FeatureCard({ title, description, icon }) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon} aria-hidden="true">
            {icon}
          </span>
          <h3 className={styles.cardTitle}>{title}</h3>
        </div>
        <p className={styles.cardDesc}>{description}</p>
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
            <div className={styles.heroLeft}>
              <div className={styles.kicker}>GetApp</div>

              <h1 className={styles.heroTitle}>
                Lifecycle and management for every <span className={styles.accent}>digital asset</span> on every
                platform.
              </h1>

              <p className={styles.heroSubtitle}>
                GetApp catalogs releases — binaries, YAML manifests, images, and container charts — discovers and
                targets devices, delivers artifacts reliably over any network (even unreliable or disconnected
                ones), deploys them, and monitors the result with runtime health and actions.
              </p>

              <p className={styles.heroSubtitle}>
                Built for environments where devices are heterogeneous and often air-gapped, so resilience,
                offline delivery, and controlled rollout matter more than raw speed.
              </p>

              <div className={styles.heroMeta}>
                <span className={styles.metaPill}>Six-stage pipeline</span>
                <span className={styles.metaPill}>Reliable on any network</span>
                <span className={styles.metaPill}>Air-gapped ready</span>
                <span className={styles.metaPill}>Runtime monitoring</span>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.mock}>
                <div className={styles.mockTop}>
                  <span className={clsx(styles.dot, styles.dotRed)} />
                  <span className={clsx(styles.dot, styles.dotYellow)} />
                  <span className={clsx(styles.dot, styles.dotGreen)} />
                  <span className={styles.mockTitle}>dashboard.getapp.sh</span>
                </div>
                <img
                  src="/img/dashboard-login.png"
                  alt="GetApp Platform sign-in screen"
                  className={styles.mockImage}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>What GetApp gives you</h2>
              <p className={styles.sectionSubtitle}>
                Every release moves through the same six stages — predictable even when devices are offline,
                mixed, or unreliable.
              </p>
            </div>

            <div className="row">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className="container">
            <div className={styles.twoCol}>
              <div>
                <h2 className={styles.sectionTitle}>The six-stage pipeline</h2>
                <p className={styles.sectionSubtitle}>
                  Every release moves through the same lifecycle, from <b>Catalog</b> to <b>Monitor</b> — with
                  approval and delivery guarantees built in along the way.
                </p>

                <div className={styles.steps}>
                  <div className={styles.step}>
                    <div className={styles.stepNum}>1</div>
                    <div>
                      <div className={styles.stepTitle}>Catalog</div>
                      <div className={styles.stepDesc}>
                        Author uploads binaries, YAML manifests, images, and container charts.
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNum}>2</div>
                    <div>
                      <div className={styles.stepTitle}>Discovery</div>
                      <div className={styles.stepDesc}>
                        Queries the platform orchestrator to enumerate matching devices.
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNum}>3</div>
                    <div>
                      <div className={styles.stepTitle}>Offering</div>
                      <div className={styles.stepDesc}>
                        Presents matches to operators for approval.
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNum}>4</div>
                    <div>
                      <div className={styles.stepTitle}>Delivery</div>
                      <div className={styles.stepDesc}>
                        Ships release resources to the platform orchestrator; Deploy waits until all resources arrive.
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNum}>5</div>
                    <div>
                      <div className={styles.stepTitle}>Deploy</div>
                      <div className={styles.stepDesc}>
                        Installs on devices — this is where Orchestrator V2 lives.
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNum}>6</div>
                    <div>
                      <div className={styles.stepTitle}>Monitor</div>
                      <div className={styles.stepDesc}>
                        Post-deploy telemetry, health, and alerting — an independent lifecycle that starts once
                        Deploy finishes.
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.ctaRow}>
                  <Link className={clsx('button button--primary', styles.ctaPrimary)} to="/docs/root/getting-started">
                    Getting started
                  </Link>
                </div>
              </div>

              <div className={styles.callout}>
                <h3 className={styles.calloutTitle}>Perfect for:</h3>
                <ul className={styles.calloutList}>
                  <li>Edge gateways and on-prem appliances</li>
                  <li>Air-gapped / restricted networks</li>
                  <li>Multi-site enterprise deployments</li>
                  <li>Secure distribution of maps & certificates</li>
                  <li>Teams replacing fragile scripts and manual installs</li>
                </ul>

                <div className={styles.calloutFooter}>
                  <div className={styles.calloutPill}>Policy rollouts</div>
                  <div className={styles.calloutPill}>Chunked downloads</div>
                  <div className={styles.calloutPill}>Integrity checks</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className="container">
            <div className={styles.finalInner}>
              <div>
                <h2 className={styles.finalTitle}>Ready to ship your first release?</h2>
                <p className={styles.finalSubtitle}>
                  Start with the docs, wire up your first project, and deploy to a small device group in minutes.
                </p>
              </div>

              <div className={styles.ctaRow}>
                <Link className={clsx('button button--primary button--lg', styles.ctaPrimary)} to="/docs/root/getting-started">
                  Start now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
