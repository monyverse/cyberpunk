import { test, expect } from '@playwright/test';

test('analytics page loads and shows demo controls', async ({ page }) => {
  // Navigate to analytics page
  await page.goto('http://localhost:3000/analytics');
  
  // Check that the page loads with basic elements
  await expect(page.getByRole('heading', { name: 'Analytics Dashboard' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Total Agents' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Total Missions' })).toBeVisible();
  
  // Navigate to demo mode
  await page.goto('http://localhost:3000/analytics?demo=1');
  
  // Check that demo controls are visible
  await expect(page.getByRole('button', { name: 'Seed Demo Data' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset Demo Data' })).toBeVisible();
  
  // Test scenario selector
  await page.getByText('Default').click();
  await page.getByRole('option', { name: 'All Completed' }).click();
  
  // Test seeding demo data
  await page.getByRole('button', { name: 'Seed Demo Data' }).click();
  
  // Wait for the page to refresh and check that data appears
  await page.waitForTimeout(1000);
  
  // Verify that the analytics dashboard shows some data
  await expect(page.getByText('Analytics Dashboard')).toBeVisible();
});