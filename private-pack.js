/* Diệu Thân · Bảng nhỏ — Ảnh riêng tư
   Ảnh bạn tự chọn chỉ lưu trong trình duyệt của máy này (IndexedDB). Không tải lên GitHub, không gửi đi đâu.
   Có thể tự cắt một bảng nhiều khung thành từng mẫu và bỏ cột ngày giờ in sẵn (lớp ngày giờ động sẽ thay). */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const GROUP='🔒 Ảnh riêng tư';
const toast=m=>{const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2400);};

/* ---------- IndexedDB ---------- */
const db=new Promise((ok,no)=>{const r=indexedDB.open('dt-private',1);r.onupgradeneeded=()=>r.result.createObjectStore('items',{keyPath:'id'});r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});
const tx=async(mode,fn)=>{const d=await db;return new Promise((ok,no)=>{const t=d.transaction('items',mode),s=t.objectStore('items'),r=fn(s);t.oncomplete=()=>ok(r&&r.result);t.onerror=()=>no(t.error);});};
const all=()=>tx('readonly',s=>s.getAll());
const put=it=>tx('readwrite',s=>s.put(it));
const del=id=>tx('readwrite',s=>s.delete(id));

let ITEMS=[];const imgs={};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

/* ---------- Cắt ảnh ---------- */
const lum=(d,i)=>d[i]*.299+d[i+1]*.587+d[i+2]*.114;
function loadImage(src){return new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=no;im.src=src;});}
function canvasOf(im,x=0,y=0,w=im.naturalWidth||im.width,h=im.naturalHeight||im.height){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,w,h);g.drawImage(im,x,y,w,h,0,0,w,h);return c;}
/* các dải không trắng giữa những hàng/cột gần như trắng hoàn toàn */
function bands(prof,len,minFrac){const out=[];let s=-1;for(let i=0;i<=len;i++){const blank=i===len||prof[i];if(!blank&&s<0)s=i;if(blank&&s>=0){if(i-s>=len*minFrac)out.push([s,i]);s=-1;}}return out;}
function splitSheet(c){const w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data;
  const rowBlank=y=>{let n=0;for(let x=0;x<w;x+=2)if(lum(d,(y*w+x)*4)<200)n++;return n<=w/2*.006;};
  const rows=bands(Array.from({length:h},(_,y)=>rowBlank(y)),h,.08),out=[];
  for(const [y0,y1] of rows){const colBlank=x=>{let n=0;for(let y=y0;y<y1;y+=2)if(lum(d,(y*w+x)*4)<200)n++;return n<=(y1-y0)/2*.006;};
    for(const [x0,x1] of bands(Array.from({length:w},(_,x)=>colBlank(x)),w,.08))out.push({x:x0,y:y0,w:x1-x0,h:y1-y0});}
  return out.length>1?out:[{x:0,y:0,w,h}];}
/* bỏ viền khung tròn bao ngoài: dò từ mép vào tới nét đậm đầu tiên rồi lùi vào trong */
function innerBox(c){const w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data,dark=(x,y)=>lum(d,(y*w+x)*4)<110;
  const scan=(n,f)=>{for(let i=0;i<n*.12;i++)if(f(i))return i;return -1;};
  const t=scan(h,y=>dark(w>>1,y)),b=scan(h,y=>dark(w>>1,h-1-y)),l=scan(w,x=>dark(x,h>>1)),r=scan(w,x=>dark(w-1-x,h>>1));
  if([t,b,l,r].some(v=>v<0))return {x:0,y:0,w,h};const m=Math.max(4,Math.round(Math.min(w,h)*.02));
  return {x:l+m,y:t+m,w:w-l-r-2*m,h:h-t-b-2*m};}
/* cột ngày giờ in sẵn bên phải, ngăn bằng đường nét đứt: tìm cột có nhiều đoạn đậm ngắn */
function clockColumn(c){const w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data;let best=-1,bestRuns=0;
  for(let x=Math.round(w*.5);x<w*.85;x++){let runs=0,prev=false,len=0,long=0;for(let y=Math.round(h*.04);y<h*.96;y++){const k=lum(d,(y*w+x)*4)<140;if(k){len++;if(!prev)runs++;}else{if(len>h*.12)long++;len=0;}prev=k;}
    if(long===0&&runs>bestRuns){bestRuns=runs;best=x;}}
  return bestRuns>=10?best:-1;}
