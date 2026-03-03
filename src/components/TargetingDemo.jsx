import { useFlags } from 'launchdarkly-react-client-sdk'

const cardStyle = {
  border: '1px solid #444',
  borderRadius: '8px',
  padding: '1rem 1.5rem',
  marginBottom: '1rem',
  backgroundColor: '#2a2a2a',
}

export default function TargetingDemo() {
  const flags = useFlags()
  const showPremium = flags.premiumFeature ?? false

  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Premium Features</h3>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        Enjoy these premium features for being a valued customer of [Company Name]!
      </p>
      {showPremium ? (
        <div
          style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, #4a2a1a 0%, #5d3d2d 100%)',
            borderRadius: '6px',
            border: '1px solid #7a5d4d',
          }}
        >
          <strong>Premium Dashboard</strong>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>
Thank you for being a premium user!         </p>
        </div>
      ) : (
        <p style={{ color: '#666' }}>
          Premium feature is not available for your current context. Switch to Premium above or add targeting rules for your context.
        </p>
      )}
    </section>
  )
}
