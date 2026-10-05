const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

window.addEventListener('scroll',()=>{
  $('#header').classList.toggle('scrolled',scrollY>25);
});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));

$('#menuBtn').addEventListener('click',()=>{
  const nav=$('.navlinks');
  const open=nav.classList.toggle('mobile-open');
  if(open){
    nav.style.cssText='display:flex;position:fixed;top:68px;left:12px;right:12px;background:#071321;padding:18px;border:1px solid #26394a;border-radius:16px;flex-direction:column;align-items:stretch;box-shadow:0 20px 50px #0008;z-index:1001';
  }else nav.removeAttribute('style');
});
$$('.navlinks a').forEach(a=>a.addEventListener('click',()=>{$('.navlinks').classList.remove('mobile-open');if(innerWidth<1001)$('.navlinks').removeAttribute('style')}));

/* Portfolio filtering */
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const f=btn.dataset.filter;
  $$('.project').forEach(p=>{p.style.display=(f==='all'||p.dataset.cat.includes(f))?'flex':'none'});
}));


/* Real sample previews from supplied workbooks */
const samplePreviewData={
  gc:{
    tag:"GENERAL CONTRACTOR",
    title:"GC Estimating Sample",
    text:"San Jose Pace Center bid summary with building area, projected cost, labor, material, division and suggested bid information.",
    image:"assets/samples/gc-sample-2.webp",
    link:"samples.html#gc",
    meta:[["BUILDING GSF","16,060"],["PROJECTED COST","$4.59M"],["SUGGESTED BID","$6.36M"],["SCOPE","GC"]]
  },
  electrical:{
    tag:"ELECTRICAL",
    title:"Electrical Estimate · Royal Crown Bakery",
    text:"Real electrical estimating structure with conduit, connectors, quantity, wastage, material cost, labor and total-cost fields.",
    image:"assets/samples/electrical-1.webp",
    link:"samples.html#electrical",
    meta:[["PROJECT","Royal Crown Bakery"],["LABOR RATE","$80"],["FIRST LINE","17 LF"],["WASTAGE","10%"]]
  },
  plumbing:{
    tag:"PLUMBING",
    title:"Plumbing Estimate · River North Block C",
    text:"Common-area and dwelling-unit estimating with quantities, wastage, material cost, labor rate, labor cost and total cost.",
    image:"assets/samples/plumbing-2.webp",
    link:"samples.html#plumbing",
    meta:[["PROJECT","River North Block C"],["LOCATION","Nashville, TN"],["LABOR RATE","$35"],["SHEETS","Common + Dwelling"]]
  },
  takeoff:{
    tag:"PLAN / TAKEOFF",
    title:"Harris County Sheriff’s Office Site",
    text:"Landscape and irrigation plan / takeoff material with plan sheets, irrigation legend and supported quantity data.",
    image:"assets/samples/pdf1/page-1.webp",
    link:"samples.html#plans",
    meta:[["SCOPE","Landscape + Irrigation"],["PLAN DATE","2/28/2025"],["ESTIMATE","$2.03M"],["SHEET","L3.01"]]
  }
};

const realElectricalRows=[
  ["01",'1-1/4" EMT Conduit',"17","10%","18.7","LF","$47.56","$70.31","$117.87"],
  ["","1-1/4\" CONN COMP STL - EMT","2","0%","2","EA","$17.27","$29.12","$46.39"],
  ["","1-1/4\" COUPLING COMP STL - EMT","2","0%","2","EA","$18.24","$22.40","$40.64"],
  ["","1-1/4\" BUSHING - PLASTIC","2","0%","2","EA","$1.05","$6.24","$7.29"],
  ["","1-1/4\" 1-H STRAP - EMT - STEEL","2","0%","2","EA","$1.91","$11.20","$13.11"],
  ["02",'4" EMT Conduit',"11","10%","12.1","LF","$115.32","$132.62","$247.94"],
  ["",'4" ELBOW 90 DEG - EMT',"1","0%","1","EA","$76.98","$64.00","$140.98"],
  ["",'4" CONN COMP STL - EMT',"1","0%","1","EA","$128.21","$37.44","$165.65"]
];

const sampleMeta=$('#samplePreviewMeta');
const sampleImage=$('#samplePreviewImage');
const sampleTag=$('#samplePreviewTag');
const sampleTitle=$('#samplePreviewTitle');
const sampleText=$('#samplePreviewText');
const sampleLink=$('#samplePreviewLink');

