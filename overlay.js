/* Diệu Thân · Bảng nhỏ — Lớp ngày giờ động (Dynamic DateTime Overlay)
   - Lớp riêng, KHÔNG vẽ vào ảnh nội dung. Trên web chỉ hiện ở lớp xem trước phía trên khung.
   - Khi gửi, lớp này chỉ được ghép vào ảnh nếu chọn "Trang web làm mới" (giờ lấy đúng lúc gửi, tự gửi lại theo chu kỳ).
   - Firmware hiện có KHÔNG nhận vị trí / định dạng tuỳ ý: xem DTOverlay.caps(). Không giả lập firmware. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const K='#000',W='#fff',RED='#ff0000';
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d;}catch(_){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(_){}}};
const ART_TABS=['pic','char','art'];
const POS={tl:'Góc trên trái',tr:'Góc trên phải',bl:'Góc dưới trái',br:'Góc dưới phải',tc:'Giữa cạnh trên',bc:'Giữa cạnh dưới',custom:'Tuỳ chỉnh (X, Y)'};
const FMT={hm:'21:37',dm:'28/11',wdm:'T7 28/11',dm_hm:'28/11 · 21:37',wdm_hm:'T7 28/11 · 21:37',two:'Hai dòng: T7 28/11 / 21:37'};
const BG={box:'Ô trắng có viền',plain:'Ô trắng không viền',clear:'Chỉ chữ (viền trắng quanh chữ)',inv:'Ô đen, chữ trắng'};
const DEF={on:false,pos:'br',x:4,y:4,fmt:'hm',size:16,weight:800,color:'k',bg:'box',margin:3,engine:'web'};
let store=LS.get('dt-overlay',{def:null,per:{}});if(!store.per)store.per={};
const lid=()=>{try{return currentLayout().id;}catch(_){return 'x';}};
const cfg=(id=lid())=>Object.assign({},DEF,store.def||{},window.PIC_FULL&&PIC_FULL.has(id)?{on:true,pos:'br',fmt:'wdm_hm',size:13,engine:'web'}:{},store.per[id]||{});
const setCfg=(o,id=lid())=>{store.per[id]=Object.assign(cfg(id),o);LS.set('dt-overlay',store);};
const active=(id)=>{const c=cfg(id);return c.on&&c.engine==='web';};

/* ---------- Chữ ngày giờ ---------- */
const p2=n=>String(n).padStart(2,'0'),TH=['CN','T2','T3','T4','T5','T6','T7'];
function lines(c,d){const hm=`${p2(d.getHours())}:${p2(d.getMinutes())}`,dm=`${p2(d.getDate())}/${p2(d.getMonth()+1)}`,wd=`${TH[d.getDay()]} ${dm}`;
  return ({hm:[hm],dm:[dm],wdm:[wd],dm_hm:[`${dm} · ${hm}`],wdm_hm:[`${wd} · ${hm}`],two:[wd,hm]})[c.fmt]||[hm];}
const fam='"Be Vietnam Pro",-apple-system,"Segoe UI",Roboto,Arial,sans-serif',famR='"Baloo 2","Be Vietnam Pro",system-ui,sans-serif';

/* Đo và đặt ô. Trả về {x,y,w,h,rows:[{t,size,y}]} theo điểm ảnh màn */
function layout(c,W0,H0,d=new Date()){const g=document.createElement('canvas').getContext('2d'),L=lines(c,d),two=L.length===2,pad=c.bg==='clear'?1:3;
  const rows=L.map((t,i)=>{const size=two&&i===0?Math.max(8,Math.round(c.size*.6)):c.size;g.font=`${c.weight} ${size}px ${i===L.length-1?famR:fam}`;return {t,size,w:Math.ceil(g.measureText(t).width)};});
  const w=Math.max(...rows.map(r=>r.w))+pad*2,h=rows.reduce((s,r)=>s+Math.round(r.size*(r===rows[rows.length-1]?0.98:1.08)),0)+pad*2-1;
  const m=+c.margin||0;let x,y;
  switch(c.pos){case 'tl':x=m;y=m;break;case 'tr':x=W0-w-m;y=m;break;case 'bl':x=m;y=H0-h-m;break;case 'tc':x=(W0-w)/2;y=m;break;case 'bc':x=(W0-w)/2;y=H0-h-m;break;
    case 'custom':x=+c.x||0;y=+c.y||0;break;default:x=W0-w-m;y=H0-h-m;}
  x=Math.round(Math.max(0,Math.min(W0-w,x)));y=Math.round(Math.max(0,Math.min(H0-h,y)));
  let cy=y+pad;for(const r of rows){const lh=Math.round(r.size*(r===rows[rows.length-1]?0.98:1.08));r.base=cy+Math.round(lh*0.8);cy+=lh;}
  return {x,y,w,h,rows,pad};}

