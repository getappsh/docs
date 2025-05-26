import React from 'react';

type Variable = {
  name: string;
  type: string;
  required?: boolean | { if: Record<string, string>; then: boolean };
  description?: string;
  example?: string;
  enum?: string[];
  subTitle?: string;
  hidden?: boolean;
  warning?: string;
  deprecated?: boolean;
  deprecationNote?: string;
  default?: string | number | boolean | null;
};

type Scope = {
  title: string;
  description?: string;
  variables: Variable[];
};

function toSlug(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function escapeMDX(text: string): string {
  if (typeof text !== 'string') return text;
  return text.includes('{') || text.includes('}') ? '`' + text + '`' : text;
}

function formatCondition(ifObj: Record<string, string>) {
  return Object.entries(ifObj)
    .map(([k, v]) => `${k} = "${v}"`)
    .join(' and ');
}

function formatRequired(required: Variable['required']): React.ReactNode {
  if (typeof required === 'boolean') return String(required);
  if (required?.if && required.then !== undefined) {
    const condition = formatCondition(required.if);
    return (
      <small>
        <i>{condition}</i>
      </small>
    );
  }
  return 'false';
}

// Component to render a single variable row
function VariableRow({ variable }: { variable: Variable }) {
  return (
    <tr key={variable.name}>
      <td>
        <code>{variable.name}</code>
      </td>
      <td>
        {variable.description && <div>{variable.description.trim()}</div>}

        {variable.warning && (
          <div style={{ color: 'orange' }}>
            ⚠️ {escapeMDX(variable.warning)}
          </div>
        )}

        {variable.deprecated && (
          <div style={{ color: 'red' }}>
            ⚠️ {escapeMDX(variable.deprecationNote || 'This variable is deprecated.')}
          </div>
        )}

        {variable.example != null && (
          <div>
            <strong>Example:</strong> <code>{variable.example}</code>
          </div>
        )}

        {variable.type === 'enum' && Array.isArray(variable.enum) && (
          <div>
            <strong>Options:</strong>
            <ul>
              {variable.enum.map(opt => (
                <li key={opt}>
                  <code>{opt}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </td>
      <td>{formatRequired(variable.required)}</td>
      <td>
        {variable.type}
        {variable.default !== undefined && (
          <>
            <br />
            <strong>Default:</strong>{' '}
            <code>{typeof variable.default === 'string' ? variable.default : JSON.stringify(variable.default)}</code>
          </>
        )}
      </td>
    </tr>
  );
}

// Component to render a group section (subtitle + table with variables)
export function GroupSection({ title, variables }: { title: string; variables: Variable[] }) {
  return (
    <div key={title}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Required</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {variables.filter(v => !v.hidden).map(variable => (
            <VariableRow key={variable.name} variable={variable} />
          ))}
        </tbody>
      </table>
    </div>
  );
}


// Main component
export function ScopeDoc({ scope }: { scope: Scope }) {
  const grouped = scope.variables.reduce((acc, v) => {
    if (v.hidden) return acc;
    const key = v.subTitle || 'Miscellaneous';
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {} as Record<string, Variable[]>);

  return (
    <>
      <h1>{scope.title}</h1>
      {scope.description && <p>{scope.description}</p>}

      {Object.entries(grouped).map(([title, vars]) => (
        <GroupSection key={title} title={title} variables={vars} />
      ))}
    </>
  );
}

// Warning and Deprecated components (unchanged)

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: '#fff8e1',
        color: '#7c5200',
        border: '1px solid #ffe58f',
        padding: '8px',
        borderRadius: '4px',
        marginTop: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5em',
      }}
    >
      <span role="img" aria-label="warning">
        ⚠️
      </span>
      <span>{children}</span>
    </div>
  );
}

function Deprecated({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '0.2em 0.5em',
        borderRadius: '4px',
        fontWeight: 'bold',
        display: 'inline-block',
      }}
    >
      ⚠️ Deprecated: {children}
    </span>
  );
}
