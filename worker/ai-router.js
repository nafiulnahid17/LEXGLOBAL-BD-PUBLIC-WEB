// Primary: Vercel Gemini 2.5 Flash. Backup: Cloudflare native Workers AI.
export const VERCEL_URL='https://ai-gateway.vercel.sh/v1/chat/completions';
export const VERCEL_MODEL='google/gemini-2.5-flash';
export const CF_MODEL='@cf/google/gemma-4-26b-a4b-it';
export function aiAvailability(env){
 const primary=typeof env?.AI_GATEWAY_API_KEY==='string'&&Boolean(env.AI_GATEWAY_API_KEY.trim());
 const fallback=typeof env?.AI?.run==='function';
 return {primary,fallback,available:primary||fallback};
}
async function cfRun(env,payload,ms){
 const model=env.AI_MODEL||CF_MODEL;
 const p=model===CF_MODEL?{...payload,chat_template_kwargs:{enable_thinking:false}}:payload;
 let timer;
 try{
  const result=await Promise.race([Promise.resolve().then(()=>env.AI.run(model,p)),
    new Promise((_,rej)=>{timer=setTimeout(()=>rej(Error('CF_TIMEOUT')),ms);})]);
  return result?.getReader?result:result&&typeof result==='object'?{...result,providerUsed:'cloudflare-workers-ai'}:result;
 }finally{clearTimeout(timer);}
}
async function gatewayRun(env,payload,ms,fetchFn){
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),ms);
 try{
  const res=await fetchFn(VERCEL_URL,{method:'POST',
   headers:{Authorization:'Bearer '+env.AI_GATEWAY_API_KEY,'Content-Type':'application/json',
    Accept:payload.stream?'text/event-stream':'application/json'},
   body:JSON.stringify({model:env.VERCEL_AI_MODEL||VERCEL_MODEL,messages:payload.messages,
    max_tokens:payload.max_tokens,temperature:payload.temperature,top_p:payload.top_p,stream:!!payload.stream}),
   signal:ctrl.signal});
  if(!res.ok)throw Error('GATEWAY_HTTP_'+res.status);
  if(payload.stream){
   if(!res.body||!res.headers.get('content-type')?.includes('text/event-stream'))throw Error('GATEWAY_BAD_STREAM');
   return res.body; // Browser already handles OpenAI-compatible SSE choices.delta.content.
  }
  if(!res.headers.get('content-type')?.includes('application/json'))throw Error('GATEWAY_BAD_TYPE');
  const txt=await res.text();
  if(txt.length>200000)throw Error('GATEWAY_OVERSIZED');
  let j;
  try{j=JSON.parse(txt);}catch{throw Error('GATEWAY_BAD_JSON');}
  const output=j?.choices?.[0]?.message?.content;
  const answer=typeof output==='string'?output: Array.isArray(output)?output.map(x=>x?.text||'').join(''):'';
  if(!answer.trim()||['length','max_tokens','token_limit'].includes(j?.choices?.[0]?.finish_reason))throw Error('GATEWAY_EMPTY_OR_TRUNCATED');
  if(answer.trim().startsWith('{'))try{JSON.parse(answer);}catch{throw Error('GATEWAY_INVALID_DRAFT_JSON');}
  return {...j,providerUsed:'vercel-ai-gateway'};
 }finally{clearTimeout(timer);}
}
export async function runProviderAI(env,payload,ms=20000,fetchFn=fetch){
 const {primary,fallback,available}=aiAvailability(env);
 if(!available)throw Error('AI_BINDING_NOT_CONFIGURED');
 if(primary){
  const budget=fallback?Math.min(16000,Math.max(3500,Math.floor(ms*.6))):ms;
  try{return await gatewayRun(env,payload,budget,fetchFn);}
  catch{
   if(!fallback)throw Error('VERCEL_GATEWAY_UNAVAILABLE');
   return cfRun(env,payload,Math.max(2500,ms-budget));
  }
 }
 return cfRun(env,payload,ms);
}