/* Vẽ lớp ngày giờ, ép về đúng 3 màu của màn */
function paint(ctx,W0,H0,c=cfg(),d=new Date()){const b=layout(c,W0,H0,d),t=document.createElement('canvas');t.width=b.w;t.height=b.h;const g=t.getContext('2d');
  const red=c.color==='r'&&(!$('optRed')||$('optRed').checked),ink=c.bg==='inv'?W:(red?RED:K);
  if(c.bg==='box'||c.bg==='plain'||c.bg==='inv'){g.fillStyle=c.bg==='inv'?K:W;g.beginPath();g.roundRect(0,0,b.w,b.h,3);g.fill();if(c.bg==='box'){g.strokeStyle=K;g.lineWidth=1;g.beginPath();g.roundRect(.5,.5,b.w-1,b.h-1,3);g.stroke();}}
  g.textAlign='center';g.textBaseline='alphabetic';
  b.rows.forEach((r,i)=>{g.font=`${c.weight} ${r.size}px ${i===b.rows.length-1?famR:fam}`;
    if(c.bg==='clear'){g.lineJoin='round';g.lineWidth=3;g.strokeStyle=W;g.strokeText(r.t,b.w/2,r.base-b.y);}g.fillStyle=ink;g.fillText(r.t,b.w/2,r.base-b.y);});
  const im=g.getImageData(0,0,b.w,b.h),a=im.data,base=ctx.getImageData(b.x,b.y,b.w,b.h),bd=base.data;
  for(let i=0;i<a.length;i+=4){if(a[i+3]<110)continue;const R=a[i],G=a[i+1],B=a[i+2];let v;
    if(R>150&&G<120&&B<120)v=[255,0,0];else v=(R*.299+G*.587+B*.114)<150?[0,0,0]:[255,255,255];bd[i]=v[0];bd[i+1]=v[1];bd[i+2]=v[2];bd[i+3]=255;}
  ctx.putImageData(base,b.x,b.y);return b;}

/* ---------- Khả năng của firmware (theo mã trang gốc tanhoangphuc842002-rgb, chưa thử trên máy thật) ---------- */
function caps(){const v=(typeof ble!=='undefined'&&ble.version)||0,conn=typeof ble!=='undefined'&&!!ble.device?.gatt?.connected,size=(typeof panelSize==='function'&&panelSize())||$('optSize').value,big=size==='290';
  if(!conn)return {conn,v,kind:'unknown',text:'Chưa kết nối nên chưa biết firmware. Kết nối màn hình để kiểm tra.'};
  if(v>=262&&v<=300)return {conn,v,kind:'stacked',text:`Firmware ${v}: “Đồng hồ tranh” chỉ có cột giờ cố định bên trái (${big?80:72}×128, giờ đỏ – phút đen). Không đặt được vị trí khác.`};
  if(v>=256&&v<=261)return {conn,v,kind:'corner',corners:true,text:`Firmware ${v}: “Đồng hồ tranh” có ô giờ ${big?120:104}×48 đặt được ở 4 góc. Định dạng, cỡ chữ, màu do firmware quyết định. Không có giữa cạnh trên/dưới hay vị trí tuỳ ý.`};
  if(v>=250&&v<=255)return {conn,v,kind:'big',text:`Firmware ${v}: “Đồng hồ tranh” có ô giờ + ngày cố định ở góc trên phải (${big?'120×80':'104×72'}).`};
  if(v>=(big?30:40))return {conn,v,kind:'side',text:`Firmware ${v}: chỉ có chế độ “Đồng hồ và ảnh” — đồng hồ cố định ở cột phải rộng 102 px, ảnh ${big?194:148}×128 bên trái. Không đặt được ô giờ lên trên thiết kế.`};
  return {conn,v,kind:'none',text:`Firmware ${v||'(không rõ)'}: chưa hỗ trợ đồng hồ tự chạy kèm ảnh.`};}

/* ---------- Lớp xem trước (chỉ trên web) ---------- */
let ovl=null,raf=0;
function ensure(){if(ovl)return;const dev=document.querySelector('.device');if(!dev)return;dev.style.position='relative';ovl=document.createElement('canvas');ovl.className='dto-layer';ovl.setAttribute('aria-hidden','true');dev.appendChild(ovl);}
function preview(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;ensure();if(!ovl)return;const cv=$('cv'),c=cfg();
  if(!c.on){ovl.hidden=true;return;}ovl.hidden=false;ovl.width=cv.width;ovl.height=cv.height;const g=ovl.getContext('2d');g.clearRect(0,0,ovl.width,ovl.height);
  const b=paint(g,cv.width,cv.height,c);g.strokeStyle=c.engine==='web'?'rgba(161,44,41,.9)':'rgba(40,38,34,.6)';g.setLineDash([2,2]);g.lineWidth=1;g.strokeRect(b.x-.5,b.y-.5,b.w+1,b.h+1);
  if(c.engine!=='web'){g.fillStyle='rgba(255,255,255,.55)';g.fillRect(b.x,b.y,b.w,b.h);}
  const r=cv.getBoundingClientRect(),pr=ovl.parentElement.getBoundingClientRect();Object.assign(ovl.style,{left:r.left-pr.left+'px',top:r.top-pr.top+'px',width:r.width+'px',height:r.height+'px'});});}

