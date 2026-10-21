import library from './library.json';
const tokenPattern=/^[A-Za-z0-9_-]{43}$/;
const templates=library.artifacts.filter(r=>r.kind==='FORM'&&r.questions?.length);
const clientGuidance={
 'GLF-BR-01':'Leva cerca de 5 a 7 minutos. Conte o que você tem em mente; os detalhes e o orçamento serão conversados depois.',
 'GLF-BR-02':'Pense no negócio como um todo. Se alguma decisão ainda estiver em aberto, conte sua dúvida na resposta.',
 'GLF-BR-03':'Envie links e exemplos do que já existe. Explique o que funciona e onde você sente falta de clareza ou continuidade.',
 'GLF-BR-04':'Conte o que a marca precisa expressar. Nas referências, explique o que chama sua atenção e por quê.',
 'GLF-BR-05':'Vamos olhar para a identidade atual. Conte o que merece permanecer e o que já não acompanha o projeto.',
 'GLF-BR-06':'Comece pelo que as pessoas precisam encontrar e fazer no site. Não é necessário conhecer termos técnicos.',
 'GLF-BR-07':'Reúna os materiais por página. Se algum texto ou imagem ainda não estiver pronto, indique o que falta.',
 'GLF-BR-08':'Conte como você usa os canais hoje e o que consegue manter na rotina. Podemos definir a frequência juntos.',
 'GLF-BR-09':'Explique quem vai ler ou assistir, em que situação e com qual objetivo. Se já houver conteúdo, compartilhe a versão disponível.',
 'GLF-BR-10':'Identifique a peça, onde ela será usada e o prazo. Inclua as medidas ou especificações que você já recebeu.',
 'GLF-BR-11':'Informe apenas plataformas, responsáveis e tipos de acesso necessários. Não envie senhas, tokens, códigos de autenticação ou chaves de API.',
 'GLF-BR-12':'Tenha em mãos a versão que está avaliando. Reúna os comentários e indique a página, peça ou trecho de cada ajuste.',
 'GLF-BR-13':'Conte com liberdade como foi a experiência. Seu retorno não condiciona o suporte; publicar um depoimento depende de autorização separada.',
 'GLF-LG-03':'Confirme a proposta e a versão do anexo antes de responder. Este registro não substitui os instrumentos adicionais necessários ao caso.',
 'GLF-LG-06':'Identifique os materiais e os usos que você está autorizando. Responda somente sobre direitos que você pode autorizar.',
 'GLF-LG-07':'A autorização de portfólio é opcional. Indique os materiais, os canais e quaisquer limites para a divulgação.',
 'GLF-EN-03':'Confira as versões e os arquivos entregues. Registre as pendências antes do aceite; o registro não elimina direitos previstos em lei.'
};
const snapshot=r=>({id:r.id,title:r.title,version:r.version,description:r.description,guidance:clientGuidance[r.id],questions:r.questions.map(q=>({...q,type:/resposta curta/i.test(q.help||'')?'text':q.type,help:q.help==='*'?'':(q.help||'').replace(/^\*\s*/, '').replace(/^\(resposta curta\)$/i,'')}))});
export class ClientForms{
 constructor(storage,helpers){this.storage=storage;Object.assign(this,helpers);}
 async admin(request){
  const path=new URL(request.url).pathname,method=request.method;
  if(path==='/api/admin/form-links'&&method==='GET'){
   const rows=await this.storage.list({prefix:'form-link:',limit:500});
   return this.json({links:[...rows.values()].map(({template,...r})=>({...r,title:template.title,status:r.status==='open'&&Date.parse(r.expiresAt)<=Date.now()?'expired':r.status})).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))});
  }
  if(path==='/api/admin/form-links'&&method==='POST'){
   const d=await this.body(request),r=templates.find(r=>r.id===d.formId);
   if(!r||typeof d.name!=='string'||!d.name.trim()||d.name.length>140||typeof(d.message||'')!=='string'||(d.message||'').length>800||typeof(d.projectId||'')!=='string'||![7,30,90].includes(d.days||30))return this.json({error:'Confira o formulário, a referência e a validade.'},400);
   const token=this.random(),id=await this.digest(token),now=new Date(),record={id,token,formId:r.id,name:d.name.trim(),message:(d.message||'').trim(),projectId:d.projectId||'',createdAt:now.toISOString(),expiresAt:new Date(+now+(d.days||30)*86400000).toISOString(),status:'open',template:snapshot(r)};
   return this.storage.transaction(async tx=>{
    const rows=await tx.list({prefix:'form-link:',limit:500});if(rows.size>=500)return this.json({error:'O espaço já tem 500 links. Organize os registros antes de criar mais.'},409);
    const workspace=await tx.get('workspace');if(record.projectId&&!workspace?.state.projects.some(p=>p.id===record.projectId))return this.json({error:'O projeto vinculado não foi encontrado.'},400);
    await tx.put('form-link:'+id,record);const {template,...safe}=record;return this.json({...safe,title:template.title},201);
   });
  }
  const match=path.match(/^\/api\/admin\/form-links\/([A-Za-z0-9_-]{43})\/revoke$/);
  if(match&&method==='POST')return this.storage.transaction(async tx=>{
   const key='form-link:'+match[1],r=await tx.get(key);if(!r)return this.json({error:'Link não encontrado.'},404);
   if(r.status==='open'){r.status='revoked';await tx.put(key,r);}return this.json({ok:true});
  });
  return this.json({error:'Caminho não encontrado.'},404);
 }
 async public(request){
  const token=new URL(request.url).pathname.match(/^\/api\/forms\/([A-Za-z0-9_-]{43})\/?$/)?.[1];
  if(!token||!tokenPattern.test(token))return this.json({error:'Este link não foi encontrado.'},404);
  const key='form-link:'+await this.digest(token),record=await this.storage.get(key),method=request.method;
  if(!record)return this.json({error:'Este link não foi encontrado.'},404);
  if(!['GET','POST'].includes(method))return this.json({error:'Método não permitido.'},405);
  if(record.status==='revoked'||Date.parse(record.expiresAt)<=Date.now())return this.json({error:'Este link foi encerrado ou venceu. Fale com Tadeu para receber outro.'},410);
  if(method==='GET'){
   if(record.status==='submitted')return this.json({status:'submitted',receipt:record.receipt,submittedAt:record.submittedAt});
   return this.json({status:'open',form:record.template,message:record.message,expiresAt:record.expiresAt});
  }
  const d=await this.body(request);
  if(typeof d.requestId!=='string'||!/^[a-zA-Z0-9-]{20,80}$/.test(d.requestId)||typeof d.respondent!=='string'||!d.respondent.trim()||d.respondent.length>100||!d.answers||typeof d.answers!=='object'||Array.isArray(d.answers)||JSON.stringify(d.answers).length>16000)return this.json({error:'Confira seu nome e as respostas. O conjunto pode ter até 16 mil caracteres.'},400);
  const conditions=d.conditions||{},allowed=new Set(record.template.questions.map(q=>q.id)),flags=new Set(record.template.questions.map(q=>q.condition).filter(Boolean));
  if(typeof conditions!=='object'||Array.isArray(conditions)||Object.entries(conditions).some(([k,v])=>!flags.has(k)||typeof v!=='boolean')||Object.keys(d.answers).some(k=>!allowed.has(k)))return this.json({error:'O formulário contém campos desconhecidos.'},400);
  const answers={};for(const q of record.template.questions){
   if(q.condition&&!conditions[q.condition])continue;
   const value=d.answers[q.id]??'';
   if(typeof value!=='string'||value.length>2000||(q.required&&!value.trim()))return this.json({error:'Confira a resposta: '+q.label,field:q.id},400);
   answers[q.id]=value.trim();
  }
  const now=Date.now(),ip=await this.digest(request.headers.get('CF-Connecting-IP')||'local');
  if(!await this.storage.getAlarm())await this.storage.setAlarm(now+600000);
  return this.storage.transaction(async tx=>{
   const current=await tx.get(key);
   if(current.status==='submitted')return current.requestId===d.requestId?this.json({ok:true,receipt:current.receipt,submittedAt:current.submittedAt}):this.json({error:'Este link já recebeu uma resposta.'},409);
   if(current.status!=='open'||Date.parse(current.expiresAt)<=Date.now())return this.json({error:'Este link não aceita mais respostas.'},410);
   let rate=await tx.get('form-attempt:'+ip);if(!rate||rate.until<now)rate={count:0,until:now+600000};if(rate.count>=10)return this.json({error:'Aguarde alguns minutos antes de tentar novamente.'},429,{'Retry-After':'600'});rate.count++;await tx.put('form-attempt:'+ip,rate);
   const workspace=await tx.get('workspace')||{version:0,state:this.empty()};
   const receipt=crypto.randomUUID(),submittedAt=new Date(now).toISOString();
   const compact={id:current.template.id,title:current.template.title,version:current.template.version,questions:current.template.questions.map(({id,label,section,condition})=>({id,label,section,condition}))};
   const response={id:receipt,formId:current.formId,name:current.name+' · '+d.respondent.trim(),respondent:d.respondent.trim(),projectId:current.projectId,answers,conditions,source:'client',linkId:current.id,template:compact,createdAt:submittedAt,updatedAt:submittedAt,submittedAt};
   const next={...workspace,version:workspace.version+1,state:{...workspace.state,responses:[response,...workspace.state.responses]},updatedAt:submittedAt};
   if(!this.validateState(next.state)||new TextEncoder().encode(JSON.stringify(next)).length>740000)return this.json({error:'Não foi possível receber agora. Suas respostas continuam nesta aba. Fale com Tadeu antes de tentar novamente.'},503);
   await tx.put('workspace',next);await tx.put(key,{...current,status:'submitted',requestId:d.requestId,receipt,submittedAt});
   return this.json({ok:true,receipt,submittedAt},201);
  });
 }
}
