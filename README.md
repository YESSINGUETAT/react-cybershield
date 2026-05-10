# react-cybershield

CyberShield security integration for React applications.

## Installation

```bash
npm install react-cybershield
```

## How It Works

This package works by acting as a **Client-Side Interceptor**. When your backend WAF (CyberShield) detects a threat, it doesn't just block the request; it returns a specific `403 Forbidden` or `429 Too Many Requests` JSON response. 

`react-cybershield` automatically catches these specific responses on the frontend and forces a secure redirection to a block page, ensuring that SPA (Single Page Application) navigations behave securely without breaking the UI.

## Usage

### 1. Standard Fetch API (Default)

To enable CyberShield protection for all standard `fetch` requests (including libraries like `React Query` or `SWR`), simply import the package at the very top of your application's entry file (usually `index.js`, `main.jsx`, or `App.js`).

**Example `index.js` (Create React App / Vite):**

```javascript
import 'react-cybershield/cybersheild.js'; // 👈 Must be at the very top!
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### 2. Axios Integration

Does the default import cover all cases? **No.** If your application uses `axios`, the default `fetch` interceptor will not catch it because Axios relies on `XMLHttpRequest` under the hood.

To cover Axios requests, you must apply the CyberShield interceptor to your Axios instance:

```javascript
import axios from 'axios';
import { applyCyberShieldToAxios } from 'react-cybershield/cybersheild.js';

const api = axios.create({
    baseURL: 'https://api.yoursite.com'
});

// 🛡️ Apply CyberShield Protection to this Axios instance
applyCyberShieldToAxios(api);

export default api;
```

### 3. Server-Side Rendering (Next.js / Remix)

Does it crash during SSR? **No.** The script includes a safe `typeof window === 'undefined'` check. 

For **Next.js (Pages Router)**, you can safely import it inside `_app.js`:
```javascript
import 'react-cybershield/cybersheild.js';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

For **Next.js (App Router)**, since server components do not execute in the browser, you should import it inside a root Client Component (e.g., a `Providers` component) or directly inside a client-side `layout.js` if applicable:
```javascript
'use client';
import 'react-cybershield/cybersheild.js';
import { useEffect } from 'react';

export function CyberShieldProvider({ children }) {
    return <>{children}</>;
}
```

## Does it cover ALL cases?

- ✅ **Standard `fetch()`** (Native)
- ✅ **React Query / SWR / RTK Query** (if they use fetch)
- ✅ **Next.js SSR** (Safe to import, won't crash Node.js)
- ⚠️ **Axios** (Requires manual application using `applyCyberShieldToAxios`)
- ❌ **Direct `XMLHttpRequest`** (Unless using Axios with the helper, raw XHR is not currently intercepted)
