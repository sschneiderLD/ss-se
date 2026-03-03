import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk'

const EVENT_KEY = 'signup-button-click'

const cardStyle = {
  border: '1px solid #444',
  borderRadius: '8px',
  padding: '1rem 1.5rem',
  marginBottom: '1rem',
  backgroundColor: '#2a2a2a',
}

const primaryBtn = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  backgroundColor: '#0d6efd',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
}

const secondaryBtn = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  backgroundColor: 'transparent',
  color: '#0d6efd',
  border: '2px solid #0d6efd',
  borderRadius: '6px',
  cursor: 'pointer',
}

export default function VariationDemo({ experimentationTestEnabled, onSignupClick }) {
  const flags = useFlags()
  const ldClient = useLDClient()
  const variant = flags.signupButtonVariant ?? 'primary'

  const buttonStyle = variant === 'secondary' ? secondaryBtn : primaryBtn
  const buttonText = variant === 'secondary' ? 'Get started' : 'Sign up'
  const metricValue = variant === 'secondary' ? 10 : 3

  function handleClick() {
    if (experimentationTestEnabled && onSignupClick) {
      onSignupClick()
    }
    if (ldClient) {
      ldClient.track(EVENT_KEY, undefined, metricValue)
      ldClient.flush?.()
    }
  }

  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Sign up for our newest product!</h3>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        Ready to try out the newest product from [Company Name]? Click the button below to get started!
      </p>
      <div style={{ marginTop: '0.5rem' }}>
        <button style={buttonStyle} type="button" onClick={handleClick}>
          {buttonText}
        </button>
        
      </div>
    </section>
  )
}
