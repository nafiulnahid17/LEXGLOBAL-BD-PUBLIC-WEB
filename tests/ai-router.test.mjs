import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runProviderAI,aiAvailability,VERCEL_URL,VERCEL_MODEL} from '../worker/ai-router.js';
import worker from '../worker/index.js';

const payload={messages:[{role:'system',content:'Be concise.'},{role:'user',content:'Hello'}],
  max_tokens:500,temperature:0.1,top_p:0.8,stream:false};
const gatewayResponse=(body,status=200,type='application/json')=>
  new Response(typeof body==='string'?body:JSON.stringify(body),{status,headers:{'content-type':type}});
const good=(txt='Professional factual answer.')=>({choices:[{message:{role:'assistant',content:txt},finish_reason:'stop'}]});

test('no configured gateway key means Cloudflare directly, without any fetch',async()=>{
 let fetches=0,cf=0;
 const result=await runProviderAI({AI:{run:async()=>{cf++;return {response:'Backup successful answer.'};}}},payload,2000,
   async()=>{fetches++;throw Error('Never invoke gateway without key');});
 assert.equal(fetches,0);assert.equal(cf,1);
 assert.equal(result.providerUsed,'cloudflare-workers-ai');
});

test('Gemini 2.5 Flash primary: valid chat completions response; Cloudflare never charged',async()=>{
 let cf=0,called=0;
 const env={AI_GATEWAY_API_KEY:'TEST_SECRET_NOT_REAL',AI:{run:async()=>{cf++;return {response:'backup'};}}};
 const result=await runProviderAI(env,payload,4000,async(url,init)=>{
   called++;
   assert.equal(url,VERCEL_URL);
   assert.equal(init.method,'POST');
   assert.equal(init.headers.Authorization,'Bearer TEST_SECRET_NOT_REAL');
   const sent=JSON.parse(init.body);
   assert.equal(sent.model,VERCEL_MODEL);
   assert.deepEqual(sent.messages,payload.messages);
   assert.equal(sent.stream,false);
   assert.equal(sent.max_tokens,500);
   assert.equal(sent.temperature,0.1);
   return gatewayResponse(good('Gemini primary works.'));
 });
 assert.equal(called,1);assert.equal(cf,0);
 assert.equal(result.providerUsed,'vercel-ai-gateway');
 assert.equal(result.choices[0].message.content,'Gemini primary works.');
 assert.doesNotMatch(JSON.stringify(result),/TEST_SECRET_NOT_REAL/);
});

for(const code of [401,429,500,503]){
 test('Gateway HTTP '+code+' triggers native Cloudflare backup',async()=>{
   let cf=0;
   const result=await runProviderAI({AI_GATEWAY_API_KEY:'dummy',AI:{run:async()=>{cf++;return {response:'Cloudflare fallback.'};}}},payload,4000,
     async()=>gatewayResponse({error:{message:'upstream not available'}},code));
   assert.equal(cf,1);
   assert.equal(result.providerUsed,'cloudflare-workers-ai');
 });
}

test('malformed response and empty Gemini text both fall back, not displayed as draft',async()=>{
 let cf=0;
 for(const upstream of [gatewayResponse('{',200),gatewayResponse(good(''))]){
   const result=await runProviderAI({AI_GATEWAY_API_KEY:'dummy',AI:{run:async()=>{cf++;return {response:'Cloudflare valid.'};}}},payload,4000,
     async()=>upstream);
   assert.equal(result.providerUsed,'cloudflare-workers-ai');
 }
 assert.equal(cf,2);
});

test('gateway network timeout/exception falls back without exposing error or token',async()=>{
 const result=await runProviderAI({AI_GATEWAY_API_KEY:'dummy',AI:{run:async()=>({response:'Recovered.'})}},payload,4000,
   async()=>{throw Error('secret dummy network failure');});
 assert.equal(result.response,'Recovered.');
 assert.equal(result.providerUsed,'cloudflare-workers-ai');
});

test('streaming uses OpenAI-compatible SSE directly when primary succeeds',async()=>{
 let cf=0;
 const sse='data: {"choices":[{"delta":{"content":"Hello "}}]}\n\n'+
   'data: {"choices":[{"delta":{"content":"world!"}}]}\n\n'+'data: [DONE]\n\n';
 const result=await runProviderAI({AI_GATEWAY_API_KEY:'dummy',AI:{run:async()=>{cf++;}}},{...payload,stream:true},4000,
   async()=>new Response(sse,{headers:{'content-type':'text/event-stream'}}));
 assert.equal(cf,0);assert.equal(typeof result.getReader,'function');
 assert.equal(await new Response(result).text(),sse);
});

test('streaming upstream 503 falls back to Cloudflare SSE',async()=>{
 let cf=0;
 const sse='data: {"response":"Backup chat"}\n\ndata: [DONE]\n\n';
 const result=await runProviderAI({AI_GATEWAY_API_KEY:'dummy',AI:{run:async()=>{cf++;return new Response(sse).body;}}},{...payload,stream:true},4000,
   async()=>gatewayResponse({error:'down'},503));
 assert.equal(cf,1);
 assert.match(await new Response(result).text(),/Backup chat/);
});

test('Gateway-only deployment can work without native Cloudflare binding',async()=>{
 const result=await runProviderAI({AI_GATEWAY_API_KEY:'dummy'},payload,4000,async()=>gatewayResponse(good('Gemini only.')));
 assert.equal(result.providerUsed,'vercel-ai-gateway');
 assert.equal(aiAvailability({AI_GATEWAY_API_KEY:'dummy'}).fallback,false);
});

test('no key and no Cloudflare binding fails closed with no network call',async()=>{
 let calls=0;
 await assert.rejects(()=>runProviderAI({},payload,4000,async()=>{calls++;}),/AI_BINDING_NOT_CONFIGURED/);
 assert.equal(calls,0);
});

test('public health reports provider readiness without disclosing secret',async()=>{
 const env={AI_GATEWAY_API_KEY:'TOP_SECRET_TEST',AI:{run:async()=>({response:'backup'})},ASSETS:{fetch:async()=>new Response('ok')}};
 const r=await worker.fetch(new Request('https://lexglobalbd.example/api/health'),env);
 const j=await r.json();
 assert.equal(j.vercelGatewayConfigured,true);
 assert.equal(j.cloudflareFallbackConfigured,true);
 assert.equal(j.legalAnsweringEnabled,true);
 assert.equal(j.primaryModel,'google/gemini-2.5-flash');
 assert.doesNotMatch(JSON.stringify(j),/TOP_SECRET_TEST/);
});

test('deployed model names stay in public vars; API key is not checked into Wrangler',async()=>{
 const content=await readFile(new URL('../wrangler.jsonc',import.meta.url),'utf8');
 const vars=JSON.parse(content).vars;
 assert.equal(vars.VERCEL_AI_MODEL,'google/gemini-2.5-flash');
 assert.equal(vars.AI_MODEL,'@cf/google/gemma-4-26b-a4b-it');
 assert.ok(!Object.hasOwn(vars,'AI_GATEWAY_API_KEY'));
});
