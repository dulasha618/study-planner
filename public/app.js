var KEY='studyplanner-v2',LOCAL=(typeof FORCE_LOCAL!=='undefined'),tab='plan',editId=null,showSw=false,spin=false,tm=null,accent=ls('sp-accent')||'blue';
var ACC=[['blue','#2563eb'],['indigo','#4f46e5'],['teal','#0d9488'],['rose','#e11d48'],['orange','#ea580c'],['slate','#334155']];
var lang=ls('sp-lang')||'en',theme=ls('sp-theme')||'auto';
var S={perDay:3,startTime:'16:00',subjects:[]};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}

var D={
en:{title:'Study Planner',summary:'{d} of {n} tasks done · {p}% overall',plan:'Plan',subjects:'Subjects',progress:'Progress',
 perDay:'Tasks per day',startAt:'Start at',makePlan:'Make my plan',today:'Today',missed:'(missed)',notSched:'Not scheduled yet',
 nothing:'Nothing left to do. Add tasks in Subjects.',noSubj:'No subjects yet. Open the Subjects tab and add your first subject.',
 pressPlan:'Press “Make my plan” to spread these over the coming days.',newSubj:'New subject name',addSubj:'Add subject',taskName:'Task name',
 part:'Part',assignment:'Assignment',due:'due',days:'Days',minutes:'Min/day',add:'Add',save:'Save',cancel:'Cancel',editTask:'Edit task',
 logTime:'Log time',logQ:'Minutes studied?',delSubj:'Delete this subject and all its tasks?',rename:'Subject name',finished:'finished',
 studied:'studied',bySubject:'Work finished per subject',hours7:'Time studied, last 7 days',dueSoon:'Due soon',overdue:'overdue',
 enableRem:'Enable reminders',exportCsv:'Export CSV',print:'Print / PDF',total:'total',studiedToday:'Studied today',streak:'Day streak',tasksDone:'Tasks done',focusTimer:'Focus timer',start:'Start',pause:'Pause',stopLog:'Stop & log',colour:'Colour',gm:'Good morning',ga:'Good afternoon',ge:'Good evening'},
si:{title:'පාඩම් සැලසුම',summary:'කාර්ය {n} න් {d} ක් අවසන් · {p}%',plan:'සැලසුම',subjects:'විෂයයන්',progress:'ප්‍රගතිය',
 perDay:'දිනකට කාර්ය',startAt:'ආරම්භය',makePlan:'සැලසුම සාදන්න',today:'අද',missed:'(මඟහැරුණි)',notSched:'තවම සැලසුම් කර නැත',
 nothing:'කිසිවක් ඉතිරි නැත. විෂයයන් තුළ කාර්ය එක් කරන්න.',noSubj:'තවම විෂයයන් නැත. විෂයයන් ටැබය විවෘත කර ඔබේ පළමු විෂය එක් කරන්න.',
 pressPlan:'“සැලසුම සාදන්න” ඔබා මේවා ඉදිරි දින වලට බෙදන්න.',newSubj:'නව විෂයයේ නම',addSubj:'විෂයක් එක් කරන්න',taskName:'කාර්යයේ නම',
 part:'කොටස',assignment:'පැවරුම',due:'අවසන් දිනය',days:'දින',minutes:'මිනිත්තු/දිනය',add:'එක් කරන්න',save:'සුරකින්න',cancel:'අවලංගු',editTask:'කාර්යය සංස්කරණය',
 logTime:'කාලය සටහන් කරන්න',logQ:'ඉගෙන ගත් මිනිත්තු ගණන?',delSubj:'මෙම විෂය සහ එහි සියලු කාර්ය මකන්නද?',rename:'විෂයයේ නම',finished:'අවසන් කළේ',
 studied:'ඉගෙන ගත්',bySubject:'විෂයයකට අවසන් කළ වැඩ',hours7:'පසුගිය දින 7 තුළ අධ්‍යයන කාලය',dueSoon:'ඉක්මනින් අවසන් වන',overdue:'කල් ඉකුත්',
 enableRem:'මතක් කිරීම් සක්‍රිය කරන්න',exportCsv:'CSV බාගන්න',print:'මුද්‍රණය / PDF',total:'මුළු',studiedToday:'අද ඉගෙන ගත්',streak:'දින පරම්පරාව',tasksDone:'අවසන් කාර්ය',focusTimer:'අවධාන ටයිමරය',start:'ආරම්භ',pause:'විරාම',stopLog:'නවත්වා සටහන් කරන්න',colour:'වර්ණය',gm:'සුබ උදෑසනක්',ga:'සුබ දහවලක්',ge:'සුබ සන්ධ්‍යාවක්'}};
