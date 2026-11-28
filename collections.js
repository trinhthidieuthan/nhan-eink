/* Diệu Thân · Bảng nhỏ — thư viện mẫu e-ink (đợt 1)
   Little Mood · Emotional Battery · Pixel World · Focus & Work · Little Goals
   Mỗi mẫu: {id, coll, name, fields, draw(ctx,w,h,P)} — vẽ đúng độ phân giải màn (250×122 hoặc 296×128).
   Mẫu “theo giờ” (timely) đổi nội dung theo thời điểm gửi; muốn tự đổi thì dùng Tự cập nhật. */
(function(){
'use strict';
const {S}=KIT,K='#000',W='#fff',R=()=>KIT.R();
const T=[];window.NT_TEMPLATES=T;
window.NT_COLLS={mood:'Little Mood',battery:'Pin cảm xúc',pixel:'Pixel World',focus:'Focus & Work',goals:'Little Goals'};
window.NT_COLL_DESC={mood:'Tâm trạng hôm nay',battery:'Năng lượng 0–100%',pixel:'Thế giới pixel',focus:'Công việc & tập trung',goals:'Mục tiêu nhỏ mỗi ngày'};
const KIND_OPTS=KIT.KINDS.map(k=>[k,KIT.KIND_NAMES[k]]);
const fitS=(c,H,frac)=>H*frac/(100*(c.u||2)); // tỉ lệ để nhân vật cao ≈ frac×H
const pad=n=>String(n).padStart(2,'0');
const WD=['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'],WS=['CN','T2','T3','T4','T5','T6','T7'];
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d;};
const daysTo=v=>{const p=String(v||'').split('-').map(Number);if(p.length!==3||!p[0])return null;return Math.round((new Date(p[0],p[1]-1,p[2])-today())/864e5);};
const num=v=>{const n=Number(String(v??'').replace(/[^\d.-]/g,''));return isFinite(n)?n:0;};
const money=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const lines=v=>String(v||'').split('\n').map(s=>s.trim()).filter(Boolean);
const hhmm=d=>`${pad(d.getHours())}:${pad(d.getMinutes())}`;
const add=t=>T.push(t);

/* ======================= A. LITTLE MOOD — 15 mẫu, mỗi mẫu một nhân vật, tư thế & đạo cụ riêng ======================= */
const MOODS=[
  {id:'vui',name:'Hôm nay thật vui',kind:'meo',mood:'vui',pose:'gio',lay:'R',sub:'Niềm vui nhỏ cũng đáng ăn mừng'},
  {id:'binhyen',name:'Hôm nay bình yên',kind:'tho',mood:'binhyen',pose:'cam',lay:'L',sub:'Một tách trà, một hơi thở chậm'},
  {id:'buon',name:'Hơi buồn một chút',kind:'gau',mood:'buon',pose:'dung',lay:'R',sub:'Rồi trời sẽ lại nắng thôi'},
  {id:'doi',name:'Đang dỗi',kind:'ma',mood:'doi',pose:'dung',lay:'L',sub:'Hừm! Dỗ đi rồi hết'},
  {id:'gian',name:'Đang tức giận',kind:'meo',mood:'gian',pose:'dung',lay:'B',sub:'Cho mình 5 phút bình tĩnh'},
  {id:'het',name:'Hết năng lượng',kind:'tho',mood:'het',pose:'nam',lay:'T',sub:'Đang sạc… xin đừng rút dây'},
  {id:'om',name:'Cần một cái ôm',kind:'gau',mood:'om',pose:'om',lay:'R',sub:'Ôm một cái là khỏe liền'},
  {id:'yeu',name:'Muốn được yêu thương',kind:'be',mood:'yeu',pose:'cam',lay:'L',sub:'Thương mình nhiều hơn nhé'},
  {id:'im',name:'Không muốn nói chuyện',kind:'ma',mood:'im',pose:'dung',lay:'R',sub:'Đang sạc pin hướng nội'},
  {id:'phien',name:'Đừng làm phiền tui',kind:'meo',mood:'phien',pose:'cam',lay:'S',sub:''},
  {id:'nghi',name:'Đang suy nghĩ',kind:'be',mood:'nghi',pose:'cam-cam',lay:'R',sub:'Để mình nghĩ thêm chút nha'},
  {id:'tuyet',name:'Hôm nay thật tuyệt',kind:'gau',mood:'tuyet',pose:'gio',lay:'L',sub:'Một ngày đáng nhớ!'},
  {id:'ngu',name:'Muốn đi ngủ',kind:'tho',mood:'ngu',pose:'dung',lay:'R',sub:'Chăn ấm đang gọi tên mình'},
  {id:'chualanh',name:'Đang chữa lành',kind:'be',mood:'chualanh',pose:'cam',lay:'L',sub:'Từ từ thôi, không sao đâu'},
  {id:'nghingoi',name:'Mặc kệ thế giới, hôm nay nghỉ ngơi',kind:'meo',mood:'nghi-ngoi',pose:'nam',lay:'T',sub:'Thế giới chờ mình chút nhé'},
];
function moodProps(c,W2,H2,m,cx,base,r){
  const u=c.u||2,hd=r&&r.head?r.head:[cx,base-H2*.6,30*u];const [hx,hy,hr]=hd;S.lw(c,2);
  switch(m.id){
    case 'vui':for(const [dx,dy,s] of [[-1.5,-.9,7],[1.6,-1.1,9],[-1.9,.2,6],[1.9,.3,5],[0,-1.6,6]])S.sparkle(c,hx+dx*hr,hy+dy*hr,s*u,K);S.heart(c,hx+2.1*hr,hy-.4*hr,6*u);S.heart(c,hx-2.1*hr,hy-.5*hr,5*u);break;
    case 'binhyen':if(r.hold)S.cup(c,r.hold[0],r.hold[1]+4*u,14*u,true,true);S.leaf(c,hx+1.6*hr,hy-.8*hr,10*u,-.6);S.leaf(c,hx-1.8*hr,hy-.2*hr,8*u,.8);break;
    case 'buon':S.cloud(c,hx+.2*hr,hy-1.75*hr,22*u);for(const dx of [-12,-2,8])S.drop(c,hx+dx*u,hy-1.15*hr+(dx%3)*u,3.2*u);break;
    case 'doi':for(const a of [-.6,-.2,.2])S.line(c,[[hx+hr*1.25+Math.cos(a)*6*u,hy-hr*.6+Math.sin(a)*6*u],[hx+hr*1.25+Math.cos(a)*14*u,hy-hr*.6+Math.sin(a)*14*u]]);break;
    case 'gian':{const ax=hx+hr*.85,ay=hy-hr*.95;c.strokeStyle=R();S.lw(c,2.6);for(const [a,b] of [[[-6,-2],[-2,-6]],[[2,-6],[6,-2]],[[6,2],[2,6]],[[-2,6],[-6,2]]])S.line(c,[[ax+a[0]*u,ay+a[1]*u],[ax+b[0]*u,ay+b[1]*u]]);c.strokeStyle=K;S.lw(c,2);
      S.cloud(c,hx-hr*1.4,hy-hr*1.05,9*u);S.cloud(c,hx-hr*1.9,hy-hr*1.6,6*u);break;}
    case 'het':S.battery(c,cx+W2*.18,base-H2*.42,44*u,18*u,4);S.zzz(c,cx+W2*.3,base-H2*.5,12*u);break;
    case 'om':for(const [dx,dy,s] of [[-1.8,-1,7],[1.9,-1.2,8],[0,-1.75,6]])S.heart(c,hx+dx*hr,hy+dy*hr,s*u);break;
    case 'yeu':if(r.hold)S.heart(c,r.hold[0],r.hold[1]+6*u,20*u,R(),true);S.heart(c,hx+1.7*hr,hy-.9*hr,6*u);S.heart(c,hx-1.7*hr,hy-.6*hr,5*u);break;
    case 'im':S.lw(c,4);c.beginPath();c.arc(hx,hy+hr*.15,hr*1.05,Math.PI*1.08,Math.PI*1.92);c.stroke();S.lw(c,2);S.rrect(c,hx-hr*1.18,hy-hr*.1,hr*.36,hr*.6,6*u,K,false);S.rrect(c,hx+hr*.82,hy-hr*.1,hr*.36,hr*.6,6*u,K,false);
      S.note(c,hx+hr*1.6,hy-hr*.8,9*u);S.note(c,hx-hr*1.7,hy-hr*1.05,7*u);break;
    case 'nghi':{const qx=Math.min(hx+hr*1.45,W2-30*u),qy=Math.max(hy-hr*1.55,24*u);S.circ(c,hx+hr*.95,hy-hr*.95,3*u);S.circ(c,hx+hr*1.15,hy-hr*1.25,4.5*u);S.cloud(c,qx,qy,15*u);c.fillStyle=K;c.font=`800 ${15*u}px sans-serif`;c.fillText('?',qx-5*u,qy+6*u);break;}
    case 'tuyet':for(let i=0;i<10;i++){const a=i*Math.PI/5;S.line(c,[[hx+Math.cos(a)*hr*1.45,hy+Math.sin(a)*hr*1.3],[hx+Math.cos(a)*hr*1.75,hy+Math.sin(a)*hr*1.6]]);}S.star(c,hx+hr*2,hy-hr*.9,8*u,R());S.star(c,hx-hr*2,hy-hr*.5,6*u,K);break;
    case 'ngu':S.poly(c,[[hx-hr*.85,hy-hr*.55],[hx+hr*.2,hy-hr*1.7],[hx+hr*.95,hy-hr*.45]],R(),true);S.circ(c,hx+hr*.25,hy-hr*1.75,5*u);S.moon(c,W2-30*u,22*u,12*u);S.zzz(c,hx+hr*1.1,hy-hr*.9,13*u);S.sparkle(c,W2-60*u,40*u,4*u);break;
    case 'chualanh':if(r.hold)S.cup(c,r.hold[0],r.hold[1]+4*u,13*u,true,false);{const px=hx+hr*1.9,py=base-6*u;S.poly(c,[[px-12*u,py-22*u],[px+12*u,py-22*u],[px+9*u,py],[px-9*u,py]]);S.line(c,[[px,py-22*u],[px,py-44*u]]);S.leaf(c,px,py-36*u,12*u,-.7);S.leaf(c,px,py-30*u,12*u,Math.PI+.7);S.heart(c,px,py-50*u,5*u);}break;
    case 'nghingoi':{S.sun(c,W2-24*u,H2*.4,8*u);const y0=base-H2*.18,x1=cx-W2*.36,x2=cx+W2*.36;S.lw(c,2.4);c.beginPath();c.moveTo(x1,y0-H2*.12);c.quadraticCurveTo(cx,base+H2*.08,x2,y0-H2*.12);c.stroke();S.lw(c,2);S.line(c,[[x1,y0-H2*.12],[x1-6*u,base]]);S.line(c,[[x2,y0-H2*.12],[x2+6*u,base]]);S.leaf(c,x1-10*u,base-2*u,10*u,-1.2);S.leaf(c,x2+4*u,base-2*u,10*u,-2);break;}
  }
}
function moodDraw(m){return (ctx,w,h,P)=>{
  const kind=P.kind||m.kind,cap=P.cap||m.name,sub=P.sub??m.sub,L=m.lay;
  // vùng nhân vật & chữ theo bố cục
  let ax,aw,tx,tw,ty,th;
  if(L==='T'){ax=0;aw=w;tx=8;tw=w-16;ty=4;th=h*.32;}
  else if(L==='S'){ax=0;aw=Math.round(w*.42);tx=aw;tw=w-aw-6;ty=10;th=h-20;}
  else if(L==='B'){ax=0;aw=Math.round(w*.45);tx=aw+4;tw=w-aw-12;ty=8;th=h-16;}
  else{const right=L==='R';aw=Math.round(w*.46);ax=right?w-aw:0;tx=right?8:aw+4;tw=w-aw-14;ty=8;th=h-16;}
  let hold=null,sign=null;
  KIT.art(ctx,0,0,w,h,(c,W2,H2)=>{const u=c.u;const cx=(ax+aw/2)*2,base=H2-4*u;let r;
    if(m.pose==='nam'){const s=fitS(c,H2*.95,1);r=KIT.charaLying(c,kind,{x:cx,y:H2-6*u,s,mood:m.mood});}
    else{const s=fitS(c,H2,L==='S'?.88:.86);r=KIT.chara(c,kind,{x:cx,y:base,s,mood:m.mood,pose:m.pose,flip:L==='L'&&kind!=='ma'});}
    hold=r&&r.hold;moodProps(c,W2,H2,m,cx,base,r);
    if(L==='B'){S.bubble(c,tx*2,ty*2,tw*2,th*2*0.72,tx*2+18*u,(ty+th*.72)*2+16*u);}
    if(L==='S'&&hold){const sw=W2*.5,sh=H2*.42;sign=[hold[0]+10*u,hold[1]-sh*.5,sw,sh];S.lw(c,2.4);S.line(c,[[hold[0],hold[1]],[sign[0]+8*u,sign[1]+sh*.5]]);
      S.rrect(c,sign[0],sign[1],sw,sh,8*u,W);S.lw(c,1.6);S.rrect(c,sign[0]+5*u,sign[1]+5*u,sw-10*u,sh-10*u,5*u,null);S.circ(c,sign[0]+sw-18*u,sign[1]+18*u,9*u,R(),false);S.lw(c,3);c.strokeStyle=W;S.line(c,[[sign[0]+sw-24*u,sign[1]+18*u],[sign[0]+sw-12*u,sign[1]+18*u]]);c.strokeStyle=K;}
  });
  if(L==='S'&&sign){const [sx,sy,sw,sh]=sign.map(v=>v/2);KIT.text(ctx,cap.toLocaleUpperCase('vi'),sx+7,sy+7,sw-34,sh-14,{max:18,min:9,weight:800,align:'left',valign:'middle',lh:1.05});
    if(P.sub)KIT.text(ctx,P.sub,sx,sy+sh+4,sw,h-(sy+sh+4)-2,{max:11,min:8,weight:600,fam:'sans'});return;}
  if(L==='B'){KIT.text(ctx,cap,tx+6,ty+4,tw-12,th*.72-10,{max:20,min:10,weight:800,align:'center',valign:'middle',lh:1.08});
    if(sub)KIT.text(ctx,sub,tx,ty+th*.76,tw,th*.24,{max:11,min:8,weight:600,fam:'sans',align:'center'});return;}
  if(L==='T'){KIT.text(ctx,cap,tx,ty,tw,th,{max:20,min:10,weight:800,align:'center',valign:'middle',lh:1.05,maxLines:2});
    if(sub)KIT.label(ctx,sub,w/2,h-5,{size:9,weight:600,align:'center',track:0});return;}
  const f=KIT.text(ctx,cap,tx,ty,tw,th*.68,{max:22,min:11,weight:800,valign:'bottom',lh:1.05,maxLines:4});
  ctx.fillStyle=R();ctx.fillRect(tx,Math.round(ty+th*.68+5),18,3);
  if(sub)KIT.text(ctx,sub,tx,ty+th*.68+12,tw,th*.32-12,{max:11,min:8,weight:500,fam:'sans',lh:1.2,maxLines:3});
};}
for(const m of MOODS)add({id:'mood-'+m.id,coll:'mood',name:m.name,fields:[{k:'kind',label:'Nhân vật',type:'select',def:m.kind,opts:KIND_OPTS},{k:'cap',label:'Câu chính',type:'text',def:m.name},{k:'sub',label:'Lời nhỏ',type:'text',def:m.sub}],draw:moodDraw(m)});

/* ======================= B. EMOTIONAL BATTERY ======================= */
const BAT_MSG=[[10,'Hết sạch pin rồi… cần ngủ một giấc'],[30,'Pin yếu, nhẹ tay với mình nhé'],[55,'Tạm ổn, đi chậm mà chắc'],[80,'Năng lượng tốt, làm thôi!'],[101,'Đầy pin! Sẵn sàng cho mọi thứ']];
const batMood=p=>p<=10?['het','nam']:p<=30?['buon','dung']:p<=55?['thuong','dung']:p<=80?['vui','vay']:['tuyet','gio'];
add({id:'bat-ngang',coll:'battery',name:'Pin cảm xúc',timely:false,fields:[
  {k:'lv',label:'Mức năng lượng',type:'range',def:65,min:0,max:100,step:5,unit:'%'},{k:'kind',label:'Nhân vật',type:'select',def:'tho',opts:KIND_OPTS},
  {k:'name',label:'Tên (không bắt buộc)',type:'text',def:''},{k:'msg',label:'Lời nhắn riêng (để trống: tự theo mức pin)',type:'text',def:''}],
  draw(ctx,w,h,P){const lv=Math.max(0,Math.min(100,num(P.lv))),[md,ps]=batMood(lv),msg=P.msg||BAT_MSG.find(x=>lv<x[0])[1],aw=Math.round(w*.4);
    KIT.art(ctx,0,0,w,h,(c,W2,H2)=>{const u=c.u;if(ps==='nam')KIT.charaLying(c,P.kind,{x:aw,y:H2-6*u,s:fitS(c,aw*2,.55),mood:md});else KIT.chara(c,P.kind,{x:aw,y:H2-4*u,s:fitS(c,H2,.86),mood:md,pose:ps});
      const bx=aw*2+16*u,bw=W2-bx-26*u,by=H2*.36,bh=H2*.3;S.lw(c,3);S.rrect(c,bx,by,bw,bh,10*u);S.rrect(c,bx+bw,by+bh*.3,8*u,bh*.4,3*u,K,false);
      const n=10,g=4*u,cw=(bw-g*(n+1))/n,on=Math.round(lv/10);for(let i=0;i<n;i++)if(i<on)S.rrect(c,bx+g+i*(cw+g),by+g,cw,bh-g*2,3*u,lv<=20?R():K,false);
      if(lv>=90){S.sparkle(c,bx+bw+10*u,by-10*u,7*u);S.sparkle(c,bx-6*u,by-14*u,5*u);}if(lv<=20)S.drop(c,bx+bw*.5,by-14*u,6*u);});
    const bx=aw+8;KIT.label(ctx,(P.name?P.name.toLocaleUpperCase('vi')+' · ':'')+'PIN CẢM XÚC',bx,16,{size:10,color:R(),track:1});
    KIT.font(ctx,28,800,'round');ctx.fillStyle=K;ctx.textAlign='right';ctx.fillText(lv+'%',w-8,Math.round(h*.3));ctx.textAlign='left';
    KIT.text(ctx,msg,bx,h*.7,w-bx-8,h*.3-4,{max:13,min:9,weight:700,fam:'round',lh:1.1,maxLines:2});}});

/* ======================= D. PIXEL WORLD — 10 mẫu ======================= */
function pxScene(ctx,w,h,px,fn){KIT.pixel(ctx,0,0,w,h,px,(g,lw,lh)=>{g.u=.5;g.lineWidth=1;fn(g,lw,lh);});}
const pxS=(g,H,frac)=>H*frac/(100*g.u);
function pxTitle(ctx,w,h,t,sub){KIT.label(ctx,t.toLocaleUpperCase('vi'),8,15,{size:11,weight:800,track:1.5});if(sub){KIT.font(ctx,9,600,'sans');ctx.fillStyle=K;ctx.fillText(sub,8,27);}}
const PX=[
  {id:'meo',name:'Mèo pixel',sub:'Meo~ chúc một ngày êm đềm',f:(g,W,H)=>{KIT.chara(g,'meo',{x:W*.68,y:H-2,s:pxS(g,H,.85),mood:'vui',pose:'vay'});for(const [x,y] of [[.46,.3],[.9,.25],[.95,.62]])S.heart(g,W*x,H*y,2.4);S.grass(g,0,W,H-1);}},
  {id:'tho',name:'Thỏ pixel',sub:'Một củ cà rốt cho ngày dài',f:(g,W,H)=>{const r=KIT.chara(g,'tho',{x:W*.68,y:H-2,s:pxS(g,H,.82),mood:'thuong',pose:'cam'});if(r.hold){S.poly(g,[[r.hold[0]-3,r.hold[1]-2],[r.hold[0]+3,r.hold[1]-2],[r.hold[0],r.hold[1]+9]],R(),true);S.line(g,[[r.hold[0],r.hold[1]-2],[r.hold[0]-2,r.hold[1]-6]]);S.line(g,[[r.hold[0],r.hold[1]-2],[r.hold[0]+2,r.hold[1]-6]]);}}},
  {id:'khunglong',name:'Khủng long mini',sub:'Nhảy qua mọi chướng ngại!',f:(g,W,H)=>{const x=W*.62,y=H-4,s=H/60;
    S.ell(g,x,y-14*s,13*s,10*s);S.ell(g,x+12*s,y-27*s,8*s,7*s);S.circ(g,x+14*s,y-29*s,1.2,K,false);S.line(g,[[x+16*s,y-24*s],[x+19*s,y-24*s]]);
    S.poly(g,[[x-12*s,y-16*s],[x-24*s,y-8*s],[x-11*s,y-10*s]]);for(const dx of [-6,0,6])S.poly(g,[[x+dx*s-2*s,y-23*s],[x+dx*s,y-28*s],[x+dx*s+2*s,y-23*s]],R(),false);
    S.line(g,[[x-5*s,y-5*s],[x-5*s,y]]);S.line(g,[[x+5*s,y-5*s],[x+5*s,y]]);S.line(g,[[0,y],[W,y]]);
    for(const cx of [W*.2,W*.93]){S.rrect(g,cx-2*s,y-14*s,4*s,14*s,1);S.line(g,[[cx-2*s,y-8*s],[cx-5*s,y-8*s],[cx-5*s,y-11*s]]);S.line(g,[[cx+2*s,y-6*s],[cx+5*s,y-6*s],[cx+5*s,y-10*s]]);}
    S.cloud(g,W*.35,H*.2,4*s);S.cloud(g,W*.85,H*.12,3*s);}},
  {id:'ma',name:'Bé ma đáng yêu',sub:'Boo! Chúc ngủ thật ngon',f:(g,W,H)=>{KIT.chara(g,'ma',{x:W*.66,y:H-3,s:pxS(g,H,.82),mood:'vui',pose:'gio'});S.moon(g,W*.92,H*.2,5);for(const [x,y] of [[.15,.85],[.4,.7],[.95,.6],[.28,.95]])S.sparkle(g,W*x,H*y,2.2);}},
  {id:'phihanhgia',name:'Phi hành gia',sub:'Từng bước nhỏ tới những vì sao',f:(g,W,H)=>{const s=H/60,x=W*.64,y=H*.75;
    g.beginPath();g.arc(x,H+H*.6,H*.95,Math.PI,0);g.fillStyle=W;g.fill();g.stroke();for(const [dx,dy,r] of [[-.2,.92,3],[.15,.96,2],[.32,.9,2.5]])S.circ(g,x+W*dx,H*dy,r*s);
    S.rrect(g,x-8*s,y-10*s,16*s,15*s,4*s);S.circ(g,x,y-20*s,10*s);S.ell(g,x+2*s,y-20*s,6*s,5*s,K,false);S.circ(g,x+4*s,y-22*s,1.2*s,W,false);S.rrect(g,x-14*s,y-8*s,6*s,10*s,2*s);
    S.line(g,[[x+12*s,y-6*s],[x+12*s,y-32*s]]);S.poly(g,[[x+12*s,y-32*s],[x+24*s,y-28*s],[x+12*s,y-24*s]],R(),true);
    g.beginPath();g.ellipse(W*.92,H*.2,9*s,3*s,-.3,0,Math.PI*2);g.stroke();S.circ(g,W*.92,H*.2,5*s);for(const [a,b] of [[.1,.15],[.3,.3],[.8,.45],[.55,.1]])S.sparkle(g,W*a,H*b,2);}},
  {id:'game',name:'Đồng hồ máy chơi game',sub:'Giờ lúc gửi',timely:true,f:(g,W,H)=>{const x=W*.47,y=3,cw=W*.5,ch=H-6;S.rrect(g,x,y,cw,ch,4);S.rrect(g,x+cw*.08,y+ch*.08,cw*.84,ch*.5,2);
    S.rrect(g,x+cw*.12,y+ch*.72,cw*.08,ch*.2,1,K,false);S.rrect(g,x+cw*.07,y+ch*.78,cw*.18,ch*.08,1,K,false);S.circ(g,x+cw*.75,y+ch*.76,ch*.06,R(),true);S.circ(g,x+cw*.88,y+ch*.68,ch*.06,K,false);
    for(const dx of [.42,.52])S.line(g,[[x+cw*dx,y+ch*.9],[x+cw*dx+cw*.06,y+ch*.86]]);},after:(ctx,w,h)=>{const x=w*.47,cw=w*.5,ch=h-6,d=new Date();KIT.text(ctx,'Đồng hồ máy chơi game',8,10,w*.4,h*.45,{max:16,min:10,weight:800,valign:'bottom',lh:1.05,maxLines:3});KIT.font(ctx,9,600,'sans');ctx.fillStyle=K;ctx.fillText('Giờ lúc gửi · tự đổi khi bật',8,h*.68);ctx.fillText('Tự cập nhật',8,h*.68+12);KIT.font(ctx,Math.round(ch*.3),800,'sans');ctx.fillStyle=K;ctx.textAlign='center';ctx.fillText(hhmm(d),x+cw/2,3+ch*.43);KIT.font(ctx,9,700,'sans');ctx.fillText(`${WS[d.getDay()]} ${pad(d.getDate())}/${pad(d.getMonth()+1)}`,x+cw/2,3+ch*.53);ctx.textAlign='left';}},
  {id:'nha',name:'Ngôi nhà nhỏ',sub:'Về nhà thôi',timely:true,f:(g,W,H)=>{const night=new Date().getHours()>=18||new Date().getHours()<6,x=W*.7,y=H-3,s=H/60;
    S.poly(g,[[x-22*s,y-26*s],[x,y-44*s],[x+22*s,y-26*s]],R(),true);S.rrect(g,x-18*s,y-26*s,36*s,26*s,1);S.rrect(g,x-4*s,y-14*s,8*s,14*s,1);S.rrect(g,x+7*s,y-21*s,8*s,7*s,1,night?K:W);
    S.rrect(g,x+10*s,y-46*s,5*s,10*s,1);S.cloud(g,x+16*s,y-52*s,3*s);S.line(g,[[0,y],[W,y]]);S.leaf(g,x-30*s,y-4*s,6*s,-1.2);S.leaf(g,x-34*s,y-3*s,6*s,-2);
    if(night){S.moon(g,W*.9,H*.18,6*s);S.sparkle(g,W*.5,H*.15,2);S.sparkle(g,W*.97,H*.45,2);}else S.sun(g,W*.92,H*.2,4*s);}},
  {id:'vuon',name:'Khu vườn pixel',sub:'Mỗi việc xong, thêm một mầm xanh',fields:[{k:'n',label:'Số cây (việc đã xong)',type:'range',def:5,min:0,max:12,step:1}],f:(g,W,H,P)=>{const n=Math.max(0,Math.min(12,num(P.n))),y=H-4,s=H/60;S.line(g,[[0,y],[W,y]]);
    for(let i=0;i<12;i++){const x=W*.08+i*(W*.84/11),st=i<n?(i%3)+1:0;if(!st){S.circ(g,x,y-1,1.2,K,false);continue;}const top=y-(8+st*5)*s;S.line(g,[[x,y],[x,top]]);S.leaf(g,x,top+4*s,4*s,-.8);S.leaf(g,x,top+6*s,4*s,Math.PI+.8);if(st===3)S.flower(g,x,top-1*s,2.2*s);else if(st===2)S.circ(g,x,top-1,1.6*s,R(),false);}
    S.sun(g,W*.92,H*.2,4*s);},after:(ctx,w,h,P)=>{KIT.label(ctx,'KHU VƯỜN PIXEL',8,15,{size:10,track:1.4});KIT.font(ctx,22,800,'round');ctx.fillStyle=K;ctx.textAlign='right';ctx.fillText(`${Math.max(0,Math.min(12,num(P.n)))}/12`,w-8,h*.55);ctx.textAlign='left';}},
  {id:'thucung',name:'Thú cưng ảo',sub:'',timely:true,fields:[{k:'pname',label:'Tên thú cưng',type:'text',def:'Mochi'},{k:'food',label:'No bụng',type:'range',def:70,min:0,max:100,step:10,unit:'%'},{k:'fun',label:'Vui vẻ',type:'range',def:80,min:0,max:100,step:10,unit:'%'}],
    f:(g,W,H,P)=>{const hr=new Date().getHours(),sleep=hr>=22||hr<6,avg=(num(P.food)+num(P.fun))/2,md=sleep?'ngu':avg<35?'buon':avg<70?'thuong':'vui';KIT.chara(g,'meo',{x:W*.22,y:H-3,s:pxS(g,H,.82),mood:md,pose:avg>=70&&!sleep?'vay':'dung'});if(sleep)S.zzz(g,W*.34,H*.3,7);},
    after:(ctx,w,h,P)=>{const x=w*.45;KIT.label(ctx,(P.pname||'Mochi').toLocaleUpperCase('vi'),x,18,{size:12,track:1.5});const bars=[['No bụng',num(P.food)],['Vui vẻ',num(P.fun)]];
      bars.forEach(([n,v],i)=>{const y=34+i*26;KIT.font(ctx,10,700,'sans');ctx.fillStyle=K;ctx.fillText(n,x,y);ctx.strokeStyle=K;ctx.lineWidth=1;ctx.strokeRect(x+.5,y+4.5,w-x-14,9);ctx.fillStyle=v<=30?R():K;ctx.fillRect(x+2,y+6,Math.round((w-x-17)*v/100),6);});
      const hr=new Date().getHours(),sleep=hr>=22||hr<6,avg=(num(P.food)+num(P.fun))/2;KIT.font(ctx,10,600,'sans');ctx.fillStyle=K;ctx.fillText(sleep?'Đang ngủ khò khò…':avg<35?'Đói và buồn, chăm mình với!':avg<70?'Ổn áp, chơi với mình nhé':'Vui quá, cảm ơn bạn!',x,h-8);}},
  {id:'theogio',name:'Mèo pixel theo giờ',sub:'',timely:true,f:(g,W,H)=>{const hr=new Date().getHours(),sc=hr<6||hr>=22?'ngu':hr<11?'sang':hr<14?'trua':hr<18?'chieu':'toi',x=W*.7,s=H/60;
    const r=KIT.chara(g,'meo',{x,y:H-3,s:pxS(g,H,.78),mood:sc==='ngu'?'ngu':sc==='chieu'?'nghi':'vui',pose:sc==='sang'?'gio':sc==='trua'||sc==='toi'?'cam':'dung'});
    if(sc==='sang')S.sun(g,W*.93,H*.2,4*s);if(sc==='trua'&&r.hold){g.beginPath();g.arc(r.hold[0],r.hold[1],6*s,0,Math.PI);g.fillStyle=W;g.fill();g.stroke();S.line(g,[[r.hold[0]-6*s,r.hold[1]],[r.hold[0]+6*s,r.hold[1]]]);}
    if(sc==='chieu'){S.rrect(g,x-16*s,H-16*s,32*s,13*s,1);S.heart(g,x,H-9*s,2.5*s);}if(sc==='toi'&&r.hold)S.cup(g,r.hold[0],r.hold[1]+2,5*s);if(sc==='ngu'){S.moon(g,W*.93,H*.2,5*s);S.zzz(g,x+12*s,H*.3,7);}},
    after:(ctx,w,h)=>{const hr=new Date().getHours(),t=hr<6||hr>=22?['Ngủ ngon','Mơ đẹp nha~']:hr<11?['Chào buổi sáng','Dậy thôi nào!']:hr<14?['Giờ ăn trưa','Ăn no rồi nghỉ']:hr<18?['Buổi chiều','Tập trung nào']:['Buổi tối','Thư giãn chút'];
      KIT.text(ctx,t[0],8,24,w*.45,40,{max:18,min:10,weight:800,lh:1.05,maxLines:2});KIT.font(ctx,10,600,'sans');ctx.fillStyle=K;ctx.fillText(t[1],8,h-10);}},
];
for(const p of PX)add({id:'px-'+p.id,coll:'pixel',name:p.name,timely:!!p.timely,fields:p.fields||[{k:'sub',label:'Lời nhắn',type:'text',def:p.sub}],
  draw(ctx,w,h,P){pxScene(ctx,w,h,2,(g,W,H)=>p.f(g,W,H,P));if(p.after)p.after(ctx,w,h,P);else{const sub=P.sub??p.sub;KIT.text(ctx,p.name,8,10,w*.46,h*.42,{max:17,min:10,weight:800,valign:'bottom',lh:1.05,maxLines:2});
    if(sub)KIT.text(ctx,sub,8,h*.6,w*.44,h*.38-4,{max:11,min:8,weight:600,fam:'sans',lh:1.2,maxLines:3});}}});

/* ======================= F. FOCUS & WORK — 12 mẫu ======================= */
const sideArt=(ctx,w,h,frac,fn,right=true)=>{const aw=Math.round(w*frac),ax=right?w-aw:0;KIT.art(ctx,ax,0,aw,h,fn);return {ax,aw,tx:right?8:aw+6,tw:w-aw-14};};
function titleBlock(ctx,x,w,h,kicker,title,sub){let y=8;if(kicker){KIT.label(ctx,kicker.toLocaleUpperCase('vi'),x,y+9,{size:9,color:R(),track:1.2});y+=14;}
  const f=KIT.text(ctx,title,x,y,w,h*.55,{max:22,min:11,weight:800,lh:1.05,maxLines:3});y+=f.lines.length*f.lh+4;if(sub)KIT.text(ctx,sub,x,y,w,h-y-4,{max:12,min:8,weight:600,fam:'sans',lh:1.2,maxLines:3});}
function checklist(ctx,x,y,w,h,items,size=12){const rh=size+6,n=Math.max(1,Math.floor(h/rh));items.slice(0,n).forEach((it,i)=>{const yy=y+i*rh,done=/^x\s+/i.test(it),t=it.replace(/^x\s+/i,'');ctx.strokeStyle=K;ctx.lineWidth=1.5;ctx.strokeRect(x+.75,yy+3.75,size-4,size-4);
  if(done){ctx.fillStyle=R();ctx.fillRect(x+3,yy+6,size-8,size-8);}KIT.font(ctx,size,done?500:700,'sans');ctx.fillStyle=K;const tt=t.length>40?t.slice(0,40)+'…':t;ctx.fillText(tt,x+size+2,yy+size+1);if(done){const tw=Math.min(ctx.measureText(tt).width,w-size-2);ctx.fillRect(x+size+2,yy+size*.6+1,tw,1.5);}});}
add({id:'f-pomodoro',coll:'focus',name:'Đồng hồ Pomodoro',timely:true,fields:[{k:'task',label:'Việc đang làm',type:'text',def:'Viết báo cáo'},{k:'mins',label:'Số phút tập trung',type:'range',def:25,min:10,max:60,step:5,unit:' phút'}],
  draw(ctx,w,h,P){const d=new Date(),end=new Date(d.getTime()+num(P.mins)*60000);const L=sideArt(ctx,w,h,.42,(c,W2,H2)=>{const u=c.u,x=W2/2,y=H2*.56,r=H2*.33;S.circ(c,x,y,r,R(),true);S.lw(c,2);
    for(const a of [-.9,-.3,.3,.9])S.leaf(c,x,y-r*.9,r*.42,-Math.PI/2+a);S.line(c,[[x,y-r*.95],[x+4*u,y-r*1.25]]);S.ell(c,x-r*.45,y-r*.35,r*.14,r*.08,W,false,-.6);KIT.face(c,x,y+r*.1,u*1.9,'thuong');});
    titleBlock(ctx,L.tx,L.tw,h,'Pomodoro · '+num(P.mins)+' phút',P.task||'Tập trung',`Bắt đầu ${hhmm(d)} → nghỉ lúc ${hhmm(end)}`);}});
const SIGNS=[
  ['f-taptrung','Đang tập trung','be','nghi','cam','ĐANG TẬP TRUNG','Quay lại lúc',':headphone'],
  ['f-dnd','Không làm phiền','meo','phien','dung','XIN ĐỪNG LÀM PHIỀN','Cảm ơn bạn đã thông cảm',':no'],
  ['f-free','Có thể làm phiền','gau','vui','vay','CỨ HỎI MÌNH NHÉ','Cửa luôn mở ♡',':door'],
  ['f-hop','Đang họp','tho','thuong','dung','ĐANG HỌP','Xong lúc',':people'],
  ['f-nghitrua','Đang nghỉ trưa','meo','ngu','dung','NGHỈ TRƯA','Quay lại lúc',':bowl'],
];
for(const [id,name,kind,mood,pose,big,sub,prop] of SIGNS)add({id,coll:'focus',name,fields:[{k:'big',label:'Chữ lớn',type:'text',def:big},{k:'sub',label:'Dòng nhỏ',type:'text',def:sub},
  ...(sub.endsWith('lúc')?[{k:'at',label:'Giờ',type:'time',def:id==='f-hop'?'15:30':id==='f-nghitrua'?'13:30':'16:00'}]:[]),{k:'kind',label:'Nhân vật',type:'select',def:kind,opts:KIND_OPTS}],
  draw(ctx,w,h,P){const L=sideArt(ctx,w,h,.38,(c,W2,H2)=>{const u=c.u,r=KIT.chara(c,P.kind,{x:W2/2,y:H2-3*u,s:fitS(c,H2,.84),mood,pose});const [hx,hy,hr]=r.head;
      if(prop===':headphone'){S.lw(c,4);c.beginPath();c.arc(hx,hy+hr*.15,hr*1.05,Math.PI*1.08,Math.PI*1.92);c.stroke();S.lw(c,2);S.rrect(c,hx-hr*1.2,hy-hr*.1,hr*.36,hr*.6,5*u,K,false);S.rrect(c,hx+hr*.84,hy-hr*.1,hr*.36,hr*.6,5*u,R(),false);}
      if(prop===':no'){S.circ(c,W2*.82,H2*.2,14*u,R(),false);S.lw(c,4);c.strokeStyle=W;S.line(c,[[W2*.82-8*u,H2*.2],[W2*.82+8*u,H2*.2]]);c.strokeStyle=K;S.lw(c,2);}
      if(prop===':door'){S.rrect(c,4*u,H2*.12,W2*.28,H2*.86,4*u);S.circ(c,4*u+W2*.24,H2*.58,3*u,K,false);}
      if(prop===':people'){const cx2=W2*.2,cy2=H2*.2;S.circ(c,cx2,cy2,14*u);S.line(c,[[cx2,cy2],[cx2,cy2-9*u]]);S.line(c,[[cx2,cy2],[cx2+7*u,cy2+3*u]]);S.circ(c,cx2,cy2,2*u,R(),false);}
      if(prop===':bowl'){const bx=W2*.82,by=H2-12*u;c.beginPath();c.arc(bx,by-12*u,14*u,0,Math.PI);c.fillStyle=W;c.fill();c.stroke();S.line(c,[[bx-14*u,by-12*u],[bx+14*u,by-12*u]]);S.line(c,[[bx+4*u,by-26*u],[bx+18*u,by-40*u]]);S.zzz(c,W2*.68,H2*.25,12*u);}},false);
    const x=L.tx,tw=L.tw;ctx.fillStyle=K;ctx.fillRect(x,8,tw,3);KIT.text(ctx,P.big||big,x,16,tw,h*.52,{max:24,min:11,weight:800,valign:'middle',lh:1.03,maxLines:3});
    ctx.fillStyle=R();ctx.fillRect(x,Math.round(h*.7),24,3);KIT.font(ctx,12,700,'sans');ctx.fillStyle=K;const s=(P.sub||'')+(P.at&&String(P.sub||'').endsWith('lúc')?' '+P.at:'');ctx.fillText(s.length>34?s.slice(0,34)+'…':s,x,h-12);}});
add({id:'f-todo',coll:'focus',name:'Danh sách công việc',fields:[{k:'title',label:'Tiêu đề',type:'text',def:'Việc hôm nay'},{k:'items',label:'Việc (mỗi dòng; “x ” ở đầu = xong)',type:'textarea',def:'Trả lời email\nx Họp nhóm 9h\nGửi báo cáo tuần\nĐặt lịch khám'}],
  draw(ctx,w,h,P){const it=lines(P.items),dn=it.filter(s=>/^x\s+/i.test(s)).length;KIT.art(ctx,w-70,0,70,h,(c,W2,H2)=>{const u=c.u;S.book(c,10*u,H2-40*u,W2-20*u,30*u);S.cup(c,W2*.55,H2-48*u,13*u);S.leaf(c,W2*.2,H2*.25,12*u,-.7);S.leaf(c,W2*.3,H2*.18,10*u,-2);});
    KIT.label(ctx,(P.title||'Việc hôm nay').toLocaleUpperCase('vi'),8,16,{size:11,track:1.2});KIT.font(ctx,10,700,'sans');ctx.fillStyle=R();ctx.textAlign='right';ctx.fillText(`${dn}/${it.length}`,w-76,16);ctx.textAlign='left';
    ctx.fillStyle=K;ctx.fillRect(8,21,w-86,1.5);checklist(ctx,8,24,w-90,h-26,it,12);}});
add({id:'f-deadline',coll:'focus',name:'Đếm ngược deadline',fields:[{k:'title',label:'Việc',type:'text',def:'Nộp dự án'},{k:'date',label:'Hạn chót',type:'date',def:''}],
  draw(ctx,w,h,P){let d=daysTo(P.date);if(d===null)d=7;KIT.art(ctx,0,0,Math.round(w*.3),h,(c,W2,H2)=>{const u=c.u,x=W2/2,t=H2*.14,b=H2*.86,hw=W2*.3;S.lw(c,3);S.line(c,[[x-hw,t],[x+hw,t]]);S.line(c,[[x-hw,b],[x+hw,b]]);S.lw(c,2.2);
      c.beginPath();c.moveTo(x-hw*.85,t);c.quadraticCurveTo(x-hw*.85,H2*.45,x,H2*.5);c.quadraticCurveTo(x+hw*.85,H2*.45,x+hw*.85,t);c.moveTo(x-hw*.85,b);c.quadraticCurveTo(x-hw*.85,H2*.55,x,H2*.5);c.quadraticCurveTo(x+hw*.85,H2*.55,x+hw*.85,b);c.stroke();
      S.poly(c,[[x-hw*.55,b-2*u],[x,b-H2*.18],[x+hw*.55,b-2*u]],R(),false);S.line(c,[[x,H2*.5],[x,b-H2*.18]]);});
    const x=Math.round(w*.3)+8;KIT.label(ctx,'DEADLINE',x,18,{size:10,color:R(),track:1.5});KIT.text(ctx,P.title||'Deadline',x,22,w-x-8,30,{max:15,min:10,weight:800,maxLines:2});
    KIT.font(ctx,d<0?24:44,800,'round');ctx.fillStyle=d<=3?R():K;const big=d<0?'Đã qua':d===0?'Hôm nay!':String(d);ctx.fillText(big,x,h-14);if(d>0){const bw=ctx.measureText(big).width;KIT.font(ctx,13,700,'sans');ctx.fillStyle=K;ctx.fillText('ngày nữa',x+bw+6,h-16);}}});
add({id:'f-muctieu',coll:'focus',name:'Mục tiêu hôm nay',fields:[{k:'items',label:'3 mục tiêu (mỗi dòng)',type:'textarea',def:'Hoàn thành bản nháp\nĐi bộ 20 phút\nĐọc 10 trang sách'},{k:'quote',label:'Lời nhắn',type:'text',def:'Từng bước nhỏ, đều đặn mỗi ngày'}],
  draw(ctx,w,h,P){const it=lines(P.items).slice(0,3);KIT.label(ctx,'MỤC TIÊU HÔM NAY',8,16,{size:11,track:1.5});ctx.fillStyle=R();ctx.fillRect(8,21,30,3);
    KIT.art(ctx,0,24,w,h-40,(c,W2,H2)=>{it.forEach((_,i)=>S.star(c,14*c.u,(10+i*16)*c.u,6*c.u,i===0?R():K));});
    it.forEach((t,i)=>{KIT.text(ctx,t,26,26+i*16,w-34,16,{max:13,min:9,weight:700,fam:'sans',maxLines:1});});KIT.font(ctx,10,500,'serif');ctx.fillStyle=K;ctx.fillText('“'+(P.quote||'')+'”',8,h-6);}});
add({id:'f-tiendo',coll:'focus',name:'Theo dõi tiến độ',fields:[{k:'items',label:'Dự án | % (mỗi dòng)',type:'textarea',def:'Website | 80\nBáo cáo quý | 45\nThiết kế logo | 100\nKế hoạch Tết | 20'}],
  draw(ctx,w,h,P){const it=lines(P.items).slice(0,4).map(s=>{const [n,p]=s.split('|');return [n.trim(),Math.max(0,Math.min(100,num(p)))];});KIT.label(ctx,'TIẾN ĐỘ CÔNG VIỆC',8,15,{size:11,track:1.5});
    const rh=(h-24)/Math.max(1,it.length);it.forEach(([n,p],i)=>{const y=22+i*rh;KIT.font(ctx,11,700,'sans');ctx.fillStyle=K;ctx.fillText(n.length>26?n.slice(0,26)+'…':n,8,y+11);ctx.textAlign='right';ctx.fillText(p+'%',w-8,y+11);ctx.textAlign='left';
      ctx.strokeStyle=K;ctx.lineWidth=1.2;ctx.strokeRect(8.5,y+14.5,w-17,6);ctx.fillStyle=p>=100?R():K;ctx.fillRect(10,y+16,Math.round((w-20)*p/100),3);});}});
add({id:'f-nhac',coll:'focus',name:'Bảng nhắc việc',fields:[{k:'items',label:'Ghi chú (mỗi dòng một tờ, tối đa 4)',type:'textarea',def:'Gọi cho mẹ\nMua sữa\nĐóng tiền điện\nSinh nhật Lan 5/12'}],
  draw(ctx,w,h,P){const it=lines(P.items).slice(0,4),n=Math.max(1,it.length),cw=(w-8)/n;KIT.art(ctx,0,0,w,h,(c,W2,H2)=>{const u=c.u;it.forEach((_,i)=>{const x=(4+i*cw)*2+4*u,rot=(i%2?.03:-.03);c.save();c.translate(x+(cw*2-8*u)/2,H2/2);c.rotate(rot);S.rrect(c,-(cw*2-8*u)/2,-H2*.42,cw*2-8*u,H2*.84,4*u);
      S.poly(c,[[(cw*2-8*u)/2-14*u,H2*.42],[(cw*2-8*u)/2,H2*.42-14*u],[(cw*2-8*u)/2,H2*.42]],W,true);S.circ(c,0,-H2*.42,6*u,R(),true);c.restore();});});
    it.forEach((t,i)=>KIT.text(ctx,t,4+i*cw+8,18,cw-16,h-30,{max:14,min:9,weight:700,align:'center',valign:'middle',lh:1.1,maxLines:4}));}});
add({id:'f-tuan',coll:'focus',name:'Lịch tuần mini',timely:true,fields:[{k:'items',label:'Sự kiện (“T2: nội dung”, mỗi dòng)',type:'textarea',def:'T2: Họp tuần\nT4: Nộp báo cáo\nT6: Ăn tối gia đình\nCN: Đi công viên'}],
  draw(ctx,w,h,P){const ev={};for(const l of lines(P.items)){const m=/^(T[2-7]|CN)\s*[:\-]\s*(.+)$/i.exec(l);if(m)ev[m[1].toUpperCase()]=m[2];}const d=new Date(),k=(d.getDay()+6)%7,cw=(w-8)/7;
    const mon=new Date(d);mon.setDate(d.getDate()-k);KIT.label(ctx,`TUẦN ${pad(mon.getDate())}/${pad(mon.getMonth()+1)}`,8,13,{size:10,track:1.2});
    ['T2','T3','T4','T5','T6','T7','CN'].forEach((t,i)=>{const x=4+i*cw,on=i===k,dd=new Date(mon);dd.setDate(mon.getDate()+i);if(on){ctx.fillStyle=K;ctx.fillRect(x+1,18,cw-2,26);}
      KIT.font(ctx,10,800,'sans');ctx.fillStyle=on?W:(i>=5?R():K);ctx.textAlign='center';ctx.fillText(t,x+cw/2,29);KIT.font(ctx,12,800,'sans');ctx.fillText(String(dd.getDate()),x+cw/2,41);ctx.textAlign='left';
      if(i)ctx.fillStyle=K,ctx.fillRect(Math.round(x),48,1,h-52);if(ev[t]){ctx.fillStyle=R();ctx.fillRect(x+cw/2-2,50,4,4);KIT.text(ctx,ev[t],x+2,56,cw-4,h-58,{max:10,min:8,weight:600,fam:'sans',align:'center',lh:1.1,maxLines:5});}});}});

/* ======================= G. LITTLE GOALS — 9 mẫu ======================= */
add({id:'g-hu',coll:'goals',name:'Hũ tiết kiệm',fields:[{k:'goal',label:'Mục tiêu',type:'text',def:'Chuyến đi Đà Lạt'},{k:'target',label:'Số tiền cần (đ)',type:'number',def:5000000},{k:'have',label:'Đã có (đ)',type:'number',def:3200000}],
  draw(ctx,w,h,P){const tg=Math.max(1,num(P.target)),hv=Math.max(0,num(P.have)),p=Math.min(1,hv/tg);KIT.art(ctx,0,0,Math.round(w*.36),h,(c,W2,H2)=>{const u=c.u,x=W2/2,jw=W2*.62,top=H2*.22,bot=H2*.94;
      S.rrect(c,x-jw*.38,top-14*u,jw*.76,14*u,4*u,R(),true);const fy=bot-(bot-top-10*u)*p;c.save();c.beginPath();c.roundRect(x-jw/2,top,jw,bot-top,22*u);c.clip();c.fillStyle=K;
      for(let yy=fy;yy<bot;yy+=6*u)c.fillRect(x-jw/2,yy,jw,3*u);for(let i=0;i<6;i++)if(fy+i*14*u<bot-6*u)S.ell(c,x-jw*.25+(i%3)*jw*.25,bot-10*u-i*10*u,9*u,5*u,W,true);c.restore();S.lw(c,3);S.rrect(c,x-jw/2,top,jw,bot-top,22*u,null);S.lw(c,2);S.heart(c,x,top+30*u,9*u);});
    const x=Math.round(w*.36)+6;KIT.label(ctx,'HŨ TIẾT KIỆM',x,16,{size:10,color:R(),track:1.4});KIT.text(ctx,P.goal||'',x,20,w-x-8,32,{max:15,min:10,weight:800,maxLines:2});
    KIT.font(ctx,26,800,'round');ctx.fillStyle=K;ctx.fillText(Math.round(p*100)+'%',x,h-30);KIT.font(ctx,10,600,'sans');ctx.fillText(`${money(hv)}đ / ${money(tg)}đ`,x,h-14);ctx.fillText(`Còn ${money(Math.max(0,tg-hv))}đ`,x,h-3);}});
add({id:'g-nuoc',coll:'goals',name:'Theo dõi uống nước',fields:[{k:'n',label:'Số cốc đã uống',type:'range',def:5,min:0,max:8,step:1},{k:'kind',label:'Nhân vật',type:'select',def:'tho',opts:KIND_OPTS}],
  draw(ctx,w,h,P){const n=Math.max(0,Math.min(8,num(P.n)));const aw=Math.round(w*.32);KIT.art(ctx,0,0,w,h,(c,W2,H2)=>{const u=c.u,r=KIT.chara(c,P.kind,{x:aw,y:H2-3*u,s:fitS(c,H2,.8),mood:n>=8?'tuyet':n>=4?'vui':'thuong',pose:'cam'});if(r.hold)S.cup(c,r.hold[0],r.hold[1]+4*u,12*u,false,false);
      const gx=aw*2+10*u,gw=(W2-gx-10*u)/4;for(let i=0;i<8;i++){const x=gx+(i%4)*gw+gw/2,y=H2*.42+Math.floor(i/4)*H2*.34;S.poly(c,[[x-gw*.28,y-H2*.13],[x+gw*.28,y-H2*.13],[x+gw*.2,y+H2*.12],[x-gw*.2,y+H2*.12]]);
        if(i<n){c.save();c.beginPath();c.rect(x-gw*.3,y-H2*.04,gw*.6,H2*.17);c.clip();S.poly(c,[[x-gw*.28,y-H2*.13],[x+gw*.28,y-H2*.13],[x+gw*.2,y+H2*.12],[x-gw*.2,y+H2*.12]],K,false);c.restore();}}});
    KIT.label(ctx,`UỐNG NƯỚC · ${n}/8 CỐC`,aw+5,14,{size:10,color:R(),track:1.2});}});
add({id:'g-sach',coll:'goals',name:'Theo dõi đọc sách',fields:[{k:'book',label:'Tên sách',type:'text',def:'Hoàng Tử Bé'},{k:'read',label:'Trang đã đọc',type:'number',def:72},{k:'total',label:'Tổng số trang',type:'number',def:120}],
  draw(ctx,w,h,P){const tot=Math.max(1,num(P.total)),rd=Math.min(tot,Math.max(0,num(P.read))),p=rd/tot;KIT.art(ctx,0,0,Math.round(w*.34),h,(c,W2,H2)=>{const u=c.u;S.book(c,10*u,H2*.4,W2-20*u,H2*.4);S.rrect(c,16*u,H2*.24,W2-36*u,H2*.16,3*u);S.rrect(c,22*u,H2*.1,W2-48*u,H2*.14,3*u,R(),true);S.cup(c,W2-22*u,H2*.92,10*u);});
    const x=Math.round(w*.34)+6;KIT.label(ctx,'ĐANG ĐỌC',x,16,{size:10,color:R(),track:1.4});KIT.text(ctx,P.book||'',x,20,w-x-8,34,{max:16,min:10,weight:800,fam:'serif',maxLines:2});
    ctx.strokeStyle=K;ctx.lineWidth=1.5;ctx.strokeRect(x+.5,h-36.5,w-x-9,10);ctx.fillStyle=K;ctx.fillRect(x+2,h-35,Math.round((w-x-12)*p),7);KIT.font(ctx,11,700,'sans');ctx.fillText(`${rd}/${tot} trang · ${Math.round(p*100)}%`,x,h-12);}});
add({id:'g-thoiquen',coll:'goals',name:'Theo dõi thói quen',timely:true,fields:[{k:'items',label:'Thói quen | ngày đạt T2→CN (1=đạt)',type:'textarea',def:'Dậy sớm | 1101100\nĐi bộ | 1111000\nĐọc sách | 1011100'}],
  draw(ctx,w,h,P){const it=lines(P.items).slice(0,4).map(s=>{const [n,b]=s.split('|');return [n.trim(),(b||'').trim()];}),k=(new Date().getDay()+6)%7,lx=Math.round(w*.34),cw=(w-lx-6)/7;
    KIT.label(ctx,'THÓI QUEN TUẦN NÀY',8,13,{size:10,track:1.2});['T2','T3','T4','T5','T6','T7','CN'].forEach((t,i)=>{KIT.font(ctx,9,800,'sans');ctx.fillStyle=i===k?R():K;ctx.textAlign='center';ctx.fillText(t,lx+i*cw+cw/2,28);ctx.textAlign='left';});
    const rh=(h-34)/Math.max(1,it.length);it.forEach(([n,b],r)=>{const y=34+r*rh+rh/2;KIT.font(ctx,11,700,'sans');ctx.fillStyle=K;ctx.fillText(n.length>14?n.slice(0,14)+'…':n,8,y+4);
      for(let i=0;i<7;i++){const cx=lx+i*cw+cw/2,on=b[i]==='1';ctx.beginPath();ctx.arc(cx,y,Math.min(cw,rh)*.32,0,Math.PI*2);ctx.lineWidth=1.4;ctx.strokeStyle=K;if(on){ctx.fillStyle=i===k?R():K;ctx.fill();}else ctx.stroke();}});}});
add({id:'g-30ngay',coll:'goals',name:'Thử thách 30 ngày',fields:[{k:'title',label:'Thử thách',type:'text',def:'Không đồ ngọt'},{k:'n',label:'Đã hoàn thành (ngày)',type:'range',def:12,min:0,max:30,step:1}],
  draw(ctx,w,h,P){const n=Math.max(0,Math.min(30,num(P.n))),gx=Math.round(w*.38),cols=10,cw=(w-gx-6)/cols,rh=(h-12)/3;KIT.label(ctx,'THỬ THÁCH 30 NGÀY',8,16,{size:10,color:R(),track:1.2});
    KIT.text(ctx,P.title||'',8,22,gx-14,h*.45,{max:16,min:10,weight:800,maxLines:3});KIT.font(ctx,28,800,'round');ctx.fillStyle=K;ctx.fillText(String(n),8,h-10);const nw=ctx.measureText(String(n)).width;KIT.font(ctx,11,700,'sans');ctx.fillText('/30 ngày',8+nw+3,h-12);
    for(let i=0;i<30;i++){const x=gx+(i%cols)*cw+cw/2,y=6+Math.floor(i/cols)*rh+rh/2,r=Math.min(cw,rh)*.38;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.lineWidth=1.2;ctx.strokeStyle=K;
      if(i<n){ctx.fillStyle=i===n-1?R():K;ctx.fill();}else ctx.stroke();}}});
add({id:'g-vuon',coll:'goals',name:'Khu vườn mục tiêu',fields:[{k:'goal',label:'Mục tiêu',type:'text',def:'Học tiếng Anh mỗi ngày'},{k:'p',label:'Tiến độ',type:'range',def:60,min:0,max:100,step:5,unit:'%'}],
  draw(ctx,w,h,P){const p=Math.max(0,Math.min(100,num(P.p))),st=p<15?0:p<40?1:p<70?2:p<100?3:4;KIT.art(ctx,0,0,Math.round(w*.4),h,(c,W2,H2)=>{const u=c.u,x=W2/2,py=H2-6*u;S.poly(c,[[x-24*u,py-30*u],[x+24*u,py-30*u],[x+18*u,py],[x-18*u,py]]);S.heart(c,x,py-14*u,6*u);
      const top=py-30*u-[6,30,58,84,96][st]*u;if(st===0){S.ell(c,x,py-33*u,6*u,4*u,K,false);return;}S.lw(c,2.4);S.line(c,[[x,py-30*u],[x,top]]);S.lw(c,2);
      for(let i=0;i<st;i++){S.leaf(c,x,py-40*u-i*20*u,16*u,-.6-(i%2)*.2);S.leaf(c,x,py-46*u-i*20*u,16*u,Math.PI+.6);}if(st>=3)S.flower(c,x,top,st===4?12*u:8*u,R());if(st===4)for(const a of [-1,1])S.sparkle(c,x+a*34*u,top+10*u,6*u);});
    const x=Math.round(w*.4)+4;KIT.label(ctx,'KHU VƯỜN MỤC TIÊU',x,16,{size:10,color:R(),track:1.2});KIT.text(ctx,P.goal||'',x,20,w-x-8,40,{max:15,min:10,weight:800,maxLines:3});
    KIT.font(ctx,11,700,'sans');ctx.fillStyle=K;ctx.fillText(['Mới gieo hạt','Đã nảy mầm','Đang lớn','Sắp nở hoa','Nở hoa rồi! 🌸'.replace(' 🌸','')][st]+` · ${p}%`,x,h-10);}});
add({id:'g-thanh',coll:'goals',name:'Thanh tiến độ cá nhân',fields:[{k:'goal',label:'Mục tiêu',type:'text',def:'Giảm 5kg trước Tết'},{k:'p',label:'Tiến độ',type:'range',def:45,min:0,max:100,step:5,unit:'%'},{k:'kind',label:'Nhân vật',type:'select',def:'meo',opts:KIND_OPTS}],
  draw(ctx,w,h,P){const p=Math.max(0,Math.min(100,num(P.p)));KIT.label(ctx,'TIẾN ĐỘ CỦA MÌNH',8,15,{size:10,color:R(),track:1.2});KIT.text(ctx,P.goal||'',8,19,w-16,24,{max:15,min:10,weight:800,maxLines:1});
    KIT.art(ctx,0,44,w,h-44,(c,W2,H2)=>{const u=c.u,bx=14*u,bw=W2-28*u,by=H2*.6;S.lw(c,3);S.rrect(c,bx,by,bw,18*u,9*u);c.fillStyle=K;c.beginPath();c.roundRect(bx+4*u,by+4*u,Math.max(10*u,(bw-8*u)*p/100),10*u,5*u);c.fill();
      for(const m of [25,50,75])S.line(c,[[bx+bw*m/100,by+22*u],[bx+bw*m/100,by+28*u]]);S.star(c,bx+bw,by-14*u,10*u,p>=100?R():K);KIT.chara(c,P.kind,{x:Math.max(bx+20*u,Math.min(bx+bw-20*u,bx+(bw-8*u)*p/100)),y:by-2*u,s:fitS(c,H2,.95),mood:p>=100?'tuyet':'vui',pose:p>=100?'gio':'vay'});});
    KIT.font(ctx,11,800,'sans');ctx.fillStyle=K;ctx.textAlign='right';ctx.fillText(p+'%',w-8,h-4);ctx.textAlign='left';}});
add({id:'g-thanhtich',coll:'goals',name:'Bảng thành tích',fields:[{k:'items',label:'Thành tích (mỗi dòng, tối đa 6)',type:'textarea',def:'7 ngày dậy sớm\nĐọc xong 2 cuốn\nChạy 5km\nTiết kiệm 1 triệu\nHọc 30 từ mới\nNấu món mới'}],
  draw(ctx,w,h,P){const it=lines(P.items).slice(0,6),cols=3,cw=(w-8)/cols,rh=(h-20)/2;KIT.label(ctx,'BẢNG THÀNH TÍCH',8,14,{size:10,color:R(),track:1.4});
    KIT.art(ctx,0,18,w,h-18,(c,W2,H2)=>{const u=c.u;it.forEach((_,i)=>{const x=(4+(i%cols)*cw+cw/2)*2,y=(Math.floor(i/cols)*rh+rh*.42)*2;S.circ(c,x,y,15*u,W,true);S.circ(c,x,y,11*u,null,true);S.star(c,x,y,8*u,i===0?R():K);});});
    it.forEach((t,i)=>KIT.text(ctx,t,4+(i%cols)*cw,18+Math.floor(i/cols)*rh+rh*.42+9,cw,rh*.42,{max:10,min:7,weight:700,fam:'sans',align:'center',maxLines:2,lh:1.05}));}});
add({id:'g-chuoi',coll:'goals',name:'Chuỗi ngày duy trì',fields:[{k:'habit',label:'Thói quen',type:'text',def:'Thiền 10 phút'},{k:'n',label:'Số ngày liên tiếp',type:'number',def:21}],
  draw(ctx,w,h,P){const n=Math.max(0,num(P.n));KIT.art(ctx,0,0,Math.round(w*.34),h,(c,W2,H2)=>{const u=c.u,x=W2/2,b=H2*.9;c.beginPath();c.moveTo(x,b);c.bezierCurveTo(x-W2*.42,b,x-W2*.3,H2*.45,x-W2*.08,H2*.12);c.bezierCurveTo(x-W2*.02,H2*.35,x+W2*.12,H2*.3,x+W2*.12,H2*.22);c.bezierCurveTo(x+W2*.42,H2*.48,x+W2*.38,b,x,b);c.fillStyle=R();c.fill();S.lw(c,2.4);c.stroke();
      c.beginPath();c.moveTo(x,b-6*u);c.bezierCurveTo(x-W2*.2,b-6*u,x-W2*.14,H2*.6,x,H2*.45);c.bezierCurveTo(x+W2*.16,H2*.6,x+W2*.2,b-6*u,x,b-6*u);c.fillStyle=W;c.fill();c.stroke();});
    const x=Math.round(w*.34)+6;KIT.label(ctx,'CHUỖI NGÀY',x,16,{size:10,color:R(),track:1.4});KIT.font(ctx,46,800,'round');ctx.fillStyle=K;ctx.fillText(String(n),x,h*.68);const nw=ctx.measureText(String(n)).width;KIT.font(ctx,13,700,'sans');ctx.fillText('ngày',x+nw+6,h*.66);
    KIT.text(ctx,P.habit||'',x,h*.74,w-x-8,h*.24,{max:13,min:9,weight:700,fam:'sans',maxLines:2});}});
// Đã bỏ khỏi thư viện theo yêu cầu: Little Mood, Pin cảm xúc, Pixel World, Little Goals
window.NT_TEMPLATES=T.filter(t=>!['mood','battery','pixel','goals'].includes(t.coll));
})();
