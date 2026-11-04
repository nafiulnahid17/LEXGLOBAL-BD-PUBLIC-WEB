import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import worker from '../worker/index.js';

const origin='https://lexglobalbd.test';
const request=(body)=>new Request(origin+'/api/workflows/ai-legal-assistant',{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)
});
const env=(run)=>({AI:{run},ASSETS:{fetch:()=>new Response('ok')},LEGAL_SEARCH_INSTANCE:''});

test('short Banglish clarification includes the original user topic in the model prompt',async()=>{
 let payload;
 const response=await worker.fetch(request({
   question:'bujhi nai',
   history:[{role:'user',content:'amar bou palai gese onno cheler sathe'},
     {role:'assistant',content:'আপনার স্ত্রী চলে গেছেন। আইনি পরিস্থিতি বুঝতে প্রথমে তথ্য গুছান।'}],
 }),env(async(_model,p)=>{payload=p;return {response:'আপনার স্ত্রী অন্য কারও সঙ্গে চলে গেছেন—এই বিষয়টি সহজ ভাষায় ব্যাখ্যা করছি।'};}));
 assert.equal(response.status,200);
 const last=payload.messages.at(-1).content;
 assert.match(last,/amar bou palai gese onno cheler sathe/);
 assert.match(last,/Re-explain the SAME topic/);
 assert.match(last,/bujhi nai/);
 assert.equal((await response.json()).mode,'preview_ai');
});

test('regular questions are not rewritten as clarification requests',async()=>{
 let payload;
 await worker.fetch(request({question:'Can you explain tenancy law generally?'}),
   env(async(_m,p)=>{payload=p;return {response:'Here is a short overview.'};}));
 assert.equal(payload.messages.at(-1).content,'Can you explain tenancy law generally?');
});

const frontend=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
function extract(start,end){
 const a=frontend.indexOf(start);const b=frontend.indexOf(end,a+start.length);
 assert.ok(a>=0 && b>a,'Function boundaries changed for '+start);
 return frontend.slice(a,b);
}

test('history compression retains both topic and the conclusion of long Bangla answers',()=>{
 const code=extract('function compactChatTurn(', 'function chatScrollToEnd(');
 const sandbox={TextEncoder,chatMessages:[
   {role:'user',content:'আমার স্ত্রী অন্য কারও সঙ্গে চলে গেছেন—কী করব?'},
   {role:'assistant',content:'প্রথমে ঘটনাটি বুঝে নিন। '+'কিছু সাধারণ তথ্য।'.repeat(130)+'শেষে আইনজীবীর সঙ্গে কথা বলুন।'},
 ]};
 vm.createContext(sandbox);
 vm.runInContext(code+'\nthis.readHistory=getRecentChatHistory;',sandbox);
 const history=sandbox.readHistory();
 assert.equal(history.length,2);
 assert.ok(history[1].content.length<=1800);
 assert.match(history[1].content,/প্রথমে ঘটনাটি/);
 assert.match(history[1].content,/শেষে আইনজীবীর সঙ্গে কথা বলুন।/);
});

test('SSE with [DONE] and finish_reason length is flagged incomplete',async()=>{
 const code=extract('async function consumeAiStream(', 'function joinChatContinuation(');
 const sandbox={ReadableStream,TextDecoder,TextEncoder};
 vm.createContext(sandbox);
 vm.runInContext(code+'\nthis.parseStream=consumeAiStream;',sandbox);
 const encoder=new TextEncoder();
 const body=new ReadableStream({start(c){
  c.enqueue(encoder.encode('data: {"response":"আপনার বিষয়টি বুঝেছি কিন্তু আপনি ক","finish_reason":"length"}\n\n'));
  c.enqueue(encoder.encode('data: [DONE]\n\n'));c.close();
 }});
 const result=await sandbox.parseStream(new Response(body),()=>{});
 assert.equal(result.complete,false);
 assert.equal(result.doneSeen,true);
});

test('SSE without terminal [DONE] remains incomplete even when text ends in punctuation',async()=>{
 const code=extract('async function consumeAiStream(', 'function joinChatContinuation(');
 const sandbox={ReadableStream,TextDecoder,TextEncoder};
 vm.createContext(sandbox);
 vm.runInContext(code+'\nthis.parseStream=consumeAiStream;',sandbox);
 const encoder=new TextEncoder();
 const body=new ReadableStream({start(c){
  c.enqueue(encoder.encode('data: {"response":"প্রথম অংশটি শেষ।"}\n\n'));c.close();
 }});
 const result=await sandbox.parseStream(new Response(body),()=>{});
 assert.equal(result.complete,false);
});
