import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
 testDir:'./tests',
 testMatch:'**/*.spec.ts',
 fullyParallel:true,
 reporter:'list',
 use:{baseURL:'http://127.0.0.1:4321',trace:'retain-on-failure',
  launchOptions:process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{}},
 projects:[{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
 webServer:{command:'node tests/static-server.mjs',url:'http://127.0.0.1:4321',reuseExistingServer:!process.env.CI},
});
