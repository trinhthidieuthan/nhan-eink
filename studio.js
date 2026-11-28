/* Diệu Thân · Bảng nhỏ — Studio sáng tạo
   Thiết kế tự do theo đúng độ phân giải màn (250×122 hoặc 296×128). Mỗi phần tử được vẽ rồi ép về 3 màu thật của màn
   (đen · trắng · đỏ). Khung chọn / tay kéo chỉ hiện trên web, không bao giờ nằm trong ảnh gửi đi. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const K='#000',W='#fff';
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d;}catch(_){return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(_){return false;}}};
const uid=()=>Math.random().toString(36).slice(2,9);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const toast=m=>{const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);};
const refresh=()=>{if(typeof schedule==='function')schedule();};
const col=c=>c==='r'?KIT.R():K;

/* ---------- Danh mục ---------- */
const TYPES={text:'Chữ',image:'Ảnh',chara:'Nhân vật',sticker:'Hình dán',clock:'Giờ',date:'Ngày',cal:'Lịch tháng',progress:'Thanh tiến độ',battery:'Pin cảm xúc',check:'Danh sách',box:'Khung'};
const MOODS={vui:'Vui',tuyet:'Tuyệt vời',binhyen:'Bình yên','nghi-ngoi':'Thảnh thơi',thuong:'Dễ thương',yeu:'Đang yêu',buon:'Buồn',doi:'Dỗi',gian:'Giận',het:'Hết pin',om:'Ốm',im:'Im lặng',phien:'Phiền',nghi:'Suy nghĩ',ngu:'Buồn ngủ',chualanh:'Chữa lành'};
const POSES={dung:'Đứng',gio:'Giơ tay',vay:'Vẫy tay',om:'Ôm tim'};
const SHAPES={heart:'Trái tim',pxheart:'Tim pixel',star:'Ngôi sao',pxstar:'Sao pixel',sparkle:'Lấp lánh',flower:'Bông hoa',leaf:'Chiếc lá',cloud:'Đám mây',sun:'Mặt trời',moon:'Mặt trăng',drop:'Giọt nước',cup:'Tách trà',book:'Cuốn sách',note:'Nốt nhạc',zzz:'Zzz'};
const FAMS={round:'Tròn mềm (Baloo)',sans:'Gọn gàng (Be Vietnam)',serif:'Có chân (Georgia)',mono:'Đơn cách'};
const FAMV={round:'round',sans:'sans',serif:'serif',mono:'ui-monospace,Menlo,Consolas,monospace'};
const LAYOUT_NAMES={'img-time':'Ảnh trái · giờ phải','time-img':'Giờ trái · ảnh phải',center:'Đồng hồ ở giữa','half-h':'Hai nửa ngang','half-v':'Hai nửa dọc',full:'Toàn màn hình',free:'Tự do (trống)'};
const DEF={
  text:()=>({text:'Little things, little joys',size:22,weight:800,fam:'round',align:'left',valign:'middle',color:'k',inv:false,x:.05,y:.08,w:.6,h:.4}),
  image:()=>({src:'',zoom:1,ox:0,oy:0,bright:0,contrast:15,dither:'fs',inv:false,x:0,y:0,w:.5,h:1}),
  chara:()=>({kind:'meo',mood:'vui',pose:'dung',flip:false,x:.62,y:.04,w:.34,h:.92}),
  sticker:()=>({shape:'heart',color:'r',x:.82,y:.08,w:.14,h:.28}),
  clock:()=>({fmt:'hm',fam:'round',weight:800,color:'k',inv:false,x:.52,y:.06,w:.46,h:.5}),
  date:()=>({fmt:'full',lunar:true,fam:'sans',color:'k',inv:false,x:.52,y:.6,w:.46,h:.32}),
  cal:()=>({accent:'r',x:.52,y:.04,w:.46,h:.92}),
  progress:()=>({label:'Dự án nhỏ',pct:60,color:'r',x:.05,y:.66,w:.55,h:.26}),
  battery:()=>({pct:70,label:'Năng lượng hôm nay',x:.05,y:.3,w:.45,h:.4}),
  check:()=>({title:'Hôm nay',items:'x Uống đủ nước\nĐọc 10 trang sách\nĐi bộ 15 phút',x:.04,y:.06,w:.55,h:.88}),
  box:()=>({line:1,radius:8,dash:false,fill:'none',x:.02,y:.04,w:.96,h:.92})};
const mkEl=(type,o={})=>Object.assign({id:uid(),type},DEF[type](),o);

function layoutEls(name,keep){const img=keep.find(e=>e.type==='image'),src=img?img.src:'';
  const I=o=>mkEl('image',Object.assign({src},img?{zoom:img.zoom,ox:img.ox,oy:img.oy,bright:img.bright,contrast:img.contrast,dither:img.dither}:{} ,o));
  switch(name){
    case 'img-time':return [I({x:0,y:0,w:.5,h:1}),mkEl('clock',{x:.53,y:.08,w:.44,h:.5}),mkEl('date',{x:.53,y:.6,w:.44,h:.32})];
    case 'time-img':return [mkEl('clock',{x:.03,y:.08,w:.44,h:.5}),mkEl('date',{x:.03,y:.6,w:.44,h:.32}),I({x:.5,y:0,w:.5,h:1})];
    case 'center':return [mkEl('clock',{x:.2,y:.06,w:.6,h:.56,align:'center'}),mkEl('date',{x:.15,y:.64,w:.7,h:.28,fmt:'full'}),mkEl('sticker',{shape:'sparkle',color:'r',x:.05,y:.12,w:.1,h:.22}),mkEl('sticker',{shape:'pxheart',color:'r',x:.86,y:.66,w:.09,h:.2})];
    case 'half-h':return [mkEl('text',{text:'Chậm lại một chút',x:.04,y:.04,w:.92,h:.44,align:'center'}),mkEl('box',{x:.02,y:.5,w:.96,h:.005,line:1,radius:0}),mkEl('date',{x:.04,y:.54,w:.92,h:.4,fmt:'full',lunar:true})];
    case 'half-v':return [mkEl('text',{text:'Hôm nay\nthật vui',size:26,x:.04,y:.08,w:.48,h:.84}),mkEl('chara',{x:.56,y:.04,w:.4,h:.92})];
    case 'full':return src?[I({x:0,y:0,w:1,h:1})]:[mkEl('text',{text:'Little things,\nlittle joys',size:30,x:.05,y:.05,w:.9,h:.9,align:'center'})];
    default:return [mkEl('text',{text:'Chạm “Thêm” để bắt đầu',size:16,weight:600,x:.05,y:.35,w:.9,h:.3,align:'center'})];}}
