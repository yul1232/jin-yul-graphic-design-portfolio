(() => {
  'use strict';
  const data=Array.isArray(window.projects)?window.projects:[],id=new URLSearchParams(location.search).get('id'),index=data.findIndex(project=>String(project.id)===id),project=data[index];
  if(!project){document.querySelector('#title').textContent='프로젝트를 찾을 수 없습니다.';document.querySelector('#intro-button').hidden=true;return;}
  document.querySelector('#back').href=`explore.html?project=${encodeURIComponent(project.id)}`;
  const title=project.title||`PROJECT ${String(index+1).padStart(2,'0')}`;document.title=title;document.querySelector('#title').textContent=title;document.querySelector('#description').textContent=project.description||'프로젝트의 기획 의도와 디자인 콘셉트, 제작 과정에 관한 설명이 들어가는 영역입니다. 추후 실제 프로젝트 내용으로 교체할 예정입니다.';
  function image(box,src,alt){if(!src)return;const img=new Image();img.alt=alt;img.decoding='async';img.addEventListener('load',()=>{box.replaceChildren(img);box.classList.add('has-image');});img.src=src;}
  image(document.querySelector('#cover'),project.cover||project.thumbnail,title);
  const toolsSection = document.querySelector('#used-tools');
  const toolsList = document.querySelector('#tool-logos');
  const catalog = window.projectTools || {};
  const tools = [...new Set(Array.isArray(project.tools) ? project.tools : [])].filter(key => Object.hasOwn(catalog, key));
  tools.forEach(key => {
    const tool = catalog[key];
    const item = document.createElement('span');
    item.setAttribute('role', 'listitem');
    const logo = document.createElement('img');
    logo.src = tool.logo; logo.alt = tool.name; logo.width = 26; logo.height = 26;
    item.append(logo); toolsList.append(item);
  });
  toolsSection.hidden = tools.length === 0;
  const button=document.querySelector('#intro-button'),intro=document.querySelector('#intro');button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));document.querySelector('#sign').textContent=open?'−':'+';intro.inert=!open;intro.classList.toggle('open',open);});
  const visuals=document.querySelector('#visuals'),images=Array.isArray(project.images)&&project.images.length?project.images:Array(5).fill('');images.forEach((src,i)=>{const figure=document.createElement('figure');figure.className='visual';const box=document.createElement('div');box.className='image-box';const label=`PROJECT VISUAL ${String(i+1).padStart(2,'0')}`;box.textContent=label;figure.append(box);visuals.append(figure);image(box,src,`${title} — ${label}`);});
  if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:0,rootMargin:'0px 0px -30px 0px'});[...visuals.children].forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
})();