/* ---------- Bảng chỉnh trong trình chỉnh sửa của mọi mẫu ---------- */
function panel(){const host=document.querySelector('.grid>div');if(!host||$('dtoBox'))return;const d=document.createElement('details');d.className='panel dto';d.id='dtoBox';d.open=true;
  d.innerHTML=`<summary>🕒 Ngày giờ động <span class="hint-inline" id="dtoSum"></span></summary>
  <label class="check" style="margin-top:12px"><input type="checkbox" id="dtoOn"> Đặt lớp ngày giờ lên mẫu này</label>
  <div id="dtoBody">
    <div class="row"><label><span>Vị trí</span><select id="dtoPos">${Object.entries(POS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label>
      <label><span>Định dạng</span><select id="dtoFmt">${Object.entries(FMT).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label></div>
    <div class="row" id="dtoXY"><label><span>X (điểm ảnh)</span><input id="dtoX" type="number" min="0" max="296"></label><label><span>Y (điểm ảnh)</span><input id="dtoY" type="number" min="0" max="128"></label></div>
    <label><span>Cỡ chữ · <output id="dtoSizeO"></output> px</span><input id="dtoSize" type="range" min="8" max="44"></label>
    <div class="row"><label><span>Độ đậm</span><select id="dtoW"><option value="600">Vừa</option><option value="800">Đậm</option></select></label>
      <label><span>Màu chữ</span><select id="dtoCol"><option value="k">Đen (nên dùng)</option><option value="r">Đỏ</option></select></label></div>
    <div class="row"><label><span>Nền ô giờ</span><select id="dtoBg">${Object.entries(BG).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label>
      <label><span>Cách mép · <output id="dtoMO"></output> px</span><input id="dtoM" type="range" min="0" max="12"></label></div>
    <div class="f-label">Cách cập nhật giờ trên màn</div>
    <label class="check"><input type="radio" name="dtoEng" value="web"> Trang web làm mới <span class="hint-inline">ghép giờ lúc gửi · bật “Tự cập nhật” để gửi lại theo chu kỳ</span></label>
    <label class="check"><input type="radio" name="dtoEng" value="fw"> Đồng hồ tự chạy (firmware) <span class="hint-inline">không cần mở trang</span></label>
    <div class="dto-note" id="dtoNote"></div>
    <div class="row-btns" style="margin-top:8px"><button id="dtoAll" type="button">Dùng cài đặt này cho mọi mẫu</button><button id="dtoFwPng" type="button" hidden>Tải ảnh nền cho Đồng hồ tranh</button></div>
  </div>`;
  host.appendChild(d);
  const bind=(id,k,num)=>$(id).addEventListener('input',()=>{setCfg({[k]:num?+$(id).value:$(id).value});sync();});
  $('dtoOn').addEventListener('change',()=>{setCfg({on:$('dtoOn').checked});sync();});
  bind('dtoPos','pos');bind('dtoFmt','fmt');bind('dtoX','x',1);bind('dtoY','y',1);bind('dtoSize','size',1);bind('dtoW','weight',1);bind('dtoCol','color');bind('dtoBg','bg');bind('dtoM','margin',1);
  for(const r of document.querySelectorAll('[name=dtoEng]'))r.addEventListener('change',()=>{setCfg({engine:r.value});sync();});
  $('dtoAll').onclick=()=>{store.def=cfg();store.per={};LS.set('dt-overlay',store);sync();toast('Đã áp dụng lớp ngày giờ cho mọi mẫu');};
  $('dtoFwPng').onclick=fwPng;}
const toast=m=>{const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);};

/* Firmware 256–261: tải ảnh nền toàn màn để đưa vào “Đồng hồ tranh” ở trang gốc (thiết bị tự vẽ ô giờ ở góc đã chọn) */
function fwPng(){const c=cfg(),cv=$('cv');render();const W0=cv.width,o=document.createElement('canvas');o.width=W0;o.height=128;const g=o.getContext('2d');g.fillStyle=W;g.fillRect(0,0,W0,128);g.drawImage(cv,0,0);
  const a=document.createElement('a');a.download=`nen-dong-ho-tranh-${W0}x128-${c.pos}.png`;a.href=o.toDataURL('image/png');a.click();}