async function prepare(file,{split,dropClock}){const url=URL.createObjectURL(file);try{const im=await loadImage(url),full=canvasOf(im),out=[];
    const parts=split?splitSheet(full):[{x:0,y:0,w:full.width,h:full.height}];
    for(const p of parts){let c=canvasOf(full,p.x,p.y,p.w,p.h);const ib=innerBox(c);c=canvasOf(c,ib.x,ib.y,ib.w,ib.h);
      if(dropClock){const x=clockColumn(c);if(x>0)c=canvasOf(c,0,0,x-3,c.height);}
      const s=Math.min(1,640/c.width),o=document.createElement('canvas');o.width=Math.round(c.width*s);o.height=Math.round(c.height*s);const g=o.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(c,0,0,o.width,o.height);
      out.push(o.toDataURL('image/png'));}
    return out;}finally{URL.revokeObjectURL(url);}}

/* ---------- Đưa vào thư viện mẫu ---------- */
function sync(){
  for(let i=LAYOUTS.length-1;i>=0;i--)if(LAYOUTS[i].t==='priv')LAYOUTS.splice(i,1);
  const gi=GROUPS.indexOf(GROUP);if(gi>=0)GROUPS.splice(gi,1);
  $('privId').innerHTML=ITEMS.map(it=>`<option value="${it.id}"></option>`).join('');
  if(ITEMS.length){GROUPS.unshift(GROUP);LAYOUTS.unshift(...ITEMS.map(it=>({group:GROUP,t:'priv',name:it.name,field:'privId',value:it.id,id:'priv:'+it.id})));}
  for(const it of ITEMS)if(!imgs[it.id]){const im=new Image();im.onload=()=>{if(typeof scheduleThumbs==='function')scheduleThumbs();if(tab==='priv')schedule();};im.src=it.src;imgs[it.id]=im;}
  const cur=localStorage.getItem('dt-priv-cur');if(cur&&ITEMS.some(i=>i.id===cur))$('privId').value=cur;
  if(tab==='priv'&&!ITEMS.length)chooseLayout(LAYOUTS[0]);
  if(typeof drawGallery==='function')drawGallery();panel();list();}
function current(){return ITEMS.find(i=>i.id===$('privId').value)||null;}
function draw(ctx,w,h){const it=current(),im=it&&imgs[it.id];
  if(!im||!im.complete||!im.naturalWidth){ctx.fillStyle='#000';ctx.font='600 12px sans-serif';ctx.textAlign='center';ctx.fillText(ITEMS.length?'Đang mở ảnh riêng tư…':'Chưa có ảnh riêng tư',w/2,h/2);ctx.textAlign='left';return;}
  if(it.fit==='cover'){const s=Math.max(w/im.naturalWidth,h/im.naturalHeight),c=document.createElement('canvas');c.width=Math.round(w/s);c.height=Math.round(h/s);c.getContext('2d').drawImage(im,(c.width-im.naturalWidth)/2,(c.height-im.naturalHeight)/2);drawLineArt(ctx,c,0,0,w,h);}
  else drawLineArt(ctx,im,0,0,w,h);}

/* ---------- Bảng chỉnh trong trình chỉnh sửa ---------- */
function panel(){const p=$('privPanel');if(!p)return;const it=current();if(!it){p.innerHTML='<p class="note">Chưa có ảnh riêng tư. Thêm ở mục Bộ sưu tập.</p>';return;}
  p.innerHTML=`<p class="note">🔒 Ảnh này chỉ lưu trên trình duyệt của máy này, không có trên GitHub.</p>
    <label><span>Tên mẫu</span><input id="privName" type="text" maxlength="40"></label>
    <label><span>Cách đặt ảnh</span><select id="privFit"><option value="contain">Vừa khung (giữ trọn ảnh)</option><option value="cover">Phủ kín màn (cắt bớt mép)</option></select></label>
    <div class="row-btns"><button id="privDel" type="button">Xoá ảnh này</button></div>`;
  $('privName').value=it.name;$('privFit').value=it.fit||'contain';
  $('privName').onchange=async()=>{it.name=$('privName').value.trim()||it.name;await put(it);sync();};
  $('privFit').onchange=async()=>{it.fit=$('privFit').value;await put(it);schedule();};
  $('privDel').onclick=async()=>{if(!confirm(`Xoá “${it.name}” khỏi máy này? Không khôi phục được.`))return;await del(it.id);ITEMS=ITEMS.filter(x=>x!==it);delete imgs[it.id];sync();toast('Đã xoá ảnh riêng tư');};}

