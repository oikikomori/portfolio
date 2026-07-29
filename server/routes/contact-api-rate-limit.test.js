const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');

describe('contact API rate limiting', () => {
  test('public POST /api/contact is rate limited per IP', () => {
    const routePath = path.join(repoRoot, 'client/app/api/contact/route.ts');
    const source = fs.readFileSync(routePath, 'utf8');

    expect(source).toMatch(/checkRateLimit/);
    expect(source).toMatch(/RATE_LIMIT\s*=\s*5/);
    expect(source).toMatch(/status:\s*429/);
    expect(source).toMatch(/요청이 너무 많습니다/);
  });

  test('contact form uses the API route (not the unused server action)', () => {
    const contactComponent = fs.readFileSync(
      path.join(repoRoot, 'client/components/Contact.tsx'),
      'utf8',
    );

    expect(contactComponent).toMatch(/fetch\('\/api\/contact'/);
    expect(contactComponent).not.toMatch(/submitContact/);
  });
});
