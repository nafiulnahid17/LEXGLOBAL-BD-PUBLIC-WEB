// Cloudflare Worker: privacy-preserving foundation API. No government or AI integrations are active.
type Env = { ASSETS: { fetch: (request: Request) => Promise<Response> } };

const slugs = [
  'ai-legal-assistant', 'instant-legal-draft', 'ai-case-analysis',
  'smart-land-management', 'smart-vehicle-brta', 'smart-tax-management',
  'passport-assistant', 'expat-documentation', 'narisafe',
  'emergency-sos-gesture', 'emergency-call',
];

function json(body: unknown, status = 200, extra: Record<string,string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      ...extra,
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    if (request.method === 'GET' && pathname === '/api/health') {
      return json({ ok: true, application: 'lexglobalbd-public-foundation', api: 'foundation-only', providerConnected: false });
    }
    if (request.method === 'GET' && pathname === '/api/features') {
      return json({ features: slugs.map((slug) => ({ slug, status: 'not_configured' })) });
    }
    const match = pathname.match(/^\/api\/workflows\/([a-z0-9-]+)$/);
    if (match && request.method === 'POST') {
      if (!slugs.includes(match[1])) return json({ error: 'Unknown feature' }, 404);
      // Intentionally NEVER read, store, process or forward sensitive case/user inputs.
      return json({
        ok: false,
        code: 'PROVIDER_NOT_CONFIGURED',
        message: 'This is a UI foundation. No AI or government service is connected.',
        dataStored: false,
      }, 501);
    }
    if (match) return json({ error: 'Method not allowed' }, 405, { allow: 'POST' });
    return json({ error: 'API endpoint not found' }, 404);
  },
};
