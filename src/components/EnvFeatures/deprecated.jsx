export function Deprecated({ children }) {
  return (
    <span style={{
      backgroundColor: '#fff3cd',
      color: '#856404',
      padding: '0.2em 0.5em',
      borderRadius: '4px',
      fontWeight: 'bold',
      display: 'inline-block',
    }}>
      ⚠️ Deprecated: {children}
    </span>
  );
}
