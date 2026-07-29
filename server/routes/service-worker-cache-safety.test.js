const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');

describe('service worker cache safety', () => {
  test('only caches successful responses (avoids permanent stale 404/502 on /_next/static)', () => {
    const swPath = path.join(repoRoot, 'client/public/sw.js');
    const source = fs.readFileSync(swPath, 'utf8');

    expect(source).toMatch(/function maybeCache\(request, response\)/);
    expect(source).toMatch(/if \(response\.ok\)/);
    expect(source).toMatch(/maybeCache\(request, res\)/);
    expect(source).not.toMatch(/\.then\(\(res\) => \{\s*const clone = res\.clone\(\)/);
  });
});