const newDoc=(lay='half-v')=>({v:1,name:'',designId:null,inv:false,layout:lay,els:layoutEls(lay,[])});

/* ---------- Trạng thái ---------- */
let doc=LS.get('dt-studio-cur',null);if(!doc||!Array.isArray(doc.els))doc=newDoc();
let sel=doc.els[0]?.id||null;
const undoS=[],redoS=[];let lastPush=0;
let saveT=0;const persist=()=>{clearTimeout(saveT);saveT=setTimeout(()=>{if(!LS.set('dt-studio-cur',doc))toast('Bộ nhớ trình duyệt đầy — hãy xoá bớt thiết kế cũ hoặc ảnh lớn.');},400);};
function mutate(fn,coalesce){const before=JSON.stringify(doc);fn();const after=JSON.stringify(doc);if(before===after)return;
  if(!coalesce||Date.now()-lastPush>900){undoS.push(before);if(undoS.length>60)undoS.shift();redoS.length=0;}lastPush=Date.now();changed();}
function changed(){persist();refresh();updTools();}
const cur=()=>doc.els.find(e=>e.id===sel)||null;

/* ---------- Vẽ ---------- */
const imgCache={};
function getImg(src){if(!src)return null;let im=imgCache[src];if(!im){im=imgCache[src]=new Image();im.onload=refresh;im.src=src;}return im.complete&&im.naturalWidth?im:null;}
function offscreen(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.fillStyle=W;g.fillRect(0,0,w,h);g.textBaseline='alphabetic';return [c,g];}
/* ép về đen / trắng / đỏ */
function pure(g,w,h){const im=g.getImageData(0,0,w,h),a=im.data,red=KIT.useRed();
  for(let i=0;i<a.length;i+=4){const r=a[i],gg=a[i+1],b=a[i+2];
    if(red&&r>150&&gg<150&&b<150&&r-gg>60){a[i]=255;a[i+1]=a[i+2]=0;}else{const v=(r*.299+gg*.587+b*.114)<150?0:255;a[i]=a[i+1]=a[i+2]=v;}a[i+3]=255;}return im;}
function compose(ctx,im,x,y,inv){const w=im.width,h=im.height,a=im.data;
  if(inv)for(let i=0;i<a.length;i+=4){if(a[i]===255&&a[i+1]===0)continue;const v=a[i]?0:255;a[i]=a[i+1]=a[i+2]=v;}
  const base=ctx.getImageData(x,y,w,h),bd=base.data;
  for(let i=0;i<a.length;i+=4){if(!inv&&a[i]===255&&a[i+1]===255)continue;bd[i]=a[i];bd[i+1]=a[i+1];bd[i+2]=a[i+2];bd[i+3]=255;}
  ctx.putImageData(base,x,y);}
const pad2=n=>String(n).padStart(2,'0');
const THU=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'],THU_S=['CN','T2','T3','T4','T5','T6','T7'];
function lunarLine(d){try{const L=Lunar.fromSolar(d.getDate(),d.getMonth()+1,d.getFullYear());return `Âm ${L.day}/${L.month}${L.leap?' nhuận':''} · ${Lunar.canChi(L.year)}`;}catch(_){return '';}}
const PX={pxheart:['.##.##.','#######','#######','.#####.','..###..','...#...'],pxstar:['...#...','..###..','#######','.#####.','.##.##.','##...##']};

function dither(g,w,h,o){const im=g.getImageData(0,0,w,h),a=im.data,n=w*h,L=new Float32Array(n);
  const ct=(100+(+o.contrast||0))/100,br=+o.bright||0;
  for(let i=0;i<n;i++){let v=a[i*4]*.299+a[i*4+1]*.587+a[i*4+2]*.114;v=(v-128)*ct+128+br;L[i]=v;}
  const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,old=L[i];let nv;
    if(o.dither==='ord')nv=old>(BAY[(y%4)*4+x%4]+.5)*16?255:0;else nv=old<128?0:255;
    const e=old-nv;L[i]=nv;
    if(o.dither==='fs'){if(x+1<w)L[i+1]+=e*7/16;if(y+1<h){if(x)L[i+w-1]+=e*3/16;L[i+w]+=e*5/16;if(x+1<w)L[i+w+1]+=e/16;}}
    else if(o.dither==='atk'){const f=e/8;if(x+1<w)L[i+1]+=f;if(x+2<w)L[i+2]+=f;if(y+1<h){if(x)L[i+w-1]+=f;L[i+w]+=f;if(x+1<w)L[i+w+1]+=f;}if(y+2<h)L[i+2*w]+=f;}}
  for(let i=0;i<n;i++){const v=L[i]>=128?255:0;a[i*4]=a[i*4+1]=a[i*4+2]=v;a[i*4+3]=255;}return im;}

