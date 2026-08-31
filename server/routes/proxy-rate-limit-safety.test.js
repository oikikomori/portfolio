const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');

describe('proxy rate-limit safety', () => {
  test('high-frequency layout polling APIs are exempt from proxy rate limiting', () => {
    const rateLimitPath = path.join(repoRoot, 'client/lib/rate-limit.ts');
    const proxyPath = path.join(repoRoot, 'client/proxy.ts');
    const rateLimitSource = fs.readFileSync(rateLimitPath, 'utf8');
    const proxySource = fs.readFileSync(proxyPath, 'utf8');

    expect(rateLimitSource).toMatch(/isRateLimitExemptPath/);
    expect(rateLimitSource).toMatch(/\/api\/cursors/);
    expect(rateLimitSource).toMatch(/\/api\/rpg-presence/);
    expect(proxySource).toMatch(/isRateLimitExemptPath\(pathname\)/);
    expect(proxySource).toMatch(/if \(!isRateLimitExemptPath\(pathname\)\)/);
  });

  test('LiveCursors polling would exceed the CN proxy budget without exemptions', () => {
    const liveCursors = fs.readFileSync(
      path.join(repoRoot, 'client/components/LiveCursors.tsx'),
      'utf8',
    );
    const proxy = fs.readFileSync(path.join(repoRoot, 'client/proxy.ts'), 'utf8');

    expect(liveCursors).toMatch(/setInterval\(push, 2000\)/);
    expect(liveCursors).toMatch(/setInterval\(pull, 2000\)/);
    expect(proxy).toMatch(/CN_RATE_LIMIT = 5/);
    expect(proxy).toMatch(/CN_RATE_WINDOW_MS = 10 \* 1000/);

    // push + pull every 2s => 10 requests / 10s from layout alone (> CN limit of 5)
    const requestsPer10s = (10_000 / 2_000) * 2;
    const cnLimit = 5;
    expect(requestsPer10s).toBeGreaterThan(cnLimit);
  });
});
