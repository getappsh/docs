import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';

import styles from './index.module.css';

const FEATURES = [
  {
    title: 'Ship to edge reliably',
    description:
      'Deploy apps, configs, maps, and certificates to distributed devices — even behind slow links or offline proxies.',
    icon: '📦',
  },
  {
    title: 'Releases, not ad-hoc scripts',
    description:
      'Define releases with metadata, versioning, and rollout strategy. Know exactly what is installed, where, and why.',
    icon: '🚀',
  },
  {
    title: 'Device groups & policies',
    description:
      'Target fleets by site, role, or environment. Apply policies, staged rollouts, and safe defaults across groups.',
    icon: '🧭',
  },
  {
    title: 'Observability built-in',
    description:
      'Track install progress, failures, retries, and health signals. Reduce time-to-fix with clear, actionable status.',
    icon: '📈',
  },
  {
    title: 'Works with your stack',
    description:
      'S3/MinIO, OCI registries, signed artifacts, Kubernetes, air-gapped flows. Integrate without rewriting everything.',
    icon: '🧩',
  },
  {
    title: 'Security by design',
    description:
      'Support signing, integrity checks, access boundaries, and controlled distribution for sensitive environments.',
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
      description="GetApp is an artifact & release delivery platform for distributed and air-gapped environments."
    >
      <header className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroLeft}>
              <div className={styles.kicker}>GetApp</div>

              <h1 className={styles.heroTitle}>
                Deploy artifacts to <span className={styles.accent}>distributed devices</span> — safely.
              </h1>

              <p className={styles.heroSubtitle}>
                A release & delivery platform for edge fleets: apps, configs, maps, certificates and data —
                with visibility, retries, and policy-based rollouts.
              </p>

              <div className={styles.heroMeta}>
                <span className={styles.metaPill}>Air-gapped ready</span>
                <span className={styles.metaPill}>MinIO / S3</span>
                <span className={styles.metaPill}>OCI registry</span>
                <span className={styles.metaPill}>Signed artifacts</span>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.mock}>
                <div className={styles.mockTop}>
                  <div className={styles.mockTitle}>GetApp Console</div>
                </div>

                <div className={styles.mockBody}>
                  <div className={styles.mockRow}>
                    <div className={styles.mockLabel}>Release</div>
                    <div className={styles.mockValue}>v1.7.3 • “stable-rollout”</div>
                  </div>
                  <div className={styles.mockRow}>
                    <div className={styles.mockLabel}>Target</div>
                    <div className={styles.mockValue}>North / Site-A / Gateways</div>
                  </div>

                  <div className={styles.progress}>
                    <div className={styles.progressHeader}>
                      <div className={styles.progressTitle}>Deployment progress</div>
                      <div className={styles.progressPct}>78%</div>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} />
                    </div>
                    <div className={styles.progressStats}>
                      <span>✅ 39 ok</span>
                      <span>⏳ 9 installing</span>
                      <span>⚠️ 2 retry</span>
                    </div>
                  </div>

                  <div className={styles.logs}>
                    <div className={styles.logsTitle}>Latest events</div>
                    <ul className={styles.logsList}>
                      <li>Device GW-12 pulled chunk 6/12</li>
                      <li>Device GW-07 verified signature</li>
                      <li>Device GW-19 switched to new manifest</li>
                      <li>Policy “staged-rollout” advanced to 80%</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.sideNote}>
                Tip: replace this mock later with a real screenshot or a short GIF of the dashboard.
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
                Build a predictable release process for fleets, with the reliability you usually only get in cloud-native environments.
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
                <h2 className={styles.sectionTitle}>A simple mental model</h2>
                <p className={styles.sectionSubtitle}>
                  <b>Projects</b> contain <b>Releases</b>. Releases include artifacts + metadata. Devices subscribe via <b>Groups</b> and pull
                  chunks safely with retries.
                </p>

                <div className={styles.steps}>
                  <div className={styles.step}>
                    <div className={styles.stepNum}>1</div>
                    <div>
                      <div className={styles.stepTitle}>Publish</div>
                      <div className={styles.stepDesc}>
                        Upload artifacts (S3/MinIO/OCI), attach release metadata and manifest.
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNum}>2</div>
                    <div>
                      <div className={styles.stepTitle}>Target</div>
                      <div className={styles.stepDesc}>
                        Select device groups, rollout policy, and safety constraints.
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNum}>3</div>
                    <div>
                      <div className={styles.stepTitle}>Observe</div>
                      <div className={styles.stepDesc}>
                        Track progress, failures, retries, and compliance from one place.
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
