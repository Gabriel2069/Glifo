import {spawn} from 'node:child_process';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {randomBytes,pbkdf2Sync} from 'node:crypto';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
if(!process.env.GLIFO_TEST_PASSWORD)throw Error('Defina GLIFO_TEST_PASSWORD para verificar o acesso em um armazenamento temporário.');
const root=fileURLToPath(new URL('../',import.meta.url)),state=await mkdtemp(path.join(tmpdir(),'glifo-admin-test-'));
const bootstrapPath=path.join(root,'worker/admin-bootstrap.json'),originalBootstrap=await readFile(bootstrapPath,'utf8');
if(process.env.GLIFO_TEST_ISOLATED_BOOTSTRAP==='true'){const salt=randomBytes(16).toString('base64url'),iterations=100000,hash=pbkdf2Sync(process.env.GLIFO_TEST_PASSWORD,Buffer.from(salt,'base64url'),iterations,32,'sha256').toString('base64url');await writeFile(bootstrapPath,JSON.stringify({salt,iterations,hash}));}
const child=spawn(process.execPath,[path.join(root,'node_modules/wrangler/bin/wrangler.js'),'dev','--local','--port','8787','--ip','127.0.0.1','--persist-to',state],{cwd:root,env:{...process.env,WRANGLER_SEND_METRICS:'false'},stdio:['ignore','pipe','pipe']});let logs='';child.stdout.on('data',x=>logs=(logs+x).slice(-10000));child.stderr.on('data',x=>logs=(logs+x).slice(-10000));let ready=false;
try{for(let i=0;i<180;i++){try{const r=await fetch('http://127.0.0.1:8787/admin/');if(r.status===200){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,500))}if(!ready)throw Error('Servidor local indisponível: '+logs);await import('./admin-verify.mjs')}catch(e){console.error(e);process.exitCode=1}finally{child.kill('SIGTERM');await new Promise(r=>child.once('close',r));await rm(state,{recursive:true,force:true});if(process.env.GLIFO_TEST_ISOLATED_BOOTSTRAP==='true')await writeFile(bootstrapPath,originalBootstrap)}
