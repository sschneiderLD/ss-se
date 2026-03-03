import { useState } from 'react'

const PLAN_CONTEXTS = {
  premium: {
    name: 'Premium User',
    plan: 'premium',
  },
  free: {
    name: 'Free User',
    plan: 'free',
  },
}

function formatContext(effectiveKey, plan, role, debug) {
  const ctx = PLAN_CONTEXTS[plan]
  return `{
  kind: 'user',
  key: '${effectiveKey}',
  name: '${ctx.name}',
  plan: '${ctx.plan}',
  role: '${role}',
  debug: ${debug}
}`
}

const SWITCHER_HEIGHT = 56

const containerStyle = (collapsed) => ({
  width: '320px',
  minWidth: '320px',
  height: collapsed ? SWITCHER_HEIGHT : 'auto',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#2a2a2a',
  border: '1px solid #444',
  borderRadius: '8px',
  transition: 'height 0.2s ease',
})

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid #444',
  backgroundColor: '#1e1e1e',
  minHeight: SWITCHER_HEIGHT,
  flexShrink: 0,
}

const codeStyle = {
  flex: 1,
  padding: '1rem',
  margin: 0,
  fontFamily: 'ui-monospace, monospace',
  fontSize: '0.85rem',
  lineHeight: 1.5,
  color: '#e0e0e0',
  overflow: 'auto',
  whiteSpace: 'pre',
}

const toggleBtnStyle = (active, disabled) => ({
  padding: '0.35rem 0.6rem',
  fontSize: '0.8rem',
  backgroundColor: disabled ? '#333' : active ? '#0d6efd' : '#444',
  color: disabled ? '#666' : '#fff',
  border: `1px solid ${disabled ? '#444' : active ? '#0d6efd' : '#555'}`,
  borderRadius: '4px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.7 : 1,
})

export default function ContextDisplay({ contextKey, currentPlan, currentRole, debug, experimentationTest, onExperimentationTestSwitch }) {
  const [collapsed, setCollapsed] = useState(true)
  const effectiveKey = debug ? 'debug' : contextKey
  const contextCode = formatContext(effectiveKey, currentPlan, currentRole, debug ?? false)

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={containerStyle(collapsed)}>
        <div style={headerStyle}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>
            {collapsed ? 'Context' : 'Current context'}
          </span>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.8rem',
              backgroundColor: '#444',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
        {!collapsed && (
          <pre style={codeStyle}>
            <code>{contextCode}</code>
          </pre>
        )}
      </div>
      <div
        style={{
          width: '320px',
          minWidth: '320px',
          padding: '0.75rem',
          backgroundColor: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>Experimentation Test</span>
          <button
            type="button"
            disabled={debug}
            style={toggleBtnStyle(experimentationTest, debug)}
            onClick={() => !debug && onExperimentationTestSwitch?.(!experimentationTest)}
          >
            {experimentationTest ? 'On' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  )
}
