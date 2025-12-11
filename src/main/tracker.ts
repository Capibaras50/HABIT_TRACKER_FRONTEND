import { BrowserWindow } from 'electron'

interface ActivityResult {
    title: string
    owner: {
        name: string
        path?: string
        bundleId?: string
    }
    url?: string
    memoryUsage?: number
}

interface AppUsage {
    name: string
    timeSpentSeconds: number
    icon?: string
}

export class ActivityTracker {
    private intervalId: NodeJS.Timeout | null = null
    private isTracking = false
    private stats: Map<string, number> = new Map() // App Name -> Seconds
    private mainWindow: BrowserWindow

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow
    }

    public startTracking() {
        if (this.isTracking) return
        this.isTracking = true
        this.stats.clear()
        
        // Poll every 1 second
        this.intervalId = setInterval(async () => {
             if (!this.isTracking) return
             try {
                // Dynamic import for ESM package in CJS/TS environment
                const activeWin = (await import('active-win')).default
                const result = await activeWin()
                
                if (result) {
                    this.processResult(result)
                }
             } catch (error) {
                 console.error('Error tracking activity:', error)
             }
        }, 1000)
    }

    public stopTracking(): AppUsage[] {
        this.isTracking = false
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
        return this.getStats()
    }

    private processResult(result: ActivityResult) {
        const appName = result.owner.name
        const currentSeconds = this.stats.get(appName) || 0
        this.stats.set(appName, currentSeconds + 1)
        
        // Optional: Send real-time updates to renderer
        this.mainWindow.webContents.send('activity-update', {
            app: appName,
            title: result.title,
            url: result.url
        })
    }

    public getStats(): AppUsage[] {
        const usage: AppUsage[] = []
        this.stats.forEach((seconds, name) => {
            usage.push({
                name,
                timeSpentSeconds: seconds
            })
        })
        return usage.sort((a, b) => b.timeSpentSeconds - a.timeSpentSeconds)
    }
}