var LOGO='<svg viewBox="0 0 64 64" width="46" height="46" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--acc)"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--acc) 62%,#000)"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#lg)"/><path d="M12 21q10-4 20 2v27q-10-5-20-2z" fill="#fff"/><path d="M52 21q-10-4-20 2v27q10-5 20-2z" fill="#fff" opacity=".82"/><circle cx="48" cy="16" r="9" fill="#22c55e" stroke="#fff" stroke-width="2.5"/><path d="M44 16.5l3 3 5.5-6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var REFRESH='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.6-4.4L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.6 4.4L21 15"/><path d="M21 20v-5h-5"/></svg>';
function T(k){return (D[lang]&&D[lang][k])||D.en[k]||k}

function uid(){return Math.random().toString(36).slice(2,9)}
function iso(d){var m=d.getMonth()+1,x=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(x<10?'0':'')+x}
function today(){return iso(new Date())}
function addDays(s,n){var d=new Date(s+'T00:00:00');d.setDate(d.getDate()+n);return iso(d)}
function loc(){return lang==='si'?'si-LK':undefined}
function label(s){return new Date(s+'T00:00:00').toLocaleDateString(loc(),{weekday:'short',day:'numeric',month:'short'})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(m){m=Math.round(m||0);return m>=60?Math.floor(m/60)+'h'+(m%60?' '+(m%60)+'m':''):m+'m'}
function toMin(s){var p=(s||'16:00').split(':');return (+p[0])*60+(+p[1]||0)}
function hhmm(n){n=n%1440;var h=Math.floor(n/60),m=n%60;return (h<10?'0':'')+h+':'+(m<10?'0':'')+m}
function sumLogs(l){return (l||[]).reduce(function(a,x){return a+(+x.m||0)},0)}
var COLORS=['#2563eb','#7c3aed','#0891b2','#059669','#d97706','#dc2626','#db2777','#475569'];

function norm(){S.perDay=S.perDay||3;S.startTime=S.startTime||'16:00';S.subjects=S.subjects||[];
 S.subjects.forEach(function(s){s.tasks.forEach(function(t){t.days=t.days||1;t.est=t.est||60;t.dates=t.dates||[];t.logs=t.logs||[]})})}
function saveLocal(){ls(KEY,JSON.stringify(S))}
function loadLocal(){try{var r=ls(KEY);if(r)S=JSON.parse(r)}catch(e){}norm()}
function api(m,u,b){return fetch(u,{method:m,headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined}).then(function(r){return r.json()})}
function reload(){return api('GET','/api/state').then(function(d){S=d;norm();render()})}
function commit(m,u,b){if(LOCAL){saveLocal();render()}else api(m,u,b).then(reload)}
function find(id){for(var i=0;i<S.subjects.length;i++){var s=S.subjects[i];for(var j=0;j<s.tasks.length;j++)if(s.tasks[j].id===id)return {s:s,t:s.tasks[j]}}}
function sub(id){return S.subjects.filter(function(s){return s.id===id})[0]}
function payload(t){return {t:t.t,kind:t.kind,due:t.due,days:t.days,est:t.est,dates:t.dates,done:t.done,doneOn:t.doneOn,logs:t.logs}}
function saveTask(t){commit('PATCH','/api/tasks/'+t.id,payload(t))}
function stats(s){var d=s.tasks.filter(function(t){return t.done}).length,m=0;s.tasks.forEach(function(t){m+=sumLogs(t.logs)});return {d:d,n:s.tasks.length,p:s.tasks.length?Math.round(d/s.tasks.length*100):0,m:m}}

function plan(){
 var queues=S.subjects.map(function(s){
  return s.tasks.filter(function(t){return !t.done}).sort(function(a,b){
   if(a.due&&b.due)return a.due<b.due?-1:a.due>b.due?1:0;if(a.due)return -1;if(b.due)return 1;return 0
  }).map(function(t){t.dates=[];return {t:t,rem:Math.max(1,t.days||1)}})});
 var day=today(),left=queues.reduce(function(n,q){return n+q.length},0),guard=0;
 while(left>0&&guard++<500){
  var c=0,used={},moved=true;
  while(c<S.perDay&&left>0&&moved){moved=false;
   for(var i=0;i<queues.length&&c<S.perDay;i++){var q=queues[i];
    if(q.length&&!used[q[0].t.id]){var h=q[0];h.t.dates.push(day);used[h.t.id]=1;c++;moved=true;if(--h.rem<=0){q.shift();left--}}}}
  day=addDays(day,1)}
 var items=[];S.subjects.forEach(function(s){s.tasks.forEach(function(t){if(!t.done)items.push({id:t.id,dates:t.dates})})});
 commit('POST','/api/plan',{items:items})}

function render(){
 var td=today(),all=0,done=0;
 S.subjects.forEach(function(s){all+=s.tasks.length;done+=stats(s).d});
 var sum=T('summary').replace('{d}',done).replace('{n}',all).replace('{p}',all?Math.round(done/all*100):0);
 var icon={auto:'◐',light:'☀',dark:'☾'}[theme];
 document.getElementById('head').innerHTML='<div class="hd"><div class="hl"><span class="logo">'+LOGO+'</span><div><h1>'+T('title')+'</h1><p class="sub">'+sum+'</p></div></div>'
  +'<div class="hb noprint"><button class="b g'+(spin?' spin':'')+'" data-act="refresh" aria-label="Refresh" title="Refresh">'+REFRESH+'</button><button class="b g" data-act="sw" aria-label="Colour">🎨</button><button class="b g" data-act="theme" aria-label="Theme">'+icon+'</button><button class="b g" data-act="lang">'+(lang==='en'?'සිං':'EN')+'</button></div></div>'+swatches();
 var nav='';[['plan','plan'],['subjects','subjects'],['progress','progress']].forEach(function(x){nav+='<button data-act="tab" data-v="'+x[0]+'" class="'+(tab===x[0]?'on':'')+'"><span class="ni">'+{plan:'📅',subjects:'📚',progress:'📈'}[x[0]]+'</span><span>'+T(x[1])+'</span></button>'});
 document.getElementById('nav').innerHTML=nav;
 document.getElementById('view').innerHTML=tab==='plan'?viewPlan(td):tab==='subjects'?viewSubjects(td):viewProgress(td)}

function taskRow(s,t,td,mode,slot){
 var late=!t.done&&t.due&&t.due<td,lg=sumLogs(t.logs),meta=[T(t.kind==='assignment'?'assignment':'part')];
 if(t.due)meta.push(T('due')+' '+label(t.due));
 meta.push(fmt(t.est)+(t.days>1?' × '+t.days+' '+T('days'):''));
 if(lg)meta.push(T('studied')+' '+fmt(lg));
 if(t.done&&t.doneOn)meta.push(T('finished')+' '+label(t.doneOn));
 return '<div class="t'+(t.done?' done':'')+'"><input type="checkbox" data-act="tog" data-id="'+t.id+'"'+(t.done?' checked':'')+' aria-label="Done">'
 +'<div class="tt">'+(slot?'<span class="slot">'+slot+'</span>':'')+'<b class="ttl">'+esc(t.t)+'</b>'
 +'<div class="tag'+(late?' late':'')+'">'+(mode==='plan'?'<span class="chip" style="--c:'+s.color+'">'+esc(s.name)+'</span> ':'')+meta.join(' · ')+'</div></div>'
 +'<button class="x noprint" data-act="focus" data-id="'+t.id+'" title="'+T('focusTimer')+'">▶</button>'
 +'<button class="x noprint" data-act="log" data-id="'+t.id+'" title="'+T('logTime')+'">⏱</button>'
 +(mode==='plan'?'':'<button class="x noprint" data-act="edit" data-id="'+t.id+'" aria-label="Edit">✎</button><button class="x noprint" data-act="deltask" data-id="'+t.id+'" aria-label="Delete">×</button>')+'</div>'}

function greeting(){var dt=new Date(),hr=dt.getHours(),k=hr<12?'gm':hr<17?'ga':'ge';
 return '<div class="greet"><h2>'+T(k)+' 👋</h2><p>'+dt.toLocaleDateString(loc(),{weekday:'long',day:'numeric',month:'long'})+'</p></div>'}
function swatches(){return showSw?'<div class="sw noprint">'+ACC.map(function(c){return '<button data-act="accent" data-v="'+c[0]+'" aria-label="'+c[0]+'" class="'+(accent===c[0]?'on':'')+'" style="background:'+c[1]+'"></button>'}).join('')+'</div>':''}
function streak(td){var set={};S.subjects.forEach(function(s){s.tasks.forEach(function(t){t.logs.forEach(function(l){if(+l.m>0)set[l.d]=1})})});
 var n=0,d=set[td]?td:addDays(td,-1);while(set[d]){n++;d=addDays(d,-1)}return n}
function overview(td){var all=0,done=0,m=0;
 S.subjects.forEach(function(s){all+=s.tasks.length;done+=stats(s).d;s.tasks.forEach(function(t){t.logs.forEach(function(l){if(l.d===td)m+=(+l.m||0)})})});
 var p=all?Math.round(done/all*100):0;
 return '<div class="card ov"><svg class="ring" viewBox="0 0 80 80" role="img" aria-label="'+p+'%"><circle class="rb" cx="40" cy="40" r="34"/><circle class="rf" style="stroke-linecap:'+(p?'round':'butt')+'" cx="40" cy="40" r="34" stroke-dasharray="'+(p*2.136)+' 213.6" transform="rotate(-90 40 40)"/><text x="40" y="46" text-anchor="middle">'+p+'%</text></svg>'
 +'<div class="ovs"><div><b>'+fmt(m)+'</b><span>'+T('studiedToday')+'</span></div><div><b>'+streak(td)+'</b><span>'+T('streak')+'</span></div><div><b>'+done+'/'+all+'</b><span>'+T('tasksDone')+'</span></div></div></div>'}

function openTimer(id){var f=find(id);if(!f)return;tm={id:id,total:25*60,left:25*60,spent:0,iv:null};drawTimer();var d=document.getElementById('dlg');if(d.showModal)d.showModal()}
function mmss(n){var m=Math.floor(n/60),s=n%60;return (m<10?'0':'')+m+':'+(s<10?'0':'')+s}
function drawTimer(){var f=find(tm.id),run=!!tm.iv;
 document.getElementById('dlg').innerHTML='<h3 style="margin:0">'+T('focusTimer')+'</h3><div class="tag" style="margin-top:2px">'+esc(f.s.name)+' – '+esc(f.t.t)+'</div>'
 +'<div class="tmr" id="tm-time">'+mmss(tm.left)+'</div>'
 +'<div class="row" style="justify-content:center;margin-bottom:14px">'+(run||tm.spent?'':'<button class="b g" data-act="tmadj" data-v="-5">−5</button>')+'<button class="b" data-act="tmgo">'+(run?T('pause'):T('start'))+'</button>'+(run||tm.spent?'':'<button class="b g" data-act="tmadj" data-v="5">+5</button>')+'</div>'
 +'<div class="row" style="justify-content:center"><button class="b g" data-act="tmstop">'+T('stopLog')+'</button></div>'}
function tick(){tm.left--;tm.spent++;var e=document.getElementById('tm-time');if(e)e.textContent=mmss(tm.left);if(tm.left<=0)endTimer()}
function endTimer(){if(!tm)return;var x=tm;tm=null;clearInterval(x.iv);var mins=Math.round(x.spent/60),d=document.getElementById('dlg');
 if(d.open)d.close();var f=find(x.id);
 if(f&&mins>=1){f.t.logs.push({d:today(),m:mins});saveTask(f.t)}
 try{if('Notification' in window&&Notification.permission==='granted'&&x.left<=0)new Notification(T('focusTimer'),{body:mins+'m ✓'})}catch(e){}}

function viewPlan(td){
 var by={},un=[],due=[],h=greeting()+overview(td);
 S.subjects.forEach(function(s){s.tasks.forEach(function(t){
  if(t.done)return;
  if(t.due&&t.due<=addDays(td,2))due.push([s,t]);
  if(!t.dates.length){un.push([s,t]);return}
  t.dates.forEach(function(d){(by[d]=by[d]||[]).push([s,t])})})});
 if(due.length){due.sort(function(a,b){return a[1].due<b[1].due?-1:1});
  h+='<div class="card"><b>'+T('dueSoon')+'</b>'+due.map(function(p){var late=p[1].due<td;
   return '<div class="tag'+(late?' late':'')+'" style="margin-top:6px"><span class="dot" style="background:'+p[0].color+'"></span>'+esc(p[0].name)+' – '+esc(p[1].t)+' · '+(late?T('overdue')+' · ':'')+label(p[1].due)+'</div>'}).join('');
  if('Notification' in window&&Notification.permission==='default')h+='<div style="margin-top:10px"><button class="b g noprint" data-act="rem">'+T('enableRem')+'</button></div>';
  h+='</div>'}
 h+='<div class="card row noprint"><label class="tag">'+T('perDay')+' <input type="number" min="1" max="12" value="'+S.perDay+'" data-act="perday" style="width:64px"></label>'
  +'<label class="tag">'+T('startAt')+' <input type="time" value="'+S.startTime+'" data-act="startt"></label><span class="grow"></span><button class="b" data-act="plan">'+T('makePlan')+'</button></div>';
 var keys=Object.keys(by).sort();
 keys.forEach(function(d){var cur=toMin(S.startTime);
  h+='<div class="day">'+(d===td?T('today'):label(d))+(d<td?' <span class="late">'+T('missed')+'</span>':'')+'</div><div class="card" style="padding:4px 14px">';
  by[d].forEach(function(p){var e=cur+p[1].est;h+=taskRow(p[0],p[1],td,'plan',hhmm(cur)+'–'+hhmm(e));cur=e});h+='</div>'});
 if(un.length){h+='<div class="day">'+T('notSched')+'</div><div class="card" style="padding:4px 14px">';
  un.forEach(function(p){h+=taskRow(p[0],p[1],td,'plan')});h+='</div>'}
 if(!S.subjects.length)h+='<div class="empty"><div class="eico">📚</div>'+T('noSubj')+'</div>';
 else if(!keys.length&&!un.length)h+='<div class="empty"><div class="eico">🎉</div>'+T('nothing')+'</div>';
 else if(un.length&&!keys.length)h+='<div class="empty">'+T('pressPlan')+'</div>';
 return h}

function viewSubjects(td){
 var h='<div class="card row"><input id="ns" class="grow" placeholder="'+T('newSubj')+'"><button class="b" data-act="addsub">'+T('addSubj')+'</button></div>';
 if(!S.subjects.length)h+='<div class="empty"><div class="eico">📚</div>'+T('noSubj')+'</div>';
 S.subjects.forEach(function(s){var st=stats(s);
  h+='<div class="card" style="border-left:4px solid '+s.color+'"><div class="sh"><span class="row" style="flex-wrap:nowrap"><input type="color" value="'+s.color+'" data-act="color" data-id="'+s.id+'" aria-label="Colour"><b data-act="ren" data-id="'+s.id+'">'+esc(s.name)+'</b></span>'
  +'<span class="tag">'+st.d+'/'+st.n+' · '+st.p+'%'+(st.m?' · '+fmt(st.m):'')+'</span><button class="x" data-act="delsub" data-id="'+s.id+'" aria-label="Delete subject">×</button></div>'
  +'<div class="bar"><i style="width:'+st.p+'%;background:'+s.color+'"></i></div>';
  s.tasks.forEach(function(t){h+=taskRow(s,t,td,'subj')});
  h+='<div class="fld" style="margin-top:12px" data-sid="'+s.id+'"><input class="nt" style="min-width:140px" placeholder="'+T('taskName')+'"><select class="nk"><option value="part">'+T('part')+'</option><option value="assignment">'+T('assignment')+'</option></select></div>'
  +'<div class="fld" data-sid="'+s.id+'"><input type="date" class="nd" aria-label="'+T('due')+'"><label class="tag">'+T('days')+' <input type="number" class="ndays" min="1" value="1" style="width:60px"></label>'
  +'<label class="tag">'+T('minutes')+' <input type="number" class="nest" min="5" step="5" value="60" style="width:70px"></label><button class="b" data-act="addtask" data-id="'+s.id+'">'+T('add')+'</button></div></div>'});
 return h}

function viewProgress(td){
 var h='<div class="card"><b>'+T('bySubject')+'</b><div class="rg">';
 S.subjects.forEach(function(s){var st=stats(s);
  h+='<div class="rc"><svg viewBox="0 0 64 64" class="mr"><circle cx="32" cy="32" r="26" class="rb2"/><circle cx="32" cy="32" r="26" fill="none" stroke="'+s.color+'" stroke-width="7" stroke-linecap="'+(st.p?'round':'butt')+'" stroke-dasharray="'+(st.p*1.634)+' 163.4" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle">'+st.p+'%</text></svg><div><b>'+esc(s.name)+'</b><div class="tag">'+st.d+'/'+st.n+(st.m?' · '+fmt(st.m):'')+'</div></div></div>'});
 if(!S.subjects.length)h+='<div class="empty"><div class="eico">📈</div>'+T('noSubj')+'</div>';
 h+='</div></div><div class="card"><b>'+T('hours7')+'</b><div class="chart" style="margin-top:14px">';
 var cnt=[],max=1,i,d;
 for(i=6;i>=0;i--){d=addDays(td,-i);var m=0;S.subjects.forEach(function(s){s.tasks.forEach(function(t){t.logs.forEach(function(l){if(l.d===d)m+=(+l.m||0)})})});cnt.push([d,m]);if(m>max)max=m}
 cnt.forEach(function(x){h+='<div><i style="height:'+Math.round(x[1]/max*80)+'px"></i>'+(x[1]?fmt(x[1]):'0')+'<br>'+new Date(x[0]+'T00:00:00').toLocaleDateString(loc(),{weekday:'short'})+'</div>'});
 h+='</div></div><div class="row noprint">'+(LOCAL?'':'<button class="b g" data-act="csv">'+T('exportCsv')+'</button>')+'<button class="b g" data-act="print">'+T('print')+'</button></div>';
 return h}

function exportCsv(){
 var rows=[['Subject','Task','Type','Due','Days','Min per day','Done','Done on','Minutes studied']];
 S.subjects.forEach(function(s){s.tasks.forEach(function(t){rows.push([s.name,t.t,t.kind,t.due,t.days,t.est,t.done?'yes':'no',t.doneOn,sumLogs(t.logs)])})});
 var csv='\ufeff'+rows.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"'}).join(',')}).join('\r\n');
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='study-progress.csv';document.body.appendChild(a);a.click();a.remove()}

function openEdit(id){var f=find(id);if(!f)return;editId=id;var t=f.t,d=document.getElementById('dlg');
 d.innerHTML='<h3 style="margin:0 0 12px">'+T('editTask')+'</h3><div class="fld"><input id="ed-t" value="'+esc(t.t)+'"></div>'
 +'<div class="fld"><select id="ed-k"><option value="part"'+(t.kind==='part'?' selected':'')+'>'+T('part')+'</option><option value="assignment"'+(t.kind==='assignment'?' selected':'')+'>'+T('assignment')+'</option></select><input type="date" id="ed-due" value="'+t.due+'"></div>'
 +'<div class="fld"><label class="tag">'+T('days')+' <input type="number" id="ed-days" min="1" value="'+t.days+'" style="width:70px"></label><label class="tag">'+T('minutes')+' <input type="number" id="ed-est" min="5" step="5" value="'+t.est+'" style="width:80px"></label></div>'
 +'<div class="row" style="justify-content:flex-end"><button class="b g" data-act="dcancel">'+T('cancel')+'</button><button class="b" data-act="dsave">'+T('save')+'</button></div>';
 if(d.showModal)d.showModal()}

function applyTheme(){var r=document.documentElement;if(theme==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',theme);if(accent==='blue')r.removeAttribute('data-accent');else r.setAttribute('data-accent',accent)}
function notify(){try{
 if(!('Notification' in window)||Notification.permission!=='granted'||ls('sp-notified')===today())return;
 var td=today(),n=[];S.subjects.forEach(function(s){s.tasks.forEach(function(t){if(!t.done&&t.due&&t.due<=addDays(td,1))n.push(s.name+' – '+t.t)})});
 if(n.length)new Notification(T('dueSoon'),{body:n.slice(0,5).join('\n')});ls('sp-notified',td)}catch(e){}}

document.addEventListener('change',function(e){
 var a=e.target.dataset.act,id=e.target.dataset.id;
 if(a==='tog'){var f=find(id),on=e.target.checked,t=f.t;t.done=on;t.doneOn=on?today():'';
  t.logs=t.logs.filter(function(l){return !l.auto});if(on&&!t.logs.length)t.logs.push({d:today(),m:t.est,auto:1});saveTask(t)}
 else if(a==='perday'||a==='startt'){if(a==='perday')S.perDay=Math.max(1,Math.min(12,parseInt(e.target.value)||3));else if(e.target.value)S.startTime=e.target.value;
  if(LOCAL){saveLocal();render()}else api('PUT','/api/settings',{perDay:S.perDay,startTime:S.startTime}).then(render)}
 else if(a==='color'){var s=sub(id);s.color=e.target.value;commit('PATCH','/api/subjects/'+id,{name:s.name,color:s.color})}});

document.addEventListener('click',function(e){
 var el=e.target.closest('[data-act]');if(!el||el.tagName==='INPUT')return;
 var a=el.dataset.act,id=el.dataset.id,s,f;
 if(a==='tab'){tab=el.dataset.v;render()}
 else if(a==='plan')plan();
 else if(a==='theme'){theme={auto:'light',light:'dark',dark:'auto'}[theme];ls('sp-theme',theme);applyTheme();render()}
 else if(a==='lang'){lang=lang==='en'?'si':'en';ls('sp-lang',lang);document.documentElement.lang=lang;render()}
 else if(a==='addsub'){var v=document.getElementById('ns').value.trim();if(!v)return;var col=COLORS[S.subjects.length%COLORS.length];
  if(LOCAL){S.subjects.push({id:uid(),name:v,color:col,tasks:[]});commit()}else commit('POST','/api/subjects',{name:v,color:col})}
 else if(a==='delsub'){if(confirm(T('delSubj'))){S.subjects=S.subjects.filter(function(x){return x.id!==id});commit('DELETE','/api/subjects/'+id)}}
 else if(a==='ren'){s=sub(id);var n=prompt(T('rename'),s.name);if(n&&n.trim()){s.name=n.trim();commit('PATCH','/api/subjects/'+id,{name:s.name,color:s.color})}}
 else if(a==='addtask'){var card=el.closest('.card'),t=card.querySelector('.nt').value.trim();if(!t)return;
  var o={t:t,kind:card.querySelector('.nk').value,due:card.querySelector('.nd').value,days:Math.max(1,parseInt(card.querySelector('.ndays').value)||1),est:Math.max(5,parseInt(card.querySelector('.nest').value)||60)};
  if(LOCAL){o.id=uid();o.dates=[];o.done=false;o.doneOn='';o.logs=[];sub(id).tasks.push(o);commit()}else commit('POST','/api/subjects/'+id+'/tasks',o)}
 else if(a==='deltask'){S.subjects.forEach(function(x){x.tasks=x.tasks.filter(function(t){return t.id!==id})});commit('DELETE','/api/tasks/'+id)}
 else if(a==='edit')openEdit(id);
 else if(a==='dcancel')document.getElementById('dlg').close();
 else if(a==='dsave'){f=find(editId);if(!f)return;var tk=f.t,nm=document.getElementById('ed-t').value.trim();if(nm)tk.t=nm;
  tk.kind=document.getElementById('ed-k').value;tk.due=document.getElementById('ed-due').value;
  tk.days=Math.max(1,parseInt(document.getElementById('ed-days').value)||1);tk.est=Math.max(5,parseInt(document.getElementById('ed-est').value)||60);
  document.getElementById('dlg').close();saveTask(tk)}
 else if(a==='log'){f=find(id);var m=parseInt(prompt(T('logQ'),String(f.t.est)));if(m>0){f.t.logs.push({d:today(),m:m});saveTask(f.t)}}
 else if(a==='rem'){try{Notification.requestPermission().then(function(){notify();render()})}catch(x){}}
 else if(a==='refresh'){spin=true;if(LOCAL){loadLocal();render()}else reload().catch(function(){});setTimeout(function(){spin=false;render()},700)}
 else if(a==='sw'){showSw=!showSw;render()}
 else if(a==='accent'){accent=el.dataset.v;ls('sp-accent',accent);applyTheme();render()}
 else if(a==='focus')openTimer(id);
 else if(a==='tmadj'){tm.total=Math.max(300,tm.total+(+el.dataset.v)*60);tm.left=tm.total;drawTimer()}
 else if(a==='tmgo'){if(tm.iv){clearInterval(tm.iv);tm.iv=null}else tm.iv=setInterval(tick,1000);drawTimer()}
 else if(a==='tmstop')endTimer();
 else if(a==='csv')exportCsv();
 else if(a==='print')window.print()});

document.getElementById('dlg').addEventListener('close',function(){if(tm)endTimer()});
function init(){applyTheme();document.documentElement.lang=lang;
 if(LOCAL){loadLocal();render();return}
 reload().then(notify).catch(function(){LOCAL=true;loadLocal();render()})}
init();
if(!LOCAL&&'serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(function(){});
