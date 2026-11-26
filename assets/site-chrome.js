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

/* Sign in: a nav button that opens a chooser for the apps that have a web version. */
(function(){
  var nav=document.querySelector('nav.gn');if(!nav)return;
  var menu=nav.querySelector('.gn-menu'),cta=nav.querySelector('.gn-cta');if(!menu)return;
  var root=(location.pathname.indexOf('/')===0)?'/':'';
  var btn=document.createElement('button');
  btn.type='button';btn.className='gn-signin';btn.setAttribute('aria-haspopup','dialog');
  btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>Sign in';
  if(cta)menu.insertBefore(btn,cta);else menu.appendChild(btn);

  var m=document.createElement('div');
  m.className='gn-modal';m.hidden=true;
  m.innerHTML='<div class="gn-modal-card" role="dialog" aria-modal="true" aria-labelledby="gn-modal-t">'+
    '<button type="button" class="gn-modal-x" aria-label="Close">&times;</button>'+
    '<h2 id="gn-modal-t">Sign in</h2><p>Choose the app you want to open on the web. You\'ll sign in with the Apple ID you use on your iPhone.</p>'+
    '<a class="gn-pick" href="'+root+'decisio/app/"><img src="'+root+'assets/brand/decisio-mark-128.webp" alt="" width="44" height="44"><span><b>DECISIO.ai</b><small>Actions, decisions and meeting records</small></span><i>&rsaquo;</i></a>'+
    '<a class="gn-pick" href="'+root+'app/"><img src="'+root+'assets/mileguard/mg-icon-128.webp" alt="" width="44" height="44"><span><b>MileGuard</b><small>Drives, costs and mileage reports · Pro</small></span><i>&rsaquo;</i></a>'+
    '<p class="gn-modal-fine">Your data is read from your own iCloud, in your browser. Guardian Apps never sees it.</p></div>';
  document.body.appendChild(m);

  var last=null;
  function open(){last=document.activeElement;m.hidden=false;document.body.style.overflow='hidden';nav.classList.remove('open');m.querySelector('.gn-pick').focus();}
  function close(){m.hidden=true;document.body.style.overflow='';if(last)last.focus();}
  btn.addEventListener('click',open);
  m.addEventListener('click',function(e){if(e.target===m||e.target.closest('.gn-modal-x'))close();});
  document.addEventListener('keydown',function(e){if(!m.hidden&&e.key==='Escape')close();});
  if(location.hash==='#signin')open();
})();
