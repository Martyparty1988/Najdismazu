document.addEventListener('DOMContentLoaded',()=>{
const e=id=>document.getElementById(id);
const el={scannerVisual:e('scanner-visual'),scannerContainer:e('scanner-container'),threatPill:e('threat-level-pill'),scanButton:e('scan-button'),scannerStatus:e('scanner-status'),scannerSubtext:e('scanner-subtext'),activityLog:e('activity-log'),statBpm:e('stat-bpm'),statRisk:e('stat-risk'),aiAnalysisButton:e('ai-analysis-button'),profileButton:e('profile-button'),aiModal:e('ai-modal'),modalTitle:e('modal-title'),modalContent:e('modal-content'),modalLoader:e('modal-loader'),modalCloseButton:e('modal-close-button'),targetThreatPill:e('target-threat-pill'),subjectName:e('subject-name'),subjectAvatarText:e('subject-avatar-text'),statScans:e('stat-scans'),statToday:e('stat-today'),lastSeen:e('last-seen'),distanceIndicator:e('distance-indicator'),soundToggle:e('sound-toggle'),shareButton:e('share-button')};
let isProcessing=false,currentThreatIndex=0,soundEnabled=true,lastDistance=null;
const storageKey='najdi-smazak-stats-v2';let stats={totalScans:0,todayCount:0,lastDate:new Date().toISOString().slice(0,10)};
const subjects=[{name:'Šlehař Delta-Piko',avatar:'ŠLEHAŘ'},{name:'Hulič Zubatá Žárovka',avatar:'HULIČ'},{name:'Sajrajtový Špiritus X',avatar:'SAJRAJT'}];
const threatLevels=[{name:'Na pohodu, jen trošku sjetý',class:'threat-low',level:0},{name:'Půl dávky v žíle',class:'threat-medium',level:1},{name:'Na šrot',class:'threat-high',level:2},{name:'Totál Overdose',class:'threat-critical',level:3}];
const states=[{status:'VAŘÍM DÁVKU...',subtext:'Míchám to s toluenem...'},{status:'PŘEPALUJU TRUBKY',subtext:'Zapalovač skoro hoří...'},{status:'ŠŇUPU DATA',subtext:'Dobrý matroš...'},{status:'HOTOVO',subtext:'Čistota 98%, kámo!'}];
const logs=['Vařím dávku, drž se','Šňupu data z radaru','Fízlové se motaj poblíž','Tep ti lítá jak kolotoč'];
const rand=(a,b)=>Math.random()*(b-a)+a;
const beep=(f=700,d=70)=>{if(!soundEnabled)return;try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.frequency.value=f;g.gain.value=.03;o.connect(g);g.connect(c.destination);o.start();setTimeout(()=>{o.stop();c.close()},d)}catch{}};
function addLogEntry(message){const li=document.createElement('li');li.className='log-item flex items-center space-x-3';const t=new Date().toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit',second:'2-digit'});li.innerHTML=`<span class="text-slate-400">${t}</span><span class="flex-1">${message}</span>`;el.activityLog.prepend(li);if(el.activityLog.children.length>15)el.activityLog.lastElementChild.remove();}
function loadStats(){try{const raw=localStorage.getItem(storageKey);if(raw)stats={...stats,...JSON.parse(raw)};const today=new Date().toISOString().slice(0,10);if(stats.lastDate!==today){stats.todayCount=0;stats.lastDate=today}}catch{}}
function saveStats(){localStorage.setItem(storageKey,JSON.stringify(stats))}
function renderStats(){el.statScans.textContent=stats.totalScans;el.statToday.textContent=stats.todayCount}
function changeSubject(){const s=subjects[Math.floor(Math.random()*subjects.length)];el.subjectName.textContent=s.name;el.subjectAvatarText.textContent=s.avatar}
function drawRadarScene(targetDistance=lastDistance){const c=el.scannerContainer;c.querySelectorAll('.blip').forEach(x=>x.remove());
for(let i=0;i<8;i++){const b=document.createElement('div');b.className='blip';const sz=rand(4,12);b.style.width=`${sz}px`;b.style.height=`${sz}px`;b.style.left=`${rand(8,92)}%`;b.style.top=`${rand(8,92)}%`;b.style.animationDelay=`-${rand(0,3).toFixed(2)}s`;c.appendChild(b)}
if(typeof targetDistance==='number'){
const ratio=Math.max(.12,Math.min(.88,targetDistance/4200));
const angle=rand(0,360)*(Math.PI/180);
const r=ratio*42;
const x=50+Math.cos(angle)*r;
const y=50+Math.sin(angle)*r;
const t=document.createElement('div');
t.className='blip blip-target';
t.style.left=`${x}%`;
t.style.top=`${y}%`;
c.appendChild(t);
}
}
function updateThreatLevel(){if(isProcessing)return;currentThreatIndex=Math.floor(Math.random()*threatLevels.length);const t=threatLevels[currentThreatIndex];el.threatPill.textContent=t.name;el.threatPill.className=`threat-pill text-black font-bold text-xs md:text-sm py-1.5 px-4 rounded-full font-orbitron text-center ${t.class}`;el.targetThreatPill.textContent=t.name;el.targetThreatPill.className=`mt-2 threat-pill text-black text-xs font-bold py-1 px-3 rounded-full inline-block text-center ${t.class}`;el.aiAnalysisButton.classList.toggle('hidden',t.level<2);addLogEntry(`⚠️ Hrozba: ${t.name}`);drawRadarScene();}
function runScan(){if(isProcessing)return;isProcessing=true;el.scanButton.disabled=true;el.scannerVisual.classList.add('scanner-active');const flow=[...states].sort(()=>Math.random()-.5);let i=0;(function step(){const s=flow[i];el.scannerStatus.textContent=s.status;el.scannerSubtext.textContent=s.subtext;el.statBpm.textContent=Math.floor(rand(70,160));el.statRisk.textContent=`${Math.floor(rand(10,95))}%`;addLogEntry(logs[Math.floor(Math.random()*logs.length)]);beep(500+currentThreatIndex*90);drawRadarScene();i++;if(i>=flow.length){isProcessing=false;el.scanButton.disabled=false;el.scannerVisual.classList.remove('scanner-active');el.scannerStatus.textContent='HOTOVEJ NA ŠLEH';el.scannerSubtext.textContent='Čekám na další lajnu';changeSubject();stats.totalScans++;stats.todayCount++;saveStats();renderStats();el.lastSeen.textContent=new Date().toLocaleString('cs-CZ');lastDistance=Math.floor(rand(120,4200));el.distanceIndicator.textContent=`${lastDistance} m`;drawRadarScene(lastDistance);addLogEntry('Hledání dokončeno, systém ready.');return;}setTimeout(step,[700,900,1200,1500][Math.floor(Math.random()*4)]);})();}
function showModal(title,txt){el.modalTitle.textContent=title;el.modalContent.textContent=txt;el.aiModal.classList.remove('hidden');el.aiModal.style.opacity='1'}
function hideModal(){el.aiModal.style.opacity='0';setTimeout(()=>el.aiModal.classList.add('hidden'),300)}
el.scanButton.addEventListener('click',runScan);
el.soundToggle.addEventListener('click',()=>{soundEnabled=!soundEnabled;el.soundToggle.textContent=soundEnabled?'🔊':'🔈';addLogEntry(soundEnabled?'Zvuky zapnutý.':'Zvuky vypnutý.')});
el.shareButton.addEventListener('click',async()=>{const txt=`${el.subjectName.textContent} | ${el.targetThreatPill.textContent} | Tep ${el.statBpm.textContent} | Riziko ${el.statRisk.textContent}`;try{if(navigator.share)await navigator.share({title:'Najdi smažák report',text:txt});else await navigator.clipboard.writeText(txt);addLogEntry('Report sdílenej do éteru.')}catch{addLogEntry('Sdílení se rozbilo, asi mokrej kabel.')}});
el.aiAnalysisButton.addEventListener('click',()=>showModal('PORADNA OD DEALERŮ','Tep máš jak po trojité lajně, dej si pauzu, nebo tě klepne.'));
el.profileButton.addEventListener('click',()=>showModal(`KDO JE TEN SMAŽKA: ${el.subjectName.textContent.toUpperCase()}`,'Původ: Uliční varna v Žižkově. Schopnosti: Pozná feťáka na 200 metrů. Slabiny: Bojí se holubů.'));
el.modalCloseButton.addEventListener('click',hideModal);el.aiModal.addEventListener('click',x=>{if(x.target===el.aiModal)hideModal()});
loadStats();renderStats();changeSubject();drawRadarScene();addLogEntry('Radar nastartovanej, systém sjetej.');setInterval(()=>drawRadarScene(),5000);setInterval(updateThreatLevel,8000);
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
});
