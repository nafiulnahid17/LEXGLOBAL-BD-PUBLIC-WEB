/** Local-only integration-test server; never deploy or use as an actual AI service. */
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import worker from '../worker/index.js';
const site=resolve(fileURLToPath(new URL('../site/',import.meta.url)));
const port=Number(process.env.PORT || 4175);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.txt':'text/plain'};
const env={
  AI:{run:async(_model,payload)=>{
    const query=payload?.messages?.at(-1)?.content||'';
    return {response:query.includes('SAMPLE DRAFT')?'নমুনা খসড়া: [নাম] [তারিখ] [বিবরণ]। তথ্য ও আইনি বিষয় আইনজীবীর মাধ্যমে যাচাই করুন।':query.includes('case')?'এটি পরীক্ষামূলক মামলা বিশ্লেষণ: ঘটনা সাজিয়ে লিখুন, নথি যাচাই করুন, এবং আইনজীবীর সঙ্গে আলোচনা করুন।':'হ্যালো! LexGlobal BD-তে স্বাগতম। সাধারণ আইনি বিষয় ব্যাখ্যা করতে পারি; নির্দিষ্ট তথ্য সরকারি উৎসে যাচাই করুন।'};
  }},
  LEGAL_SEARCH_INSTANCE:'',
  PUBLIC_AI_RATE:{limit:async()=>({success:true})},
  ASSETS:{fetch:async(request)=>{
    const url=new URL(request.url);let pathname=decodeURIComponent(url.pathname);
    if (pathname==='/' || pathname.startsWith('/public'))pathname='/index.html';
    const absolute=resolve(site,'.'+pathname);
    if(absolute!==site && !absolute.startsWith(site+sep))return new Response('Not Found',{status:404});
    try {const content=await readFile(absolute);return new Response(content,{headers:{'content-type':mime[extname(absolute)]||'application/octet-stream'}});}
    catch{return new Response('Not Found',{status:404});}
  }}
};
createServer(async(req,res)=>{
  try {
    const chunks=[];
    for await(const chunk of req)chunks.push(chunk);
    const url=`http://127.0.0.1:${port}${req.url}`;
    const request=new Request(url,{method:req.method,headers:req.headers,body:chunks.length?Buffer.concat(chunks):undefined});
    const output=await worker.fetch(request,env);
    res.writeHead(output.status,Object.fromEntries(output.headers));res.end(Buffer.from(await output.arrayBuffer()));
  }catch(e){res.writeHead(500);res.end(String(e.message));}
}).listen(port,'127.0.0.1',()=>console.log(`MOCK ONLY: http://127.0.0.1:${port}/public`));
