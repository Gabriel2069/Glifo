import {ClientForms} from './forms.mjs';
import {catalog} from './catalog.mjs';
import {loginView,adminView,formView} from './views.mjs';
import bootstrap from './admin-bootstrap.json';
import library from './library.json';
const TTL=8*60*60*1000, MAX_BODY=768*1024;
const encode=bytes=>btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
const bytes=text=>Uint8Array.from(atob(text.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
const random=()=>encode(crypto.getRandomValues(new Uint8Array(32)));
async function digest(text){return encode(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text))));}
async function derive(password,salt,iterations=100000){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);return encode(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:bytes(salt),iterations,hash:'SHA-256'},key,256)));}
function equal(a,b){let v=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)v|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return v===0;}
const privateHeaders={'Cache-Control':'no-store, max-age=0','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{...privateHeaders,'Content-Type':'application/json; charset=utf-8',...extra}});}
function cookie(token,clear=false){return `__Host-glifo=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${clear?0:TTL/1000}`;}
const empty=()=>({projects:[],leads:[],tasks:[],notes:[],bookmarks:[],responses:[],checklists:[]});
const limits={projects:300,leads:500,tasks:1500,notes:500,bookmarks:500,responses:500,checklists:1000};
function validateState(state){
 if(!state||typeof state!=='object'||Array.isArray(state))return false;
 for(const key of Object.keys(state))if(!(key in limits))return false;
 for(const [key,limit]of Object.entries(limits)){
  if(!Array.isArray(state[key])||state[key].length>limit)return false;
  const ids=new Set();
  for(const item of state[key]){if(!item||typeof item!=='object'||typeof item.id!=='string'||item.id.length>120||ids.has(item.id))return false;ids.add(item.id);if(JSON.stringify(item).length>30000)return false;
   for(const field of ['name','client','service','stage','due','budget','scope','notes','contact','projectId','body','url','formId','templateId','updatedAt','createdAt'])if(item[field]!==undefined&&typeof item[field]!=='string')return false;
   if(['projects','leads','tasks','notes','bookmarks'].includes(key)&&(!item.name||typeof item.name!=='string'))return false;
   if(key==='responses'&&(!item.formId||!item.answers||typeof item.answers!=='object'||Array.isArray(item.answers)||Object.values(item.answers).some(v=>typeof v!=='string')))return false;
   if(key==='checklists'&&(!item.name||!Array.isArray(item.items)||item.items.length>80||item.items.some(i=>!i||typeof i.title!=='string'||typeof i.evidence!=='string'||!['PENDENTE','ATENDE','NÃO ATENDE','NÃO SE APLICA'].includes(i.state))))return false;
   if(item.url){try{if(new URL(item.url).protocol!=='https:')return false;}catch{return false;}}
  }
 }
 return true;
}
async function body(request){if(Number(request.headers.get('content-length')||0)>MAX_BODY)throw Error('size');const reader=request.body?.getReader();if(!reader)throw Error('body');let size=0,text='',decoder=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BODY){await reader.cancel();throw Error('size');}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();return JSON.parse(text);}
export class GlifoWorkspace{
 constructor(ctx,env){this.ctx=ctx;this.env=env;this.forms=new ClientForms(ctx.storage,{json,body,digest,random,empty,validateState});}
 async session(request){const token=request.headers.get('cookie')?.match(/(?:^|;\s*)__Host-glifo=([A-Za-z0-9_-]{43})(?:;|$)/)?.[1];if(!token)return null;const key='session:'+await digest(token),record=await this.ctx.storage.get(key);if(!record||record.expires<Date.now()){if(record)await this.ctx.storage.delete(key);return null;}return {key,...record};}
 async fetch(request){
  const path=new URL(request.url).pathname,method=request.method;
  try{
   if(path.startsWith('/api/forms/'))return await this.forms.public(request);
   if(path==='/api/admin/login'&&method==='POST'){
    const data=await body(request);if(typeof data.password!=='string'||data.password.length>128)return json({error:'Confira a senha.'},400);
    const now=Date.now(),ip=await digest(request.headers.get('CF-Connecting-IP')||'local');
    const blocked=await this.ctx.storage.transaction(async tx=>{let rate=await tx.get('attempt:'+ip);if(!rate||now>rate.until)rate={count:0,until:now+15*60*1000};if(rate.count>=5)return true;rate.count++;await tx.put('attempt:'+ip,rate);return false;});
    if(!await this.ctx.storage.getAlarm())await this.ctx.storage.setAlarm(now+15*60*1000);
    if(blocked)return json({error:'Muitas tentativas. Aguarde 15 minutos para tentar novamente.'},429,{'Retry-After':'900'});
    const verifier=await this.ctx.storage.get('password')||bootstrap;
    if(!equal(await derive(data.password,verifier.salt,verifier.iterations),verifier.hash))return json({error:'A senha não confere.'},401);
    const token=random();await this.ctx.storage.put('session:'+await digest(token),{expires:now+TTL});await this.ctx.storage.delete('attempt:'+ip);
    if(!await this.ctx.storage.getAlarm())await this.ctx.storage.setAlarm(now+TTL);
    return json({ok:true},200,{'Set-Cookie':cookie(token)});
   }
   const session=await this.session(request);if(!session)return json({error:'Entre novamente para continuar.'},401);
   if(path==='/api/admin/session'&&method==='GET')return json({ok:true,expires:session.expires});
   if(path==='/api/admin/logout'&&method==='POST'){await this.ctx.storage.delete(session.key);return json({ok:true},200,{'Set-Cookie':cookie('',true)});}
   if(path==='/api/admin/library'&&method==='GET')return json(catalog(library));
   if(path.startsWith('/api/admin/form-links'))return await this.forms.admin(request);
   if(path==='/api/admin/password'&&method==='PUT'){
    const data=await body(request),old=await this.ctx.storage.get('password')||bootstrap;
    if(typeof data.current!=='string'||!equal(await derive(data.current,old.salt,old.iterations),old.hash))return json({error:'A senha atual não confere.'},400);
    if(typeof data.password!=='string'||data.password.length<4||data.password.length>128)return json({error:'Use entre 4 e 128 caracteres.'},400);
    const salt=encode(crypto.getRandomValues(new Uint8Array(24)));await this.ctx.storage.put('password',{salt,iterations:100000,hash:await derive(data.password,salt)});
    const all=await this.ctx.storage.list({prefix:'session:'});for(const key of all.keys())if(key!==session.key)await this.ctx.storage.delete(key);
    return json({ok:true});
   }
   if(path==='/api/admin/workspace'&&method==='GET')return json(await this.ctx.storage.get('workspace')||{version:0,state:empty(),updatedAt:null});
   if(path==='/api/admin/workspace'&&method==='PUT'){
    const data=await body(request);if(!validateState(data.state))return json({error:'O arquivo contém dados inválidos ou excede os limites do espaço.'},400);
    const expected=Number(request.headers.get('if-match'));if(!request.headers.has('if-match')||!Number.isInteger(expected))return json({error:'Recarregue o espaço antes de salvar.'},428);
    return await this.ctx.storage.transaction(async tx=>{const current=await tx.get('workspace')||{version:0,state:empty()};if(current.version!==expected)return json({error:'Há uma versão mais recente. Exporte sua cópia local e recarregue antes de continuar.'},409);const record={version:current.version+1,state:data.state,updatedAt:new Date().toISOString()};await tx.put('workspace',record);return json(record);});
   }
   return json({error:'Caminho não encontrado.'},404);
  }catch{return json({error:'Não foi possível processar este pedido. Confira os dados e tente novamente.'},400);}
 }
 async alarm(){const now=Date.now();for(const prefix of ['session:','attempt:','form-attempt:']){const rows=await this.ctx.storage.list({prefix});for(const[key,value]of rows)if((value.expires||value.until)<=now)await this.ctx.storage.delete(key);}const remaining=await this.ctx.storage.list({prefix:'session:',limit:1}),attempts=await this.ctx.storage.list({prefix:'attempt:',limit:1});const formAttempts=await this.ctx.storage.list({prefix:'form-attempt:',limit:1});if(remaining.size||attempts.size||formAttempts.size)await this.ctx.storage.setAlarm(now+15*60*1000);}
}
function view(html){const nonce=random();return new Response(html.replaceAll('NONCE_PLACEHOLDER',nonce),{headers:{...privateHeaders,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':`default-src 'self'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'`}});}
export default{async fetch(request,env){
 const url=new URL(request.url);let path;try{path=decodeURIComponent(url.pathname);}catch{return new Response('Pedido inválido',{status:400});}
 const formPage=/^\/responder\/[A-Za-z0-9_-]{43}\/?$/.test(path);
 const protectedPath=formPage||path==='/admin'||path.startsWith('/admin/')||path.startsWith('/api/admin/')||path.startsWith('/api/forms/');
 if(!protectedPath)return env.ASSETS.fetch(request);
 if(!env.WORKSPACE)return json({error:'O espaço interno ainda não foi habilitado nesta publicação.'},503);
 const stub=env.WORKSPACE.get(env.WORKSPACE.idFromName('glifo-workspace-v1'));
 if(path.startsWith('/api/admin/')||path.startsWith('/api/forms/')){
  if(request.method!=='GET'&&request.headers.get('Origin')!==url.origin)return json({error:'Origem não permitida.'},403);
  if(request.method!=='GET'&&!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato não permitido.'},415);
  const inner=new URL(request.url);inner.pathname=path;return stub.fetch(new Request(inner,request));
 }
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}});
 if(formPage)return view(formView);
 if(path!=='/admin'&&path!=='/admin/')return new Response('Não encontrado',{status:404,headers:privateHeaders});
 const session=await stub.fetch(new Request(new URL('/api/admin/session',request.url),request));return view(session.ok?adminView:loginView);
}};
