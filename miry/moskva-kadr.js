// КАДР МИРА: Москва, 2024 — кухня съёмной квартиры ночью.
// Зоны те же роли, что и на Волыни (ochag · stol · vhod · okno · sunduk · altar ·
// lavka · pokaz · resurs · dytya · dar), просто здесь они выглядят так.
// Вся графика — кодом, ни пикселя генерации (закон проекта).

window.KADR = {
  mir: "moskva",
  mesto: "Москва · 2024 · вечер",

  defs: `
    <radialGradient id="lamp" cx="46%" cy="60%" r="66%">
      <stop offset="0%" stop-color="#f0c27a" stop-opacity=".30"/>
      <stop offset="45%" stop-color="#9a7a4a" stop-opacity=".12"/>
      <stop offset="100%" stop-color="#12141a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="wallg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#242a33"/><stop offset="100%" stop-color="#161a21"/>
    </linearGradient>
    <linearGradient id="floorg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a2119"/><stop offset="100%" stop-color="#14100c"/>
    </linearGradient>
    <linearGradient id="nightg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1b2b3d"/><stop offset="100%" stop-color="#26384a"/>
    </linearGradient>
    <radialGradient id="vig" cx="50%" cy="50%" r="72%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".72"/>
    </radialGradient>`,

  svg: `
    <rect x="0" y="0" width="760" height="366" fill="url(#wallg)"/>
    <rect x="0" y="360" width="760" height="110" fill="url(#floorg)"/>
    <path d="M0,363 H760" stroke="#3a2f24" stroke-width="1.2"/>
    <g stroke="#2c343f" stroke-width="1" opacity=".5">
      <path d="M60,0 V366"/><path d="M180,0 V366"/><path d="M300,0 V366"/>
      <path d="M420,0 V366"/><path d="M540,0 V366"/><path d="M660,0 V366"/>
    </g>
    <ellipse cx="360" cy="300" rx="330" ry="200" fill="url(#lamp)"/>

    <!-- ВХОД: проём в прихожую -->
    <g class="hot" data-z="vhod">
      <rect x="24" y="120" width="94" height="243" fill="#0c0f14"/>
      <rect x="24" y="120" width="94" height="243" fill="none" stroke="#3b4450" stroke-width="3"/>
      <rect x="30" y="352" width="82" height="7" fill="#4a3c2c"/>
      <path d="M96,236 a5,5 0 1,0 .1,0" fill="#8d8577"/>
      <circle class="mark" cx="71" cy="150" r="3.4"/>
    </g>

    <!-- ПОКАЗ: грамота в рамке, лицом к двери -->
    <g class="hot" data-z="pokaz">
      <rect x="136" y="150" width="60" height="52" fill="#c9a86a"/>
      <rect x="141" y="155" width="50" height="42" fill="#e8e2d2"/>
      <g stroke="#9a9184" stroke-width="1.6">
        <path d="M147,166 H185"/><path d="M147,174 H185"/><path d="M147,182 H172"/>
      </g>
      <circle class="mark" cx="166" cy="138" r="3.4"/>
    </g>

    <!-- СУНДУК: шкаф-купе, где держат своё -->
    <g class="hot" data-z="sunduk">
      <rect x="206" y="126" width="98" height="236" fill="#3a3128"/>
      <rect x="206" y="126" width="49" height="236" fill="#443a2e"/>
      <path d="M255,126 V362" stroke="#241d16" stroke-width="2"/>
      <rect x="246" y="236" width="5" height="26" rx="2" fill="#8d8577"/>
      <rect x="259" y="236" width="5" height="26" rx="2" fill="#8d8577"/>
      <circle class="mark" cx="255" cy="114" r="3.4"/>
    </g>

    <!-- ОЧАГ: плита с вытяжкой -->
    <g class="hot" data-z="ochag">
      <rect x="330" y="150" width="118" height="34" fill="#4a5058"/>
      <path d="M344,184 L434,184 L424,206 L354,206 Z" fill="#3c424a"/>
      <rect x="330" y="252" width="118" height="110" fill="#d5d8db"/>
      <rect x="330" y="252" width="118" height="16" fill="#b9bdc2"/>
      <rect x="342" y="284" width="94" height="60" fill="#1a1d22"/>
      <rect x="348" y="290" width="82" height="48" fill="#2a2f36"/>
      <g fill="#5b626b">
        <circle cx="356" cy="260" r="7"/><circle cx="382" cy="260" r="7"/>
        <circle cx="408" cy="260" r="7"/><circle cx="434" cy="260" r="7"/>
      </g>
      <!-- кастрюля -->
      <path d="M366,238 L410,238 L406,254 L370,254 Z" fill="#8a9099"/>
      <rect x="362" y="234" width="52" height="5" rx="2" fill="#a2a8b0"/>
      <circle class="mark" cx="389" cy="138" r="3.4"/>
    </g>

    <!-- ОКНО: ночной двор, огни в доме напротив -->
    <g class="hot" data-z="okno">
      <rect x="470" y="130" width="132" height="104" fill="url(#nightg)"/>
      <g fill="#2e3f52">
        <rect x="486" y="160" width="44" height="74"/><rect x="544" y="148" width="44" height="86"/>
      </g>
      <g fill="#e8c87a" opacity=".85">
        <rect x="492" y="170" width="9" height="7"/><rect x="512" y="186" width="9" height="7"/>
        <rect x="552" y="162" width="9" height="7"/><rect x="570" y="196" width="9" height="7"/>
        <rect x="552" y="210" width="9" height="7"/>
      </g>
      <rect x="470" y="130" width="132" height="104" fill="none" stroke="#4a5058" stroke-width="5"/>
      <path d="M536,130 V234 M470,182 H602" stroke="#4a5058" stroke-width="4"/>
      <!-- штора, задёрнутая наполовину -->
      <path d="M470,126 L508,126 L500,238 L470,238 Z" fill="#4a3c46" opacity=".92"/>
      <circle class="mark" cx="536" cy="118" r="3.4"/>
    </g>

    <!-- АЛТАРЬ: полка с фотографиями и свечой -->
    <g class="hot" data-z="altar">
      <rect x="624" y="186" width="118" height="7" fill="#4a3c2c"/>
      <rect x="640" y="140" width="34" height="46" fill="#5a4a36"/>
      <rect x="645" y="145" width="24" height="36" fill="#c8bda6"/>
      <circle cx="657" cy="158" r="6" fill="#8a8070"/>
      <path d="M648,181 C650,168 664,168 666,181 Z" fill="#8a8070"/>
      <rect x="692" y="156" width="26" height="30" fill="#5a4a36"/>
      <rect x="696" y="160" width="18" height="22" fill="#b6ac96"/>
      <!-- свеча -->
      <rect x="726" y="164" width="8" height="22" fill="#e8e0cc"/>
      <ellipse cx="730" cy="161" rx="3.6" ry="7" fill="#e8a33d"/>
      <circle class="mark" cx="683" cy="128" r="3.4"/>
    </g>

    <!-- ДИТЯ: дверь в комнату, приоткрыта, ночник -->
    <g class="hot" data-z="dytya">
      <rect x="620" y="212" width="86" height="150" fill="#171b21"/>
      <rect x="620" y="212" width="86" height="150" fill="none" stroke="#3b4450" stroke-width="3"/>
      <rect x="668" y="212" width="38" height="150" fill="#0b0e13"/>
      <path d="M668,212 L706,222 L706,352 L668,362 Z" fill="#0e131a"/>
      <ellipse cx="690" cy="300" rx="16" ry="30" fill="#c98a3a" opacity=".22"/>
      <circle class="mark" cx="663" cy="200" r="3.4"/>
    </g>

    <!-- СТОЛ -->
    <g class="hot" data-z="stol">
      <path d="M462,278 L666,272 L672,292 L462,298 Z" fill="#c9b48c"/>
      <path d="M462,298 L672,292 L672,300 L462,306 Z" fill="#9a8a68"/>
      <rect x="474" y="306" width="8" height="58" fill="#5a4a36"/>
      <rect x="650" y="300" width="8" height="62" fill="#5a4a36"/>
      <ellipse cx="512" cy="282" rx="15" ry="5" fill="#8a8070"/>
      <ellipse cx="556" cy="279" rx="15" ry="5" fill="#8a8070"/>
      <circle class="mark" cx="566" cy="262" r="3.4"/>
    </g>

    <!-- РЕСУРС: конверт с деньгами и мелочь на столе -->
    <g class="hot" data-z="resurs">
      <path d="M596,262 L646,258 L648,278 L598,282 Z" fill="#e2dccb"/>
      <path d="M596,262 L622,272 L648,258" fill="none" stroke="#b3a98f" stroke-width="1.8"/>
      <g fill="#b9a35a"><circle cx="600" cy="288" r="4"/><circle cx="610" cy="290" r="4"/></g>
      <circle class="mark" cx="622" cy="248" r="3.4"/>
    </g>

    <!-- ДАР: пакет с подарком -->
    <g class="hot" data-z="dar">
      <path d="M478,250 L520,250 L516,282 L482,282 Z" fill="#8a4a52"/>
      <path d="M486,250 C488,236 510,236 512,250" fill="none" stroke="#8a4a52" stroke-width="3"/>
      <rect x="478" y="258" width="42" height="5" fill="#d8c8a8"/>
      <circle class="mark" cx="499" cy="232" r="3.4"/>
    </g>

    <!-- ЛАВКА: угловой диван -->
    <g class="hot" data-z="lavka">
      <path d="M688,296 L756,296 L756,362 L688,362 Z" fill="#3e4650"/>
      <path d="M688,296 L756,296 L756,312 L688,312 Z" fill="#4c5560"/>
      <rect x="694" y="316" width="28" height="20" rx="4" fill="#59626d"/>
      <rect x="726" y="316" width="26" height="20" rx="4" fill="#59626d"/>
      <circle class="mark" cx="722" cy="286" r="3.4"/>
    </g>`,

  // ФИГУРА: тот же канон, что и на Волыни (пропорции в головах · верхние 20% несут
  // личность · зазор рука↔корпус · контактная тень), но убор здесь — волосы и одежда.
  figura: function(x, base, h, g, opts){
    opts = opts || {};
    var hu = h / (g === 'ч' ? 7.2 : 7.0);
    var hy = base - h + hu;
    var sh = base - h + hu * 2.0;
    var w  = h * 0.21;
    var dark = opts.dark || '#171a20';
    var s = '';
    s += '<ellipse cx="'+x+'" cy="'+base+'" rx="'+(w*1.1)+'" ry="6" fill="#000" opacity=".45"/>';
    // ноги
    s += '<path d="M'+(x-w*0.62)+','+base+' L'+(x-w*0.5)+','+(base-h*0.4)+' L'+(x+w*0.5)+','+(base-h*0.4)+
         ' L'+(x+w*0.62)+','+base+' Z" fill="#1d2129"/>';
    s += '<path d="M'+x+','+(base-h*0.38)+' V'+(base-2)+'" stroke="#12151a" stroke-width="2"/>';
    // корпус: свитер / куртка — прямой силуэт, не колокол
    s += '<path d="M'+(x-w*0.72)+','+(base-h*0.36)+' C'+(x-w*0.78)+','+(sh+hu*0.9)+' '+(x-w*0.72)+','+(sh+hu*0.2)+' '+(x-w*0.52)+','+sh+
         ' C'+(x-w*0.2)+','+(sh-hu*0.3)+' '+(x+w*0.2)+','+(sh-hu*0.3)+' '+(x+w*0.52)+','+sh+
         ' C'+(x+w*0.72)+','+(sh+hu*0.2)+' '+(x+w*0.78)+','+(sh+hu*0.9)+' '+(x+w*0.72)+','+(base-h*0.36)+' Z" fill="'+dark+'"/>';
    var neck = opts.strah ? hu*0.1 : hu*0.26;
    s += '<rect x="'+(x-hu*0.2)+'" y="'+(hy+hu*0.4)+'" width="'+(hu*0.4)+'" height="'+neck+'" fill="'+dark+'"/>';
    s += '<ellipse cx="'+x+'" cy="'+hy+'" rx="'+(hu*0.44)+'" ry="'+(hu*0.5)+'" fill="#22262e"/>';
    // волосы — здешний дискриминатор вместо намітки
    if (g === 'ч'){
      s += '<path d="M'+(x-hu*0.46)+','+(hy-hu*0.08)+' C'+(x-hu*0.5)+','+(hy-hu*0.62)+' '+(x+hu*0.5)+','+(hy-hu*0.62)+' '+(x+hu*0.46)+','+(hy-hu*0.08)+
           ' L'+(x+hu*0.42)+','+(hy-hu*0.18)+' C'+(x+hu*0.3)+','+(hy-hu*0.4)+' '+(x-hu*0.3)+','+(hy-hu*0.4)+' '+(x-hu*0.42)+','+(hy-hu*0.18)+' Z" fill="#15181e"/>';
    } else {
      s += '<path d="M'+(x-hu*0.5)+','+(hy+hu*0.12)+' C'+(x-hu*0.56)+','+(hy-hu*0.66)+' '+(x+hu*0.56)+','+(hy-hu*0.66)+' '+(x+hu*0.5)+','+(hy+hu*0.12)+
           ' L'+(x+hu*0.36)+','+(hy+hu*0.1)+' C'+(x+hu*0.4)+','+(hy-hu*0.34)+' '+(x-hu*0.4)+','+(hy-hu*0.34)+' '+(x-hu*0.36)+','+(hy+hu*0.1)+' Z" fill="#15181e"/>';
      // пучок
      s += '<circle cx="'+x+'" cy="'+(hy-hu*0.66)+'" r="'+(hu*0.2)+'" fill="#15181e"/>';
    }
    // руки с зазором от корпуса
    s += '<path d="M'+(x-w*0.7)+','+(sh+hu*0.35)+' C'+(x-w*1.25)+','+(sh+hu*1.2)+' '+(x-w*1.15)+','+(sh+hu*2.0)+' '+(x-w*0.85)+','+(sh+hu*2.35)+
         '" stroke="'+dark+'" stroke-width="'+(hu*0.3)+'" stroke-linecap="round" fill="none"/>';
    s += '<path d="M'+(x+w*0.7)+','+(sh+hu*0.35)+' C'+(x+w*1.2)+','+(sh+hu*1.1)+' '+(x+w*1.1)+','+(sh+hu*1.9)+' '+(x+w*0.8)+','+(sh+hu*2.35)+
         '" stroke="'+dark+'" stroke-width="'+(hu*0.3)+'" stroke-linecap="round" fill="none"/>';
    // ОДНА высокочастотная деталь — и она улика: телефон в руке, экраном вниз
    if (opts.detal === 'telefon')
      s += '<rect x="'+(x+w*0.66)+'" y="'+(sh+hu*2.2)+'" width="'+(hu*0.3)+'" height="'+(hu*0.5)+'" rx="2" fill="#0d1014" stroke="#39414c" stroke-width="1"/>';
    return s;
  }
};
