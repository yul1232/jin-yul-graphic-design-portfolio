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
    const card=document.createElement('figure');card.className='card';card.draggable=false;card.setAttribute('role','group');card.setAttribute('aria-roledescription','슬라이드');card.setAttribute('aria-label',`${index+1} / ${projects.length}${project.title?`: ${project.title}`:project.thumbnail?': 작품 이미지':': 빈 작품 영역'}`);card.dataset.projectId=project.id;
    if (project.thumbnail) {
      const img = new Image();
      img.alt = project.title || '';
      img.draggable = false;
      img.decoding = 'async';
      if (index === position) img.fetchPriority = 'high';
      img.addEventListener('load', async () => {
        await img.decode().catch(() => {});
        img.classList.add('is-ready');
      }, { once: true });
      img.addEventListener('error', () => img.remove(), { once: true });
      img.src = project.thumbnail;
      card.append(img);
    }
    container.append(card);
    return card;
  });
  const gatsbyIndex = projects.findIndex(project => project.id === 'project-3');
  const kaguyaIndex = projects.findIndex(project => project.id === 'project-4');
  const depthStep = 650;
  const perspective = 1100;
  const sideScale = perspective / (perspective + depthStep);
  const cardSpacing = () => width * (width <= 600 ? .72 : width <= 900 ? .56 : .47);
  let extraPosterGap = 0;

  function measurePosterGap() {
    if (gatsbyIndex < 0 || kaguyaIndex !== gatsbyIndex + 1) return;
    const gatsbyHalf = cards[gatsbyIndex].offsetWidth / 2;
    const kaguyaHalf = cards[kaguyaIndex].offsetWidth / 2;
    const gutter = 8;
    const required = Math.max(
      (gatsbyHalf + gutter) / sideScale + kaguyaHalf,
      (kaguyaHalf + gutter) / sideScale + gatsbyHalf,
    );
    extraPosterGap = Math.max(0, required - cardSpacing());
  }

  document.querySelector('#total').textContent=pad(projects.length);
  function render(){
    const spacing = cardSpacing();
    const crossing = Math.max(0, Math.min(1, position - gatsbyIndex));
    const centered = Math.round(position);
    const activeCard = activeIndex();
    cards.forEach((card, i) => {
      const distance = i - position;
      const magnitude = Math.abs(distance);
      // Keep the current and adjacent cards unchanged, with a longer fade beyond them.
      const opacity = magnitude <= 1
        ? 1 - .71 * magnitude
        : .29 * Math.pow(Math.max(0, 2 - magnitude), .71 / .29);
      const visibility = opacity === 0 ? 'hidden' : 'visible';
      if (card.style.visibility !== visibility) card.style.visibility = visibility;
      if (opacity > 0) {
        const posterOffset = extraPosterGap * (Number(i >= kaguyaIndex) - crossing);
        card.style.transform = `translate(-50%, -50%) translate3d(${distance * spacing + posterOffset}px, 0, ${-depthStep * magnitude}px)`;
      }
      const opacityValue = String(opacity);
      if (card.style.opacity !== opacityValue) card.style.opacity = opacityValue;
      const ariaHidden = String(i !== centered);
      if (card.getAttribute('aria-hidden') !== ariaHidden) card.setAttribute('aria-hidden', ariaHidden);
      const active = i === activeCard;
      if (card.dataset.active !== String(active)) {
        card.classList.toggle('is-active', active);
        card.dataset.active = String(active);
      }
    });
    const destination=animation?animation.to:position;previous.disabled=!projects.length||destination<=0;nextButton.disabled=!projects.length||destination>=last;
    const counter = projects.length ? pad(centered + 1) : '00';
    if (current.textContent !== counter) current.textContent = counter;
    if(!animation&&!cardPress?.moved&&selected!==centered){selected=centered;announcement.textContent=projects.length?`${centered+1} / ${projects.length}${projects[centered].title?`, ${projects[centered].title}`:''}`:'등록된 작품이 없습니다.';}
    canvas.style.transform=`translateX(${motion.matches?0:-position*9}px)`;
  }
  function sample(now) {
    if (animation?.start == null) return;
    const t = Math.max(0, Math.min(1, (now - animation.start) / animation.duration));
    position = animation.from + (animation.to - animation.from) * (1 - Math.pow(1 - t, 3));
    if (t === 1) animation = null;
  }
  function tick(now) {
    frame = 0;
    // Start on the first available frame so delayed image work cannot skip the opening of the slide.
    if (animation && animation.start === null) animation.start = now;
    sample(now);
    render();
    if (animation) schedule();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(tick);}
  function snap(target = Math.round(position)) {
    const destination = clamp(target);
    if (motion.matches) {
      position = destination;
      animation = null;
      render();
      return;
    }
    animation = { from: position, to: destination, start: null, duration: 550 };
    schedule();
  }
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
  scene.addEventListener('pointermove',e=>{if(cardPress?.id!==e.pointerId)return;const press=cardPress;press.lastX=e.clientX;if(!press.moved&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>7){sample(performance.now());press.position=position;animation=null;press.moved=true;scene.classList.add('dragging');}if(press.moved){position=clamp(press.position+(press.x-e.clientX)/travel());schedule();}});
  function openProject(project){const url=`project.html?id=${encodeURIComponent(project.id)}`;if(window.openProjectPage)window.openProjectPage(url);else location.href=url;}
  function release(e){if(cardPress?.id!==e.pointerId)return;const press=cardPress;cardPress=null;scene.classList.remove('dragging');if(press.moved){snap();return;}if(e.type==='pointerup'&&press.clickable&&Math.hypot(e.clientX-press.x,e.clientY-press.y)<=7&&activeIndex()===press.index&&cardAt(e)===cards[press.index])openProject(projects[press.index]);}
  for(const name of ['pointerup','pointercancel','lostpointercapture'])scene.addEventListener(name,release);
  window.addEventListener('keydown',e=>{if(window.projectTransitionBusy||e.ctrlKey||e.metaKey||e.altKey||e.target?.closest?.('input, textarea, select, [contenteditable="true"]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();resetWheel();move(e.key==='ArrowRight'?1:-1);return;}if(e.key==='Enter'&&document.activeElement===scene&&projects.length&&activeIndex()>=0){e.preventDefault();openProject(projects[Math.round(position)]);}});
  function resize(){width=innerWidth;height=innerHeight;if(cardPress?.moved){cardPress.position=position;cardPress.x=cardPress.lastX;}const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*1.1*dpr);canvas.height=Math.round(height*1.1*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);let seed=718;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646;};for(let i=0;i<Math.floor(width*height/3500);i++){const x=random()*width*1.1,y=random()*height*1.1,radius=.25+random()*.65;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);random();/* 난수 소비 순서를 유지해 별의 위치와 크기를 보존합니다. */ctx.fillStyle='#F5F5F5';ctx.fill();}schedule();}
  window.addEventListener('resize', () => {
    resize();
    measurePosterGap();
  });
  if (gatsbyIndex >= 0 && kaguyaIndex === gatsbyIndex + 1) {
    const posterSizes = new ResizeObserver(() => { measurePosterGap(); schedule(); });
    posterSizes.observe(cards[gatsbyIndex]);
    posterSizes.observe(cards[kaguyaIndex]);
    measurePosterGap();
  }
  motion.addEventListener('change',()=>{if(animation)snap(animation.to);schedule();});resize();
})();
