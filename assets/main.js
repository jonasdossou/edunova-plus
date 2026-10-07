(function(){
"use strict";
function load(u){return fetch(u,{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return null})}
var done=false;
function go(r){if(done)return;done=true;r=r||[];
 function it(x){return (x&&x.items)||[]}
 boot(r[0]||{},it(r[1]),it(r[2]),it(r[3]),it(r[4]),it(r[5]))}
Promise.all(['data/config.json','data/actualites.json','data/evenements.json','data/equipe.json','data/partenaires.json','data/programmes.json'].map(load)).then(go);
setTimeout(function(){go(null)},6000);
function slugify(t){return String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)}
function boot(C,NEWS,EVENTS,TEAM,PARTS,PROGD){
NEWS.concat(EVENTS).forEach(function(x){x.date=String(x.date||'').slice(0,10);if(!x.id)x.id=slugify(x.titre)+'-'+x.date});
EVENTS.forEach(function(x){if(x.annuel&&x.mois){var n=new Date(),y=n.getFullYear(),m=+x.mois;if(n.getMonth()+1>m)y++;x.date=y+'-'+String(m).padStart(2,'0')+'-01';x.fin=y+'-'+String(m).padStart(2,'0')+'-'+new Date(y,m,0).getDate()}});

var PROGS={'imarra':'Imarra','espace-agora':'Espace Agora','acquis':'Acquis','samedi-plus':'Samedi+','tremplin-plus':'Tremplin+','imarra-echos':'Imarra Échos','nafasi':'Nafasi','jaano':'Jaano'};
PROGD=(PROGD||[]).filter(function(p){return p&&p.id&&p.nom}).sort(function(a,b){return (a.ordre||99)-(b.ordre||99)});PROGD.forEach(function(p){PROGS[p.id]=p.nom});
var CATS=['Edunova+','Programmes','Événements','Opportunités','Témoignages','Ressources'];
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var ARROW='<svg viewBox="0 0 20 20" aria-hidden="true" width="16" height="16"><path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var MK=(document.querySelector('.hero-mark')||document.querySelector('.ph .mk')||{}).outerHTML||'';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function d(iso){return new Date(String(iso)+'T12:00:00')}
function fmt(iso){var x=d(iso);return isNaN(x)?'':x.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}
function today(){var t=new Date();return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0')}
function excerpt(b,n){b=String(b||'').replace(/\s+/g,' ').trim();n=n||150;return b.length>n?b.slice(0,n).replace(/\s\S*$/,'')+'…':b}
function paras(t){return String(t||'').split(/\n\s*\n/).map(function(p){return p.trim()}).filter(Boolean).map(function(p){return '<p>'+esc(p).replace(/\n/g,'<br>')+'</p>'}).join('')}
function safeUrl(u){u=String(u||'').trim();return /^(https?:\/\/|\/|mailto:|tel:|[a-z0-9\-_\/.]+$)/i.test(u)&&!/^javascript:/i.test(u)?u:'#'}
function inline(s){
 s=esc(s);
 s=s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g,function(m,a,u){return '<img src="'+safeUrl(u.replace(/&amp;/g,'&'))+'" alt="'+a+'" loading="lazy" onerror="this.remove()">'});
 s=s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,function(m,t,u){var h=safeUrl(u.replace(/&amp;/g,'&'));return '<a href="'+h+'"'+(/^https?:/.test(h)?' target="_blank" rel="noopener"':'')+'>'+t+'</a>'});
 s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_]+)__/g,'<strong>$1</strong>');
 s=s.replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>').replace(/(^|[\s(])_([^_\n]+)_/g,'$1<em>$2</em>');
 return s}