function drawEl(ctx,e,W0,H0){
  const x=Math.round(e.x*W0),y=Math.round(e.y*H0),w=Math.max(2,Math.round(e.w*W0)),h=Math.max(2,Math.round(e.h*H0)),sc=H0/122;
  let [c,g]=offscreen(w,h);let im=null;
  switch(e.type){
    case 'text':KIT.text(g,e.text||'',1,0,w-2,h,{max:Math.round(e.size*sc),min:7,weight:e.weight,fam:FAMV[e.fam]||'round',align:e.align,valign:e.valign,maxLines:8,color:col(e.color)});break;
    case 'clock':{const d=new Date();let t=`${pad2(d.getHours())}:${pad2(d.getMinutes())}`;if(e.fmt==='hm12'){const hh=d.getHours()%12||12;t=`${hh}:${pad2(d.getMinutes())}`;}
      KIT.text(g,t,0,0,w,h,{max:Math.round(h*1.05),min:8,weight:e.weight,fam:FAMV[e.fam]||'round',align:e.align||'center',valign:'middle',maxLines:1,lh:1,color:col(e.color)});
      if(e.fmt==='hm12'){KIT.font(g,Math.max(8,Math.round(h*.18)),700,'sans');g.fillStyle=col(e.color);g.textAlign='right';g.fillText(new Date().getHours()<12?'SA':'CH',w-1,h-2);g.textAlign='left';}break;}
    case 'date':{const d=new Date();let t=e.fmt==='short'?`${THU_S[d.getDay()]} · ${pad2(d.getDate())}/${pad2(d.getMonth()+1)}`:e.fmt==='dm'?`${d.getDate()} tháng ${d.getMonth()+1}`:`${THU[d.getDay()]}, ${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()}`;
      if(e.lunar)t+='\n'+lunarLine(d);KIT.text(g,t,0,0,w,h,{max:Math.round(16*sc),min:7,weight:700,fam:FAMV[e.fam]||'sans',align:e.align||'center',valign:'middle',maxLines:3,color:col(e.color)});break;}
    case 'cal':{const d=new Date(),y0=d.getFullYear(),m0=d.getMonth(),first=new Date(y0,m0,1).getDay(),days=new Date(y0,m0+1,0).getDate(),rows=Math.ceil((first+days)/7);
      const hh=Math.max(9,Math.round(h*.16)),cw=w/7,rh=(h-hh*2)/rows;g.fillStyle=K;g.fillRect(0,0,w,hh);KIT.font(g,Math.round(hh*.72),800,'sans');g.fillStyle=W;g.textAlign='center';g.fillText(`Tháng ${m0+1} · ${y0}`,w/2,hh*.8);
      KIT.font(g,Math.max(7,Math.round(Math.min(cw*.5,hh*.7))),700,'sans');THU_S.forEach((t,i)=>{g.fillStyle=i===0?col(e.accent):K;g.fillText(t,(i+.5)*cw,hh*1.85);});
      KIT.font(g,Math.max(7,Math.round(Math.min(cw*.55,rh*.72))),600,'sans');
      for(let n=1;n<=days;n++){const p=first+n-1,cx=(p%7+.5)*cw,cy=hh*2+(Math.floor(p/7)+.5)*rh;
        if(n===d.getDate()){g.fillStyle=col(e.accent);g.beginPath();g.roundRect(cx-cw*.46,cy-rh*.48,cw*.92,rh*.96,3);g.fill();g.fillStyle=W;}else g.fillStyle=p%7===0?col(e.accent):K;
        g.fillText(n,cx,cy+rh*.28);}g.textAlign='left';break;}
    case 'progress':{const p=clamp(+e.pct||0,0,100),bh=Math.max(6,Math.round(h*.36)),by=h-bh-1;
      KIT.text(g,e.label||'',0,0,w*.72,by-2,{max:Math.round(14*sc),min:7,weight:700,fam:'sans',valign:'bottom',maxLines:2});
      KIT.font(g,Math.max(8,Math.round(Math.min(14*sc,(by-2)))),800,'round');g.fillStyle=K;g.textAlign='right';g.fillText(p+'%',w-1,by-3);g.textAlign='left';
      g.strokeStyle=K;g.lineWidth=1.5;g.beginPath();g.roundRect(1,by,w-2,bh,bh/2);g.stroke();g.fillStyle=col(e.color);const fw=Math.max(0,(w-6)*p/100);if(fw>1){g.beginPath();g.roundRect(3,by+2,fw,bh-4,(bh-4)/2);g.fill();}break;}
    case 'battery':{const p=clamp(+e.pct||0,0,100),lab=e.label?Math.round(h*.3):0,bh=h-lab-2,bw=w-Math.max(4,w*.07);
      g.strokeStyle=K;g.lineWidth=2;g.beginPath();g.roundRect(1,1,bw-2,bh-2,Math.min(6,bh*.2));g.stroke();g.fillStyle=K;g.fillRect(bw,bh*.32,w-bw-1,bh*.36);
      g.fillStyle=p<=20?KIT.R():K;const fw=(bw-8)*p/100;if(fw>0)g.fillRect(4,4,fw,bh-8);
      KIT.font(g,Math.round(bh*.5),800,'round');g.textAlign='center';const tx=(bw)/2;g.lineWidth=3;g.strokeStyle=W;g.strokeText(p+'%',tx,bh*.68);g.fillStyle=K;g.fillText(p+'%',tx,bh*.68);g.textAlign='left';
      if(lab)KIT.text(g,e.label,0,bh+1,w,lab,{max:Math.round(12*sc),min:7,weight:700,fam:'sans',align:'center',valign:'middle',maxLines:1});break;}
    case 'check':{const th=Math.round(Math.min(h*.24,18*sc));KIT.text(g,e.title||'',0,0,w,th,{max:th,min:8,weight:800,fam:'round',valign:'middle',maxLines:1});
      g.fillStyle=KIT.R();g.fillRect(0,th+1,Math.min(w,24),2);
      const items=(e.items||'').split('\n').filter(s=>s.trim()).slice(0,8),n=Math.max(1,items.length),lh=Math.min((h-th-5)/n,20*sc),fs=Math.max(7,Math.round(lh*.62));
      items.forEach((s,i)=>{const done=/^x\s+/i.test(s),t=s.replace(/^x\s+/i,''),cy=th+5+i*lh,bx=Math.round(fs*.9);
        g.strokeStyle=K;g.lineWidth=1.2;g.strokeRect(1.5,Math.round(cy+(lh-bx)/2)+.5,bx,bx);
        if(done){g.strokeStyle=KIT.R();g.lineWidth=2;g.beginPath();g.moveTo(3,cy+lh/2);g.lineTo(1.5+bx*.45,cy+(lh+bx)/2-2);g.lineTo(bx+3,cy+(lh-bx)/2-1);g.stroke();}
        KIT.font(g,fs,done?500:600,'sans');g.fillStyle=K;let tt=t;while(tt.length>1&&g.measureText(tt).width>w-bx-6)tt=tt.slice(0,-2)+'…';g.fillText(tt,bx+6,cy+lh/2+fs*.36);
        if(done){g.fillRect(bx+6,Math.round(cy+lh/2),Math.min(w-bx-6,g.measureText(tt).width),1);}});break;}
    case 'box':{g.strokeStyle=K;g.lineWidth=e.line||1;if(e.dash)g.setLineDash([4,3]);const lw=e.line||1,r=Math.min(e.radius||0,w/2,h/2);
      if(h<=4||w<=4){g.fillStyle=K;if(e.dash){for(let i=0;i<Math.max(w,h);i+=7)h<=4?g.fillRect(i,0,4,Math.min(h,lw)):g.fillRect(0,i,Math.min(w,lw),4);}else g.fillRect(0,0,h<=4?w:Math.min(w,lw),h<=4?Math.min(h,lw):h);break;}
      g.beginPath();g.roundRect(lw/2,lw/2,w-lw,h-lw,r);if(e.fill!=='none'){g.fillStyle=col(e.fill);g.fill();}g.stroke();break;}
    case 'image':{const src=getImg(e.src);
      if(!src){g.strokeStyle=K;g.setLineDash([3,3]);g.strokeRect(.5,.5,w-1,h-1);g.setLineDash([]);KIT.text(g,'Chạm để chọn ảnh',4,0,w-8,h,{max:12,min:7,weight:600,fam:'sans',align:'center',valign:'middle'});break;}
      const s0=Math.max(w/src.naturalWidth,h/src.naturalHeight)*(+e.zoom||1),dw=src.naturalWidth*s0,dh=src.naturalHeight*s0;
      g.imageSmoothingQuality='high';g.drawImage(src,(w-dw)/2*(1+(+e.ox||0)),(h-dh)/2*(1+(+e.oy||0)),dw,dh);im=dither(g,w,h,e);break;}
    case 'chara':case 'sticker':{const D=KIT.design(w,h,(dc,DW,DH)=>{
        if(e.type==='chara'){const s=Math.min(DH*.94/200,DW/150);KIT.chara(dc,e.kind,{x:DW/2,y:DH*.985,s,mood:e.mood,pose:e.pose,flip:e.flip});return;}
        const S=KIT.S,m=Math.min(DW,DH),cx=DW/2,cy=DH/2,fc=col(e.color);dc.strokeStyle=fc;
        switch(e.shape){case 'heart':S.heart(dc,cx,cy-m*.08,m*.3,fc);break;case 'star':S.star(dc,cx,cy+m*.04,m*.46,fc);break;case 'sparkle':S.sparkle(dc,cx,cy,m*.47,fc);break;
          case 'flower':S.flower(dc,cx,cy,m*.28,e.color==='r'?KIT.R():K);break;case 'leaf':S.leaf(dc,cx-m*.4,cy+m*.1,m*.68,-.5);break;case 'cloud':S.cloud(dc,cx,cy+m*.08,m*.36);break;
          case 'sun':S.sun(dc,cx,cy,m*.22);break;case 'moon':S.moon(dc,cx,cy,m*.4);break;case 'drop':S.drop(dc,cx,cy,m*.42,e.color==='r'?fc:W);break;case 'cup':S.cup(dc,cx-m*.06,cy+m*.3,m*.5);break;
          case 'book':S.book(dc,cx-m*.42,cy-m*.3,m*.84,m*.6);break;case 'note':dc.strokeStyle=K;S.note(dc,cx-m*.15,cy+m*.3,m*.55);break;case 'zzz':S.zzz(dc,cx-m*.35,cy+m*.35,m*.45);break;}});
      if(PX[e.shape]){const P=PX[e.shape],cols=P[0].length,rows=P.length,u=Math.max(1,Math.floor(Math.min(w/cols,h/rows))),ox=Math.floor((w-u*cols)/2),oy=Math.floor((h-u*rows)/2);
        g.fillStyle=col(e.color);P.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch==='#')g.fillRect(ox+i*u,oy+j*u,u,u);}));}
      else KIT.blit(g,D,0,0,w,h);break;}}
  compose(ctx,im||pure(g,w,h),x,y,!!e.inv);}

