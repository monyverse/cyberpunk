import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/analytics');
  await page.getByRole('heading', { name: 'Total Agents' }).click();
  await page.getByRole('heading', { name: '0' }).first().click();
  await page.goto('http://localhost:3000/analytics?demo=1');
  await page.getByText('Default').click();
  await page.getByRole('option', { name: 'All Completed' }).click();
  await page.getByRole('button', { name: 'Seed Demo Data' }).click();
  await page.getByRole('button', { name: 'Open issues overlay' }).click();
  await page.getByRole('button', { name: 'Copy Stack Trace' }).click();
  await page.getByRole('button', { name: 'Copy Stack Trace' }).click();
});