function sync(){if(!$('dtoBox'))return;const c=cfg(),cap=caps(),art=ART_TABS.includes(typeof tab!=='undefined'?tab:'');
  $('dtoOn').checked=c.on;$('dtoBody').hidden=!c.on;$('dtoPos').value=c.pos;$('dtoFmt').value=c.fmt;$('dtoX').value=c.x;$('dtoY').value=c.y;$('dtoXY').hidden=c.pos!=='custom';
  $('dtoSize').value=c.size;$('dtoSizeO').textContent=c.size;$('dtoW').value=c.weight;$('dtoCol').value=c.color;$('dtoBg').value=c.bg;$('dtoM').value=c.margin;$('dtoMO').textContent=c.margin;
  for(const r of document.querySelectorAll('[name=dtoEng]'))r.checked=r.value===c.engine;
  $('dtoSum').textContent=c.on?`${FMT[c.fmt]} · ${POS[c.pos].toLowerCase()}`:'tắt';
  let note='';
  if(c.engine==='web'){note=`<b>Đang dùng: trang web làm mới.</b> Thiết kế gốc giữ nguyên; lúc gửi, ô giờ được ghép lên đúng vị trí. Màn chỉ đổi giờ khi trang gửi lại (bật “Tự cập nhật”, trang phải mở và gần màn). Mỗi lần gửi là làm mới toàn màn (~30 giây) — firmware hiện tại không có lệnh làm mới riêng một vùng.`;
    if(c.color==='r')note+=` <br>Chữ đỏ: màn 3 màu phải làm mới toàn bộ mới hiện màu đỏ; nên dùng đen.`;}
  else{note=`<b>Firmware tự chạy.</b> ${cap.text}`;
    if(cap.kind==='corner'){const ok=['tl','tr','bl','br'].includes(c.pos);note+=ok?` <br>Vị trí “${POS[c.pos]}” dùng được. Tải ảnh nền ở nút bên dưới rồi đưa lên mục <i>Đồng hồ tranh</i> ở trang gốc (chọn cùng góc). Định dạng/cỡ chữ ở đây chỉ để xem trước, máy sẽ dùng kiểu của firmware.`:` <br>“${POS[c.pos]}” firmware không hỗ trợ — chỉ có 4 góc.`;}
    else if(cap.kind==='side')note+=` <br>Muốn dùng kiểu này: chọn mẫu ở nhóm “Giờ tự chạy” hoặc nút “Gửi kèm đồng hồ tự chạy” (thiết kế bị thu vào khung trái).`;
    note+=` <br><b>Trang không gửi lớp giờ ở chế độ này</b> và không khẳng định màn tự chạy nếu firmware chưa hỗ trợ. Xem đề xuất nâng cấp firmware trong HUONG-DAN.md.`;}
  $('dtoNote').innerHTML=note;$('dtoFwPng').hidden=!(c.engine==='fw'&&cap.kind==='corner'&&['tl','tr','bl','br'].includes(c.pos));
  // mẫu tranh / nhân vật: khi bật lớp web thì vẽ tranh toàn màn và gửi bằng nút Gửi thường
  if(art){const on=active();$('btnSend').hidden=!on;$('artGuide').hidden=on;$('autoBox').hidden=!on&&tab!=='char';if(tab==='pic')document.querySelector('[data-p="pic"]').hidden=on;for(const n of document.querySelectorAll('[data-p="pic"] .note,[data-p="char"] .note'))if(/tự chạy/.test(n.textContent))n.hidden=on;}
  if(typeof schedule==='function')schedule();preview();}

/* ---------- Ghép vào luồng hiện có (không đổi giao thức Bluetooth) ---------- */
window.DTOverlay={cfg,active,paint,caps,preview,sync,
  fullArt:()=>ART_TABS.includes(typeof tab!=='undefined'?tab:'')&&active(),
  bake(ctx,W0,H0){if(active())paint(ctx,W0,H0);}};
const _render=render;window.render=render=function(){_render();preview();};
const _setTab=setTab;window.setTab=setTab=function(t){_setTab(t);sync();};
window.savePng=savePng=function(name){artExport=true;_render();const cv=$('cv'),o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const g=o.getContext('2d');g.drawImage(cv,0,0);
  if(active())paint(g,cv.width,cv.height);const a=document.createElement('a');a.download=name;a.href=o.toDataURL('image/png');a.click();artExport=false;render();};
panel();sync();
window.addEventListener('resize',preview);setInterval(()=>{if(cfg().on)preview();},20000);
if(typeof ble!=='undefined')setInterval(()=>{const k=(ble.device?.gatt?.connected?1:0)+'|'+ble.version;if(k!==sync.k){sync.k=k;sync();}},2000);
})();