function draw(ctx,w,h){for(const e of doc.els){try{drawEl(ctx,e,w,h);}catch(err){console.warn('studio',e.type,err);}}
  if(doc.inv){const im=ctx.getImageData(0,0,w,h),a=im.data;for(let i=0;i<a.length;i+=4){if(a[i]===255&&a[i+1]===0)continue;const v=a[i]>127?0:255;a[i]=a[i+1]=a[i+2]=v;}ctx.putImageData(im,0,0);}
  if(typeof tab!=='undefined'&&tab==='studio')requestAnimationFrame(placeSel);}

/* ---------- Khung chọn trên xem trước (chỉ trên web) ---------- */
let selBox=null,dragging=null,panMode=false;
function ensureSel(){if(selBox)return;const dev=document.querySelector('.device');dev.style.position='relative';
  selBox=document.createElement('div');selBox.className='st-sel';selBox.innerHTML='<i class="st-h" title="Kéo để đổi cỡ"></i>';dev.appendChild(selBox);
  selBox.querySelector('.st-h').addEventListener('pointerdown',ev=>startDrag(ev,'size'));}
function placeSel(){ensureSel();const e=cur(),cv=$('cv');if(tab!=='studio'||!e){selBox.hidden=true;return;}
  const r=cv.getBoundingClientRect(),pr=cv.offsetParent?cv.offsetParent.getBoundingClientRect():r,ox=r.left-pr.left,oy=r.top-pr.top;
  selBox.hidden=false;Object.assign(selBox.style,{left:ox+e.x*r.width+'px',top:oy+e.y*r.height+'px',width:e.w*r.width+'px',height:e.h*r.height+'px'});
  selBox.classList.toggle('pan',panMode&&e.type==='image');}
