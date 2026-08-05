// КАДР МИРА: Волынь, 1869 — хата поночі, по канону (піч = чверть хати,
// покуть строго по діагоналі від печі, сволок дає тісноту).
// Зоны — роли мест, общие для всех миров; здесь они выглядят так.

window.KADR = {
  mir: "volyn",
  mesto: "Вербівка над Случчю · Волинь · 1869",

  defs: `<radialGradient id="lamp" cx="46%" cy="72%" r="70%">
            <stop offset="0%" stop-color="#e8a33d" stop-opacity=".42"/>
            <stop offset="40%" stop-color="#b8712f" stop-opacity=".17"/>
            <stop offset="100%" stop-color="#15110d" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="doorlight" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stop-color="#8fa6b5" stop-opacity=".32"/>
            <stop offset="100%" stop-color="#5b6d7a" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="wallg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2b2119"/><stop offset="100%" stop-color="#17120e"/>
          </linearGradient>
          <linearGradient id="floorg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#241b14"/><stop offset="100%" stop-color="#120e0a"/>
          </linearGradient>
          <radialGradient id="vig" cx="50%" cy="50%" r="72%">
            <stop offset="55%" stop-color="#000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000" stop-opacity=".72"/>
          </radialGradient>`,

  svg: `<!-- стіни, сволок, долівка -->
        <rect x="0" y="0" width="760" height="362" fill="url(#wallg)"/>
        <rect x="0" y="356" width="760" height="114" fill="url(#floorg)"/>
        <path d="M0,360 H760" stroke="#3a2c20" stroke-width="1.2"/>
        <rect x="0" y="100" width="760" height="14" fill="#3b2c1c"/>
        <rect x="0" y="114" width="760" height="3" fill="#241a10"/>
        <ellipse cx="70" cy="250" rx="130" ry="165" fill="url(#doorlight)"/>
        <ellipse cx="360" cy="330" rx="300" ry="190" fill="url(#lamp)"/>

        <!-- ДВЕРІ -->
        <g class="hot" data-z="vhod">
          <rect x="18" y="128" width="92" height="232" fill="#0b0e11"/>
          <rect x="18" y="128" width="92" height="232" fill="none" stroke="#463527" stroke-width="3"/>
          <rect x="12" y="120" width="104" height="9" fill="#3d2e21"/>
          <rect x="14" y="352" width="102" height="8" fill="#4a3826"/>
          <circle class="mark" cx="64" cy="170" r="3.4"/>
        </g>

        <!-- РУШНИК на жердці -->
        <g class="hot" data-z="pokaz">
          <rect x="132" y="138" width="70" height="4" fill="#4a3826"/>
          <path d="M140,142 L140,214 L152,222 L164,214 L164,142 Z" fill="#e4dac6"/>
          <path d="M168,142 L168,210 L180,218 L192,210 L192,142 Z" fill="#d9cdb6"/>
          <g fill="#a33a26">
            <rect x="140" y="196" width="24" height="4"/><rect x="140" y="204" width="24" height="3"/>
            <rect x="168" y="192" width="24" height="4"/>
          </g>
          <circle class="mark" cx="166" cy="128" r="3.4"/>
        </g>

        <!-- СКРИНЯ -->
        <g class="hot" data-z="sunduk">
          <path d="M206,306 L306,300 L306,356 L206,358 Z" fill="#5a4127"/>
          <path d="M206,306 L306,300 L306,312 L206,318 Z" fill="#75563a"/>
          <g stroke="#2f2114" stroke-width="2">
            <path d="M230,304 L230,357"/><path d="M282,301 L282,356"/>
          </g>
          <rect x="248" y="326" width="18" height="12" fill="#2b1e13"/>
          <circle class="mark" cx="256" cy="290" r="3.4"/>
        </g>

        <!-- ВІДРО -->
        <g class="hot" data-z="resurs">
          <path d="M316,330 L352,330 L347,362 L321,362 Z" fill="#4e3b28"/>
          <path d="M316,330 L352,330 L352,335 L316,335 Z" fill="#69513a"/>
          <path d="M318,330 C322,314 346,314 350,330" stroke="#7d6a52" stroke-width="2" fill="none"/>
          <circle class="mark" cx="334" cy="316" r="3.4"/>
        </g>

        <!-- ПІЧ — чверть хати -->
        <g class="hot" data-z="ochag">
          <path d="M366,358 L366,196 Q366,164 398,162 L486,162 Q518,164 518,196 L518,358 Z" fill="#cbbfa6"/>
          <path d="M366,358 L366,196 Q366,164 398,162 L420,162 L420,358 Z" fill="#b3a68c"/>
          <path d="M420,162 L420,118 L484,118 L484,162 Z" fill="#bdb096"/>
          <path d="M396,330 L396,282 Q442,256 488,282 L488,330 Z" fill="#150f0a"/>
          <ellipse cx="442" cy="322" rx="28" ry="8" fill="#8a3a16" opacity=".5"/>
          <ellipse cx="442" cy="324" rx="14" ry="4" fill="#c2542c" opacity=".45"/>
          <path d="M358,330 L526,330 L526,344 L358,344 Z" fill="#ddd2ba"/>
          <path d="M366,230 L518,230" stroke="#a3977e" stroke-width="1.5"/>
          <ellipse cx="470" cy="222" rx="15" ry="9" fill="#3a2a1c"/>
          <circle class="mark" cx="442" cy="140" r="3.4"/>
        </g>

        <!-- ПІЛ з дитям -->
        <g class="hot" data-z="dytya">
          <rect x="530" y="300" width="96" height="10" fill="#4a3826"/>
          <rect x="536" y="310" width="9" height="48" fill="#3a2b1d"/>
          <rect x="612" y="310" width="9" height="48" fill="#3a2b1d"/>
          <path d="M540,300 C552,282 568,276 588,276 C608,276 620,284 630,300 Z" fill="#7d6a52"/>
          <ellipse cx="552" cy="288" rx="11" ry="10" fill="#1a130d"/>
          <circle class="mark" cx="588" cy="262" r="3.4"/>
        </g>

        <!-- ВІКНО -->
        <g class="hot" data-z="okno">
          <rect x="546" y="136" width="72" height="66" fill="#141a20"/>
          <rect x="546" y="136" width="72" height="66" fill="none" stroke="#4a3826" stroke-width="4"/>
          <path d="M582,136 L582,202 M546,169 L618,169" stroke="#4a3826" stroke-width="3"/>
          <rect x="548" y="138" width="68" height="62" fill="#2a2119" opacity=".85"/>
          <circle class="mark" cx="582" cy="122" r="3.4"/>
        </g>

        <!-- ПОКУТЬ: образи й свічка (по діагоналі від печі — вісь кадру) -->
        <g class="hot" data-z="altar">
          <path d="M654,124 L740,124 L740,196 L654,196 Z" fill="#3a2a1c"/>
          <path d="M660,130 L734,130 L734,190 L660,190 Z" fill="#6b4a2c"/>
          <ellipse cx="697" cy="152" rx="13" ry="16" fill="#c9a86a" opacity=".65"/>
          <path d="M688,172 L706,172" stroke="#c9a86a" stroke-width="2" opacity=".5"/>
          <path d="M646,124 L748,124 L748,130 L646,130 Z" fill="#e4dac6"/>
          <rect x="716" y="196" width="7" height="22" fill="#e8e0cc"/>
          <ellipse cx="719.5" cy="194" rx="3.6" ry="7" fill="#e8a33d"/>
          <circle class="mark" cx="697" cy="110" r="3.4"/>
        </g>

        <!-- ЛАВА + СТІЛ -->
        <g class="hot" data-z="lavka">
          <rect x="640" y="300" width="112" height="9" fill="#5a4127"/>
          <rect x="646" y="309" width="8" height="46" fill="#3a2b1d"/>
          <rect x="738" y="309" width="8" height="46" fill="#3a2b1d"/>
          <circle class="mark" cx="696" cy="292" r="3.4"/>
        </g>
        <g class="hot" data-z="stol">
          <path d="M628,268 L744,262 L750,278 L628,284 Z" fill="#e4dac6"/>
          <path d="M628,284 L750,278 L750,286 L628,292 Z" fill="#b8a888"/>
          <rect x="640" y="292" width="8" height="64" fill="#4a3826"/>
          <rect x="728" y="288" width="8" height="68" fill="#4a3826"/>
          <ellipse cx="668" cy="272" rx="14" ry="5" fill="#9a8a6c"/>
          <ellipse cx="704" cy="269" rx="14" ry="5" fill="#9a8a6c"/>
          <circle class="mark" cx="690" cy="252" r="3.4"/>
        </g>

        <!-- ВУЗЛИК (дарунок) -->
        <g class="hot" data-z="dar">
          <path d="M596,246 C606,230 626,230 636,246 C640,254 634,262 616,262 C598,262 592,254 596,246 Z" fill="#d8cbb0"/>
          <path d="M610,232 L604,222 M622,232 L630,222" stroke="#d8cbb0" stroke-width="4" stroke-linecap="round"/>
          <circle class="mark" cx="616" cy="216" r="3.4"/>
        </g>`,

  // ФИГУРА по канону: пропорции в головах · верхние 20% несут личность ·
  // головной убор — главный дискриминатор · зазор рука↔корпус · контактная тень.
  figura: function(x, base, h, g, opts){
    opts = opts || {};
    var hu = h / (g === 'ч' ? 6.5 : 6.2);       // висота голови
    var hy = base - h + hu;                      // центр голови
    var sh = base - h + hu * 2.05;               // плечі
    var w  = h * 0.29;                           // ширина корпусу
    var dark = opts.dark || '#120d09';
    var s = '';
    s += '<ellipse cx="'+x+'" cy="'+base+'" rx="'+(w*0.9)+'" ry="6" fill="#000" opacity=".5"/>';
    // корпус: свита донизу ширшає, але помірно — інакше фігура читається матрьошкою
    s += '<path d="M'+(x-w*0.78)+','+base+' C'+(x-w*0.74)+','+(base-h*0.4)+' '+(x-w*0.64)+','+(sh+hu*0.5)+' '+(x-w*0.48)+','+sh+
         ' C'+(x-w*0.2)+','+(sh-hu*0.32)+' '+(x+w*0.2)+','+(sh-hu*0.32)+' '+(x+w*0.48)+','+sh+
         ' C'+(x+w*0.64)+','+(sh+hu*0.5)+' '+(x+w*0.74)+','+(base-h*0.4)+' '+(x+w*0.78)+','+base+' Z" fill="'+dark+'"/>';
    // шия — коротка, якщо страх
    var neck = opts.strah ? hu*0.12 : hu*0.3;
    s += '<rect x="'+(x-hu*0.22)+'" y="'+(hy+hu*0.42)+'" width="'+(hu*0.44)+'" height="'+neck+'" fill="'+dark+'"/>';
    s += '<ellipse cx="'+x+'" cy="'+hy+'" rx="'+(hu*0.46)+'" ry="'+(hu*0.52)+'" fill="'+dark+'"/>';
    // ГОЛОВНИЙ УБІР — головний дискримінатор
    if (g === 'ч'){
      s += '<path d="M'+(x-hu*0.56)+','+(hy-hu*0.18)+' Q'+x+','+(hy-hu*0.95)+' '+(x+hu*0.56)+','+(hy-hu*0.18)+
           ' L'+(x+hu*0.6)+','+(hy-hu*0.02)+' L'+(x-hu*0.6)+','+(hy-hu*0.02)+' Z" fill="#241a12"/>';
    } else {
      // намітка: обвиває голову й лягає на плечі, лишаючи обличчя темним
      // (прийом Нарбута — світле обрамлення на темному, а не білий капюшон)
      var sv = opts.svitlo || '#e4dac6';
      s += '<path d="M'+(x-hu*0.54)+','+(hy+hu*0.06)+' C'+(x-hu*0.58)+','+(hy-hu*0.74)+' '+(x+hu*0.58)+','+(hy-hu*0.74)+' '+(x+hu*0.54)+','+(hy+hu*0.06)+
           ' L'+(x+hu*0.38)+','+(hy+hu*0.06)+' C'+(x+hu*0.4)+','+(hy-hu*0.5)+' '+(x-hu*0.4)+','+(hy-hu*0.5)+' '+(x-hu*0.38)+','+(hy+hu*0.06)+' Z" fill="'+sv+'"/>';
      s += '<path d="M'+(x-hu*0.54)+','+(hy+hu*0.02)+' C'+(x-hu*0.62)+','+(hy+hu*0.62)+' '+(x-hu*0.5)+','+(hy+hu*0.98)+' '+(x-hu*0.3)+','+(hy+hu*1.06)+
           ' L'+(x+hu*0.3)+','+(hy+hu*1.06)+' C'+(x+hu*0.5)+','+(hy+hu*0.98)+' '+(x+hu*0.62)+','+(hy+hu*0.62)+' '+(x+hu*0.54)+','+(hy+hu*0.02)+
           ' L'+(x+hu*0.4)+','+(hy+hu*0.04)+' C'+(x+hu*0.44)+','+(hy+hu*0.56)+' '+(x-hu*0.44)+','+(hy+hu*0.56)+' '+(x-hu*0.4)+','+(hy+hu*0.04)+' Z" fill="'+sv+'" opacity=".9"/>';
      // спідниця в ПОВЗДОВЖНЮ смугу — Волинь
      s += '<g stroke="#2a1f16" stroke-width="1.5" opacity=".75">';
      for (var i = -2; i <= 2; i++)
        s += '<path d="M'+(x + i*w*0.3)+','+(base - h*0.34)+' L'+(x + i*w*0.36)+','+base+'"/>';
      s += '</g>';
    }
    // руки з зазором від корпусу — закон силуету
    s += '<path d="M'+(x-w*0.72)+','+(sh+hu*0.5)+' C'+(x-w*1.15)+','+(sh+hu*1.4)+' '+(x-w*1.05)+','+(sh+hu*2.2)+' '+(x-w*0.78)+','+(sh+hu*2.5)+
         '" stroke="'+dark+'" stroke-width="'+(hu*0.34)+'" stroke-linecap="round" fill="none"/>';
    s += '<path d="M'+(x+w*0.72)+','+(sh+hu*0.5)+' C'+(x+w*1.1)+','+(sh+hu*1.3)+' '+(x+w*1.0)+','+(sh+hu*2.1)+' '+(x+w*0.7)+','+(sh+hu*2.5)+
         '" stroke="'+dark+'" stroke-width="'+(hu*0.34)+'" stroke-linecap="round" fill="none"/>';
    // ОДНА високочастотна деталь — і вона улика
    if (opts.detal === 'namysto')
      s += '<g fill="#a33a26">'+[0,1,2,3,4].map(function(k){
        return '<circle cx="'+(x - hu*0.3 + k*hu*0.15)+'" cy="'+(sh + hu*0.3 + Math.abs(k-2)*1.6)+'" r="2.1"/>';}).join('')+'</g>';
    return s;
  }
};
