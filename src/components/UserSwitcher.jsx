import { useEffect } from 'react'
import { useLDClient } from 'launchdarkly-react-client-sdk'

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

const ROLES = ['User', 'admin']

const switcherStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 10,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  alignItems: 'center',
  marginBottom: '1.5rem',
  padding: '0.75rem',
  backgroundColor: '#242424',
  borderBottom: '1px solid #444',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
}

const btnStyle = (active) => ({
  padding: '0.4rem 0.8rem',
  fontSize: '0.9rem',
  backgroundColor: active ? '#0d6efd' : 'transparent',
  color: active ? 'white' : '#aaa',
  border: `1px solid ${active ? '#0d6efd' : '#555'}`,
  borderRadius: '6px',
  cursor: 'pointer',
})

export default function UserSwitcher({ contextKey, currentPlan, onPlanSwitch, currentRole, onRoleSwitch, debug, onDebugSwitch }) {
  const ldClient = useLDClient()

  useEffect(() => {
    if (!ldClient || !contextKey) return
    const planCtx = PLAN_CONTEXTS[currentPlan]
    const effectiveKey = debug ? 'debug' : contextKey
    ldClient.identify({
      kind: 'user',
      key: effectiveKey,
      name: planCtx.name,
      plan: planCtx.plan,
      role: currentRole,
      debug,
    })
  }, [ldClient, contextKey, currentPlan, currentRole, debug])

  const planCtx = PLAN_CONTEXTS[currentPlan]

  return (
    <div style={switcherStyle}>
      <span style={{ marginRight: '0.25rem', color: '#888' }}>Plan:</span>
      <button
        style={btnStyle(currentPlan === 'free')}
        type="button"
        onClick={() => onPlanSwitch('free')}
      >
        Free User
      </button>
      <button
        style={btnStyle(currentPlan === 'premium')}
        type="button"
        onClick={() => onPlanSwitch('premium')}
      >
        Premium User
      </button>
      <span style={{ marginLeft: '0.5rem', marginRight: '0.25rem', color: '#888' }}>Role:</span>
      {ROLES.map((role) => (
        <button
          key={role}
          style={btnStyle(currentRole === role)}
          type="button"
          onClick={() => onRoleSwitch(role)}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      ))}
      <span style={{ marginLeft: '0.5rem', marginRight: '0.25rem', color: '#888' }}>Debug:</span>
      <button
        style={btnStyle(debug)}
        type="button"
        onClick={() => onDebugSwitch(!debug)}
      >
        {debug ? 'On' : 'Off'}
      </button>
      <span style={{ marginLeft: 'auto', color: '#666', fontSize: '0.85rem' }}>
        {planCtx.name}, {currentRole}
      </span>
    </div>
  )
}
