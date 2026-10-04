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

/* Sample tables */
const samples={
 gc:[
  ['01','Concrete Scope',125,'5%','131.25','CY','$145','$19,031','$7,250','$26,281'],
  ['02','Structural Framing',840,'7%','898.8','LF','$18','$16,178','$8,990','$25,168'],
  ['03','Drywall Package',5200,'8%','5,616','SF','$3.25','$18,252','$11,232','$29,484'],
  ['04','Doors / Frames',24,'0%','24','EA','$680','$16,320','$4,800','$21,120']
 ],
 electrical:[
  ['01','Conduit / Raceway',680,'5%','714','LF','$4.80','$3,427','$1,285','$4,712'],
  ['02','Electrical Boxes',46,'3%','47.38','EA','$18','$853','$360','$1,213'],
  ['03','Lighting Fixtures',32,'5%','33.6','EA','$145','$4,872','$1,008','$5,880'],
  ['04','Wire / Cable',1450,'7%','1,551.5','LF','$2.75','$4,267','$2,016','$6,283']
 ],
 plumbing:[
  ['01','Common Area Pipe',420,'5%','441','LF','$7.20','$3,175','$1,260','$4,435'],
  ['02','Dwelling Unit Fixtures',18,'3%','18.54','EA','$285','$5,284','$1,850','$7,134'],
  ['03','Domestic Water',560,'5%','588','LF','$6.40','$3,763','$1,764','$5,527'],
  ['04','Drain / Waste',390,'5%','409.5','LF','$8.10','$3,317','$1,638','$4,955']
 ],
 takeoff:[
  ['01','Class 200 PVC Lateral Pipe',605.784,'0%','605.784','FT','—','—','—','TAKEOFF'],
  ['02','Class 200 PVC Mainline Pipe',1548.290,'0%','1548.290','FT','—','—','—','TAKEOFF'],
  ['03','Hunter PGP Ultra',20,'0%','20','COUNT','—','—','—','TAKEOFF'],
  ['04','Hunter Pro-Spray',64,'0%','64','COUNT','—','—','—','TAKEOFF'],
  ['05','Netafim Drip Tube',3238,'0%','3238','SF','—','—','—','TAKEOFF']
 ]};
function renderTable(key){
 const body=$('#estimateTable tbody');body.innerHTML='';
 samples[key].forEach(row=>{const tr=document.createElement('tr');row.forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});body.appendChild(tr)});
}
renderTable('gc');
$$('.sample-tab').forEach(b=>b.addEventListener('click',()=>{$$('.sample-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderTable(b.dataset.sample)}));

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
  $('#formBody').innerHTML='<div class="success"><div class="check">✓</div><h2>PROJECT RECEIVED.</h2><p style="color:#6d7b88;margin:12px auto 25px;max-width:560px">Thank you for submitting your project. This standalone demo has captured the form interaction locally; connect the form to your preferred backend or email service for production submissions.</p><button class="btn btn-gold" onclick="closeModal(\\'quoteModal\\')">Return Home</button></div>';
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
