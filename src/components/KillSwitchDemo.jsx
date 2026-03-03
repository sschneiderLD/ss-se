import { useState } from 'react'

const cardStyle = {
  border: '1px solid #444',
  borderRadius: '8px',
  padding: '1rem 1.5rem',
  marginBottom: '1rem',
  backgroundColor: '#2a2a2a',
}

const apiBase = import.meta.env.VITE_API_URL || ''

export default function KillSwitchDemo({ contextKey, currentPlan, currentRole, debug, killSwitchStatus, onTriggerDisable }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const status = killSwitchStatus
  const loadingStatus = status === null

  const handleTriggerDisable = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/api/kill-switch/disable`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to disable')
      onTriggerDisable?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loadingStatus) {
    return (
      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Your Account Details</h3>
        <p style={{ color: '#888' }}>Loading...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Your Account Details</h3>
        <p style={{ color: '#c00' }}>
          Error: {error}. Is the server running? Start it with <code>cd server && npm run dev</code>
        </p>
      </section>
    )
  }

  const flagOn = status?.integrationEnabled === true
  const configured = status?.configured

  const accountFields = [
    { label: 'Account Name', value: 'Jane Smith' },
    { label: 'Email', value: 'jane.smith@companyname.com' },
    { label: 'Plan', value: 'Free' },
  ]

  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Your Account Details</h3>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        Find your account details below
      </p>
      {!configured ? (
        <p style={{ color: '#888' }}>{status?.message}</p>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            {accountFields.map(({ label, value }) => (
              <div key={label} style={{ marginBottom: '0.75rem' }}>
                <span style={{ color: '#888', fontSize: '0.85rem' }}>{label}: </span>
                <span
                  style={{
                    color: flagOn ? '#e74c3c' : undefined,
                    fontWeight: flagOn ? 600 : undefined,
                  }}
                >
                  {flagOn ? 'ERROR' : value}
                </span>
              </div>
            ))}
          </div>
          {flagOn && (
            <button
              type="button"
              disabled={loading}
              onClick={handleTriggerDisable}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                backgroundColor: loading ? '#555' : '#c0392b',
                color: '#fff',
                border: '1px solid #a93226',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Disabling...' : 'Trigger Kill Switch'}
            </button>
          )}
        </>
      )}
    </section>
  )
}
