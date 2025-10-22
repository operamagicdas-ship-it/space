
(function(){
  const fab=document.getElementById('fab');
  const panel=document.getElementById('slidePanel');
  const closeBtn=document.getElementById('closeBtn');
  let pinned=false;

  fab.addEventListener('mouseenter',()=>{ if(!pinned) showPanel(); });
  fab.addEventListener('mouseleave',()=>{ if(!pinned) hidePanel(); });
  panel.addEventListener('mouseenter',()=>{ if(!pinned) showPanel(); });
  panel.addEventListener('mouseleave',()=>{ if(!pinned) hidePanel(); });

  fab.addEventListener('click',()=>{ pinned?hidePanel():showPanel(true); });
  closeBtn.addEventListener('click',()=>hidePanel());

  function showPanel(pin){
    panel.classList.add('visible');
    pinned=!!pin;
  }
  function hidePanel(){
    panel.classList.remove('visible');
    pinned=false;
  }
})();
