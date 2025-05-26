import React from 'react';

type Variable = {
  name: string;
  type: string;
  required:
  | boolean
  | {
    if: Record<string, string>;
  }
  | {
    oneOf: Record<string, string>[];
  }; description?: string;
  example?: string;
  enum?: string[];
  subTitle?: string;
  hidden?: boolean;
  warning?: string[];
  notes?: string[];
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
  const entries = Object.entries(ifObj);
  return (
    <>
      {entries.map(([key, value], i) => (
        <div
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 0',
          }}
        >
          <code style={{ padding: '2px 6px', backgroundColor: '#f0f0f0', borderRadius: 4 }}>
            {`${key} = "${value}"`}
          </code>
          {i < entries.length - 1 && (
            <span style={{ color: '#999', fontStyle: 'italic' }}>and</span>
          )}
        </div>
      ))}
    </>
  );
}


function formatRequired(required: Variable['required']): React.ReactNode {
  if (typeof required === 'boolean') {
    return <code>{String(required)}</code>;
  }

  if ('if' in required && typeof required.if === 'object') {
    return (
      <div>
        <small>
          <i>Required if:</i>
        </small>
        <div style={{ marginLeft: 12, marginTop: 4 }}>{formatCondition(required.if)}</div>
      </div>
    );
  }

  if ('oneOf' in required && Array.isArray(required.oneOf)) {
    return (
      <div>
        <small>
          <i>Required if any of the following:</i>
        </small>
        <ul style={{ marginTop: 4, marginLeft: 20 }}>
          {required.oneOf.map((cond, idx) => (
            <li key={idx}>
              <div>{formatCondition(cond)}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <code>false</code>;
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

        {variable.warning && !!variable.warning.length && (variable.warning.map(w => (
          <div key={w} style={{ color: 'orange' }}>
            ⚠️ {escapeMDX(w)}
          </div>
        )))}

        {variable.notes && !!variable.notes.length && (
          <div>
            <strong>Notes:</strong>
            <ul>
              {variable.notes.map((note, index) => (
                <li key={index}>{escapeMDX(note)}</li>
              ))}
            </ul>
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
    <div key={title} style={{ marginBottom: '3em' }}>
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
