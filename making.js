(() => {
  'use strict';
  const trigger = document.querySelector('#making-open');
  const dialog = document.querySelector('#making-dialog');
  if (!trigger || !dialog) return;
  const notify = () => document.dispatchEvent(new CustomEvent('portfolio:modalchange'));
  trigger.addEventListener('click', () => {
    if (dialog.open) return;
    dialog.showModal(); trigger.setAttribute('aria-expanded', 'true'); notify();
  });
  document.querySelector('#making-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus({ preventScroll: true }); notify();
  });
})();
