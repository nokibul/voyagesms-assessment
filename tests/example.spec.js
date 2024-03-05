const { test, expect } = require('@playwright/test');

function generateRandomEmail(prefix = 'user') {
  const timestamp = new Date().getTime();
  const randomNumber = Math.floor(Math.random() * 10000);
  const email = `${prefix}_${timestamp}_${randomNumber}@example.com`;
  return email;
}

test('should create an account', async ({ page }) => {
  await page.goto('https://revibe-web-client-voyage-sms-voyagesms.vercel.app/');
  const email = generateRandomEmail()
  // Fill in the registration form
  await page.fill('input[name="email"]', email);
  console.log(email)
  await page.fill('input[name="first_name"]', 'Vdodndddsrdo');
  await page.fill('input[name="last_name"]', 'nadmdddddsre');
  await page.fill('input[name="company_name"]', 'Voddddrndso LTD');
  await page.fill('input[name="website"]', 'vonsdddddro.com');
  await page.click('button[type="submit"]')
  await page.waitForTimeout(2000)

  const currentUrl = page.url()
  expect(currentUrl).toContain('https://revibe-web-client-voyage-sms-voyagesms.vercel.app/account/signup/password');

  // password page
  await page.fill('input[name="password"]', 'NewPass4Liverecover');
  await page.click('button[type="submit"]')

  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(2000)

  const shopifyUrl = page.url();
  expect(shopifyUrl).toContain('https://revibe-web-client-voyage-sms-voyagesms.vercel.app/account/signup/shopify');
  
  // shopify page
  await page.waitForSelector('button.rounded-md');
  const button = await page.$('button.rounded-md');
  expect(button).not.toBeNull();
  
  await button.click();
  await page.waitForTimeout(4000)

  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000)

  const checkboxButton = await page.$(`button[role="checkbox"]`);
  expect(checkboxButton).not.toBeNull();
  await checkboxButton.click()
  
  await page.waitForSelector('button.rounded-lg');
  const nextButton = await page.$('button.rounded-lg');
  expect(nextButton).not.toBeNull();
  await nextButton.click();
  await page.waitForTimeout(4000);
  // api to call to get tokens: https://revibe-web-client-voyage-sms-voyagesms.vercel.app/api/auth/session
});

test('should give error while trying to create a duplicate account', async ({ page }) => {
  await page.goto('https://revibe-web-client-voyage-sms-voyagesms.vercel.app/');
  
  const email = 'user_1709655822595_4718@example.com' // an account has already been created with this email 
  // registration page
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="first_name"]', 'Vdodndddsrdo');
  await page.fill('input[name="last_name"]', 'nadmdddddsre');
  await page.fill('input[name="company_name"]', 'Voddddrndso LTD');
  await page.fill('input[name="website"]', 'vonsdddddro.com');
  await page.click('button[type="submit"]')
  await page.waitForTimeout(2000)

  const currentUrl = page.url()
  expect(currentUrl).toContain('https://revibe-web-client-voyage-sms-voyagesms.vercel.app/account/signup/info?validation-errors=%7B%22email%22%3A%5B%22An+account+with+this+email+already+exists%22%5D%7D');
});

test('should reject invalid shop url', async ({ page }) => {
  await page.goto('https://revibe-web-client-voyage-sms-voyagesms.vercel.app/');
  
  const email = generateRandomEmail()
  // Fill in the registration form
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="first_name"]', 'Vdodndddsrdo');
  await page.fill('input[name="last_name"]', 'nadmdddddsre');
  await page.fill('input[name="company_name"]', 'Voddddrndso LTD');
  await page.fill('input[name="website"]', 'vonsdddddro.com');
  await page.click('button[type="submit"]')
  await page.waitForTimeout(2000)

  const currentUrl = page.url()
  expect(currentUrl).toContain('https://revibe-web-client-voyage-sms-voyagesms.vercel.app/account/signup/password');

  // password page
  await page.fill('input[name="password"]', 'NewPass4Liverecover');
  await page.click('button[type="submit"]')

  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(2000)

  const shopifyUrl = page.url();
  expect(shopifyUrl).toContain('https://revibe-web-client-voyage-sms-voyagesms.vercel.app/account/signup/shopify');
  
  // shopify page
  await page.waitForSelector('button.rounded-lg');
  const button = await page.$('button.rounded-lg');
  expect(button).not.toBeNull();
  
  await page.fill('input[name="shop"]', 'an_invalid_domain');
  await button.click();
  await page.waitForTimeout(3000)

  // page wont change
  const url = page.url();
  expect(url).toContain('https://revibe-web-client-voyage-sms-voyagesms.vercel.app/account/signup/shopify');
});