function pt(ev){const r=$('cv').getBoundingClientRect();return [(ev.clientX-r.left)/r.width,(ev.clientY-r.top)/r.height];}
function hit(p){ // phần tử nhỏ nhất dưới ngón tay (khung viền rỗng chỉ bắt ở mép)
  let best=null;for(const e of doc.els){if(!(p[0]>=e.x&&p[0]<=e.x+e.w&&p[1]>=e.y&&p[1]<=e.y+e.h))continue;
    if(e.type==='box'&&e.fill==='none'&&e.w>.06&&e.h>.06){const m=.04;if(p[0]>e.x+m&&p[0]<e.x+e.w-m&&p[1]>e.y+m*2&&p[1]<e.y+e.h-m*2)continue;}
    if(!best||e.w*e.h<=best.w*best.h)best=e;}return best;}
function startDrag(ev,mode){if(tab!=='studio')return;const p=pt(ev);let e=cur();
  if(mode!=='size'){const h=hit(p);if(!h){sel=null;buildProps();placeSel();return;}if(!e||e.id!==h.id){sel=h.id;buildProps();buildLayers();}e=h;
    if(e.type==='image'&&!e.src&&ev.pointerType!=='mouse'){pickImage(e);return;}}
  ev.preventDefault();ev.stopPropagation();
  dragging={mode:mode==='size'?'size':(panMode&&e.type==='image'?'pan':'move'),p0:p,o:{x:e.x,y:e.y,w:e.w,h:e.h,ox:+e.ox||0,oy:+e.oy||0},before:JSON.stringify(doc),moved:false};
  window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',endDrag,{once:true});}
function snap(v,arr,t=.02){for(const a of arr)if(Math.abs(v-a)<t)return a;return v;}
function onMove(ev){if(!dragging)return;const e=cur();if(!e)return;const p=pt(ev),dx=p[0]-dragging.p0[0],dy=p[1]-dragging.p0[1],o=dragging.o;if(Math.abs(dx)+Math.abs(dy)>.004)dragging.moved=true;
  if(dragging.mode==='move'){let nx=o.x+dx,ny=o.y+dy;nx=snap(nx,[0,.5-o.w/2,1-o.w]);ny=snap(ny,[0,.5-o.h/2,1-o.h]);e.x=+nx.toFixed(4);e.y=+ny.toFixed(4);}
  else if(dragging.mode==='size'){e.w=+clamp(o.w+dx,.03,1.2).toFixed(4);e.h=+clamp(o.h+dy,.03,1.2).toFixed(4);e.w=snap(e.x+e.w,[1,.5])-e.x;e.h=snap(e.y+e.h,[1,.5])-e.y;}
  else{e.ox=+clamp(o.ox-dx*4/Math.max(1,+e.zoom||1),-1,1).toFixed(3);e.oy=+clamp(o.oy-dy*4/Math.max(1,+e.zoom||1),-1,1).toFixed(3);}
  refresh();}
function endDrag(){window.removeEventListener('pointermove',onMove);if(dragging&&dragging.moved){undoS.push(dragging.before);redoS.length=0;persist();buildProps();updTools();}dragging=null;}

/* ---------- Ảnh: thu nhỏ trước khi lưu để không đầy bộ nhớ ---------- */
let imgTarget=null;
function pickImage(e){imgTarget=e?e.id:null;$('stFile').click();}
async function loadFile(f){const url=URL.createObjectURL(f);const im=new Image();await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;im.src=url;});
  const max=640,s=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);
  const g=c.getContext('2d');g.fillStyle=W;g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(url);return c.toDataURL('image/jpeg',.85);}

