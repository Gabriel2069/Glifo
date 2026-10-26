import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
const dir=new URL('./ui/',import.meta.url);const read=name=>readFile(new URL(name,dir),'utf8');
function page(body,js,css,title){return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><meta name="color-scheme" content="dark"><meta name="theme-color" content="#0C1020"><title>'+title+'</title><link rel="icon" type="image/png" href="/brand/symbol.png"><link rel="apple-touch-icon" href="/brand/symbol.png"><style nonce="NONCE_PLACEHOLDER">'+css+'</style></head><body>'+body+'<script nonce="NONCE_PLACEHOLDER">'+js+'</script></body></html>'}
const css=await read('admin.css')+'\n'+await read('studio/studio.css'),title='Espaço interno · Glifo';
const login=page(await read('login.html'),await read('login.js'),css,title),admin=page(await read('admin.html'),await read('admin-client.js'),css,title),form=page(await read('form.html'),await read('form.js'),await read('form.css'),'Um projeto começa aqui · Glifo');
await writeFile(new URL('./views.mjs',import.meta.url),'export const loginView='+JSON.stringify(login)+';\nexport const adminView='+JSON.stringify(admin)+';\nexport const formView='+JSON.stringify(form)+';\n');

const result=await build({entryPoints:[new URL('studio/app.mjs',dir).pathname],bundle:true,format:'iife',platform:'browser',minify:true,write:false,target:'es2022'});
await writeFile(new URL('./studio-runtime.mjs',import.meta.url),'export const studioRuntime='+JSON.stringify(result.outputFiles[0].text)+';\n');
