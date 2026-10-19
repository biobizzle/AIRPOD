(() => {
  'use strict';
  const root=document.documentElement, sceneNodes=[...document.querySelectorAll('.scene')];
  const nav=[...document.querySelectorAll('.nav button')], count=document.querySelector('#count'),
        connect=document.querySelector('.scene-connect'), menu=document.querySelector('#menu'),
        navElement=document.querySelector('#nav'), win=document.querySelector('#window'),
        autoplayButton=document.querySelector('#autoplay'), modal=document.querySelector('#modal'),
        modalContent=document.querySelector('#modalContent');
  const durations=[5200,3400,3400,6500];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let position=0, playing=!reduced, cycleId, phaseId, lastScroll=0, touchY=null, switchColor=false, activeUser=false;
  function halt(){clearTimeout(cycleId);clearTimeout(phaseId)}
  function syncButton(){autoplayButton.innerHTML=playing?'PAUSE MOTION <span>Ⅱ</span>':'PLAY MOTION <span>▶</span>';autoplayButton.setAttribute('aria-pressed',String(playing))}
  function schedule(){halt();if(!playing||document.hidden)return;if(position===3){phaseId=setTimeout(()=>connect.classList.add('green-phase'),2600)}cycleId=setTimeout(()=>navigate((position+1)%4,false),durations[position])}
  function navigate(index,manual=true){position=(index+4)%4;
    for(let i=0;i<4;i++){let active=i===position;sceneNodes[i].classList.toggle('is-active',active);sceneNodes[i].toggleAttribute('inert',!active);sceneNodes[i].setAttribute('aria-hidden',String(!active));nav[i].classList.toggle('on',active);}
    count.textContent=`${String(position+1).padStart(2,'0')} / 04`;
    navElement.classList.remove('is-open');menu.setAttribute('aria-expanded','false');
    connect.classList.remove('green-phase');
    if(manual){playing=false;syncButton()}
    schedule();
  }
  document.querySelectorAll('[data-target]').forEach(item=>item.addEventListener('click',e=>{e.preventDefault();navigate(Number(item.dataset.target));}));
  document.querySelector('#previous').addEventListener('click',()=>navigate(position-1));
  document.querySelector('#next').addEventListener('click',()=>navigate(position+1));
  autoplayButton.addEventListener('click',()=>{playing=!playing;syncButton();schedule()});
  menu.addEventListener('click',()=>{const open=navElement.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open))});
  win.addEventListener('wheel',e=>{if(modal.open || Math.abs(e.deltaY)<17)return;e.preventDefault();const now=performance.now();if(now-lastScroll<850)return;lastScroll=now;navigate(position+(e.deltaY>0?1:-1))},{passive:false});
  win.addEventListener('touchstart',e=>{if(e.touches.length===1)touchY=e.touches[0].clientY},{passive:true});
  win.addEventListener('touchend',e=>{if(touchY===null)return;const delta=touchY-e.changedTouches[0].clientY;touchY=null;if(Math.abs(delta)>80)navigate(position+(delta>0?1:-1))},{passive:true});
  document.addEventListener('keydown',e=>{if(modal.open||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;if(['ArrowRight','ArrowDown','PageDown'].includes(e.key)){e.preventDefault();navigate(position+1)}if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();navigate(position-1)}});
  document.addEventListener('visibilitychange',schedule);
  document.querySelector('#colours').addEventListener('click',()=>{switchColor=!switchColor;root.style.setProperty('--lime',switchColor?'#e6a3ff':'#affb18');document.querySelectorAll('.ear img,.macro-ear img,.macro-ear-back img').forEach(img=>img.style.filter=switchColor?'hue-rotate(102deg)':'none')});
  function openModal(html){playing=false;syncButton();halt();modalContent.innerHTML=html;modal.showModal()}
  modal.addEventListener('close',()=>{let video=modal.querySelector('video');if(video)video.pause()});
  document.querySelector('#watch').addEventListener('click',()=>openModal(`<p class="eyebrow">ORIGINAL DESIGN REFERENCE</p><h2>THE MOTION STUDY</h2><video controls autoplay playsinline preload="metadata"><source src="assets/reference.mp4" type="video/mp4"></video><p>The supplied 19-second reference video.</p>`));
  document.querySelector('#buy').addEventListener('click',()=>openModal(`<p class="eyebrow">SOUNDAR / CONCEPT</p><h2>NO WIRES.<br>NO STOPPING YOU.</h2><p>This is a front-end reconstruction of a motion-design concept, not a live store. No price, stock, or checkout has been supplied.</p><button class="dialog-btn" id="explore" type="button">Explore the product →</button>`));
  modalContent.addEventListener('click',e=>{if(e.target.id==='explore'){modal.close();navigate(2)}});
  syncButton();schedule();
})();
