// 모든 이동을 최상위 문서에서 처리합니다. 프레임은 중첩하지 않고 교체합니다.
(() => {
  'use strict';
  const surface = document.querySelector('[data-page-surface]');
  if (!surface) return;
  const home = surface.dataset.pageSurface === 'home';
  let activeFrame = null, inputFrame = null, busy = false;
  window.projectTransitionBusy = false;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = () => Number(window.coverData?.transitionMs) || 1000;
  const focusPage = () => document.querySelector('#start, #scene, #back')?.focus({ preventScroll: true });
  function setBusy(value) { busy = value; window.projectTransitionBusy = value; }
  function show(element) {
    element.hidden = false; element.inert = false;
    element.removeAttribute('aria-hidden'); element.removeAttribute('tabindex');
    element.classList.remove('page-leaving'); element.style.zIndex = '1';
  }
  function fade(outgoing, incoming, finish) {
    incoming.classList.remove('page-leaving');
    incoming.hidden = false; incoming.inert = false; incoming.style.zIndex = '0';
    incoming.removeAttribute('aria-hidden'); incoming.removeAttribute('tabindex');
    outgoing.style.zIndex = '1'; outgoing.inert = true;
    const ms = duration();
    document.documentElement.style.setProperty('--page-fade-duration', `${ms}ms`);
    let done = false, timer;
    const complete = () => {
      if (done) return; done = true; clearTimeout(timer);
      outgoing.removeEventListener('transitionend', onEnd);
      finish(); show(incoming); inputFrame = null; setBusy(false);
      if (incoming.tagName === 'IFRAME') {
        incoming.contentWindow.focus();
        incoming.contentWindow.postMessage({ type: 'portfolio:shown' }, '*');
      } else focusPage();
    };
    const onEnd = event => { if (event.target === outgoing && event.propertyName === 'opacity') complete(); };
    if (reduced()) { complete(); return; }
    outgoing.addEventListener('transitionend', onEnd);
    // Force the outgoing layer's visible state to be committed before changing opacity.
    outgoing.getBoundingClientRect();
    outgoing.classList.add('page-leaving'); timer = setTimeout(complete, ms + 80);
  }
  function navigate(url) {
    if (busy) return;
    const target = new URL(url, location.href);
    if (!['index.html', 'explore.html', 'project.html'].includes(target.pathname.split('/').pop())) return;
    setBusy(true);
    // Child pages delegate to the host, so detail and return routes never nest frames.
    if (parent !== window) {
      parent.postMessage({ type: 'portfolio:navigate', url: target.href }, '*');
      return;
    }
    const outgoing = activeFrame || surface;
    if (home && target.pathname.endsWith('/index.html')) {
      if (!activeFrame) { setBusy(false); return; }
      fade(outgoing, surface, () => { outgoing.remove(); activeFrame = null; });
      return;
    }
    const incoming = document.createElement('iframe');
    incoming.className = 'page-frame'; incoming.title = target.pathname.endsWith('/project.html') ? '프로젝트 상세' : '포트폴리오';
    incoming.dataset.page = target.pathname.split('/').pop();
    incoming.inert = true; incoming.tabIndex = -1; incoming.setAttribute('aria-hidden', 'true');
    let timeout, loaded = false;
    incoming.addEventListener('load', () => {
      if (loaded) return; loaded = true; clearTimeout(timeout);
      inputFrame = incoming;
      fade(outgoing, incoming, () => {
        if (activeFrame) outgoing.remove(); else outgoing.hidden = true;
        activeFrame = incoming;
      });
    });
    incoming.src = target.href; document.body.append(incoming);
    timeout = setTimeout(() => {
      if (loaded) return;
      incoming.remove(); setBusy(false); outgoing.inert = false;
      location.href = target.href;
    }, 15000);
  }
  window.PortfolioTransition = { navigate };
  window.openProjectPage = navigate;
  window.addEventListener('message', event => {
    if (event.data?.type === 'portfolio:wheel' && event.source === parent && surface.dataset.pageSurface === 'detail') {
      const unit = event.data.deltaMode === 1 ? 16 : event.data.deltaMode === 2 ? innerHeight : 1;
      const top = Number(event.data.deltaY) * unit;
      if (Number.isFinite(top)) window.scrollBy({ top, left: 0, behavior: 'instant' });
      return;
    }
    if (event.data?.type === 'portfolio:shown' && event.source === parent) { setBusy(false); focusPage(); return; }
    if (event.data?.type !== 'portfolio:navigate' || !activeFrame || event.source !== activeFrame.contentWindow) return;
    navigate(event.data.url);
  });
  // 프레임 교체 직후 커서가 그대로여서 휠이 호스트에 도착해도 즉시 상세로 전달합니다.
  // 상세 문서 안에서 발생한 휠은 프레임 경계를 넘어 버블링하지 않으므로 중복되지 않습니다.
  window.addEventListener('wheel', event => {
    const frame = inputFrame || activeFrame;
    if (parent !== window || !frame || frame.dataset.page !== 'project.html' || event.ctrlKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    frame.contentWindow.postMessage({ type: 'portfolio:wheel', deltaY: event.deltaY, deltaMode: event.deltaMode }, '*');
  }, { passive: false });
  document.querySelectorAll('[data-fade-link]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
      event.preventDefault(); navigate(link.href);
    });
  });
})();
