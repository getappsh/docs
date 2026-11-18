import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import Icon from '@site/src/components/Icon';
import ProductCard from '@site/src/components/ProductCard';
import { AUDIENCES, CATEGORIES, PRODUCTS } from '@site/src/data/products';

import styles from './products.module.css';

const AUDIENCE_FILTERS = [{ id: 'all', label: 'Everyone' }, ...Object.entries(AUDIENCES).map(([id, label]) => ({ id, label }))];

function matches(product, query) {
  if (!query) return true;
  const haystack = [product.name, product.tagline, product.description, ...product.capabilities].join(' ').toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

export default function Products() {
  const [category, setCategory] = useState('all');
  const [audience, setAudience] = useState('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (category === 'all' || p.category === category) &&
          (audience === 'all' || p.audience.includes(audience)) &&
          matches(p, query.trim()),
      ),
    [category, audience, query],
  );

  const reset = () => {
    setCategory('all');
    setAudience('all');
    setQuery('');
  };

  return (
    <Layout
      title="Products"
      description="The GetApp catalog of products and solutions — from the on-device agent to rules, configuration, edge delivery, and supply-chain security."
    >
      <header className={styles.hero}>
        <div className="container">
          <div className={styles.kicker}>Product catalog</div>
          <h1 className={styles.title}>Everything GetApp ships</h1>
          <p className={styles.subtitle}>
            {PRODUCTS.length} building blocks for managing digital assets across networks and devices — pick the ones you need, or run
            the whole platform end to end.
          </p>
        </div>
      </header>

      <main className="container">
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Icon name="search" size={18} className={styles.searchIcon} />
            <input
              type="search"
              className={styles.search}
              placeholder="Search products and capabilities…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </div>

          <div className={styles.filterRow} role="group" aria-label="Filter by area">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={clsx(styles.chip, category === c.id && styles.chipActive)}
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
                <span className={styles.chipCount}>
                  {c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.audienceRow}>
            <label htmlFor="audience" className={styles.audienceLabel}>
              Built for
            </label>
            <select id="audience" className={styles.select} value={audience} onChange={(e) => setAudience(e.target.value)}>
              {AUDIENCE_FILTERS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
            <span className={styles.resultCount}>
              Showing {visible.length} of {PRODUCTS.length}
            </span>
          </div>
        </div>

        {visible.length > 0 ? (
          <div className={styles.grid}>
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No products match those filters.</p>
            <button type="button" className="button button--secondary button--sm" onClick={reset}>
              Clear filters
            </button>
          </div>
        )}

        <section className={styles.bottomCta}>
          <div>
            <h2>Not sure where to start?</h2>
            <p>Install the Agent on one device, connect it to a server, and deliver your first release.</p>
          </div>
          <div className={styles.ctaRow}>
            <Link className="button button--primary" to="/docs/root/getting-started">
              Getting started
            </Link>
            <Link className="button button--secondary" to="/docs/category/user-docs">
              User docs
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
