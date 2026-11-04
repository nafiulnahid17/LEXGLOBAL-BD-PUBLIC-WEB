// Cloudflare Worker API foundation — no real AI/government integrations.
const slugs = [
  'ai-legal-assistant', 'instant-legal-draft', 'ai-case-analysis',
  'smart-land-management', 'smart-vehicle-brta', 'smart-tax-management',
  'passport-assistant', 'expat-documentation', 'narisafe',
  'emergency-sos-gesture', 'emergency-call'
];

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      ...extra
    }
  });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (request.method === 'GET' && pathname === '/api/health') {
      return json({ ok: true, app: 'LexGlobal BD For Public', mode: 'foundation', integrationsActive: false });
    }
    if (request.method === 'GET' && pathname === '/api/features') {
      return json({ features: slugs.map(slug => ({ slug, status: 'not_configured' })) });
    }
    const match = pathname.match(/^\/api\/workflows\/([a-z0-9-]+)$/);
    if (match && request.method === 'POST') {
      if (!slugs.includes(match[1])) return json({ error: 'Unknown feature' }, 404);
      // Intentionally never read, store or forward submitted private information.
      return json({ ok: false, code: 'PROVIDER_NOT_CONFIGURED', stored: false,
        message: 'Frontend foundation only. This workflow is not connected.' }, 501);
    }
    if (match) return json({ error: 'Method not allowed' }, 405, { allow: 'POST' });
    return json({ error: 'Endpoint not found' }, 404);
  }
};
