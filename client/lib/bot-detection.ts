/**
 * Bot / scraper detection helpers used by `proxy.ts` (Next.js middleware equivalent).
 *
 * Everything here must be Edge-runtime compatible: no Node.js `Buffer`/`crypto`
 * module, only Web APIs (`Request`/`Headers`, `crypto.subtle` if ever needed).
 */

// ---------------------------------------------------------------------------
// Trusted internal callers (never bot/rate-limit checked)
// ---------------------------------------------------------------------------

/** Vercel Cron always sends this exact User-Agent for its own invocations. */
const VERCEL_CRON_UA = /^vercel-cron\/1\.0$/i

export function isVercelCronUserAgent(userAgent: string): boolean {
  return VERCEL_CRON_UA.test(userAgent.trim())
}

/**
 * A request to an internal `/api/cron/*` route that already carries the
 * correct `Authorization: Bearer <CRON_SECRET>` header is trusted regardless
 * of its User-Agent — this covers Vercel Cron itself and any secondary
 * external pinger (e.g. cron-job.org) hitting cron routes that Vercel's
 * Hobby plan cron scheduler doesn't cover (see AGENTS.md).
 */
export function isAuthorizedCronRequest(pathname: string, authorizationHeader: string | null): boolean {
  if (!pathname.startsWith('/api/cron/')) return false
  const cronSecret = process.env.CRON_SECRET?.trim()
  if (!cronSecret) return false
  const provided = authorizationHeader?.replace(/^Bearer\s+/i, '').trim()
  return provided === cronSecret
}

// ---------------------------------------------------------------------------
// Known-good search engine / social-preview crawlers (official, verifiable UAs)
// ---------------------------------------------------------------------------

const WHITELISTED_CRAWLER_PATTERNS: RegExp[] = [
  /googlebot/i,
  /adsbot-google/i,
  /google-inspectiontool/i,
  /mediapartners-google/i,
  /storebot-google/i,
  /bingbot/i,
  /bingpreview/i,
  /msnbot/i,
  /yeti/i, // Naver's official crawler
  /naverbot/i,
  /daumoa/i, // Daum's official crawler
  /duckduckbot/i,
  /applebot/i,
  // Social link-preview unfurlers (not scrapers in the abusive sense — blocking
  // these breaks OG previews when sharing posts on KakaoTalk/Slack/etc.)
  /kakaotalk-scrap/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /slackbot/i,
  /discordbot/i,
]

export function isWhitelistedCrawler(userAgent: string): boolean {
  if (!userAgent) return false
  return WHITELISTED_CRAWLER_PATTERNS.some((re) => re.test(userAgent))
}

// ---------------------------------------------------------------------------
// Known scraper / scripting-tool signatures
// ---------------------------------------------------------------------------

const BAD_BOT_UA_PATTERNS: RegExp[] = [
  /curl\//i,
  /wget/i,
  /python-requests/i,
  /python-urllib/i,
  /\baiohttp/i,
  /scrapy/i,
  /libwww-perl/i,
  /go-http-client/i,
  /java\/\d/i,
  /okhttp/i,
  /postmanruntime/i,
  /headlesschrome/i,
  /phantomjs/i,
  /node-fetch/i,
  /axios\//i,
  /^undici/i,
  /nikto/i,
  /sqlmap/i,
  /masscan/i,
  /nmap/i,
  /zgrab/i,
  /httpclient/i,
  /^$/, // empty UA handled separately, kept here for completeness
]

/** Generic "bot/crawler/spider" self-identifying UAs that aren't on the whitelist. */
const GENERIC_BOT_TOKEN = /bot|crawler|spider|scrape/i

export type BotBlockReason =
  | 'no-user-agent'
  | 'bot-signature'
  | 'missing-browser-headers'
  | 'sensitive-path-scan'

/**
 * Returns a block reason if the request looks like an obvious bot/scraper,
 * or `null` if it should be treated as (probably) a real browser or an
 * explicitly whitelisted crawler.
 */
export function detectObviousBot(request: {
  userAgent: string
  accept: string | null
  acceptLanguage: string | null
}): BotBlockReason | null {
  const ua = request.userAgent.trim()

  if (!ua) return 'no-user-agent'

  if (isWhitelistedCrawler(ua)) return null

  if (BAD_BOT_UA_PATTERNS.some((re) => re.test(ua))) return 'bot-signature'
  if (GENERIC_BOT_TOKEN.test(ua)) return 'bot-signature'

  // Real browsers all still send `Mozilla/5.0` for legacy compat reasons.
  // Anything claiming to be a browser-ish UA without that token, and missing
  // the headers a browser always attaches, is very likely a spoofed script.
  const looksLikeBrowser = /mozilla\/5\.0/i.test(ua)
  const hasBrowserHeaders = Boolean(request.accept) && Boolean(request.acceptLanguage)
  if (!looksLikeBrowser && !hasBrowserHeaders) return 'missing-browser-headers'

  return null
}

// ---------------------------------------------------------------------------
// Sensitive-path scanning (wp-admin, .env, .git, phpmyadmin, ...)
// ---------------------------------------------------------------------------

const SENSITIVE_PATH_PATTERNS: RegExp[] = [
  /^\/wp-admin/i,
  /^\/wp-login\.php/i,
  /^\/wp-content/i,
  /^\/wp-includes/i,
  /^\/xmlrpc\.php/i,
  /\.env(\.|$)/i,
  /^\/\.git(\/|$)/i,
  /^\/\.svn(\/|$)/i,
  /^\/\.hg(\/|$)/i,
  /^\/\.aws(\/|$)/i,
  /^\/\.ssh(\/|$)/i,
  /^\/\.docker/i,
  /^\/\.idea(\/|$)/i,
  /^\/\.vscode\/sftp\.json/i,
  /^\/phpmyadmin/i,
  /^\/pma(\/|$)/i,
  /^\/adminer\.php/i,
  /^\/config\.php/i,
  /^\/configuration\.php/i,
  /^\/settings\.php/i,
  /^\/database\.sql/i,
  /^\/backup\.(sql|zip|tar|tar\.gz)$/i,
  /^\/\.well-known\/(?!acme-challenge)/i, // legit is only acme-challenge; other probes are scanners
  /^\/cgi-bin\//i,
  /^\/actuator/i, // Spring Boot actuator probing
  /^\/telescope/i, // Laravel Telescope probing
  /^\/_profiler/i, // Symfony profiler probing
  /^\/vendor\/phpunit/i,
  /^\/server-status/i,
  /^\/debug\/default\/view/i,
  /^\/shell\.php/i,
  /^\/eval-stdin\.php/i,
  /^\/solr\//i,
  /^\/console\/?$/i,
]

export function isSensitiveScanPath(pathname: string): boolean {
  return SENSITIVE_PATH_PATTERNS.some((re) => re.test(pathname))
}
