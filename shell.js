/* Diệu Thân · Bảng nhỏ — khung điều hướng 5 mục, yêu thích, gần đây, lịch sử gửi, sao lưu.
   Chỉ sắp xếp lại các khối có sẵn (giữ nguyên id) nên mọi chức năng cũ vẫn chạy như trước. */
(function(){
'use strict';
const $=id=>document.getElementById(id),q=s=>document.querySelector(s);
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d;}catch(_){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(_){}}};
const toast=m=>{const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);};

/* ---------- Yêu thích & gần đây ---------- */
let FAV=LS.get('dt-fav',[]),REC=LS.get('dt-recent',[]);
window.DT_isFav=id=>FAV.includes(id);
window.DT_toggleFav=id=>{FAV=FAV.includes(id)?FAV.filter(x=>x!==id):[id,...FAV];LS.set('dt-fav',FAV);toast(FAV.includes(id)?'Đã thêm vào Yêu thích ♥':'Đã bỏ khỏi Yêu thích');renderLists();};
window.DT_EXTRA_THUMBS=()=>[...FAV,...REC];
window.addEventListener('dt:choose',e=>{const id=e.detail.id;REC=[id,...REC.filter(x=>x!==id)].slice(0,10);LS.set('dt-recent',REC);go(e.detail.t==='studio'?'studio':'home',true);renderLists();});

/* ---------- Lịch sử gửi màn hình ---------- */
let HIST=LS.get('dt-history',[]);
function addHist(kind,ok){const l=currentLayout();HIST=[{t:Date.now(),name:l?l.name:'?',kind,ok},...HIST].slice(0,40);LS.set('dt-history',HIST);renderHist();}
const tracked=(fn,kind)=>async()=>{const ok=await fn();if(ok||ble.device?.gatt?.connected)addHist(kind,!!ok);return ok;};
$('btnSend').onclick=tracked(()=>send(),'Gửi ảnh');$('btnSendClock').onclick=tracked(()=>sendWithClock(),'Gửi kèm giờ tự chạy');