/* ---------- Bảng điều khiển ---------- */
const F={ // [khoá, nhãn, kiểu, tuỳ chọn]
  text:[['text','Nội dung','textarea'],['size','Cỡ chữ tối đa','range',[8,60,1]],['weight','Độ đậm','select',{400:'Thường',600:'Vừa',800:'Đậm'}],['fam','Phông chữ','select',FAMS],['align','Căn chữ','select',{left:'Trái',center:'Giữa',right:'Phải'}],['valign','Căn dọc','select',{top:'Trên',middle:'Giữa',bottom:'Dưới'}],['color','Màu','select',{k:'Đen',r:'Đỏ'}],['inv','Đảo màu khối này','check']],
  image:[['_img','Ảnh','imgbtn'],['zoom','Phóng to','range',[1,4,.05]],['ox','Dịch ngang','range',[-1,1,.02]],['oy','Dịch dọc','range',[-1,1,.02]],['bright','Độ sáng','range',[-60,60,1]],['contrast','Tương phản','range',[-50,100,1]],['dither','Kiểu chấm e-ink','select',{fs:'Mịn (Floyd–Steinberg)',atk:'Sáng, rõ nét (Atkinson)',ord:'Lưới đều (Bayer)',thr:'Chỉ đen trắng (ngưỡng)'}],['inv','Đảo màu ảnh','check']],
  chara:[['kind','Nhân vật','select',KIT.KIND_NAMES],['mood','Cảm xúc','select',MOODS],['pose','Tư thế','select',POSES],['flip','Lật ngang','check']],
  sticker:[['shape','Hình','select',SHAPES],['color','Màu','select',{r:'Đỏ',k:'Đen'}]],
  clock:[['fmt','Kiểu giờ','select',{hm:'24 giờ (14:05)',hm12:'12 giờ (2:05 CH)'}],['fam','Phông chữ','select',FAMS],['weight','Độ đậm','select',{600:'Vừa',800:'Đậm'}],['align','Căn','select',{left:'Trái',center:'Giữa',right:'Phải'}],['color','Màu','select',{k:'Đen',r:'Đỏ'}],['inv','Đảo màu khối này','check']],
  date:[['fmt','Cách ghi','select',{full:'Thứ Bảy, 28/11/2026',short:'T7 · 28/11',dm:'28 tháng 11'}],['lunar','Thêm ngày âm lịch','check'],['fam','Phông chữ','select',FAMS],['align','Căn','select',{left:'Trái',center:'Giữa',right:'Phải'}],['color','Màu','select',{k:'Đen',r:'Đỏ'}],['inv','Đảo màu khối này','check']],
  cal:[['accent','Màu ngày hôm nay','select',{r:'Đỏ',k:'Đen'}]],
  progress:[['label','Tên','text'],['pct','Phần trăm','range',[0,100,1]],['color','Màu thanh','select',{r:'Đỏ',k:'Đen'}]],
  battery:[['pct','Mức pin','range',[0,100,1]],['label','Lời nhắn (để trống nếu không cần)','text']],
  check:[['title','Tiêu đề','text'],['items','Mỗi dòng một việc · đầu dòng “x ” là đã xong','textarea']],
  box:[['line','Độ dày nét','range',[1,4,1]],['radius','Bo góc','range',[0,24,1]],['dash','Nét đứt','check'],['fill','Tô nền','select',{none:'Không',k:'Đen',r:'Đỏ'}]]};

function panelHTML(){return `
  <div class="st-row"><label><span>Bố cục nhanh</span><select id="stLayout">${Object.entries(LAYOUT_NAMES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><button id="stApply">Áp dụng</button></div>
  <div class="f-label">Thêm vào màn</div>
  <div class="st-add">${Object.entries(TYPES).map(([k,v])=>`<button data-add="${k}">+ ${v}</button>`).join('')}</div>
  <input type="file" id="stFile" accept="image/*" hidden>
  <div class="st-tools" role="toolbar" aria-label="Công cụ">
    <button id="stUndo" title="Hoàn tác">↶ Hoàn tác</button><button id="stRedo" title="Làm lại">↷ Làm lại</button>
    <button id="stDup">Nhân bản</button><button id="stDel">Xoá</button><button id="stUp" title="Đưa lên trên">Lên trên</button><button id="stDown" title="Đưa xuống dưới">Xuống dưới</button>
  </div>
  <div class="st-tools" role="toolbar" aria-label="Căn chỉnh"><span class="f-label" style="margin:0 4px 0 0">Căn</span>
    <button data-al="l" title="Sát trái">⇤</button><button data-al="c" title="Giữa ngang">↔</button><button data-al="r" title="Sát phải">⇥</button>
    <button data-al="t" title="Sát trên">⤒</button><button data-al="m" title="Giữa dọc">↕</button><button data-al="b" title="Sát dưới">⤓</button>
    <label class="check" style="margin-left:auto"><input type="checkbox" id="stInvAll"> Đảo màu cả màn</label></div>
  <div class="f-label">Các lớp <span style="font-weight:400;text-transform:none;letter-spacing:0">· chạm để chọn, hoặc chạm thẳng lên khung xem trước rồi kéo</span></div>
  <div class="st-layers" id="stLayers"></div>
  <div id="stProps" class="st-props"></div>
  <div class="st-save">
    <div class="f-label">Lưu thiết kế</div>
    <div class="st-row"><label><span>Tên thiết kế</span><input id="stName" type="text" maxlength="40" placeholder="Ví dụ: Góc làm việc"></label></div>
    <div class="row-btns"><button id="stSave" class="primary">Lưu</button><button id="stSaveNew">Lưu thành bản mới</button><button id="stNew">Thiết kế mới</button></div>
    <p class="st-note">Giờ, ngày và lịch là lúc gửi lên màn. Muốn tự làm mới, bật “Tự cập nhật” bên dưới khung xem trước.</p>
  </div>`;}

