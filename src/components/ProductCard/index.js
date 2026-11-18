import React from 'react';
import Link from '@docusaurus/Link';
import Icon from '@site/src/components/Icon';
import { AUDIENCES, CATEGORIES } from '@site/src/data/products';
import styles from './styles.module.css';

const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

export default function ProductCard({ product, compact = false }) {
  const { id, name, icon, category, tagline, description, capabilities, audience, docs } = product;

  return (
    <article className={styles.card} id={id}>
      <div className={styles.head}>
        <span className={styles.icon}>
          <Icon name={icon} />
        </span>
        <span className={styles.category}>{categoryLabel(category)}</span>
      </div>

      <h3 className={styles.name}>{name}</h3>
      <p className={styles.tagline}>{tagline}</p>

      {!compact && (
        <>
          <p className={styles.description}>{description}</p>
          <ul className={styles.capabilities}>
            {capabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}

      <div className={styles.footer}>
        {!compact && (
          <div className={styles.audience}>
            {audience.map((a) => (
              <span key={a} className={styles.audiencePill}>
                {AUDIENCES[a]}
              </span>
            ))}
          </div>
        )}
        <div className={styles.links}>
          {(compact ? docs.slice(0, 1) : docs).map((d) => (
            <Link key={d.to} to={d.to} className={styles.link}>
              {d.label}
              <Icon name="arrow" size={14} />
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
