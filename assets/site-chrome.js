(function(){
  var nav=document.querySelector('nav.gn');if(!nav)return;
  var burger=nav.querySelector('.gn-burger'),dd=nav.querySelector('.gn-dd'),ddBtn=nav.querySelector('.gn-dd-btn');
  if(burger)burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o?'true':'false');});
  if(ddBtn)ddBtn.addEventListener('click',function(e){e.stopPropagation();var o=dd.classList.toggle('open');ddBtn.setAttribute('aria-expanded',o?'true':'false');});
  function closeAll(){if(dd){dd.classList.remove('open');ddBtn.setAttribute('aria-expanded','false');}}
  document.addEventListener('click',function(e){if(dd&&!dd.contains(e.target))closeAll();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeAll();if(nav.classList.contains('open')){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.focus();}}});
  nav.querySelectorAll('.gn-menu a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');if(burger)burger.setAttribute('aria-expanded','false');closeAll();});});
})();