/* ---------- Biểu tượng (nét mảnh, đồng nhất) ---------- */
const IC={home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  gallery:'<rect x="3" y="4" width="8" height="7" rx="1.5"/><rect x="13" y="4" width="8" height="7" rx="1.5"/><rect x="3" y="13" width="8" height="7" rx="1.5"/><rect x="13" y="13" width="8" height="7" rx="1.5"/>',
  studio:'<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/><circle cx="19" cy="19" r="2"/>',
  fav:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2L5 5.9 3 9.3l2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.6-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/>'};
const NAV=[['home','Trang chủ'],['gallery','Bộ sưu tập'],['studio','Studio'],['fav','Yêu thích'],['settings','Cài đặt']];
const svg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;

/* ---------- Dựng các mục, chuyển khối có sẵn vào đúng chỗ ---------- */
const wrap=q('.wrap'),gallery=q('.gallery'),grid=q('.grid'),editHead=[...document.querySelectorAll('.gal-head')].find(h=>h.querySelector('#curName')),opts=q('details.opts'),more=q('details.more'),sleepBox=$('sleepBox');
q('.topbar .sub').innerHTML='Little things, little joys <span style="opacity:.75">· Những điều nhỏ bé, những niềm vui nhỏ</span>';
const nav=document.createElement('nav');nav.className='nav';nav.innerHTML=NAV.map(([k,n])=>`<a href="#${k}" data-v="${k}">${svg(k)}${n}</a>`).join('');q('.tb-in .brand').after(nav);
const vyLink=q('.tb-link');
const bnav=document.createElement('nav');bnav.className='bnav';bnav.innerHTML=NAV.map(([k,n])=>`<a href="#${k}" data-v="${k}">${svg(k)}${n}</a>`).join('');document.body.appendChild(bnav);
const mk=(id,html='')=>{const v=document.createElement('section');v.id='v-'+id;v.className='view';v.hidden=true;v.innerHTML=html;wrap.appendChild(v);return v;};
const vHome=mk('home',`
  <div class="hero"><div><h2>Bảng nhỏ<em>.</em> Niềm vui nhỏ<em>.</em></h2><p class="slogan"><b>Little things, little joys.</b> Tạo một màn hình e-ink mang cảm xúc, cá tính và yêu thương của riêng bạn.</p></div>
    <div class="hero-side"><span class="conn-pill" id="heroConn"><i></i><span>Chưa kết nối</span></span>
      <div class="seg" id="sizeSeg" role="group" aria-label="Loại màn hình"><button data-s="213">2.13″ <small>250×122</small></button><button data-s="290">2.9″ <small>296×128</small></button></div>
      <span class="small-note" style="font-size:12px;color:var(--muted)">Kết nối màn hình thì cỡ màn được chọn tự động</span><span id="vySlot"></span></div></div>
  <div id="homeEditor"></div>
  <div class="blk"><h3><span class="pixel-heart"></span>Dùng gần đây</h3><div class="strip" id="recentStrip"></div></div>
  <div class="blk"><h3>Bộ sưu tập<a class="more" href="#gallery">Xem tất cả →</a></h3><div class="colls" id="collGrid"></div></div>`);
$('homeEditor').append(editHead,grid);if(vyLink)$('vySlot').append(vyLink);
const vGal=mk('gallery','<h2 class="view-h">Bộ sưu tập</h2><p class="view-sub">Chạm vào một mẫu để chỉnh sửa ngay. Chạm ♡ để lưu vào Yêu thích.</p>');vGal.appendChild(gallery);
const vStudio=mk('studio','<h2 class="view-h">Studio sáng tạo</h2><p class="view-sub">Thiết kế tự do đúng độ phân giải màn. Chạm lên khung xem trước để chọn, kéo để di chuyển, kéo góc đỏ để đổi cỡ.</p><div id="studioEditor"></div>');
const vFav=mk('fav',`<h2 class="view-h">Yêu thích</h2><p class="view-sub">Mẫu bạn đã thả tim và các thiết kế tự tạo trong Studio.</p>
  <div class="blk"><h3>♥ Mẫu yêu thích</h3><div class="cards" id="favCards"></div></div>
  <div class="blk"><h3>Thiết kế của tôi<a class="more" href="#studio">Mở Studio →</a></h3><div class="cards" id="myDesigns"></div></div>`);
const vSet=mk('settings',`<h2 class="view-h">Cài đặt</h2><p class="view-sub">Thiết bị, lịch tắt/mở màn, sao lưu dữ liệu và lịch sử gửi.</p>
  <div class="set-grid"><div id="setA"></div><div id="setB"></div></div>`);
const blk=(title,body)=>{const b=document.createElement('div');b.className='blk';b.innerHTML=`<h3>${title}</h3>`;if(body)b.append(...[].concat(body));return b;};
opts.open=true;opts.querySelector('summary').innerHTML='Hiển thị trên màn';
$('setA').append(blk('Màn hình',opts),blk('Bluetooth',more));more.open=false;
if(sleepBox){sleepBox.open=true;$('setA').append(blk('Hẹn giờ tắt / mở màn',sleepBox));}
const bk=blk('Sao lưu & khôi phuc'.replace('phuc','phục'));bk.insertAdjacentHTML('beforeend',`<p class="small-note" style="margin:0 0 10px;color:var(--muted);font-size:13px">Lưu mọi nội dung, yêu thích, thiết kế và cài đặt trên trình duyệt này thành một tệp. Mở tệp đó trên máy khác để chép sang.</p>
  <div class="row-btns"><button id="bkExport" class="primary">Tải bản sao lưu</button><button id="bkImport">Khôi phục từ tệp…</button><input type="file" id="bkFile" accept="application/json" hidden></div>
  <p class="small-note" style="margin:12px 0 0;font-size:12.5px;color:var(--muted)">Cần quay lại giao diện cũ? Mở <a href="index-v1.html">phiên bản trước</a> (dữ liệu dùng chung).</p>`);
const hb=blk('Lịch sử gửi màn hình');hb.insertAdjacentHTML('beforeend','<ul class="hist" id="histList"></ul><div class="row-btns" style="margin-top:10px"><button id="histClear">Xoá lịch sử</button></div>');
$('setB').append(bk,hb);
editHead.querySelector('h2').innerHTML='Đang chỉnh <span id="curName" class="cur"></span>';
for(const h of document.querySelectorAll('.gallery .gal-head h2'))h.innerHTML='Chọn mẫu';

/* ---------- Chuyển mục ---------- */
const VIEWS={home:vHome,gallery:vGal,studio:vStudio,fav:vFav,settings:vSet};
function go(v,scroll){if(!VIEWS[v])v='home';for(const [k,el] of Object.entries(VIEWS))el.hidden=k!==v;for(const a of document.querySelectorAll('.nav a,.bnav a'))a.classList.toggle('on',a.dataset.v===v);
  if(location.hash!=='#'+v)history.replaceState(null,'','#'+v);
  const host=v==='studio'?$('studioEditor'):$('homeEditor');if(grid.parentNode!==host){host.append(editHead,grid);}
  if(v==='studio'&&window.Studio)Studio.open();else if(window.Studio&&tab==='studio')Studio.open();
  if(v==='fav'||v==='home')renderLists();if(scroll===true&&v==='home')$('homeEditor').scrollIntoView({behavior:'smooth',block:'start'});else window.scrollTo({top:0});}
window.DT_go=go;
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const v=a.getAttribute('href').slice(1);if(VIEWS[v]){e.preventDefault();go(v);}});
window.addEventListener('hashchange',()=>go(location.hash.slice(1)));

