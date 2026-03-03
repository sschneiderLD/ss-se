import { useState, useEffect, useCallback } from 'react'
import { useFlags } from 'launchdarkly-react-client-sdk'
import { createContextKey } from './utils/contextKey.js'
import UserSwitcher from './components/UserSwitcher'
import ContextDisplay from './components/ContextDisplay'
import ReleaseFlagDemo from './components/ReleaseFlagDemo'
import TargetingDemo from './components/TargetingDemo'
import VariationDemo from './components/VariationDemo'
import KillSwitchDemo from './components/KillSwitchDemo'

const apiBase = import.meta.env.VITE_API_URL || ''

function App({ contextKey: initialContextKey }) {
  const [contextKey, setContextKey] = useState(initialContextKey)
  const [currentPlan, setCurrentPlan] = useState('free')
  const [currentRole, setCurrentRole] = useState('User')
  const [debug, setDebug] = useState(false)
  const [experimentationTest, setExperimentationTest] = useState(false)
  const [killSwitchStatus, setKillSwitchStatus] = useState(null)
  const flags = useFlags()

  const refreshKillSwitchStatus = useCallback(async () => {
    try {
      const effectiveKey = debug ? 'debug' : contextKey
      const params = new URLSearchParams({
        plan: currentPlan,
        key: effectiveKey,
        role: currentRole ?? 'User',
        debug: String(debug ?? false),
      })
      const res = await fetch(`${apiBase}/api/feature-status?${params}`)
      const data = await res.json()
      setKillSwitchStatus(data)
    } catch {
      setKillSwitchStatus({ configured: false })
    }
  }, [contextKey, currentPlan, currentRole, debug])

  useEffect(() => {
    refreshKillSwitchStatus()
  }, [refreshKillSwitchStatus])

  function handleSignupClick() {
    if (experimentationTest) {
      setContextKey(createContextKey())
    }
  }

  const showTargetingDemo = flags.premiumFeature === true
  const showVariationDemo = flags.signupButtonVariant != null

  return (
    <div style={{ display: 'flex', gap: '1.5rem', padding: '2rem', maxWidth: '1200px', margin: '0 auto', alignItems: 'flex-start' }}>
      <main style={{ flex: 1, minWidth: 0 }}>
        <h1>Company Name Site</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>
        [Company Name] delivers the best [Product Name] on the market!
      </p>

      <UserSwitcher
        contextKey={contextKey}
        currentPlan={currentPlan}
        onPlanSwitch={setCurrentPlan}
        currentRole={currentRole}
        onRoleSwitch={setCurrentRole}
        debug={debug}
        onDebugSwitch={(value) => {
          setDebug(value)
          if (value) setExperimentationTest(false)
        }}
      />

      <ReleaseFlagDemo />
      {showTargetingDemo && <TargetingDemo />}
      {showVariationDemo && (
        <VariationDemo
          experimentationTestEnabled={experimentationTest}
          onSignupClick={handleSignupClick}
        />
      )}
      <KillSwitchDemo
        contextKey={contextKey}
        currentPlan={currentPlan}
        currentRole={currentRole}
        debug={debug}
        killSwitchStatus={killSwitchStatus}
        onTriggerDisable={refreshKillSwitchStatus}
      />
      </main>
      <ContextDisplay
        contextKey={contextKey}
        currentPlan={currentPlan}
        currentRole={currentRole}
        debug={debug}
        experimentationTest={experimentationTest}
        onExperimentationTestSwitch={setExperimentationTest}
      />
    </div>
  )
}

export default App
