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

function containsHtml(str: string): boolean {
  // Basic check for HTML tags - can be improved or replaced with a sanitizer library
  return /<\/?[a-z][\s\S]*>/i.test(str);
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
          <code
            style={{
              padding: '2px 6px',
              backgroundColor: '#f0f0f0',
              borderRadius: 4,
              whiteSpace: 'pre-wrap',
            }}
          >
            {`${key} = `}
            {containsHtml(value) ? (
              <span
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ) : (
              `"${value}"`
            )}
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
        {variable.description && (
          <div style={{ marginBottom: '0.5em' }}>
            {containsHtml(variable.description) ? (
              <div dangerouslySetInnerHTML={{ __html: variable.description }} />
            ) : (
              variable.description.trim()
            )}
          </div>
        )}


        {variable.warning && variable.warning.length > 0 && (
          <div style={{ marginBottom: '0.5em' }}>
            {variable.warning.map(w => (
              <div key={w} style={{ color: 'orange' }}>
                ⚠️ {containsHtml(w) ? <span dangerouslySetInnerHTML={{ __html: w }} /> : escapeMDX(w)}
              </div>
            ))}
          </div>
        )}

        {variable.notes && variable.notes.length > 0 && (
          <div style={{ marginBottom: '0.5em' }}>
            <strong>Notes:</strong>
            <ul>
              {variable.notes.map((note, index) => (
                <li key={index}>
                  {containsHtml(note) ? (
                    <span dangerouslySetInnerHTML={{ __html: note }} />
                  ) : (
                    escapeMDX(note)
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {variable.example != null && (containsHtml(variable.example) ? (
          <div style={{ marginBottom: '0.5em' }}>
            <strong>Example:</strong>{' '}
            <span dangerouslySetInnerHTML={{ __html: variable.example }} />
          </div>
        ) : (
          <div style={{ marginBottom: '0.5em' }}>
            <strong>Example:</strong> <code>{variable.example}</code>
          </div>
        ))}

        {variable.type === 'enum' && Array.isArray(variable.enum) && (
          <div style={{ marginBottom: '0.5em' }}>
            <strong>Options:</strong>{' '}
            {(() => {
              const opts = variable.enum as string[];
              return opts.map((opt, idx) => (
                <span key={opt}>
                  <code>{opt}</code>
                  {idx < opts.length - 1 && ', '}
                </span>
              ));
            })()}
          </div>
        )}

        {variable.deprecated && (
          <div style={{ marginBottom: '0.5em' }}>
            <Deprecated>
              {escapeMDX(variable.deprecationNote || 'This variable is deprecated.')}
            </Deprecated>
          </div>
        )}
      </td>
      <td>{formatRequired(variable.required)}</td>
      <td style={{ verticalAlign: 'top' }}>
        <div style={{ fontSize: '0.9em', color: '#333' }}>

          {variable.type}

          {variable.default !== undefined && (
            <div
              style={{
                marginTop: '0.6em',
                padding: '0.75em 1em',
                backgroundColor: '#f0f4ff',
                borderLeft: '4px solid #3367d6',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.9em',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                overflowX: 'auto', // allows horizontal scroll if too long
              }}
            >
              <span style={{ color: '#3367d6', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                Default:
              </span>
              <code
                style={{
                  padding: '0.5em',
                  whiteSpace: 'pre', // prevents breaking inside the value
                  wordBreak: 'normal', // avoid breaking long strings mid-word
                }}
              >
                {typeof variable.default === 'string'
                  ? variable.default
                  : JSON.stringify(variable.default, null, 2)}
              </code>
            </div>
          )}
        </div>
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
        display: 'inline-block',
      }}
    >
      <strong>Deprecated:</strong> {children}
    </span>
  );
}

