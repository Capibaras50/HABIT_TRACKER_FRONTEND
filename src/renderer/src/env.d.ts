/// <reference types="vite/client" />

interface AppUsage {
  name: string
  timeSpentSeconds: number
  icon?: string
}

interface ActivityUpdate {
  app: string
  title: string
  url?: string
}

interface Window {
  electron: import('@electron-toolkit/preload').ElectronAPI
  api: {
    startTracking: () => Promise<boolean>
    stopTracking: () => Promise<AppUsage[]>
    getStats: () => Promise<AppUsage[]>
    onActivityUpdate: (callback: (data: ActivityUpdate) => void) => void
    removeActivityListener: () => void
    // ... existing api methods if any were assumed on window.api, but actually we have services/api.ts which is separate. 
    // The preload exposes 'api' with ONLY tracking methods now based on my previous edit.
    // Wait, did I overwrite other api methods in preload? 
    // Checking preload: "const api = { startTracking ... }" 
    // Yes, I defined a new object. Preload only has these methods now. 
    // The rest of the app uses 'src/renderer/src/services/api.ts' which imports from separate file, NOT window.api.
    // So this is safe.
  }
}