function md(t){
 var lines=String(t||'').replace(/\r/g,'').split('\n'),out=[],buf=[],list=null;
 function flush(){if(buf.length){out.push('<p>'+inline(buf.join(' '))+'</p>');buf=[]}}
 function close(){if(list){out.push('</'+list+'>');list=null}}
 lines.forEach(function(l){var m;
  if(!l.trim()){flush();close();return}
  if((m=/^(#{2,4})\s+(.*)$/.exec(l))){flush();close();var n=Math.min(m[1].length,3);out.push('<h'+n+'>'+inline(m[2])+'</h'+n+'>');return}
  if(/^#\s+/.test(l)){flush();close();out.push('<h2>'+inline(l.replace(/^#\s+/,''))+'</h2>');return}
  if((m=/^>\s?(.*)$/.exec(l))){flush();close();out.push('<blockquote><p>'+inline(m[1])+'</p></blockquote>');return}
  if((m=/^\s*[-*+]\s+(.*)$/.exec(l))){flush();if(list!=='ul'){close();out.push('<ul>');list='ul'}out.push('<li>'+inline(m[1])+'</li>');return}
  if((m=/^\s*\d+[.)]\s+(.*)$/.exec(l))){flush();if(list!=='ol'){close();out.push('<ol>');list='ol'}out.push('<li>'+inline(m[1])+'</li>');return}
  if(/^!\[[^\]]*\]\([^)]+\)\s*$/.test(l.trim())){flush();close();out.push(inline(l.trim()));return}
  close();buf.push(l.trim())});
 flush();close();return out.join('')}
function plain(t){return String(t||'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/^[#>\-*+\s]+|\d+[.)]\s+/gm,'').replace(/[*_`]/g,'').replace(/\s+/g,' ').trim()}
function readTime(t){var w=plain(t).split(' ').filter(Boolean).length;return Math.max(1,Math.round(w/200))+' min de lecture'}
function q(k){var m=new RegExp('[?&]'+k+'=([^&#]*)').exec(location.search);return m?decodeURIComponent(m[1].replace(/\+/g,' ')):''}
var tones=['','o','m'];
function ph(tone,img,alt){var mk=document.querySelector('.ph .mk');return '<div class="ph '+(tone||'')+'">'+(mk?mk.outerHTML:'')+(img?'<img src="'+esc(img)+'" alt="'+esc(alt||'')+'" loading="lazy" onerror="this.remove()">':'')+'</div>'}
function toast(h){var t=$('#toast');if(!t)return;t.innerHTML=h;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('on')},4200)}

NEWS.sort(function(a,b){return String(b.date).localeCompare(String(a.date))});
function upcoming(){var t=today();return EVENTS.filter(function(e){return (e.fin||e.date)>=t}).sort(function(a,b){return a.date.localeCompare(b.date)})}
function past(){var t=today();return EVENTS.filter(function(e){return (e.fin||e.date)<t}).sort(function(a,b){return b.date.localeCompare(a.date)})}

function newsCard(a,i){
 return '<a class="card rv d'+(i%3)+'" href="article.html?id='+encodeURIComponent(a.id)+'">'+ph(tones[i%3],a.image,'')+
 '<div class="b"><div class="top"><span class="tag">'+esc(a.categorie)+'</span><span>'+fmt(a.date)+'</span></div><h3>'+esc(a.titre)+'</h3><p>'+esc(excerpt(plain(a.extrait||a.texte)))+'</p><p class="meta2">'+readTime(a.texte)+'</p><span class="link">Lire l’article '+ARROW+'</span></div></a>'}
function evRow(e,isPast){
 var x=d(e.date);
 return '<a class="ev rv'+(isPast?' past':'')+'" href="evenement.html?id='+encodeURIComponent(e.id)+'"><div class="cal" aria-hidden="true">'+(e.periode?'<b style="font-size:20px">'+x.toLocaleDateString('fr-FR',{month:'short'})+'</b><span>chaque année</span>':'<b>'+x.getDate()+'</b><span>'+x.toLocaleDateString('fr-FR',{month:'short'})+' '+x.getFullYear()+'</span>')+'</div>'+
 '<div><h3>'+esc(e.titre)+'</h3><p class="meta">'+(e.periode?'Période : '+esc(e.periode):fmt(e.date))+(e.heure?' · '+esc(e.heure):'')+(e.lieu?' · '+esc(e.lieu):'')+'</p><p>'+esc(excerpt(e.texte,120))+'</p></div>'+ph('m',e.image,'')+'</a>'}
function empty(title,text){return '<div class="empty rv"><h3>'+title+'</h3>'+(text?'<p>'+text+'</p>':'')+'</div>'}
function share(title){var u=encodeURIComponent(location.href),t=encodeURIComponent(title+' | Edunova+');
 return '<div class="share"><b>Partager</b><a href="https://wa.me/?text='+t+'%20'+u+'" target="_blank" rel="noopener">WhatsApp</a><a href="https://www.facebook.com/sharer/sharer.php?u='+u+'" target="_blank" rel="noopener">Facebook</a><a href="https://www.linkedin.com/sharing/share-offsite/?url='+u+'" target="_blank" rel="noopener">LinkedIn</a><button type="button" data-copy>Copier le lien</button></div>'}
function hideIfEmpty(el,isEmpty){var s=el.closest('[data-hide-empty]');if(s)s.classList.toggle('is-empty',isEmpty)}

/* ---- Actualités ---- */
var curCat=CATS.indexOf(q('cat'))>-1?q('cat'):'Toutes';
var blogQ='', blogShown=9;
function featCard(a){return '<a class="feat rv" href="article.html?id='+encodeURIComponent(a.id)+'">'+ph('o',a.image,'')+'<div class="b"><span class="une">À la une</span><div class="top" style="display:flex;gap:10px;align-items:center;font-size:13px;color:var(--muted)"><span class="tag">'+esc(a.categorie)+'</span><span>'+fmt(a.date)+'</span></div><h2>'+esc(a.titre)+'</h2><p>'+esc(excerpt(plain(a.extrait||a.texte),220))+'</p><p class="meta2">'+(a.auteur?esc(a.auteur)+' · ':'')+readTime(a.texte)+'</p><span class="link">Lire l’article '+ARROW+'</span></div></a>'}
function renderBlog(el){
 var list=NEWS.filter(function(a){return curCat==='Toutes'||a.categorie===curCat});
 var qq=blogQ.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 if(qq)list=list.filter(function(a){return (a.titre+' '+plain(a.texte)+' '+(a.categorie||'')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').indexOf(qq)>-1});
 if(!list.length){el.innerHTML=empty(qq?'Aucun article ne correspond à « '+esc(blogQ)+' »':(curCat==='Toutes'?'Aucun article pour l’instant':'Aucun article dans « '+esc(curCat)+' » pour l’instant'),qq?'Essayez un autre mot, ou retirez le filtre de catégorie.':'Les prochains articles apparaîtront ici.');return}
 var feat=(!qq&&curCat==='Toutes')?list.shift():null, shown=list.slice(0,blogShown);
 el.innerHTML=(feat?featCard(feat):'')+(shown.length?'<div class="news">'+shown.map(newsCard).join('')+'</div>':'')+(list.length>blogShown?'<div class="more-wrap"><button type="button" class="btn btn-ghost" data-more>Voir plus d’articles ('+(list.length-blogShown)+')</button></div>':'');
}
function renderNews(el){
 if(el.hasAttribute('data-blog')){renderBlog(el);return}
 var list=NEWS.slice(), prog=el.getAttribute('data-programme'), lim=+el.getAttribute('data-limit')||0;
 if(prog)list=list.filter(function(a){return a.programme===prog});
 if(el.hasAttribute('data-filter')&&curCat!=='Toutes')list=list.filter(function(a){return a.categorie===curCat});
 if(lim)list=list.slice(0,lim);
 if(el.hasAttribute('data-quiet')){hideIfEmpty(el,!list.length);if(!list.length){el.innerHTML='';return}}
 el.innerHTML=list.length?'<div class="news">'+list.map(newsCard).join('')+'</div>':empty(curCat==='Toutes'?'Aucune actualité pour l’instant':'Aucun article dans « '+esc(curCat)+' » pour l’instant','Les prochaines actualités apparaîtront ici.');
}
function renderChips(){var el=$('#chips');if(!el)return;
 el.innerHTML=['Toutes'].concat(CATS).map(function(c){var n=c==='Toutes'?NEWS.length:NEWS.filter(function(a){return a.categorie===c}).length;if(c!=='Toutes'&&!n&&c!==curCat)return '';return '<button type="button" class="chip" data-cat="'+c+'" aria-pressed="'+(c===curCat)+'">'+c+'<small>'+n+'</small></button>'}).join('')}
$$('[data-news]').forEach(renderNews); renderChips();

var art=$('[data-article-detail]');
if(art){var a=NEWS.find(function(x){return x.id===q('id')});
 if(!a){art.innerHTML='<section class="wrap"><div class="phero on-band"><h1>Article introuvable</h1><p class="lead">Cet article n’existe pas ou a été retiré.</p></div></section><section class="sec"><div class="wrap"><a class="btn btn-primary" href="actualites.html">Voir toutes les actualités</a></div></section>'}
 else{document.title=a.titre+' | Edunova+';var others=NEWS.filter(function(x){return x.id!==a.id});var more=others.filter(function(x){return x.categorie===a.categorie}).concat(others.filter(function(x){return x.categorie!==a.categorie})).slice(0,3);var pb=document.createElement('div');pb.className='progress';pb.setAttribute('aria-hidden','true');document.body.appendChild(pb);window.addEventListener('scroll',function(){var ar=$('.art');if(!ar)return;var r=ar.getBoundingClientRect(),h=r.height-window.innerHeight;pb.style.width=Math.min(100,Math.max(0,(-r.top)/(h>0?h:1)*100))+'%'},{passive:true});var md_meta=document.querySelector('meta[name=description]');if(md_meta)md_meta.setAttribute('content',excerpt(plain(a.extrait||a.texte),160));
  art.innerHTML='<section class="sec" style="padding-top:clamp(40px,6vw,72px)"><div class="wrap"><article class="art"><p style="font-size:14px;color:var(--muted);margin-bottom:18px"><a href="index.html">Accueil</a> / <a href="actualites.html">Actualités</a></p>'+
  '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;font-size:14px;color:var(--muted)"><a class="tag" href="actualites.html?cat='+encodeURIComponent(a.categorie)+'">'+esc(a.categorie)+'</a><span>'+fmt(a.date)+'</span></div>'+
  '<h1 style="font-size:clamp(30px,4.4vw,50px);font-weight:800;letter-spacing:-.035em;margin-top:16px">'+esc(a.titre)+'</h1><p class="byline">'+(a.auteur?'Par <b>'+esc(a.auteur)+'</b> · ':'')+readTime(a.texte)+'</p>'+ph('o',a.image,a.titre)+'<div class="body">'+md(a.texte)+'</div>'+
  (a.programme&&PROGS[a.programme]?'<p style="margin-top:28px"><a class="link" href="programme-'+a.programme+'.html">Découvrir le programme '+PROGS[a.programme]+' '+ARROW+'</a></p>':'')+share(a.titre)+'</article>'+
  (more.length?'<h2 class="h2" style="margin:80px 0 28px">À lire aussi</h2><div class="news">'+more.map(newsCard).join('')+'</div>':'')+'</div></section>'}}

/* ---- Programmes (données modifiables depuis l'espace équipe) ---- */
var STAT={actif:'',developpement:'En développement',preparation:'Bientôt',realise:'Réalisé'},STATL={actif:'Actif',developpement:'En développement',preparation:'En préparation',realise:'Programme réalisé'};
var STATIC_PAGES=['imarra','espace-agora','acquis','samedi-plus','tremplin-plus','imarra-echos','nafasi','jaano'];
function plink(p){return STATIC_PAGES.indexOf(p.id)>-1?'programme-'+p.id+'.html':'programme.html?id='+encodeURIComponent(p.id)}
function mkSvg(){var m=document.querySelector('.ph .mk');return m?m.outerHTML:''}
function progCard(p,extra){var st=p.badge||STAT[p.statut]||'';return '<a class="prog'+(extra||'')+'" href="'+plink(p)+'"><div class="ph '+esc(p.ton||'')+'">'+mkSvg()+'<img src="'+esc(p.image||'images/programmes/'+p.id+'.jpg')+'" alt="" loading="lazy" onerror="this.remove()"><span class="nm">'+esc(p.nom)+'</span>'+(st?'<span class="stt">'+st+'</span>':'')+'</div><div class="b"><h3>'+esc(p.signature||'')+'</h3><p>'+esc(p.accroche||'')+'</p>'+(p.tags?'<p class="tags">'+esc(p.tags)+'</p>':'')+'<span class="link">Découvrir '+esc(p.nom)+' '+ARROW+'</span></div></a>'}
function progDetail(p){var parent=PROGD.find(function(q){return q.id===p.parent}),de=/^[aeiouéèêîô]/i.test(p.nom)?'d’':'de ',secs='';
 (p.sections||[]).forEach(function(s){secs+='<h2>'+esc(s.titre||'')+'</h2>';if(s.liste&&s.liste.length)secs+='<ul class="checks" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">'+s.liste.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>';if(s.texte)secs+=md(s.texte)});
 var fiche=[['Public',p.public],['Besoin auquel il répond',p.besoin],['Format',p.format],['Zone',p.zone],['Statut',p.statutTexte||STATL[p.statut]]].filter(function(x){return x[1]});
 var lead=p.titre&&p.titre!==p.signature?esc(p.signature||''):'';
 return '<section class="wrap"><div class="phero on-band"><div class="deco" aria-hidden="true"><i></i><i></i><i></i></div><p class="crumbs"><a href="index.html">Accueil</a> / <a href="programmes.html">Nos programmes</a> / '+esc(p.nom)+'</p><h1>'+esc(p.titre||p.nom)+'</h1>'+(lead?'<p class="lead">'+lead+'</p>':'')+'</div></section>'+
 '<section class="sec"><div class="wrap pd"><div class="rv prog-body">'+ph(p.ton||'',p.image||('images/programmes/'+p.id+'.jpg'),p.nom)+'<div class="prose" style="margin-top:28px">'+md(p.intro||'')+'</div>'+(parent?'<p style="margin-top:10px"><a class="link" href="'+plink(parent)+'">Voir le programme '+esc(parent.nom)+' '+ARROW+'</a></p>':'')+secs+(p.tags?'<p class="tags" style="margin-top:20px">'+esc(p.tags)+'</p>':'')+'</div>'+
 '<aside class="aside rv d2"><h3>'+esc(p.nom)+' en bref</h3>'+fiche.map(function(x){return '<p><b style="color:var(--ink)">'+x[0]+'</b><br>'+esc(x[1])+'</p>'}).join('')+(p.statut==='realise'?'':'<a class="btn btn-primary" href="rejoindre.html?profil=membre">'+(p.statut==='preparation'?'Être informé du lancement':'Je veux participer')+'</a>')+'<a class="btn btn-ghost" href="partenaires.html#devenir-partenaire">Soutenir ce programme</a></aside></div></section>'+
 '<section class="sec tight" data-hide-empty><div class="wrap"><h2 class="h2" style="margin-bottom:28px">Autour '+de+esc(p.nom)+'</h2><div data-news data-programme="'+esc(p.id)+'" data-limit="3" data-quiet></div></div></section>'+
 '<section class="sec tight"><div class="wrap"><h2 class="h2" style="margin-bottom:28px">Les autres programmes</h2><div class="rail">'+PROGD.filter(function(q){return q.id!==p.id}).map(function(q){return progCard(q)}).join('')+'</div></div></section>'}
if(PROGD.length){
 $$('[data-programmes]').forEach(function(el){var grid=el.getAttribute('data-programmes')==='grid';el.innerHTML=PROGD.map(function(p,i){return progCard(p,grid?' rv d'+(i%3):'')}).join('')});
 $$('[data-prog-footer]').forEach(function(el){el.innerHTML=PROGD.map(function(p){return '<li><a href="'+plink(p)+'">'+esc(p.nom)+'</a></li>'}).join('')});
 $$('[data-prog-glance]').forEach(function(el){el.innerHTML='<div class="tbl-glance"><table><thead><tr><th>Programme</th><th>Pour qui</th><th>Pour quoi</th></tr></thead><tbody>'+PROGD.map(function(p){var st=p.badge||STAT[p.statut]||'';return '<tr><td><a class="link" href="'+plink(p)+'">'+esc(p.nom)+'</a>'+(st?' <span class="stt-i">'+st+'</span>':'')+'</td><td>'+esc(p.public||'–')+'</td><td>'+esc(p.besoin||p.signature||'')+'</td></tr>'}).join('')+'</tbody></table></div>'});
 $$('[data-prog-detail]').forEach(function(el){var id=el.getAttribute('data-prog-detail')||q('id'),p=PROGD.find(function(x){return x.id===id});
  if(p){el.innerHTML=progDetail(p);document.title=p.nom+' | Edunova+';$$('[data-news]',el).forEach(renderNews)}else if(!el.getAttribute('data-prog-detail'))el.innerHTML='<section class="wrap"><div class="phero on-band"><h1>Programme introuvable</h1></div></section><section class="sec"><div class="wrap"><a class="btn btn-primary" href="programmes.html">Voir tous les programmes</a></div></section>'});
}
/* ---- Événements ---- */
$$('[data-events]').forEach(function(el){
 var k=el.getAttribute('data-events'), lim=+el.getAttribute('data-limit')||0, l=k==='passes'?past():upcoming();
 if(lim)l=l.slice(0,lim);
 el.innerHTML=l.length?'<div class="ev-list">'+l.map(function(e){return evRow(e,k==='passes')}).join('')+'</div>':
  (k==='passes'?empty('Pas encore d’événement passé',''):empty('Aucun événement annoncé pour l’instant','Inscrivez-vous à la newsletter en bas de page pour être prévenu du prochain rendez-vous.'));
});
var evd=$('[data-event-detail]');
if(evd){var e=EVENTS.find(function(x){return x.id===q('id')});
 if(!e){evd.innerHTML='<section class="wrap"><div class="phero on-band"><h1>Événement introuvable</h1><p class="lead">Cet événement n’existe pas ou a été retiré.</p></div></section><section class="sec"><div class="wrap"><a class="btn btn-primary" href="evenements.html">Voir les événements</a></div></section>'}
 else{document.title=e.titre+' | Edunova+';var isPast=(e.fin||e.date)<today(),when=e.periode?'Période : '+esc(e.periode):fmt(e.date);
  evd.innerHTML='<section class="wrap"><div class="phero on-band"><div class="deco" aria-hidden="true"><i></i><i></i><i></i></div><p class="crumbs"><a href="index.html">Accueil</a> / <a href="evenements.html">Événements</a></p><h1>'+esc(e.titre)+'</h1><p class="lead">'+when+(e.heure?' · '+esc(e.heure):'')+(e.lieu?' · '+esc(e.lieu):'')+'</p></div></section>'+
  '<section class="sec"><div class="wrap pd"><div>'+ph('o',e.image,e.titre)+'<h2 style="margin-top:36px">'+(isPast?'Ce qui s’est passé':'À propos de l’événement')+'</h2><div class="prose" style="margin-top:14px">'+paras(e.texte)+'</div></div>'+
  '<aside class="aside"><h3>'+(isPast?'Événement terminé':'Vous souhaitez participer ?')+'</h3><p>'+(e.periode?'<strong>Période :</strong> '+esc(e.periode):'<strong>Date :</strong> '+fmt(e.date))+(e.heure?'<br><strong>Heure :</strong> '+esc(e.heure):'')+'<br><strong>Lieu :</strong> '+esc(e.lieu||'À préciser')+(e.programme&&PROGS[e.programme]?'<br><strong>Programme :</strong> <a class="link" href="programme-'+e.programme+'.html">'+PROGS[e.programme]+'</a>':'')+'</p>'+
  (isPast?'<a class="btn btn-ghost" href="evenements.html">Voir les prochains événements</a>':'<a class="btn btn-primary" href="contact.html?objet='+encodeURIComponent('Participation : '+e.titre)+'">Je souhaite participer</a>')+share(e.titre)+'</aside></div></section>'}}

/* ---- Équipe ---- */
$$('[data-team]').forEach(function(el){
 var l=TEAM.filter(function(m){return (m.equipe||'dirigeante')===el.getAttribute('data-team')});
 hideIfEmpty(el,!l.length);
 el.innerHTML=l.length?'<div class="team">'+l.map(function(m,i){var p=String(m.nom).trim().split(/\s+/),ini=(p[0]||'')[0]+((p[p.length-1]||'')[0]||'');
  return '<div class="pers rv d'+(i%3)+'"><div class="ph '+tones[i%3]+'"><span class="ini" aria-hidden="true">'+esc(ini)+'</span>'+(m.photo?'<img src="'+esc(m.photo)+'" alt="'+esc(m.nom)+'" loading="lazy" onerror="this.remove()">':'')+'</div><h3>'+esc(m.nom)+'</h3><p class="role">'+esc(m.fonction)+'</p>'+(m.bio?'<p>'+esc(m.bio)+'</p>':'')+'</div>'}).join('')+'</div>':'';
});

/* ---- Partenaires ---- */
$$('[data-partners]').forEach(function(el){
 el.innerHTML=PARTS.length?'<div class="logos">'+PARTS.map(function(p,i){var inner=p.logo?'<img src="'+esc(p.logo)+'" alt="'+esc(p.nom)+'" loading="lazy" style="max-height:70%;max-width:80%;object-fit:contain">':esc(p.nom);return p.lien?'<a class="rv d'+(i%4)+'" href="'+esc(p.lien)+'" target="_blank" rel="noopener" style="aspect-ratio:3/2;border:1.5px solid var(--line);border-radius:var(--r-md);display:grid;place-items:center;background:#fff">'+inner+'</a>':'<div class="rv d'+(i%4)+'" style="border-style:solid;background:#fff">'+inner+'</div>'}).join('')+'</div>'
  :'<div class="empty rv"><h3>Vous souhaitez soutenir la jeunesse du Borgou ?</h3><p>Devenez l’un des premiers partenaires d’Edunova+.</p></div>';
});

/* ---- Coordonnées et réseaux ---- */
$$('[data-cfg]').forEach(function(el){var k=el.getAttribute('data-cfg'),v=C[k];
 if(!v){el.style.display='none';return}
 if(k==='telephone')el.innerHTML='<a href="tel:'+esc(v.replace(/\s/g,''))+'">'+esc(v)+'</a>';
 else if(k==='email')el.innerHTML='<a href="mailto:'+esc(v)+'">'+esc(v)+'</a>';
 else if(k==='taplink')el.innerHTML='<a href="'+esc(v)+'" target="_blank" rel="noopener">Nos réseaux sociaux</a>';
 else el.textContent=v;});
$$('[data-cfg-block]').forEach(function(el){if(!C[el.getAttribute('data-cfg-block')])el.style.display='none'});
var soc=[['facebook','Facebook'],['instagram','Instagram'],['linkedin','LinkedIn'],['youtube','YouTube']].filter(function(s){return C[s[0]]}).map(function(s){return '<a href="'+esc(C[s[0]])+'" target="_blank" rel="noopener">'+s[1]+'</a>'});
if(C.taplink)soc.unshift('<a href="'+esc(C.taplink)+'" target="_blank" rel="noopener">Tous nos réseaux</a>');
if(C.whatsapp)soc.push('<a href="https://wa.me/'+esc(C.whatsapp)+'" target="_blank" rel="noopener">WhatsApp</a>');
$$('[data-social]').forEach(function(el){el.innerHTML=soc.join('')});
$$('[data-social-block]').forEach(function(el){if(!soc.length)el.style.display='none'});
var wa=$('#wa');if(wa){if(C.whatsapp)wa.href='https://wa.me/'+C.whatsapp+'?text='+encodeURIComponent('Bonjour Edunova+, ');else wa.remove()}
$$('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
var objet=q('objet');if(objet&&$('#f-objet'))$('#f-objet').value=objet;
var prof=q('profil');if(prof){var map={membre:'Jeune / membre',benevole:'Bénévole',mentor:'Mentor',partenaire:'Partenaire'};var r=$('input[name="profil"][value="'+map[prof]+'"]');if(r)r.checked=true;$$('[data-profile]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-profile')===prof)})}

/* ---- Apparitions au défilement ---- */
if('IntersectionObserver' in window&&!reduce){
 var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
 window.__observe=function(root){$$('.rv:not(.in),.path:not(.in)',root).forEach(function(el){io.observe(el)})};
}else{window.__observe=function(root){$$('.rv,.path',root).forEach(function(el){el.classList.add('in')})}}
window.__observe(document);

/* ---- Diaporama d'accueil ---- */
var hero=$('#hero');
if(hero){var slides=$$('.slide',hero),dots=$$('.dots button',hero),i=0,timer;
 function show(n){slides[i].classList.remove('on');slides[i].setAttribute('aria-hidden','true');dots[i].classList.remove('on');
  i=(n+slides.length)%slides.length;slides[i].classList.add('on');slides[i].setAttribute('aria-hidden','false');
  var nd=dots[i].cloneNode(true);dots[i].parentNode.replaceChild(nd,dots[i]);dots[i]=nd;nd.classList.add('on')}
 function start(){clearInterval(timer);if(!reduce)timer=setInterval(function(){show(i+1)},7000)}
 hero.addEventListener('click',function(ev){var b=ev.target.closest('[data-go]');if(b){show(+b.getAttribute('data-go'));start()}});
 hero.addEventListener('mouseenter',function(){clearInterval(timer);hero.classList.add('paused')});
 hero.addEventListener('mouseleave',function(){hero.classList.remove('paused');start()});
 hero.addEventListener('focusin',function(){clearInterval(timer);hero.classList.add('paused')});
 start();}

/* ---- Clics ---- */
document.addEventListener('click',function(ev){
 var t=ev.target;
 var dm=t.closest('[data-dom]');
 if(dm){var n=dm.getAttribute('data-dom');$$('.dom-btn').forEach(function(b){b.setAttribute('aria-selected',b===dm)});$$('.dom-desc-m').forEach(function(p,k){p.hidden=String(k)!==n});$$('[data-dom-slide]').forEach(function(s){s.hidden=s.getAttribute('data-dom-slide')!==n});$('#dom-panel').setAttribute('aria-labelledby','dom-'+n);return}
 var rl=t.closest('[data-rail]');
 if(rl){var rail=$('#rail');rail.scrollBy({left:(+rl.getAttribute('data-rail'))*rail.clientWidth*.8,behavior:reduce?'auto':'smooth'});return}
 var ct=t.closest('[data-cat]');
 if(t.closest('[data-more]')){blogShown+=9;$$('[data-blog]').forEach(function(el){renderBlog(el);window.__observe(el)});return}
 if(ct){curCat=ct.getAttribute('data-cat');blogShown=9;renderChips();$$('[data-news][data-filter]').forEach(function(el){renderNews(el);window.__observe(el)});history.replaceState(null,'','actualites.html'+(curCat==='Toutes'?'':'?cat='+encodeURIComponent(curCat)));return}
 var pf=t.closest('[data-profile]');
 if(pf){var k=pf.getAttribute('data-profile'),map={membre:'Jeune / membre',benevole:'Bénévole',mentor:'Mentor',partenaire:'Partenaire'};$$('[data-profile]').forEach(function(b){b.setAttribute('aria-pressed',b===pf)});var r=$('input[name="profil"][value="'+map[k]+'"]');if(r){r.checked=true;r.closest('fieldset').classList.remove('bad')}$('#join-form').scrollIntoView({behavior:reduce?'auto':'smooth'});return}
 if(t.closest('[data-copy]')){var v=location.href;(navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(function(){toast('Lien copié.')},function(){toast('Copiez ce lien : '+esc(v))});return}
 /* Transition entre les pages */
 var a=t.closest('a[href]');
 if(a&&!reduce&&!ev.defaultPrevented&&ev.button===0&&!ev.metaKey&&!ev.ctrlKey&&!ev.shiftKey&&!ev.altKey&&!a.target&&!a.hasAttribute('download')){
  var href=a.getAttribute('href');
  if(/^[a-z0-9\-]+\.html/i.test(href)){
   var dest=href.split('#')[0].split('?')[0], cur=location.pathname.split('/').pop()||'index.html';
   if(dest===cur&&href.indexOf('#')>-1)return;
   ev.preventDefault();var w=$('#wipe');w.classList.add('in');try{sessionStorage.setItem('ew','1')}catch(e){}
   setTimeout(function(){location.href=href},470);}
 }
});
window.addEventListener('pageshow',function(e){if(e.persisted){var w=$('#wipe');if(w)w.classList.remove('in')}});
document.addEventListener('change',function(ev){var f=ev.target.closest('.field');if(f)f.classList.remove('bad')});
var sq=$('#blog-q');if(sq){var st;sq.addEventListener('input',function(){clearTimeout(st);st=setTimeout(function(){blogQ=sq.value;blogShown=9;$$('[data-blog]').forEach(function(el){renderBlog(el);window.__observe(el)})},180)})}

/* ---- Formulaires (envoi par e-mail via Web3Forms) ---- */
document.addEventListener('submit',function(ev){
 var form=ev.target;if(!form.hasAttribute('data-form'))return;ev.preventDefault();
 var isNl=form.classList.contains('nl-form'), msg=$(isNl?'.msg':'.form-msg',form), ok=true, first=null;
 if(isNl){var m=$('input[type=email]',form);if(!m.value.trim()||!m.checkValidity()){msg.textContent='Saisissez une adresse e-mail valide, par exemple nom@exemple.com.';m.focus();return}}
 else{
  $$('.field',form).forEach(function(f){if(f.matches('fieldset'))return;var c=$('input,select,textarea',f);if(!c)return;
   var bad=!c.checkValidity()||(c.required&&c.type!=='checkbox'&&!c.value.trim());f.classList.toggle('bad',bad);if(bad){ok=false;first=first||c}});
  $$('fieldset[data-req]',form).forEach(function(f){var bad=!$('input:checked',f);f.classList.toggle('bad',bad);if(bad){ok=false;first=first||$('input',f)}});
  if(!ok){first.focus();return}
 }
 if($('input[name=botcheck]',form)&&$('input[name=botcheck]',form).checked)return;
 if(!C.web3formsKey){msg.textContent='L’envoi n’est pas encore activé : ajoutez la clé Web3Forms dans contenu.js (voir LISEZMOI). En attendant, écrivez-nous sur WhatsApp.';return}
 var data={access_key:C.web3formsKey,subject:'Site Edunova+ : '+form.getAttribute('data-form'),from_name:'Site Edunova+',formulaire:form.getAttribute('data-form')};
 new FormData(form).forEach(function(v,k){if(k==='botcheck')return;data[k]=data[k]?data[k]+', '+v:v});
 var btn=$('button[type=submit]',form),label=btn.textContent;btn.disabled=true;btn.textContent='Envoi…';msg.textContent='';
 fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)})
 .then(function(r){return r.json()}).then(function(res){
  if(!res.success)throw new Error(res.message||'');
  if(isNl){msg.textContent='Merci ! Vous recevrez nos prochaines actualités.';form.reset();btn.disabled=false;btn.textContent=label;return}
  var name=(data.nom||'').split(' ')[0];
  form.parentNode.innerHTML='<div class="done" tabindex="-1"><div class="ok"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></div><h3>Merci'+(name?' '+esc(name):'')+' !</h3><p>Votre demande a bien été envoyée. L’équipe Edunova+ vous recontacte rapidement.</p><p style="margin-top:20px"><a class="link" href="index.html">Retour à l’accueil</a></p></div>';
  $('.done').focus();
 }).catch(function(){btn.disabled=false;btn.textContent=label;msg.textContent='L’envoi a échoué. Vérifiez votre connexion Internet et réessayez, ou écrivez-nous sur WhatsApp.'});
});

/* ---- Menu ---- */
var burger=$('#burger'),nav=$('#nav'),ddb=$('#dd-btn'),ddm=$('#dd-edu'),dd=$('.dd');
function closeMenu(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Ouvrir le menu');document.body.classList.remove('lock')}
burger.addEventListener('click',function(){var o=!nav.classList.contains('open');nav.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu');document.body.classList.toggle('lock',o)});
ddb.addEventListener('click',function(ev){ev.stopPropagation();var o=!ddm.classList.contains('open');ddm.classList.toggle('open',o);ddb.setAttribute('aria-expanded',o)});
dd.addEventListener('mouseenter',function(){if(window.innerWidth>1120){ddm.classList.add('open');ddb.setAttribute('aria-expanded','true')}});
dd.addEventListener('mouseleave',function(){if(window.innerWidth>1120){ddm.classList.remove('open');ddb.setAttribute('aria-expanded','false')}});
document.addEventListener('click',function(ev){if(!ev.target.closest('.dd')&&window.innerWidth>1120){ddm.classList.remove('open');ddb.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',function(ev){if(ev.key==='Escape'){if(ddm.classList.contains('open')){ddm.classList.remove('open');ddb.setAttribute('aria-expanded','false');ddb.focus()}else if(nav.classList.contains('open')){closeMenu();burger.focus()}}});
var hdr=$('#hdr');window.addEventListener('scroll',function(){hdr.classList.toggle('scrolled',window.scrollY>12)},{passive:true});
}
})();