let built=false;
function build(){if(built)return;built=true;const p=$('stPanel');p.innerHTML=panelHTML();
  for(const b of p.querySelectorAll('[data-add]'))b.onclick=()=>addEl(b.dataset.add);
  $('stApply').onclick=()=>{const lay=$('stLayout').value;if(doc.els.length>1&&!confirm('Áp dụng bố cục sẽ sắp xếp lại các phần tử (ảnh đã chọn vẫn giữ). Tiếp tục?'))return;mutate(()=>{doc.layout=lay;doc.els=layoutEls(lay,doc.els);});sel=doc.els[0]?.id;buildAll();};
  $('stFile').onchange=async ev=>{const f=ev.target.files[0];ev.target.value='';if(!f)return;try{const src=await loadFile(f);
      mutate(()=>{let e=doc.els.find(x=>x.id===imgTarget);if(!e){e=mkEl('image');doc.els.unshift(e);}e.src=src;e.zoom=1;e.ox=0;e.oy=0;sel=e.id;});buildAll();}catch(_){toast('Không mở được ảnh này.');}};
  $('stUndo').onclick=()=>{if(!undoS.length)return;redoS.push(JSON.stringify(doc));doc=JSON.parse(undoS.pop());if(!cur())sel=doc.els[0]?.id||null;buildAll();changed();};
  $('stRedo').onclick=()=>{if(!redoS.length)return;undoS.push(JSON.stringify(doc));doc=JSON.parse(redoS.pop());if(!cur())sel=doc.els[0]?.id||null;buildAll();changed();};
  $('stDup').onclick=()=>{const e=cur();if(!e)return;const n=Object.assign(JSON.parse(JSON.stringify(e)),{id:uid(),x:Math.min(.95,e.x+.04),y:Math.min(.95,e.y+.06)});mutate(()=>doc.els.push(n));sel=n.id;buildAll();};
  $('stDel').onclick=()=>{const e=cur();if(!e)return;mutate(()=>doc.els=doc.els.filter(x=>x!==e));sel=doc.els[doc.els.length-1]?.id||null;buildAll();};
  $('stUp').onclick=()=>moveZ(1);$('stDown').onclick=()=>moveZ(-1);
  for(const b of p.querySelectorAll('[data-al]'))b.onclick=()=>{const e=cur();if(!e)return;mutate(()=>{({l:()=>e.x=0,c:()=>e.x=+(.5-e.w/2).toFixed(4),r:()=>e.x=+(1-e.w).toFixed(4),t:()=>e.y=0,m:()=>e.y=+(.5-e.h/2).toFixed(4),b:()=>e.y=+(1-e.h).toFixed(4)})[b.dataset.al]();});};
  $('stInvAll').onchange=ev=>mutate(()=>doc.inv=ev.target.checked);
  $('stName').oninput=ev=>{doc.name=ev.target.value;persist();};
  $('stSave').onclick=()=>saveDesign(false);$('stSaveNew').onclick=()=>saveDesign(true);
  $('stNew').onclick=()=>{if(!confirm('Bắt đầu thiết kế mới? Thiết kế đang mở chưa lưu sẽ mất (có thể Hoàn tác).'))return;mutate(()=>{const n=newDoc($('stLayout').value);Object.assign(doc,n);});sel=doc.els[0]?.id;buildAll();};
  const cv=$('cv');cv.addEventListener('pointerdown',ev=>{if(tab==='studio')startDrag(ev,'move');});
  cv.addEventListener('dblclick',()=>{const e=cur();if(tab==='studio'&&e&&e.type==='image')pickImage(e);});
  document.addEventListener('keydown',ev=>{if(tab!=='studio'||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||''))return;const e=cur();
    if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='z'){ev.preventDefault();(ev.shiftKey?$('stRedo'):$('stUndo')).click();return;}
    if(!e)return;const st=ev.shiftKey?.05:.004,mv={ArrowLeft:[-st,0],ArrowRight:[st,0],ArrowUp:[0,-st],ArrowDown:[0,st]}[ev.key];
    if(mv){ev.preventDefault();mutate(()=>{e.x=+(e.x+mv[0]).toFixed(4);e.y=+(e.y+mv[1]).toFixed(4);},true);}
    else if(ev.key==='Delete'||ev.key==='Backspace'){ev.preventDefault();$('stDel').click();}});
  window.addEventListener('resize',()=>requestAnimationFrame(placeSel));}
function moveZ(d){const e=cur();if(!e)return;const i=doc.els.indexOf(e),j=clamp(i+d,0,doc.els.length-1);if(i===j)return;mutate(()=>{doc.els.splice(i,1);doc.els.splice(j,0,e);});buildLayers();}
function addEl(type){if(type==='image'){pickImage(null);return;}const e=mkEl(type);
  if(type==='text'){e.x=.06;e.y=.3;}mutate(()=>doc.els.push(e));sel=e.id;buildAll();}
function label(e){const t=TYPES[e.type];if(e.type==='text')return `${t}: ${(e.text||'').split('\n')[0].slice(0,18)}`;if(e.type==='chara')return `${KIT.KIND_NAMES[e.kind]||t} · ${MOODS[e.mood]||''}`;if(e.type==='sticker')return SHAPES[e.shape]||t;return t;}
function buildLayers(){const box=$('stLayers');if(!box)return;box.innerHTML='';[...doc.els].reverse().forEach(e=>{const b=document.createElement('button');b.className='st-layer'+(e.id===sel?' on':'');b.textContent=label(e);b.onclick=()=>{sel=e.id;buildLayers();buildProps();placeSel();};box.appendChild(b);});
  if(!doc.els.length)box.innerHTML='<p class="empty">Màn đang trống — thêm chữ, ảnh hoặc nhân vật.</p>';}
