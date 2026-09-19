import { defineConfig } from '@playwright/test';

const baseURL = 'https://petstore.swagger.io/v2/';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

  outputDir: 'test-results',

  use: {
    baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