function renderSamplePreview(key){
  const d=samplePreviewData[key];
  if(!d)return;
  if(sampleTag)sampleTag.textContent=d.tag;
  if(sampleTitle)sampleTitle.textContent=d.title;
  if(sampleText)sampleText.textContent=d.text;
  if(sampleImage){sampleImage.src=d.image;sampleImage.alt=d.title+' preview';}
  if(sampleLink)sampleLink.href=d.link;
  if(sampleMeta){
    sampleMeta.innerHTML=d.meta.map(([k,v])=>`<div class="sample-meta-item"><span>${k}</span><strong>${v}</strong></div>`).join('');
  }
}

function renderElectricalTable(){
  const body=$('#estimateTable tbody');
  if(!body)return;
  body.innerHTML='';
  realElectricalRows.forEach(row=>{
    const tr=document.createElement('tr');
    row.forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});
    body.appendChild(tr);
  });
}
renderSamplePreview('gc');
renderElectricalTable();

$$('.sample-tab').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.sample-tab').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  renderSamplePreview(btn.dataset.sample);
}));

/* FAQ */
$$('.faq-q').forEach(q=>q.addEventListener('click',()=>q.parentElement.classList.toggle('open')));

/* Modals */
function openModal(id){$(id).classList.add('open');document.body.classList.add('no-scroll')}
function closeModal(id){$(id).classList.remove('open');document.body.classList.remove('no-scroll')}
function openViewer(title,cat){$('#viewerTitle').textContent=title;$('#viewerCategory').textContent=cat;$('#sheetTitle').textContent='FIVE STAR ESTIMATING · '+title;openModal('viewerModal')}
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id)}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal.open').forEach(m=>closeModal(m.id))});

/* Multi-step quote form */
let step=0;const steps=$$('.form-step');const labels=['Contact Information','Project Information','Services','Upload Documents','Review & Submit'];
function updateStep(){
 steps.forEach((s,i)=>s.classList.toggle('active',i===step));
 $('#stepLabel').textContent=String(step+1).padStart(2,'0')+' / 05 · '+labels[step];
 $('#stepPercent').textContent=((step+1)*20)+'%';$('#progressBar').style.width=((step+1)*20)+'%';
 $('#prevBtn').style.visibility=step===0?'hidden':'visible';
 $('#nextBtn').textContent=step===steps.length-1?'Submit Project':'Continue →';
 if(step===steps.length-1){
   const fd=new FormData($('#quoteForm'));let html='';
   [['Name','name'],['Company','company'],['Email','email'],['Project','project'],['Type','type'],['Service','service'],['Deadline','deadline']].forEach(([l,k])=>html+=`<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e0e5e9"><b>${l}</b><span>${fd.get(k)||'—'}</span></div>`);
   $('#review').innerHTML=html;
 }
}
function openQuote(){step=0;$('#quoteForm').reset();$('#formBody').innerHTML=$('#formBody').innerHTML;/* no-op safeguard */openModal('quoteModal');updateStep()}
function nextStep(){
 const current=steps[step];
 const required=current.querySelectorAll('[required]');
 for(const field of required){if(!field.checkValidity()){field.reportValidity();return}}
 if(step<steps.length-1){step++;updateStep()}
 else{
  $('#formBody').innerHTML='<div class="success"><div class="check">✓</div><h2>PROJECT RECEIVED.</h2><p style="color:#6d7b88;margin:12px auto 25px;max-width:560px">Thank you for submitting your project. This standalone demo has captured the form interaction locally; connect the form to your preferred backend or email service for production submissions.</p><button class="btn btn-gold" onclick="closeModal(\'quoteModal\')">Return Home</button></div>';
 }
}
function prevStep(){if(step>0){step--;updateStep()}}

/* Smooth internal navigation */
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
 const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'})}
}));

/* Organization / FAQ structured data */
const schema={
 "@context":"https://schema.org","@type":"ProfessionalService","name":"Five Star Estimating",
 "description":"Professional construction estimating and quantity takeoff services.",
 "serviceType":["Construction Estimating","Quantity Takeoffs","Material Takeoffs","Cost Estimating","Bid Preparation"]
};
const script=document.createElement('script');script.type='application/ld+json';script.textContent=JSON.stringify(schema);document.head.appendChild(script);

document.querySelectorAll('[data-placeholder-link="true"]').forEach(link=>{
  link.addEventListener('click', e=>e.preventDefault());
});

/* placeholder social links */
document.querySelectorAll('[data-placeholder-link="true"]').forEach(link=>{
  link.addEventListener('click', e=>e.preventDefault());
});