function buildProps(){const box=$('stProps');if(!box)return;const e=cur();box.innerHTML='';if(!e){box.innerHTML='<p class="empty">Chọn một lớp để chỉnh.</p>';return;}
  const h=document.createElement('div');h.className='f-label';h.textContent='Chỉnh: '+TYPES[e.type];box.appendChild(h);
  for(const [k,lab,typ,o] of F[e.type]||[]){const L=document.createElement(typ==='check'?'label':'label');
    if(typ==='check'){L.className='check';const i=document.createElement('input');i.type='checkbox';i.checked=!!e[k];i.onchange=()=>mutate(()=>e[k]=i.checked);L.append(i,' '+lab);box.appendChild(L);continue;}
    L.innerHTML=`<span>${lab}</span>`;let el;
    if(typ==='imgbtn'){el=document.createElement('div');el.className='row-btns';const b1=document.createElement('button');b1.textContent=e.src?'Đổi ảnh…':'Chọn ảnh…';b1.onclick=()=>pickImage(e);
      const b2=document.createElement('button');b2.textContent=panMode?'✓ Kéo để dịch ảnh trong khung':'Kéo để dịch ảnh trong khung';b2.onclick=()=>{panMode=!panMode;buildProps();placeSel();};el.append(b1,b2);L.appendChild(el);box.appendChild(L);continue;}
    if(typ==='textarea'){el=document.createElement('textarea');el.rows=3;el.value=e[k]??'';}
    else if(typ==='select'){el=document.createElement('select');el.innerHTML=Object.entries(o).map(([a,b])=>`<option value="${a}">${b}</option>`).join('');el.value=String(e[k]);}
    else if(typ==='range'){el=document.createElement('input');el.type='range';[el.min,el.max,el.step]=o;el.value=e[k];const out=document.createElement('output');out.textContent=e[k];L.querySelector('span').append(' · ',out);el.addEventListener('input',()=>out.textContent=el.value);}
    else{el=document.createElement('input');el.type='text';el.value=e[k]??'';}
    el.addEventListener('input',()=>{const v=typ==='range'?+el.value:(typ==='select'&&/^\d+$/.test(el.value)?+el.value:el.value);mutate(()=>e[k]=v,true);if(k==='text'||k==='kind'||k==='mood'||k==='shape'||k==='title')buildLayers();});
    L.appendChild(el);box.appendChild(L);}
  const pos=document.createElement('div');pos.className='st-pos';const W0=$('cv').width,H0=$('cv').height;
  pos.innerHTML=`<span class="f-label" style="margin:0">Vị trí & cỡ (điểm ảnh, màn ${W0}×${H0})</span>`;
  for(const [k,n,D] of [['x','X',W0],['y','Y',H0],['w','Rộng',W0],['h','Cao',H0]]){const L=document.createElement('label');L.innerHTML=`<span>${n}</span>`;const i=document.createElement('input');i.type='number';i.value=Math.round(e[k]*D);i.step=1;
    i.addEventListener('input',()=>{if(i.value==='')return;mutate(()=>e[k]=+(+i.value/D).toFixed(4),true);});L.appendChild(i);pos.appendChild(L);}
  box.appendChild(pos);}
function updTools(){if(!built)return;$('stUndo').disabled=!undoS.length;$('stRedo').disabled=!redoS.length;const has=!!cur();for(const id of ['stDup','stDel','stUp','stDown'])$(id).disabled=!has;
  for(const b of document.querySelectorAll('[data-al]'))b.disabled=!has;$('stInvAll').checked=!!doc.inv;}
function buildAll(){buildLayers();buildProps();updTools();if($('stName'))$('stName').value=doc.name||'';if($('stLayout')&&LAYOUT_NAMES[doc.layout])$('stLayout').value=doc.layout;placeSel();}

/* ---------- Thiết kế đã lưu ---------- */
function designs(){return LS.get('dt-designs',[]);}
function saveDesign(asNew){const list=designs();const name=(doc.name||'').trim()||`Thiết kế ${new Date().toLocaleDateString('vi-VN')}`;doc.name=name;
  if(typeof render==='function')render();const thumb=$('cv').toDataURL('image/png');
  let id=asNew||!doc.designId||!list.some(d=>d.id===doc.designId)?uid():doc.designId;if(asNew&&doc.designId)doc.name=name.replace(/( · bản sao)?$/,' · bản sao');
  doc.designId=id;const item={id,name:doc.name,doc:JSON.parse(JSON.stringify(doc)),thumb,at:Date.now(),size:$('optSize').value};
  const i=list.findIndex(d=>d.id===id);if(i>=0)list[i]=item;else list.unshift(item);
  if(!LS.set('dt-designs',list)){toast('Không lưu được: bộ nhớ trình duyệt đầy. Xoá bớt thiết kế cũ rồi thử lại.');return;}
  persist();buildAll();toast(asNew?'Đã lưu thành bản mới':'Đã lưu thiết kế');window.dispatchEvent(new Event('dt:designs'));}
function openDesign(id){const d=designs().find(x=>x.id===id);if(!d)return;undoS.push(JSON.stringify(doc));redoS.length=0;doc=JSON.parse(JSON.stringify(d.doc));doc.designId=d.id;sel=doc.els[0]?.id||null;
  if(d.size&&$('optSize').value!==d.size&&!(window.ble&&ble.panel)){/* giữ cỡ màn hiện tại; bố cục theo tỉ lệ nên vẫn vừa */}
  persist();window.DT_go&&DT_go('studio');open();buildAll();refresh();}
function renderMine(box){if(!box)return;const list=designs();box.innerHTML='';
  if(!list.length){box.innerHTML='<p class="empty">Chưa có thiết kế nào. Mở Studio, tạo rồi bấm “Lưu”.</p>';return;}
  for(const d of list){const c=document.createElement('div');c.className='card st-card';c.innerHTML=`<img alt=""><span class="nm"></span><span class="st-acts"><button data-a="open">Mở</button><button data-a="dup">Nhân bản</button><button data-a="del">Xoá</button></span>`;
    c.querySelector('img').src=d.thumb;c.querySelector('.nm').textContent=d.name;
    c.onclick=ev=>{const a=ev.target.dataset.a;if(a==='dup'){const L=designs(),n=Object.assign(JSON.parse(JSON.stringify(d)),{id:uid(),name:d.name+' · bản sao',at:Date.now()});n.doc.designId=n.id;n.doc.name=n.name;L.unshift(n);if(!LS.set('dt-designs',L))toast('Bộ nhớ đầy');renderMine(box);return;}
      if(a==='del'){if(!confirm(`Xoá thiết kế “${d.name}”? Không khôi phục được (trừ khi bạn có bản sao lưu).`))return;LS.set('dt-designs',designs().filter(x=>x.id!==d.id));renderMine(box);return;}
      openDesign(d.id);};box.appendChild(c);}}

function open(){build();if(typeof tab!=='undefined'&&tab!=='studio'&&typeof setTab==='function'){setTab('studio');if(typeof drawGallery==='function')drawGallery();}
  $('cv').style.touchAction='none';buildAll();refresh();}
function leave(){if(selBox)selBox.hidden=true;$('cv').style.touchAction='';}

window.Studio={draw,open,leave,renderMine,openDesign,get doc(){return doc;}};
})();