/* ---------- Thẻ mẫu dùng chung ---------- */
function cardFor(l){const c=document.createElement('button');c.className='card';c.innerHTML=`<img alt="" src="${thumbOf(l.id)}"><span class="nm"></span><span class="fav" data-fav="1">${DT_isFav(l.id)?'♥':'♡'}</span>`;
  c.querySelector('.nm').textContent=l.name;c.onclick=e=>{if(e.target.dataset.fav){DT_toggleFav(l.id);drawGallery();return;}chooseLayout(l);};return c;}
function renderLists(){
  const byId=id=>LAYOUTS.find(l=>l.id===id);
  const rs=$('recentStrip');if(rs){rs.innerHTML='';const list=REC.map(byId).filter(Boolean);if(!list.length)rs.innerHTML='<p class="empty">Chưa có — chọn một mẫu ở Bộ sưu tập để bắt đầu.</p>';list.forEach(l=>rs.appendChild(cardFor(l)));}
  const fc=$('favCards');if(fc){fc.innerHTML='';const list=FAV.map(byId).filter(Boolean);if(!list.length)fc.innerHTML='<p class="empty">Chưa có mẫu yêu thích. Chạm ♡ trên thẻ mẫu để lưu.</p>';list.forEach(l=>fc.appendChild(cardFor(l)));}
  const cg=$('collGrid');if(cg&&!cg.childElementCount){for(const g of GROUPS){const first=LAYOUTS.find(l=>l.group===g),n=LAYOUTS.filter(l=>l.group===g).length,b=document.createElement('button');b.className='coll';
    b.innerHTML=`<img alt="" src="${thumbOf(first.id)}"><div><b></b><span>${n} mẫu</span></div>`;b.querySelector('b').textContent=g;b.onclick=()=>{curGroup=g;drawGallery();if(LAYOUTS.some(l=>l.group===g&&!document.querySelector('#cards img[src^="data"]')))makeThumbs();go('gallery');};cg.appendChild(b);}}
  if(window.Studio)Studio.renderMine($('myDesigns'));
}
function renderHist(){const ul=$('histList');if(!ul)return;ul.innerHTML=HIST.length?HIST.map(h=>{const d=new Date(h.t);return `<li><b>${h.ok?'✓':'✗'} ${h.name}</b><span>${h.kind} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} ${d.getDate()}/${d.getMonth()+1}</span></li>`;}).join(''):'<li><span>Chưa gửi lần nào.</span></li>';}
$('histClear').onclick=()=>{if(confirm('Xoá lịch sử gửi?')){HIST=[];LS.set('dt-history',HIST);renderHist();}};

/* ---------- Sao lưu / khôi phục ---------- */
const KEYS=k=>k.startsWith('nhan-eink')||k.startsWith('dt-');
$('bkExport').onclick=()=>{const o={app:'dieuthan-bangnho',v:1,at:new Date().toISOString(),data:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(KEYS(k))o.data[k]=localStorage.getItem(k);}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,1)],{type:'application/json'}));a.download=`bang-nho-sao-luu-${new Date().toISOString().slice(0,10)}.json`;a.click();toast('Đã tạo bản sao lưu');};
$('bkImport').onclick=()=>$('bkFile').click();
$('bkFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const o=JSON.parse(await f.text());if(o.app!=='dieuthan-bangnho'||!o.data)throw 0;if(!confirm('Khôi phục sẽ thay dữ liệu hiện tại trên trình duyệt này. Tiếp tục?'))return;
  for(const [k,v] of Object.entries(o.data))if(KEYS(k))localStorage.setItem(k,v);toast('Đã khôi phục, đang tải lại…');setTimeout(()=>location.reload(),700);}catch(_){alert('Tệp sao lưu không hợp lệ.');}};

/* ---------- Chọn cỡ màn & trạng thái kết nối ---------- */
function syncSize(){for(const b of document.querySelectorAll('#sizeSeg button'))b.classList.toggle('on',b.dataset.s===$('optSize').value);}
for(const b of document.querySelectorAll('#sizeSeg button'))b.onclick=()=>{$('optSize').value=b.dataset.s;$('optSize').dispatchEvent(new Event('input',{bubbles:true}));syncSize();};
$('optSize').addEventListener('input',syncSize);
new MutationObserver(()=>{const st=$('status'),p=$('heroConn');p.classList.toggle('on',st.classList.contains('on'));p.querySelector('span').textContent=st.textContent;syncSize();}).observe($('status'),{childList:true,characterData:true,subtree:true,attributes:true});

const _setTab=setTab;window.setTab=setTab=t=>{_setTab(t);document.body.classList.toggle('tab-studio',t==='studio');if(t!=='studio'&&window.Studio)Studio.leave();};document.body.classList.toggle('tab-studio',tab==='studio');
window.addEventListener('dt:designs',renderLists);
syncSize();renderHist();go(location.hash.slice(1)||'home');setTimeout(renderLists,300);
})();
