import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  use: { baseURL: "http://127.0.0.1:4173/stormwreck-combat-companion/" },
  projects: [
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command:
      "node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173/stormwreck-combat-companion/",
    reuseExistingServer: true,
  },
});
