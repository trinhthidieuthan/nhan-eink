/* Diệu Thân · Bảng nhỏ — bộ vẽ cho màn e-ink (đen · trắng · đỏ)
   - Vẽ tranh nét ở khung gấp đôi rồi thu về đúng độ phân giải thiết bị, chỉ giữ 3 màu thật của màn.
   - Bộ nhân vật riêng: mèo tròn, thỏ tai cụp, gấu nhỏ, bé ma, cô gái chibi — đổi biểu cảm & tư thế.
   Không dùng màu xám/chuyển màu: màn vật lý không hiển thị được. */
(function(){
'use strict';
const K='#000',W='#fff',RED='#ff0000';
const KIT={K,W};
KIT.useRed=()=>{const el=document.getElementById('optRed');return !el||el.checked;};
KIT.R=()=>KIT.useRed()?RED:K;

/* ---------- Khung vẽ gấp đôi + thu về e-ink ---------- */
KIT.design=(w,h,draw,scale=2)=>{const c=document.createElement('canvas');c.width=Math.round(w*scale);c.height=Math.round(h*scale);
  const x=c.getContext('2d');x.fillStyle=W;x.fillRect(0,0,c.width,c.height);x.lineCap='round';x.lineJoin='round';x.strokeStyle=K;x.fillStyle=K;x.lineWidth=2*scale;
  x.u=scale;draw(x,c.width,c.height);return c;};
/* Thu nhỏ + ngưỡng: đen / trắng / đỏ — nét sắc, không nhiễu chấm */
KIT.blit=(ctx,src,x,y,w,h)=>{
  const t=document.createElement('canvas');t.width=w;t.height=h;const g=t.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(src,0,0,w,h);
  const im=g.getImageData(0,0,w,h),a=im.data,red=KIT.useRed();
  for(let i=0;i<a.length;i+=4){const r=a[i],gg=a[i+1],b=a[i+2];
    if(red&&r>150&&gg<150&&b<150&&r-gg>60){a[i]=255;a[i+1]=a[i+2]=0;}
    else{const v=(r*.299+gg*.587+b*.114)<150?0:255;a[i]=a[i+1]=a[i+2]=v;}a[i+3]=255;}
  // chỉ ghi điểm không trắng để giữ nền đã vẽ
  const base=ctx.getImageData(x,y,w,h),bd=base.data;for(let i=0;i<a.length;i+=4){if(a[i]===255&&a[i+1]===255&&a[i+2]===255)continue;bd[i]=a[i];bd[i+1]=a[i+1];bd[i+2]=a[i+2];bd[i+3]=255;}
  ctx.putImageData(base,x,y);};
/* Vẽ tranh nét phủ một vùng (mặc định cả màn) */
KIT.art=(ctx,x,y,w,h,draw)=>KIT.blit(ctx,KIT.design(w,h,draw),x,y,w,h);
/* Phong cách pixel: vẽ ở độ phân giải thấp rồi phóng to từng điểm */
KIT.pixel=(ctx,x,y,w,h,px,draw)=>{const lw=Math.max(8,Math.round(w/px)),lh=Math.max(8,Math.round(h/px));
  const c=document.createElement('canvas');c.width=lw;c.height=lh;const g=c.getContext('2d');g.fillStyle=W;g.fillRect(0,0,lw,lh);g.lineCap='round';g.lineJoin='round';g.strokeStyle=K;g.lineWidth=1;g.u=lw/ (w/2);draw(g,lw,lh);
  const im=g.getImageData(0,0,lw,lh),a=im.data,red=KIT.useRed();
  for(let i=0;i<a.length;i+=4){const r=a[i],gg=a[i+1],b=a[i+2];if(red&&r>150&&gg<140&&b<140){a[i]=255;a[i+1]=a[i+2]=0;}else{const v=(r*.299+gg*.587+b*.114)<160?0:255;a[i]=a[i+1]=a[i+2]=v;}a[i+3]=255;}
  g.putImageData(im,0,0);ctx.imageSmoothingEnabled=false;
  const t=document.createElement('canvas');t.width=w;t.height=h;const tg=t.getContext('2d');tg.imageSmoothingEnabled=false;tg.drawImage(c,0,0,w,h);
  const d=tg.getImageData(0,0,w,h).data,base=ctx.getImageData(x,y,w,h),bd=base.data;for(let i=0;i<d.length;i+=4){if(d[i]===255&&d[i+1]===255)continue;bd[i]=d[i];bd[i+1]=d[i+1];bd[i+2]=d[i+2];bd[i+3]=255;}
  ctx.putImageData(base,x,y);ctx.imageSmoothingEnabled=true;};

/* ---------- Chữ: phông hỗ trợ tiếng Việt ---------- */
const FAM={round:'"Baloo 2","Be Vietnam Pro",system-ui,sans-serif',sans:'"Be Vietnam Pro",-apple-system,"Segoe UI",Roboto,Arial,sans-serif',serif:'Georgia,"Times New Roman","Noto Serif",serif'};
KIT.font=(ctx,size,weight=700,fam='round')=>{ctx.font=`${weight} ${size}px ${FAM[fam]||fam}`;};
KIT.wrap=(ctx,text,maxW)=>{const out=[];for(const para of String(text).split('\n')){const ws=para.split(/\s+/).filter(Boolean);if(!ws.length){out.push('');continue;}let line='';
  for(const w of ws){const t=line?line+' '+w:w;if(ctx.measureText(t).width<=maxW||!line)line=t;else{out.push(line);line=w;}}out.push(line);}return out;};
/* Chữ tự co cho vừa khung; trả về {lines,size,lh} */
KIT.fitText=(ctx,text,maxW,maxH,{max=22,min=9,weight=700,fam='round',lh=1.15,maxLines=6}={})=>{
  for(let s=max;s>=min;s--){KIT.font(ctx,s,weight,fam);const L=KIT.wrap(ctx,text,maxW);if(L.length<=maxLines&&L.length*s*lh<=maxH&&L.every(l=>ctx.measureText(l).width<=maxW))return {lines:L,size:s,lh:s*lh};}
  KIT.font(ctx,min,weight,fam);let L=KIT.wrap(ctx,text,maxW);const n=Math.max(1,Math.min(maxLines,Math.floor(maxH/(min*lh))));if(L.length>n){L=L.slice(0,n);L[n-1]=L[n-1].replace(/\s*\S*$/,'')+'…';}return {lines:L,size:min,lh:min*lh};};
KIT.text=(ctx,text,x,y,w,h,o={})=>{const f=KIT.fitText(ctx,text,w,h,o),al=o.align||'left',va=o.valign||'top';ctx.fillStyle=o.color||K;ctx.textAlign=al;ctx.textBaseline='alphabetic';
  const total=f.lines.length*f.lh,y0=va==='middle'?y+(h-total)/2:va==='bottom'?y+h-total:y,ax=al==='center'?x+w/2:al==='right'?x+w:x;
  f.lines.forEach((l,i)=>ctx.fillText(l,ax,Math.round(y0+(i+1)*f.lh-f.lh*0.22)));ctx.textAlign='left';return f;};
KIT.label=(ctx,t,x,y,{size=10,weight=800,color=K,align='left',track=1,fam='sans'}={})=>{KIT.font(ctx,size,weight,fam);ctx.fillStyle=color;const ch=[...t];
  const tw=ch.reduce((s,c)=>s+ctx.measureText(c).width,0)+track*(ch.length-1);let cx=align==='center'?x-tw/2:align==='right'?x-tw:x;ctx.textAlign='left';for(const c of ch){ctx.fillText(c,cx,y);cx+=ctx.measureText(c).width+track;}return tw;};

/* ---------- Hình cơ bản (khung thiết kế, đơn vị u = hệ số vẽ) ---------- */
const S={};KIT.S=S;
S.lw=(c,w)=>{c.lineWidth=w*(c.u||2);};
S.ell=(c,x,y,rx,ry,fill=W,stroke=true,rot=0)=>{c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke)c.stroke();};
S.circ=(c,x,y,r,fill=W,stroke=true)=>S.ell(c,x,y,r,r,fill,stroke);
S.line=(c,pts)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
S.poly=(c,pts,fill=W,stroke=true)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke)c.stroke();};
S.rrect=(c,x,y,w,h,r,fill=W,stroke=true)=>{c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke)c.stroke();};
S.heart=(c,x,y,s,fill=KIT.R(),stroke=false)=>{c.beginPath();c.moveTo(x,y+s*.9);c.bezierCurveTo(x-s*1.5,y-.1*s,x-s*.75,y-s*1.05,x,y-s*.35);c.bezierCurveTo(x+s*.75,y-s*1.05,x+s*1.5,y-.1*s,x,y+s*.9);if(fill){c.fillStyle=fill;c.fill();}if(stroke)c.stroke();};
S.star=(c,x,y,r,fill=K,pts=5,inner=.45)=>{c.beginPath();for(let i=0;i<pts*2;i++){const a=-Math.PI/2+i*Math.PI/pts,rr=i%2?r*inner:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fillStyle=fill;c.fill();};
S.sparkle=(c,x,y,r,fill=K)=>S.star(c,x,y,r,fill,4,.28);
S.cloud=(c,x,y,s,fill=W)=>{c.beginPath();c.moveTo(x-s*1.1,y+s*.35);c.arc(x-s*.55,y+s*.05,s*.45,Math.PI*.8,Math.PI*1.6);c.arc(x+s*.05,y-s*.2,s*.6,Math.PI*1.15,Math.PI*1.95);c.arc(x+s*.7,y+s*.1,s*.42,Math.PI*1.45,Math.PI*.4);c.closePath();c.fillStyle=fill;c.fill();c.stroke();};
S.sun=(c,x,y,r)=>{S.circ(c,x,y,r);for(let i=0;i<8;i++){const a=i*Math.PI/4;S.line(c,[[x+Math.cos(a)*r*1.45,y+Math.sin(a)*r*1.45],[x+Math.cos(a)*r*1.9,y+Math.sin(a)*r*1.9]]);}};
S.moon=(c,x,y,r,bg=W)=>{S.circ(c,x,y,r,K,false);S.circ(c,x+r*.45,y-r*.3,r*.85,bg,false);};
S.drop=(c,x,y,s,fill=W)=>{c.beginPath();c.moveTo(x,y-s);c.quadraticCurveTo(x+s*.9,y+s*.2,x,y+s*.7);c.quadraticCurveTo(x-s*.9,y+s*.2,x,y-s);c.fillStyle=fill;c.fill();c.stroke();};
S.leaf=(c,x,y,s,rot=0,fill=W)=>{c.save();c.translate(x,y);c.rotate(rot);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(s*.6,-s*.5,s*1.2,0);c.quadraticCurveTo(s*.6,s*.5,0,0);c.fillStyle=fill;c.fill();c.stroke();S.line(c,[[0,0],[s*1.1,0]]);c.restore();};
S.flower=(c,x,y,s,center=KIT.R())=>{for(let i=0;i<5;i++){const a=i*Math.PI*2/5;S.circ(c,x+Math.cos(a)*s*.7,y+Math.sin(a)*s*.7,s*.5);}S.circ(c,x,y,s*.38,center);};
S.cup=(c,x,y,s,steam=true,heart=true)=>{S.rrect(c,x-s*.6,y-s*.8,s*1.2,s*1.1,s*.25);c.beginPath();c.arc(x+s*.72,y-s*.3,s*.28,-Math.PI/2,Math.PI/2);c.stroke();if(heart)S.heart(c,x,y-s*.3,s*.22);
  if(steam)for(const dx of [-.25,.2]){S.line(c,[[x+dx*s,y-s*1],[x+dx*s+s*.12,y-s*1.25],[x+dx*s,y-s*1.5]]);}};
S.book=(c,x,y,w,h)=>{S.rrect(c,x,y,w,h,3);S.line(c,[[x+w/2,y],[x+w/2,y+h]]);for(let i=1;i<4;i++){S.line(c,[[x+w*.12,y+h*i/4],[x+w*.4,y+h*i/4]]);S.line(c,[[x+w*.6,y+h*i/4],[x+w*.88,y+h*i/4]]);}};
S.bubble=(c,x,y,w,h,tailX,tailY,fill=W)=>{c.beginPath();c.roundRect(x,y,w,h,Math.min(h/2,18*(c.u||2)/2));c.fillStyle=fill;c.fill();c.stroke();
  c.beginPath();const bx=Math.max(x+10,Math.min(x+w-10,tailX));const by=tailY>y+h?y+h:y;c.moveTo(bx-8,by);c.lineTo(tailX,tailY);c.lineTo(bx+8,by);c.fillStyle=fill;c.fill();c.stroke();S.lw(c,0);c.lineWidth=(c.u||2)*2;
  c.beginPath();c.moveTo(bx-6,by);c.lineTo(bx+6,by);c.strokeStyle=fill;c.lineWidth=(c.u||2)*3;c.stroke();c.strokeStyle=K;c.lineWidth=(c.u||2)*2;};
S.zzz=(c,x,y,s)=>{c.fillStyle=K;c.font=`800 ${s}px sans-serif`;c.fillText('z',x,y);c.font=`800 ${s*.75}px sans-serif`;c.fillText('z',x+s*.7,y-s*.6);c.font=`800 ${s*.55}px sans-serif`;c.fillText('z',x+s*1.25,y-s*1.05);};
S.note=(c,x,y,s)=>{S.ell(c,x,y,s*.45,s*.35,K,false,-.4);S.line(c,[[x+s*.4,y],[x+s*.4,y-s*1.3],[x+s*.95,y-s*1.05]]);};
S.battery=(c,x,y,w,h,pct,fillCol=K)=>{S.rrect(c,x,y,w,h,h*.18);S.rrect(c,x+w,y+h*.3,w*.06,h*.4,2,K,false);const n=5,gap=w*.03,bw=(w-gap*(n+1))/n,on=Math.round(pct/100*n);
  for(let i=0;i<n;i++)if(i<on)S.rrect(c,x+gap+i*(bw+gap),y+gap*1.6,bw,h-gap*3.2,2,pct<=20?KIT.R():fillCol,false);};
S.grass=(c,x1,x2,y)=>{for(let x=x1;x<x2;x+=14*(c.u||2)/2)S.line(c,[[x,y],[x+3,y-8*(c.u||2)/2],[x+6,y]]);};

/* ---------- Khuôn mặt dùng chung ---------- */
/* mood: vui · binhyen · buon · doi · gian · het · om · yeu · im · phien · nghi · tuyet · ngu · chualanh · nghi-ngoi · thuong */
function face(c,x,y,u,mood){
  const ex=u*11,ey=y,my=y+u*11,dot=(dx,r=u*3.3)=>{S.ell(c,x+dx,ey,r,r*1.15,K,false);S.circ(c,x+dx+r*.4,ey-r*.4,r*.32,W,false);};
  const arcUp=(dx)=>{c.beginPath();c.arc(x+dx,ey+u*2,u*3.6,Math.PI*1.12,Math.PI*1.88);c.stroke();};
  const arcDown=(dx)=>{c.beginPath();c.arc(x+dx,ey-u*1.5,u*3.6,Math.PI*.12,Math.PI*.88);c.stroke();};
  const smile=(r=u*5)=>{c.beginPath();c.arc(x,my-r*.9,r,.2*Math.PI,.8*Math.PI);c.stroke();};
  const blush=(sz=1)=>{if(KIT.useRed()){S.ell(c,x-ex-u*5,ey+u*6,u*4*sz,u*2.4*sz,KIT.R(),false);S.ell(c,x+ex+u*5,ey+u*6,u*4*sz,u*2.4*sz,KIT.R(),false);}
    else for(const s of [-1,1])for(let i=0;i<3;i++)S.line(c,[[x+s*(ex+u*3)+i*u*2.2-u*2,ey+u*7],[x+s*(ex+u*3)+i*u*2.2-u*1,ey+u*5]]);};
  S.lw(c,1.6*(u/1.6));
  switch(mood){
    case 'vui':arcUp(-ex);arcUp(ex);c.beginPath();c.moveTo(x-u*5,my-u*2);c.quadraticCurveTo(x,my+u*6,x+u*5,my-u*2);c.closePath();c.fillStyle=K;c.fill();blush();break;
    case 'tuyet':for(const s of [-1,1])S.sparkle(c,x+s*ex,ey,u*5);c.beginPath();c.moveTo(x-u*6,my-u*2);c.quadraticCurveTo(x,my+u*8,x+u*6,my-u*2);c.closePath();c.fillStyle=K;c.fill();S.ell(c,x,my+u*1.8,u*2.4,u*1.4,KIT.R(),false);blush();break;
    case 'binhyen':case 'nghi-ngoi':arcDown(-ex);arcDown(ex);smile(u*3.5);blush(.9);break;
    case 'thuong':dot(-ex);dot(ex);smile(u*3.2);blush(.9);break;
    case 'buon':dot(-ex,u*3);dot(ex,u*3);S.line(c,[[x-ex-u*4,ey-u*6],[x-ex+u*3,ey-u*4.5]]);S.line(c,[[x+ex+u*4,ey-u*6],[x+ex-u*3,ey-u*4.5]]);
      c.beginPath();c.arc(x,my+u*3,u*4,1.15*Math.PI,1.85*Math.PI);c.stroke();S.lw(c,1);S.drop(c,x-ex-u*1,ey+u*7,u*2.6);break;
    case 'doi':S.line(c,[[x-ex-u*4,ey],[x-ex+u*3,ey+u*1]]);S.line(c,[[x+ex+u*4,ey],[x+ex-u*3,ey+u*1]]);S.ell(c,x-ex-u*5,ey+u*7,u*5,u*3.2,KIT.R(),false);S.ell(c,x+ex+u*5,ey+u*7,u*5,u*3.2,KIT.R(),false);
      c.beginPath();c.moveTo(x-u*3,my);c.quadraticCurveTo(x,my-u*3,x+u*3,my);c.stroke();break;
    case 'gian':dot(-ex,u*2.8);dot(ex,u*2.8);S.lw(c,2.2*(u/1.6));S.line(c,[[x-ex-u*5,ey-u*7],[x-ex+u*3,ey-u*3.5]]);S.line(c,[[x+ex+u*5,ey-u*7],[x+ex-u*3,ey-u*3.5]]);S.lw(c,1.6*(u/1.6));
      S.rrect(c,x-u*5,my-u*2,u*10,u*4,u*1.5,W);S.line(c,[[x-u*1.7,my-u*2],[x-u*1.7,my+u*2]]);S.line(c,[[x+u*1.7,my-u*2],[x+u*1.7,my+u*2]]);break;
    case 'het':S.line(c,[[x-ex-u*4,ey+u*1],[x-ex+u*4,ey+u*1]]);S.line(c,[[x+ex-u*4,ey+u*1],[x+ex+u*4,ey+u*1]]);
      S.line(c,[[x-u*5,my],[x-u*2.5,my-u*1.6],[x,my],[x+u*2.5,my-u*1.6],[x+u*5,my]]);break;
    case 'om':case 'yeu':for(const s of [-1,1])S.heart(c,x+s*ex,ey,u*4);smile(u*4);blush();break;
    case 'im':dot(-ex,u*2.6);dot(ex,u*2.6);S.line(c,[[x-u*6,my-u*.5],[x+u*6,my-u*.5]]);for(let i=-2;i<=2;i++)S.line(c,[[x+i*u*2.4,my-u*2.2],[x+i*u*2.4,my+u*1.2]]);break;
    case 'phien':dot(-ex,u*2.8);dot(ex,u*2.8);S.line(c,[[x-ex-u*4,ey-u*5],[x-ex+u*3,ey-u*3.5]]);S.line(c,[[x+ex+u*4,ey-u*5],[x+ex-u*3,ey-u*3.5]]);S.line(c,[[x-u*4,my],[x+u*4,my]]);break;
    case 'nghi':S.ell(c,x-ex+u*1.5,ey-u*1.5,u*2.8,u*3.1,K,false);S.ell(c,x+ex+u*1.5,ey-u*1.5,u*2.8,u*3.1,K,false);S.line(c,[[x-u*2,my],[x+u*3,my-u*1]]);blush(.8);break;
    case 'ngu':arcDown(-ex);arcDown(ex);S.ell(c,x,my,u*2.2,u*2.8,W);blush(.8);break;
    case 'chualanh':arcDown(-ex);dot(ex);smile(u*3);S.lw(c,1);c.save();c.translate(x+ex+u*7,ey-u*6);c.rotate(.5);S.rrect(c,-u*5,-u*2,u*10,u*4,u*1.5,W);S.line(c,[[0,-u*2],[0,u*2]]);c.restore();blush(.8);break;
    default:dot(-ex);dot(ex);smile(u*3.5);blush();
  }
  S.lw(c,2);
}
KIT.face=face;

/* ---------- Bộ nhân vật ----------
   chara(c,kind,{x,y,s,mood,pose,flip}) — (x,y) là điểm đáy giữa; s≈1 cao ~180 đơn vị thiết kế.
   pose: dung · ngoi · gio (2 tay lên) · vay · om (dang tay) · cam (cầm trước ngực) · cam-cam (tay ở cằm) · nam
   Trả về toạ độ tay cầm {hx,hy} để đặt đạo cụ. */
function arms(c,cx,sy,pose,len,side=1,body=0){
  const L=[cx-body,sy],Rr=[cx+body,sy];const hand=(p)=>S.circ(c,p[0],p[1],len*.16);let hold=null;
  const draw=(a,b)=>{S.lw(c,2.2);S.line(c,[a,b]);hand(b);};
  switch(pose){
    case 'gio':draw(L,[cx-body-len*.55,sy-len*.95]);draw(Rr,[cx+body+len*.55,sy-len*.95]);break;
    case 'vay':draw(L,[cx-body-len*.45,sy+len*.55]);draw(Rr,[cx+body+len*.6,sy-len*.85]);break;
    case 'om':draw(L,[cx-body-len*1.05,sy-len*.15]);draw(Rr,[cx+body+len*1.05,sy-len*.15]);break;
    case 'cam':hold=[cx,sy+len*.35];draw(L,[cx-len*.25,hold[1]]);draw(Rr,[cx+len*.25,hold[1]]);break;
    case 'cam-cam':draw(L,[cx-body-len*.35,sy+len*.6]);draw(Rr,[cx+len*.05,sy-len*.42]);break;
    default:draw(L,[cx-body-len*.3,sy+len*.7]);draw(Rr,[cx+body+len*.3,sy+len*.7]);
  }
  return hold;
}
const KINDS={
  meo(c,x,y,s,mood,pose){ // mèo tròn
    const bodyR=48*s,hr=44*s,hy=y-bodyR*1.6-hr*.55;
    S.lw(c,2.2);c.beginPath();c.moveTo(x+bodyR*.9,y-bodyR*.4);c.quadraticCurveTo(x+bodyR*1.9,y-bodyR*.6,x+bodyR*1.5,y-bodyR*1.5);c.stroke(); // đuôi
    S.ell(c,x,y-bodyR*.92,bodyR*1.02,bodyR*.95);
    S.ell(c,x-bodyR*.45,y-bodyR*.08,bodyR*.28,bodyR*.15);S.ell(c,x+bodyR*.45,y-bodyR*.08,bodyR*.28,bodyR*.15);
    for(const sd of [-1,1])S.poly(c,[[x+sd*hr*.85,hy-hr*.25],[x+sd*hr*.75,hy-hr*1.15],[x+sd*hr*.2,hy-hr*.8]]);
    for(const sd of [-1,1])S.poly(c,[[x+sd*hr*.72,hy-hr*.42],[x+sd*hr*.68,hy-hr*.92],[x+sd*hr*.36,hy-hr*.72]],KIT.useRed()?KIT.R():W,false);
    S.ell(c,x,hy,hr,hr*.88);
    S.lw(c,1.4);for(const sd of [-1,1])for(const dy of [-3,3])S.line(c,[[x+sd*hr*.62,hy+hr*.22+dy*s],[x+sd*hr*1.12,hy+hr*.16+dy*s*2.2]]);
    face(c,x,hy+hr*.05,1.6*s*1.25,mood);
    return {hold:arms(c,x,y-bodyR*1.45,pose,bodyR*.95,1,bodyR*.55),head:[x,hy,hr]};
  },
  tho(c,x,y,s,mood,pose){ // thỏ tai cụp
    const hr=42*s,by=y-34*s,hy=by-36*s-hr*.6;
    S.ell(c,x,by,40*s,36*s);S.ell(c,x-22*s,y-6*s,14*s,8*s);S.ell(c,x+22*s,y-6*s,14*s,8*s);S.circ(c,x+38*s,by+8*s,9*s);
    for(const sd of [-1,1]){c.save();c.translate(x+sd*hr*.82,hy-hr*.35);c.rotate(sd*.22);S.ell(c,0,hr*.62,hr*.27,hr*.95);S.ell(c,0,hr*.72,hr*.12,hr*.68,KIT.useRed()?KIT.R():W,!KIT.useRed());c.restore();}
    S.ell(c,x,hy,hr,hr*.9);face(c,x,hy+hr*.15,1.6*s*1.2,mood);
    S.ell(c,x,hy+hr*.38,hr*.06,hr*.05,K,false);
    return {hold:arms(c,x,by-24*s,pose,40*s,1,26*s),head:[x,hy,hr]};
  },
  gau(c,x,y,s,mood,pose){ // gấu nhỏ
    const hr=44*s,by=y-40*s,hy=by-38*s-hr*.62;
    S.ell(c,x,by,46*s,42*s);S.ell(c,x,by+6*s,24*s,20*s);S.ell(c,x-24*s,y-6*s,15*s,9*s);S.ell(c,x+24*s,y-6*s,15*s,9*s);
    for(const sd of [-1,1]){S.circ(c,x+sd*hr*.72,hy-hr*.72,hr*.32);S.circ(c,x+sd*hr*.72,hy-hr*.72,hr*.15,KIT.useRed()?KIT.R():W,!KIT.useRed());}
    S.ell(c,x,hy,hr,hr*.92);S.ell(c,x,hy+hr*.36,hr*.34,hr*.24);S.ell(c,x,hy+hr*.28,hr*.1,hr*.07,K,false);
    face(c,x,hy-hr*.02,1.6*s*1.15,mood);
    return {hold:arms(c,x,by-26*s,pose,42*s,1,30*s),head:[x,hy,hr]};
  },
  ma(c,x,y,s,mood,pose){ // bé ma
    const w=50*s,top=y-150*s,bot=y-14*s;c.beginPath();c.moveTo(x-w,bot);c.lineTo(x-w,top+w);c.arc(x,top+w,w,Math.PI,0);c.lineTo(x+w,bot);
    const n=4;for(let i=n;i>0;i--){const x1=x+w-(i-.5)*(2*w/n),x0=x+w-i*(2*w/n);c.quadraticCurveTo(x1,bot+14*s*(i%2?1:-.2),x0,bot);}
    c.closePath();c.fillStyle=W;c.fill();c.stroke();
    let hold=null;S.lw(c,2.2);
    if(pose==='gio'){S.ell(c,x-w-6*s,top+w*1.2,9*s,16*s,W,true,-.5);S.ell(c,x+w+6*s,top+w*1.2,9*s,16*s,W,true,.5);}
    else if(pose==='om'){S.ell(c,x-w-14*s,top+w*1.6,16*s,8*s);S.ell(c,x+w+14*s,top+w*1.6,16*s,8*s);}
    else if(pose==='cam'){hold=[x,top+w*2.15];S.ell(c,x-14*s,hold[1],10*s,8*s);S.ell(c,x+14*s,hold[1],10*s,8*s);}
    else{S.ell(c,x-w-4*s,top+w*1.7,8*s,13*s,W,true,.5);S.ell(c,x+w+4*s,top+w*1.7,8*s,13*s,W,true,-.5);}
    face(c,x,top+w*1.05,1.6*s*1.3,mood);
    return {hold,head:[x,top+w,w]};
  },
  be(c,x,y,s,mood,pose){ // cô gái chibi
    const hr=46*s,by=y,top=y-70*s,hy=top-hr*.75;
    c.beginPath();c.moveTo(x-22*s,top);c.quadraticCurveTo(x-48*s,top+20*s,x-46*s,by);c.lineTo(x+46*s,by);c.quadraticCurveTo(x+48*s,top+20*s,x+22*s,top);c.closePath();c.fillStyle=W;c.fill();c.stroke();
    S.heart(c,x,top+30*s,8*s);
    S.ell(c,x,hy+hr*.1,hr*1.12,hr*1.12,K,false);
    c.fillStyle=K;for(const sd of [-1,1]){c.beginPath();c.moveTo(x+sd*hr*1.05,hy);c.quadraticCurveTo(x+sd*hr*1.25,hy+hr*1.3,x+sd*hr*.75,hy+hr*1.45);c.lineTo(x+sd*hr*.55,hy+hr*.5);c.fill();}
    S.ell(c,x,hy+hr*.2,hr*.92,hr*.84);
    c.fillStyle=K;c.beginPath();c.moveTo(x-hr*.95,hy+hr*.15);c.bezierCurveTo(x-hr*.95,hy-hr*.95,x+hr*.95,hy-hr*.95,x+hr*.95,hy+hr*.15);
    for(let i=3;i>=0;i--){const xx=x-hr*.95+(i/4)*hr*1.9,xp=x-hr*.95+((i+1)/4)*hr*1.9;c.quadraticCurveTo((xx+xp)/2,hy-hr*.12,xx,hy+(i%2?hr*.12:0));}c.fill();
    face(c,x,hy+hr*.35,1.6*s*1.15,mood);
    return {hold:arms(c,x,top+10*s,pose,40*s,1,26*s),head:[x,hy,hr]};
  },
};
KIT.KINDS=Object.keys(KINDS);
KIT.KIND_NAMES={meo:'Mèo tròn',tho:'Thỏ tai cụp',gau:'Gấu nhỏ',ma:'Bé ma',be:'Cô gái chibi'};
KIT.chara=(c,kind,{x,y,s=1,mood='thuong',pose='dung',flip=false}={})=>{c.save();if(flip){c.translate(2*x,0);c.scale(-1,1);}
  const u=c.u||2;S.lw(c,2.2);const r=(KINDS[kind]||KINDS.meo)(c,x,y,s*u/2,mood,pose);c.restore();
  if(r&&r.hold&&flip)r.hold[0]=2*x-r.hold[0];return r;};
/* Nhân vật nằm (hết pin / nghỉ ngơi): vẽ xoay ngang */
KIT.charaLying=(c,kind,{x,y,s=1,mood='het'}={})=>{const hg=200*s*(c.u||2)/2; // (x,y): tâm đáy chỗ nằm
  c.save();c.translate(x+hg*.5,y-hg*.3);c.rotate(-Math.PI/2);const r=KIT.chara(c,kind,{x:0,y:0,s,mood,pose:'dung'});c.restore();return {hold:null,head:[x-hg*.3,y-hg*.3,hg*.2]};};

window.KIT=KIT;
})();
