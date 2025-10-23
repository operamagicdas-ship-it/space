// ...hover...
// (function(){
//   const fab=document.getElementById('fab');
//   const panel=document.getElementById('slidePanel');
//   const closeBtn=document.getElementById('closeBtn');
//   let pinned=false;

//   fab.addEventListener('mouseenter',()=>{ if(!pinned) showPanel(); });
//   fab.addEventListener('mouseleave',()=>{ if(!pinned) hidePanel(); });
//   panel.addEventListener('mouseenter',()=>{ if(!pinned) showPanel(); });
//   panel.addEventListener('mouseleave',()=>{ if(!pinned) hidePanel(); });

//   fab.addEventListener('click',()=>{ pinned?hidePanel():showPanel(true); });
//   closeBtn.addEventListener('click',()=>hidePanel());

//   function showPanel(pin){
//     panel.classList.add('visible');
//     pinned=!!pin;
//   }
//   function hidePanel(){
//     panel.classList.remove('visible');
//     pinned=false;
//   }
// })();


// ...click...
// document.addEventListener('DOMContentLoaded', () => {
//   const fab = document.getElementById('fab');
//   const panel = document.getElementById('slidePanel');
//   const closeBtn = document.getElementById('closeBtn');
//   if (!fab || !panel) return;

//   let isOpen = false;

//   function openPanel() {
//     panel.classList.add('open');
//     panel.setAttribute('aria-hidden', 'false');
//     document.documentElement.classList.add('no-scroll');
//     isOpen = true;
//   }

//   function closePanel() {
//     panel.classList.remove('open');
//     panel.setAttribute('aria-hidden', 'true');
//     document.documentElement.classList.remove('no-scroll');
//     isOpen = false;
//   }

//   function togglePanel(e) {
//     e.stopPropagation();
//     isOpen ? closePanel() : openPanel();
//   }

//   fab.addEventListener('click', togglePanel);
//   if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closePanel(); });

//   // Не закрывать при клике внутри панели
//   panel.addEventListener('click', (e) => e.stopPropagation());

//   // Закрыть по Escape
//   document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) closePanel(); });

//   // Закрыть при клике вне панели и кнопки
//   document.addEventListener('click', (e) => {
//     if (!isOpen) return;
//     if (!panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) closePanel();
//   });
// });
document.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById('fab');
  const panel = document.getElementById('slidePanel');
  const closeBtn = document.getElementById('closeBtn');

  console.log('btn-newsletter init', { fab: !!fab, panel: !!panel, closeBtn: !!closeBtn });
  if (!fab || !panel) return;

  let isOpen = false;

  
 function openPanel() {
    panel.classList.add('open');
    panel.classList.remove('visible');
    panel.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
    isOpen = true;
  }

  function closePanel() {
    panel.classList.remove('open');
    panel.classList.remove('visible');
    panel.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
    isOpen = false;
  }

  function togglePanel(e) {
    e.preventDefault();
    e.stopPropagation();
    isOpen ? closePanel() : openPanel();
  }

  fab.addEventListener('click', togglePanel);
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closePanel(); });

  // Не закрывать при клике внутри панели
  panel.addEventListener('click', (e) => e.stopPropagation());

  // Закрыть по Escape
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc') && isOpen) closePanel();
  });

  // Закрыть при клике вне панели и кнопки
  document.addEventListener('click', (e) => {
    if (!isOpen) return;
    if (!panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) closePanel();
  });
});
