import React from 'react';

type PageMeta = {
  id: string;
  title: string;
  slug: string;
};

type ServiceWithNote = {
  serviceName: string;
  note?: string;
};

type Props = {
  map: {
    requiredScopes: ServiceWithNote[];
    optionalScopes: ServiceWithNote[];
  };
  scopesMeta: PageMeta[];
};

const ScopeItem: React.FC<{ service: ServiceWithNote; scopesMeta: PageMeta[] }> = ({ service, scopesMeta }) => {
  const meta = scopesMeta.find((s) => s.title === service.serviceName);
  const link = meta ? `/docs/env/${meta.slug}` : null;

  return (
    <li style={{ marginBottom: '0.25rem' }}>
      {link ? (
        <a href={link} style={{ textDecoration: 'none', color: '#0366d6' }}>
          <code style={{ backgroundColor: '#f6f8fa', padding: '2px 4px', borderRadius: '4px' }}>
            {service.serviceName}
          </code>
        </a>
      ) : (
        <code style={{ backgroundColor: '#f6f8fa', padding: '2px 4px', borderRadius: '4px' }}>
          {service.serviceName}
        </code>
      )}
      {service.note && (
        <span style={{ marginLeft: '0.5rem', color: '#6a737d', fontSize: '0.875rem' }}>({service.note})</span>
      )}
    </li>
  );
};

const ScopeList: React.FC<{
  label: string;
  scopes: ServiceWithNote[];
  scopesMeta: PageMeta[];
}> = ({ label, scopes, scopesMeta }) => {
  if (!scopes || scopes.length === 0) return null;
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>{label}</h4>
      <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
        {scopes.map((service, index) => (
          <ScopeItem key={index} service={service} scopesMeta={scopesMeta} />
        ))}
      </ul>
    </section>
  );
};

const ServiceMapping: React.FC<Props> = ({ map, scopesMeta }) => {
  return (
    <div style={{ border: '1px solid #e1e4e8', borderRadius: '6px', padding: '1rem', backgroundColor: '#fff', marginBottom: '2.5rem' }}>
      <ScopeList label="Required Scopes" scopes={map.requiredScopes} scopesMeta={scopesMeta} />
      <ScopeList label="Optional Scopes" scopes={map.optionalScopes} scopesMeta={scopesMeta} />
    </div>
  );
};

export default ServiceMapping;
