// components/Warning.jsx
export function Warning({ children }) {
  return (
    <span style={{ color: 'orange' }}>
      ⚠️ Warning: {children}
    </span>
  );
}
