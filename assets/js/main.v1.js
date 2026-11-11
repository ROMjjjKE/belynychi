
(function(){
  'use strict';
  /* ---------- меню ---------- */
  var burger=document.getElementById('burger'), drawer=document.getElementById('drawer'), closeBtn=document.getElementById('drawerClose');
  function openD(){ if(!drawer) return; drawer.classList.add('is-open'); document.body.classList.add('is-locked'); if(burger) burger.setAttribute('aria-expanded','true'); if(closeBtn) closeBtn.focus(); }
  function closeD(){ if(!drawer) return; drawer.classList.remove('is-open'); document.body.classList.remove('is-locked'); if(burger){burger.setAttribute('aria-expanded','false'); burger.focus();} }
  if(burger) burger.addEventListener('click', openD);
  if(closeBtn) closeBtn.addEventListener('click', closeD);
  if(drawer){ drawer.addEventListener('click', function(e){ if(e.target===drawer) closeD(); });
    drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeD); }); }
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeD(); });
  window.addEventListener('resize', function(){ if(window.innerWidth>1024) closeD(); });

  function m2(n){ return (Math.round(n*10)/10).toString().replace('.',','); }
  function fmt(min){ return min>=60 ? Math.floor(min/60)+' ч '+String(min%60).padStart(2,'0')+' мин' : min+' мин'; }

  /* ---------- расчёт поездки ---------- */
  function initRide(id){
    var city=document.getElementById(id+'City'), one=document.getElementById(id+'One'), back=document.getElementById(id+'Back'),
        pax=document.getElementById(id+'Pax'), time=document.getElementById(id+'Time'), list=document.getElementById(id+'List'), go=document.getElementById(id+'Go');
    if(!city||!one||!back) return;
    var rt=false;
    function paint(){
      var d=+city.value, dist = rt ? d*2 : d, mins = Math.round(d/70*60)+15; if(rt) mins = mins*2+20;
      var nm = city.options[city.selectedIndex].text.split(' — ')[0];
      time.textContent = fmt(mins);
      var rows=[['Направление', nm+(rt?' — и обратно':'')],['В одну сторону', '≈ '+d+' км'],['Всего в пути','≈ '+dist+' км'],['Дорога', rt?'два рейса с ожиданием':'без остановок'],['Пассажиров', pax?pax.value:'—']];
      list.innerHTML = rows.map(function(r){ return '<div><span>'+r[0]+'</span><b>'+r[1]+'</b></div>'; }).join('');
      if(go){
        var txt='Здравствуйте! Такси из Белынич: '+nm+(rt?', туда и обратно':'')+'. Пассажиров: '+(pax?pax.value:1)+'. Подскажите стоимость и время.';
        go.href='https://wa.me/375447023646?text='+encodeURIComponent(txt);
      }
    }
    [city,pax].forEach(function(el){ if(el) el.addEventListener('input', paint); if(el) el.addEventListener('change', paint); });
    function pick(on,off,val){ rt=val; on.classList.add('is-on'); off.classList.remove('is-on'); paint(); }
    one.addEventListener('click', function(){ pick(one,back,false); });
    back.addEventListener('click', function(){ pick(back,one,true); });
    paint();
  }
  initRide('calc'); initRide('calc2');

  /* ---------- подбор авто ---------- */
  var pickBox=document.getElementById('pick');
  if(pickBox){
    var st={pax:'1',lug:'s',dir:'city'};
    var T=document.getElementById('pickT'), L=document.getElementById('pickList');
    var LUG={s:'рюкзак или небольшая сумка',m:'чемоданы',l:'много вещей, коляска или крупногабарит'};
    var DIR={city:'по городу и району',inter:'между городами',abroad:'за границу'};
    function group(id,key){
      var box=document.getElementById(id); if(!box) return;
      box.addEventListener('click', function(e){
        var b=e.target.closest('button[data-v]'); if(!b) return;
        box.querySelectorAll('button').forEach(function(x){ x.classList.remove('is-on'); });
        b.classList.add('is-on'); st[key]=b.getAttribute('data-v'); paintPick();
      });
    }
    function paintPick(){
      var p=+st.pax, v=p+' '+(p===1?'пассажир':(p<5?'пассажира':'пассажиров'));
      T.textContent='Легковая, '+v;
      var rows=[['Багаж', LUG[st.lug]],['Маршрут', DIR[st.dir]]];
      if(p>=4 && st.lug!=='s') rows.push(['Внимание','вчетвером и с крупным багажом тесно — предупредите при заказе, подберём вариант']);
      if(st.dir!=='city') rows.push(['Обратно','договоримся об обратной дороге сразу']);
      if(st.dir==='abroad') rows.push(['Документы','проверьте паспорт, визы и сроки до поездки']);
      if(st.dir==='inter'&&st.lug==='l') rows.push(['Подача','нужно время уложить вещи — скажите заранее']);
      rows.push(['Цена','называем до поездки, по маршруту']);
      L.innerHTML=rows.map(function(r){ return '<div><span>'+r[0]+'</span><b>'+r[1]+'</b></div>'; }).join('');
    }
    group('pax','pax'); group('lug','lug'); group('dir','dir'); paintPick();
  }

  /* ---------- форма ---------- */
  var f=document.getElementById('lead'), msg=document.getElementById('formMsg');
  if(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var d=new FormData(f), need=['name','phone','to'], ok=true;
      need.forEach(function(k){ var el=f.querySelector('[name="'+k+'"]'); if(!d.get(k)||!String(d.get(k)).trim()){ ok=false; if(el){el.style.borderColor='#B3261E'; el.focus();} } else { var el2=f.querySelector('[name="'+k+'"]'); if(el2) el2.style.borderColor=''; } });
      if(!ok){ if(msg){ msg.style.color='#B3261E'; msg.textContent='Заполните имя, телефон и куда едем.'; } return; }
      var txt='Заявка с сайта такси Белыничи.\nИмя: '+d.get('name')+'\nТелефон: '+d.get('phone')+
        '\nОткуда: '+(d.get('from')||'Белыничи')+'\nКуда: '+d.get('to')+'\nКогда: '+(d.get('when')||'—')+
        '\nДетали: '+(d.get('msg')||'—');
      if(msg){ msg.style.color=''; msg.textContent='Открываем WhatsApp — останется нажать «отправить».'; }
      window.open('https://wa.me/375447023646?text='+encodeURIComponent(txt), '_blank');
      f.reset();
    });
  }
})();
