const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
for (const reduced of [false,true]) {
  const frames = [], events = {}, timers = new Map(); let id = 0;
  function element(tagName='DIV') {
    const classes = new Set();
    return {tagName,style:{},dataset:{},hidden:false,inert:false,events:{},classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)},
      setAttribute(){},removeAttribute(){},getBoundingClientRect(){return{};},focus(){},
      addEventListener(name,fn){this.events[name]=fn;},removeEventListener(name){delete this.events[name];},
      remove(){const i=frames.indexOf(this);if(i>=0)frames.splice(i,1);},
      contentWindow:{messages:[],focus(){},postMessage(message){this.messages.push(message);}},};
  }
  const surface=element();surface.dataset.pageSurface='home';
  const context={URL,location:{href:'http://localhost/index.html'},matchMedia:()=>({matches:reduced}),
    document:{querySelector:s=>s==='[data-page-surface]'?surface:null,querySelectorAll:()=>[],documentElement:{style:{setProperty(){}}},createElement:()=>element('IFRAME'),body:{append:f=>frames.push(f)}},
    setTimeout(fn){timers.set(++id,fn);return id;},clearTimeout:id=>timers.delete(id)};
  context.window=context;context.parent=context;context.addEventListener=(name,fn)=>events[name]=fn;
  vm.createContext(context);vm.runInContext(fs.readFileSync(`${__dirname}/page-transition.js`,'utf8'),context);
  const end=out=>{if(!reduced)out.events.transitionend({target:out,propertyName:'opacity'});};
  context.PortfolioTransition.navigate('explore.html');
  context.PortfolioTransition.navigate('explore.html');assert.equal(frames.length,1);
  let explore=frames[0];assert.equal(surface.hidden,false);explore.events.load();end(surface);assert.equal(surface.hidden,true);assert.equal(explore.inert,false);
  for(let i=0;i<3;i++) {
    events.message({source:explore.contentWindow,data:{type:'portfolio:navigate',url:'http://localhost/project.html?id=project-3'}});
    const detail=frames[1];detail.events.load();end(explore);assert.equal(frames.length,1);assert.equal(frames[0],detail);
    let prevented=false,stopped=false;
    events.wheel({deltaY:120,deltaMode:0,preventDefault(){prevented=true;},stopImmediatePropagation(){stopped=true;}});
    assert.equal(prevented,true);assert.equal(stopped,true);
    assert.equal(detail.contentWindow.messages.at(-1).type,'portfolio:wheel');
    assert.equal(detail.contentWindow.messages.at(-1).deltaY,120);
    events.message({source:detail.contentWindow,data:{type:'portfolio:navigate',url:'http://localhost/explore.html?project=project-3'}});
    explore=frames[1];explore.events.load();end(detail);assert.equal(frames.length,1);assert.ok(explore.src.endsWith('project=project-3'));
  }
  events.message({source:{},data:{type:'portfolio:navigate',url:'http://localhost/index.html'}});assert.equal(frames.length,1);
  events.message({source:explore.contentWindow,data:{type:'portfolio:navigate',url:'http://localhost/index.html'}});end(explore);
  assert.equal(frames.length,0);assert.equal(surface.hidden,false);assert.equal(surface.inert,false);
}
console.log('PASS: four fade routes, load-before-fade, duplicate guard, selection URL, no frame accumulation, source validation, reduced motion');
