# SE Demo Submission

A full-stack demo application for showcasing LaunchDarkly feature flags, targeting, and control.

## Prerequisites

- Node.js 18+
- A LaunchDarkly account

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. **Configure LaunchDarkly**
   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   ```
   Edit both `.env` files with your keys. See [LaunchDarkly Setup](#launchdarkly-setup-step-by-step) below for where to find them.

3. **Create feature flags** in LaunchDarkly (see [LaunchDarkly Setup](#launchdarkly-setup-step-by-step) below)

4. **Run the app**
   ```bash
   npm run dev:all
   ```
   This starts both the frontend (Vite) and backend (Express) in one terminal. Alternatively, run them in separate terminals: `npm run dev` and `cd server && npm run dev`.

## LaunchDarkly Setup (Step-by-Step)

Follow these steps to configure LaunchDarkly for this demo.

### 1. Get Your Keys

1. Log in to [LaunchDarkly](https://app.launchdarkly.com).
2. Open your project (or create one) and select an environment (e.g. **Test** or **Production**).
3. Go to **Project settings** (gear icon in the left sidebar) → **Environments**.
4. Click the **⋮** overflow menu for your environment.
5. Choose **Copy Client-side ID** — paste into `.env` as `VITE_LAUNCHDARKLY_CLIENT_ID`.
6. Choose **Copy SDK Key** — paste into `server/.env` as `LD_SDK_KEY`.
7. For the **Trigger Kill Switch** button (in Your Account Details), add these to `server/.env`:
   - **LD_ACCESS_TOKEN** — Go to **Account settings** → **Authorization** → **Create token**, assign a role with write access, and paste the token.
   - **LD_PROJECT_KEY** — In **Project settings** (gear icon in sidebar), find the **Project key** (often `default`).
   - **LD_ENVIRONMENT_KEY** — In **Project settings** → **Environments**, find the key for your environment (e.g. `test`, `production`).

### 2. Create Feature Flags

Create four flags in your project. Navigate to **Feature flags** and click **Create flag**.

#### Flag 1: `new-dashboard-section` (Release flag)

1. **Name:** New Dashboard Section  
2. **Key:** `new-dashboard-section` (auto-filled from name)  
3. **Type:** Boolean  
4. Enable **SDKs using Client-side ID** (for frontend).  
5. **Flag State:** Off
7. Save. Toggle it **On** under "Targeting" to turn the feature on for everyone.

#### Flag 2: `premium-feature` (Rule-based targeting)

1. **Name:** Premium Feature  
2. **Key:** `premium-feature`  
3. **Type:** Boolean  
4. Enable **SDKs using Client-side ID**.  
5. **Flag State:** On
6. **Default:** serve "false"  
7. Under **Targeting**, add a custom rule: **If** `plan` **is one of** `premium` → **Then** serve `true`.  
8. Save.

#### Flag 3: `signup-button-variant` (A/B variation)

1. **Name:** Signup Button Variant  
2. **Key:** `signup-button-variant`  
3. **Type:** String  
4. Add variations: `primary` and `secondary` (default: `primary`).  
5. Enable **SDKs using Client-side ID**.  
6. Under **Targeting**, use a percentage rollout (e.g. 50% each) or serve a single variation.
7. **Optional** Under **Targeting**, add a custom rule: **If** 'role' **is one of** 'admin' → **Then** serve `secondary`. This allows admins to force seeing the new version of the button.
8. 7. **Optional** Under **Targeting**, select **Target Individuals**, then search for "debug", **Then** serve `secondary`. This allows debug users to force seeing the new version of the button.
9. Save.

#### Flag 4: `api-integration-kill-switch` (Server-side kill switch)

1. **Name:** Update to new API version  
2. **Key:** `api-integration-kill-switch`  
3. **Type:** Boolean  
4. Leave **SDKs using Client-side ID** off — this flag is evaluated server-side only.
5. Go to the **Variations** tab, update the **true** variaition name to **V2**, update the **false** variation name to **V1**.
6. **Default:** On, with "V1" selected. 
7. Save.

The **Your Account Details** section displays account fields (Account Name, Email, Plan). When the flag is **On** with **V2**, values show as `ERROR` in red; when **V1**, static values appear. A **Trigger Kill Switch** button appears when the flag is serving V2 and turns the flag off via the LaunchDarkly API when clicked.

### 3. Create Experimentation Metric (Optional)

To use the signup button with experiments:

1. Go to **Metrics** in the left sidebar → **Create metric**.
2. Select **LaunchDarkly hosted** and **Custom** event kind.
3. **Event key:** `signup-button-click` (must match the app exactly).
4. Choose **Value/size** as what to measure.
5. **Aggregation:** Average or Sum.
6. **Higher is better** (value 10 indicates a stronger signal than 3).
7. **Randomization unit:** user.
8. Create the metric.

The app sends:
- **3** when the "Sign up" button (primary variant) is clicked.
- **10** when the "Get started" button (secondary variant) is clicked.

Use this metric in an experiment tied to `signup-button-variant` to compare variant performance.

## Demo Scenarios

1. **Release flag** – Toggle `new-dashboard-section` on/off in LaunchDarkly to show or hide the new section (no redeploy).
2. **User targeting** – Use the switcher to toggle between Free and Premium contexts. The `premium-feature` content only appears for Premium.
3. **A/B variation** – The signup button text and style change based on `signup-button-variant`. Click the button to send a metric event (value 3 for "Sign up", 10 for "Get started") for experimentation.
4. **Kill switch** – The **Your Account Details** section shows account fields. When the flag is on and set to V2, values display as `ERROR` in red. Click **Trigger Kill Switch** to turn the flag off and restore normal values. Then turn the flag back on and set to a default value of V1, add a custom rule targeting **debug** is **true**, and serve V2. This allows a developer to see the error live in production while not impacting other users.

## Project Structure

```
feature-flag-demo/
├── src/
│   ├── main.jsx          # LDProvider setup
│   ├── App.jsx           # App shell
│   └── components/       # Demo components
├── server/
│   ├── index.js          # Express API + LD server SDK
│   ├── package.json
│   └── .env.example
├── index.html
├── package.json
└── .env.example
```