/* ---------- Khối thêm ảnh ở Bộ sưu tập ---------- */
function block(){if($('privBlk'))return;const v=$('v-gallery');if(!v)return;const b=document.createElement('div');b.className='blk';b.id='privBlk';
  b.innerHTML=`<h3>🔒 Ảnh riêng tư <span style="font:500 12.5px var(--sans);color:var(--muted)">chỉ lưu trên máy này</span></h3>
    <p class="small-note" style="margin:0 0 10px;font-size:13px;color:var(--muted)">Chọn ảnh từ máy. Ảnh không tải lên GitHub và không ai khác thấy. Mỗi ảnh thành một mẫu trong nhóm “${GROUP}”, đặt được lớp ngày giờ động như mọi mẫu.</p>
    <label class="check"><input type="checkbox" id="privSplit" checked> Tự cắt bảng nhiều khung thành từng mẫu</label>
    <label class="check"><input type="checkbox" id="privClock" checked> Bỏ cột ngày giờ in sẵn bên phải (nếu có)</label>
    <div class="row-btns" style="margin-top:8px"><button class="primary" id="privAdd" type="button">Thêm ảnh…</button><input type="file" id="privFile" accept="image/*" multiple hidden></div>
    <div class="strip" id="privList" style="margin-top:12px"></div>`;
  v.insertBefore(b,v.querySelector('.gallery'));
  $('privAdd').onclick=()=>$('privFile').click();
  $('privFile').onchange=async e=>{const files=[...e.target.files];e.target.value='';if(!files.length)return;$('privAdd').disabled=true;$('privAdd').textContent='Đang cắt ảnh…';let n=0;
    try{for(const f of files){const parts=await prepare(f,{split:$('privSplit').checked,dropClock:$('privClock').checked}),base=f.name.replace(/\.[^.]+$/,'').slice(0,24)||'Ảnh';
        for(let i=0;i<parts.length;i++){const it={id:uid(),name:parts.length>1?`${base} ${i+1}`:base,src:parts[i],fit:'contain',at:Date.now()};await put(it);ITEMS.push(it);n++;}}
      toast(`Đã thêm ${n} mẫu riêng tư`);}catch(err){alert('Không lưu được ảnh: '+(err&&err.message||err));}
    finally{$('privAdd').disabled=false;$('privAdd').textContent='Thêm ảnh…';sync();if(typeof makeThumbs==='function'){curGroup=GROUP;makeThumbs();}}};}
function list(){const box=$('privList');if(!box)return;box.innerHTML=ITEMS.length?'':'<p class="empty">Chưa có ảnh nào.</p>';
  for(const it of ITEMS){const c=document.createElement('button');c.className='card';c.innerHTML='<img alt=""><span class="nm"></span>';c.querySelector('img').src=it.src;c.querySelector('.nm').textContent=it.name;
    c.onclick=()=>chooseLayout(LAYOUTS.find(l=>l.id==='priv:'+it.id));box.appendChild(c);}}

$('privId').addEventListener('change',()=>{localStorage.setItem('dt-priv-cur',$('privId').value);});
const _choose=chooseLayout;window.chooseLayout=chooseLayout=function(l){_choose(l);if(l&&l.t==='priv'){localStorage.setItem('dt-priv-cur',l.value);panel();}};
window.Private={draw,reload:async()=>{ITEMS=(await all()).sort((a,b)=>a.at-b.at);sync();}};
block();Private.reload().catch(()=>{const b=$('privBlk');if(b)b.querySelector('p').textContent='Trình duyệt này không cho lưu ảnh riêng tư (IndexedDB bị tắt, ví dụ ở chế độ ẩn danh).';});
})();
