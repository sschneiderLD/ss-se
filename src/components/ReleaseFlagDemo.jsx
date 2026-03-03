import { useFlags } from 'launchdarkly-react-client-sdk'

const cardStyle = {
  border: '1px solid #444',
  borderRadius: '8px',
  padding: '1rem 1.5rem',
  marginBottom: '1rem',
  backgroundColor: '#2a2a2a',
}

export default function ReleaseFlagDemo() {
  const flags = useFlags()
  const showNewSection = flags.newDashboardSection ?? false

  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Your Dashboard</h3>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        Here you'll find everything you need to know about your [Company Name] account!
      </p>
      {showNewSection ? (
        <div
          style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)',
            borderRadius: '6px',
            border: '1px solid #3d7a4d',
          }}
        >
          <strong>New Dashboard Feature!</strong>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>
            This new tool is sure to help you manage your [Company Name] account!
          </p>
        </div>
      ) : (
        <p style={{ color: '#666' }}>No new features are available yet.</p>
      )}
    </section>
  )
}
