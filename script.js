(() => {
  'use strict';
  const projects=Array.isArray(window.projects)?window.projects:[];
  const scene=document.querySelector('#scene');if(!scene)return;
  const container=document.querySelector('#cards'),current=document.querySelector('#current'),announcement=document.querySelector('#announcement'),canvas=document.querySelector('#stars'),ctx=canvas.getContext('2d');
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),pad=n=>String(n).padStart(2,'0'),last=Math.max(0,projects.length-1),clamp=n=>Math.max(0,Math.min(last,n));
  const restoreId=new URLSearchParams(location.search).get('project');
  let position=Math.max(0,projects.findIndex(p=>p.id===restoreId)),selected=-1,width=innerWidth,height=innerHeight,animation=null,frame=0,cardPress=null,wheelGesture;
  const previous=document.querySelector('#previous'),nextButton=document.querySelector('#next');
  function resetWheel(){wheelGesture={time:-Infinity,direction:0,total:0,fired:false,amplitude:0};}resetWheel();
  const activeIndex=()=>!animation&&!cardPress?.moved&&Math.abs(position-Math.round(position))<.0001?Math.round(position):-1;
  const cards=projects.map((project,index)=>{
    const card=document.createElement('figure');card.className='card';card.draggable=false;card.setAttribute('role','group');card.setAttribute('aria-roledescription','슬라이드');card.setAttribute('aria-label',`${index+1} / ${projects.length}${project.title?`: ${project.title}`:': 빈 작품 영역'}`);card.dataset.projectId=project.id;
    if(project.thumbnail){const img=new Image();img.alt=project.title||'';img.draggable=false;img.decoding='async';img.src=project.thumbnail;img.addEventListener('error',()=>img.remove(),{once:true});card.append(img);}container.append(card);return card;
  });
  document.querySelector('#total').textContent=pad(projects.length);
  function render(){
    const spacing=width*(width<=600?.72:width<=900?.56:.47);
    cards.forEach((card,i)=>{const distance=i-position,magnitude=Math.abs(distance);card.style.transform=`translate(-50%, -50%) translate3d(${distance*spacing}px, 0, ${-650*magnitude}px)`;card.style.opacity=String(Math.max(0,1-.71*magnitude));card.style.visibility=magnitude>=1.41?'hidden':'visible';card.setAttribute('aria-hidden',String(i!==Math.round(position)));const active=i===activeIndex();card.classList.toggle('is-active',active);card.dataset.active=String(active);});
    const destination=animation?animation.to:position;previous.disabled=!projects.length||destination<=0;nextButton.disabled=!projects.length||destination>=last;
    const next=Math.round(position);current.textContent=projects.length?pad(next+1):'00';if(!animation&&!cardPress?.moved&&selected!==next){selected=next;announcement.textContent=projects.length?`${next+1} / ${projects.length}${projects[next].title?`, ${projects[next].title}`:''}`:'등록된 작품이 없습니다.';}
    canvas.style.transform=`translateX(${motion.matches?0:-position*9}px)`;
  }
  function sample(now){if(animation){const t=Math.min(1,(now-animation.start)/animation.duration);position=animation.from+(animation.to-animation.from)*(1-Math.pow(1-t,3));if(t===1)animation=null;}}
  function tick(now){frame=0;sample(now);render();if(animation)schedule();}
  function schedule(){if(!frame)frame=requestAnimationFrame(tick);}
  function snap(target=Math.round(position)){animation={from:position,to:clamp(target),start:performance.now(),duration:motion.matches?0:550};if(motion.matches){position=animation.to;animation=null;}render();schedule();}
  function move(direction){if(!projects.length||window.projectTransitionBusy)return;const base=animation?animation.to:Math.round(position),target=clamp(base+direction);if(target===base)return;sample(performance.now());cardPress=null;scene.classList.remove('dragging');snap(target);}
  previous.addEventListener('click',()=>{resetWheel();move(-1);});nextButton.addEventListener('click',()=>{resetWheel();move(1);});
  window.addEventListener('wheel',e=>{
    if(window.projectTransitionBusy||e.ctrlKey)return;const unit=e.deltaMode===1?16:e.deltaMode===2?height:1,delta=(Math.abs(e.deltaX||0)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*unit;if(!Number.isFinite(delta)||!delta)return;e.preventDefault();
    const now=performance.now(),direction=Math.sign(delta),amplitude=Math.abs(delta);
    if(now-wheelGesture.time>180||direction!==wheelGesture.direction||(wheelGesture.fired&&wheelGesture.amplitude<20&&amplitude>=40&&amplitude>wheelGesture.amplitude*2.5))resetWheel();
    wheelGesture.time=now;wheelGesture.direction=direction;wheelGesture.amplitude=amplitude;wheelGesture.total+=amplitude;if(!wheelGesture.fired&&wheelGesture.total>=24){wheelGesture.fired=true;move(direction);}
  },{passive:false});
  function cardAt(e){const direct=e.target?.closest?.('.card');if(direct)return direct;return cards.map((card,index)=>({card,depth:Math.abs(index-position)})).sort((a,b)=>a.depth-b.depth).map(item=>item.card).find(card=>{if(card.style.visibility==='hidden'||Number(card.style.opacity)<=0)return false;const r=card.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});}
  scene.addEventListener('dragstart',e=>e.preventDefault());
  scene.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0||!projects.length||cardPress||window.projectTransitionBusy)return;resetWheel();e.preventDefault();const index=cards.indexOf(cardAt(e)),clickable=index>=0&&index===activeIndex();cardPress={id:e.pointerId,index,clickable,x:e.clientX,y:e.clientY,lastX:e.clientX,position,moved:false};scene.setPointerCapture(e.pointerId);scene.focus({preventScroll:true});});
  const travel=()=>Math.max(160,Math.min(width*.58,620));
  scene.addEventListener('pointermove',e=>{if(cardPress?.id!==e.pointerId)return;const press=cardPress;press.lastX=e.clientX;if(!press.moved&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>7){sample(performance.now());press.position=position;animation=null;press.moved=true;scene.classList.add('dragging');}if(press.moved){position=clamp(press.position+(press.x-e.clientX)/travel());render();}});
  function openProject(project){const url=`project.html?id=${encodeURIComponent(project.id)}`;if(window.openProjectPage)window.openProjectPage(url);else location.href=url;}
  function release(e){if(cardPress?.id!==e.pointerId)return;const press=cardPress;cardPress=null;scene.classList.remove('dragging');if(press.moved){snap();return;}if(e.type==='pointerup'&&press.clickable&&Math.hypot(e.clientX-press.x,e.clientY-press.y)<=7&&activeIndex()===press.index&&cardAt(e)===cards[press.index])openProject(projects[press.index]);}
  for(const name of ['pointerup','pointercancel','lostpointercapture'])scene.addEventListener(name,release);
  window.addEventListener('keydown',e=>{if(window.projectTransitionBusy||e.ctrlKey||e.metaKey||e.altKey||e.target?.closest?.('input, textarea, select, [contenteditable="true"]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();resetWheel();move(e.key==='ArrowRight'?1:-1);return;}if(e.key==='Enter'&&document.activeElement===scene&&projects.length&&activeIndex()>=0){e.preventDefault();openProject(projects[Math.round(position)]);}});
  function resize(){width=innerWidth;height=innerHeight;if(cardPress?.moved){cardPress.position=position;cardPress.x=cardPress.lastX;}const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*1.1*dpr);canvas.height=Math.round(height*1.1*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);let seed=718;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646;};for(let i=0;i<Math.floor(width*height/3500);i++){const x=random()*width*1.1,y=random()*height*1.1,radius=.25+random()*.65;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);random();/* 난수 소비 순서를 유지해 별의 위치와 크기를 보존합니다. */ctx.fillStyle='#F5F5F5';ctx.fill();}schedule();}
  window.addEventListener('resize',resize);motion.addEventListener('change',()=>{if(animation)snap(animation.to);schedule();});resize();
})();
