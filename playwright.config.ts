import { defineConfig, devices } from '@playwright/test'

const port = 3000

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `bun dev -- --hostname 127.0.0.1 --port ${port}`,
    reuseExistingServer: !process.env.CI,
    url: `http://127.0.0.1:${port}`,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
