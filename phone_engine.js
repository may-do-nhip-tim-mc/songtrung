(function () {
  var root = document.getElementById('doppel-phone-root');
  var S = window.DOPPEL_PHONE;
  if (!root || !S) return;

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var THEMES = {
    sim_zone: {
      bg: '#f5f4ef', card: '#ffffff', border: '#dcd6c8', text: '#26292b',
      sub: '#6f7479', accent: '#357a6b', accentSoft: '#e4f1ee',
      barBg: '#eae6db', barText: '#26292b',
      mapBg: '#f2efe6', block: '#e5e0d3', park: '#c8e6c9', water: '#b8dcf0',
      roadMinor: '#ffffff', roadOuter: '#d4cfc1', roadInner: '#ffffff',
      mapLabel: '#555b61', labelHalo: '#f5f4ef', transitDot: '#5d738a',
      offBg: 'rgba(130,136,140,0.22)', offStroke: '#7a8288',
      signal: 4, glitch: false
    },
    switching: {
      bg: '#131012', card: '#1e171b', border: '#a84432', text: '#f4e9e4',
      sub: '#c29990', accent: '#e05d44', accentSoft: '#3a1b18',
      barBg: '#261414', barText: '#ffb3a3',
      mapBg: '#1c1518', block: '#261c20', park: '#223029', water: '#1d2430',
      roadMinor: '#2f2328', roadOuter: '#543330', roadInner: '#3f2b2e',
      mapLabel: '#b88f88', labelHalo: '#1c1518', transitDot: '#a85a4c',
      offBg: 'rgba(224,93,68,0.24)', offStroke: '#e05d44',
      signal: 1, glitch: true
    },
    geflich: {
      bg: '#101815', card: '#17231e', border: '#273d33', text: '#e8f1ec',
      sub: '#92aba0', accent: '#48b884', accentSoft: '#193529',
      barBg: '#0c1310', barText: '#d4ebe0',
      mapBg: '#14201b', block: '#1b2b24', park: '#1c3b2c', water: '#133945',
      roadMinor: '#22362d', roadOuter: '#101a16', roadInner: '#2e4a3d',
      mapLabel: '#8fb0a1', labelHalo: '#14201b', transitDot: '#4e8a73',
      offBg: 'rgba(198,83,75,0.22)', offStroke: '#d46259',
      signal: 4, glitch: false
    },
    north: {
      bg: '#11161d', card: '#19212c', border: '#2c3a4d', text: '#e8eef5',
      sub: '#8ea2b8', accent: '#5a9be6', accentSoft: '#1b2c42',
      barBg: '#0c1016', barText: '#d0dff0',
      mapBg: '#161f2a', block: '#1e2a38', park: '#1a332b', water: '#14314a',
      roadMinor: '#253445', roadOuter: '#0e151d', roadInner: '#344961',
      mapLabel: '#8fa5bd', labelHalo: '#161f2a', transitDot: '#597ea8',
      offBg: 'rgba(204,88,88,0.22)', offStroke: '#d66565',
      signal: 4, glitch: false
    },
    aurora: {
      bg: '#f1f6fb', card: '#ffffff', border: '#cddae8', text: '#162230',
      sub: '#60748a', accent: '#2574df', accentSoft: '#e4effc',
      barBg: '#e2ecf7', barText: '#162230',
      mapBg: '#edf2f7', block: '#dde6f0', park: '#c2ead6', water: '#b8d7f5',
      roadMinor: '#ffffff', roadOuter: '#c6d4e3', roadInner: '#ffffff',
      mapLabel: '#4f647a', labelHalo: '#edf2f7', transitDot: '#4b74a6',
      offBg: 'rgba(196,69,69,0.16)', offStroke: '#c44545',
      signal: 4, glitch: false
    },
    buffer: {
      bg: '#16171a', card: '#1f2126', border: '#3a3d45', text: '#e3e4e8',
      sub: '#8e929c', accent: '#d69e3a', accentSoft: '#302819',
      barBg: '#101114', barText: '#d9b56c',
      mapBg: '#1b1d21', block: '#24272d', park: '#222e26', water: '#1d2a33',
      roadMinor: '#2b2e36', roadOuter: '#121316', roadInner: '#3a3e48',
      mapLabel: '#969ba6', labelHalo: '#1b1d21', transitDot: '#9e8452',
      offBg: 'rgba(214,158,58,0.22)', offStroke: '#d69e3a',
      signal: 2, glitch: false
    }
  };

  var KIND_META = {
    gov:    { icon: '🏛️', color: '#3b82f6', fallbackApp: 'Thông Báo Nhà Nước' },
    med:    { icon: '💉', color: '#10b981', fallbackApp: 'Y Tế Cộng Đồng' },
    social: { icon: '🔔', color: '#f59e0b', fallbackApp: '3791 Net' },
    msg:    { icon: '💬', color: '#8b5cf6', fallbackApp: 'Tin Nhắn' },
    net:    { icon: '📡', color: '#ef4444', fallbackApp: 'Hệ Thống Mạng' }
  };

  var mode = THEMES[S.netMode] ? S.netMode : 'geflich';
  var T = THEMES[mode];

  function signalSvg(bars) {
    var html = '<span class="dp-sig">';
    for (var i = 1; i <= 4; i++) {
      html += '<i style="height:' + (i * 3 + 2) + 'px;opacity:' + (i <= bars ? '1' : '0.25') + '"></i>';
    }
    return html + '</span>';
  }

  function getPoiMeta(p) {
    var txt = ((p.type || '') + ' ' + (p.name || '') + ' ' + (p.icon || '')).toLowerCase();
    if (/bệnh viện|y viện|y tế|phúc lợi|phòng khám|clinic|🏥|💉/.test(txt)) {
      return { color: '#e53935', glyph: 'H', txtColor: '#e53935' };
    }
    if (/chợ|siêu thị|tiệm|cà phê|cửa hàng|trung tâm|tiện ích|🛒|☕|🛍/.test(txt)) {
      return { color: '#1e88e5', glyph: p.icon || '🛒', txtColor: '#2b82e0' };
    }
    if (/công viên|vườn|rừng|sinh thái|quảng trường|🌳|🌿|🌲/.test(txt)) {
      return { color: '#2e9d5b', glyph: p.icon || '🌿', txtColor: '#2d9959' };
    }
    if (/ga |trạm|bus|tàu|bến|cảng|giao thông|🚇|🚆|🚌/.test(txt)) {
      return { color: '#455a64', glyph: p.icon || '🚇', txtColor: T.text };
    }
    if (/học viện|đại học|trường|thư viện|🎓|🏫/.test(txt)) {
      return { color: '#607d8b', glyph: p.icon || '🎓', txtColor: T.text };
    }
    return { color: T.accent, glyph: p.icon || '📍', txtColor: T.text };
  }

  function buildStreetMapSvg(curMode, theme) {
    var lbls = curMode === 'geflich'
      ? { a: 'Đ. Hạ Lưu', b: 'Đại lộ Sinh Thái', c: 'Khu Ven Sông', z: 'QUẬN TRUNG TÂM' }
      : curMode === 'north'
      ? { a: 'Đại lộ Duyên Hải', b: 'Đ. Cảng Bắc', c: 'Tuyến Liên Bang', z: 'KHU CẢNG BẮC' }
      : curMode === 'aurora'
      ? { a: 'Đại lộ Cực Quang', b: 'Vành đai Vòm Kính', c: 'Trục Tháp Lõi', z: 'PHÂN KHU B' }
      : curMode === 'sim_zone'
      ? { a: 'Đ. Trung Tâm', b: 'Phố Nam Đồi', c: 'Đ. Công Viên', z: 'KHU DÂN CƯ' }
      : { a: 'Quốc lộ Đệm', b: 'Tuyến Biên Giới', c: 'Đường Vành Đai', z: 'VÙNG ĐỆM' };

    var waterLayer = '';
    var parkLayer = '';
    if (curMode === 'geflich') {
      waterLayer = '<path d="M-20,210 C85,180 155,222 260,192 C325,174 375,188 420,168 L420,250 L-20,250 Z" fill="' + theme.water + '" opacity="0.9"/>';
      parkLayer = '<path d="M125,22 L215,38 L228,96 L158,118 L112,78 Z" fill="' + theme.park + '" opacity="0.9"/>' +
        '<ellipse cx="322" cy="148" rx="34" ry="20" fill="' + theme.park + '" opacity="0.85"/>' +
        '<ellipse cx="48" cy="142" rx="28" ry="18" fill="' + theme.park + '" opacity="0.8"/>';
    } else if (curMode === 'north') {
      waterLayer = '<path d="M322,-10 C310,65 342,130 315,250 L420,250 L420,-10 Z" fill="' + theme.water + '" opacity="0.92"/>';
      parkLayer = '<rect x="132" y="34" width="66" height="44" rx="10" fill="' + theme.park + '" opacity="0.85"/>' +
        '<circle cx="62" cy="172" r="22" fill="' + theme.park + '" opacity="0.8"/>';
    } else if (curMode === 'aurora') {
      waterLayer = '<path d="M332,-10 C324,75 336,155 326,250 L420,250 L420,-10 Z" fill="' + theme.water + '" opacity="0.9"/>';
      parkLayer = '<circle cx="176" cy="68" r="36" fill="' + theme.park + '" stroke="' + theme.border + '" stroke-width="1.2" opacity="0.95"/>' +
        '<circle cx="176" cy="68" r="14" fill="' + theme.water + '" opacity="0.65"/>' +
        '<circle cx="290" cy="176" r="22" fill="' + theme.park + '" stroke="' + theme.border + '" stroke-width="1" opacity="0.9"/>';
    } else {
      waterLayer = '<ellipse cx="188" cy="84" rx="22" ry="10" transform="rotate(-14 188 84)" fill="' + theme.water + '" opacity="0.9"/>';
      parkLayer = '<path d="M128,28 L212,34 L224,96 L154,108 L118,68 Z" fill="' + theme.park + '" opacity="0.92"/>' +
        '<rect x="282" y="152" width="46" height="34" rx="8" fill="' + theme.park + '" opacity="0.85"/>';
    }

    var blocks =
      '<g fill="' + theme.block + '" opacity="0.72">' +
        '<rect x="14" y="18" width="38" height="22" rx="2"/>' +
        '<rect x="60" y="16" width="42" height="26" rx="2"/>' +
        '<rect x="16" y="54" width="34" height="36" rx="2"/>' +
        '<rect x="64" y="60" width="36" height="28" rx="2"/>' +
        '<rect x="238" y="22" width="48" height="26" rx="2"/>' +
        '<rect x="296" y="24" width="36" height="30" rx="2"/>' +
        '<rect x="242" y="62" width="44" height="32" rx="2"/>' +
        '<rect x="22" y="112" width="44" height="24" rx="2"/>' +
        '<rect x="78" y="116" width="38" height="32" rx="2"/>' +
        '<rect x="132" y="138" width="42" height="28" rx="2"/>' +
        '<rect x="186" y="142" width="48" height="24" rx="2"/>' +
        '<rect x="246" y="118" width="42" height="26" rx="2"/>' +
        '<rect x="34" y="176" width="52" height="24" rx="2"/>' +
        '<rect x="112" y="186" width="46" height="26" rx="2"/>' +
        '<rect x="174" y="182" width="50" height="28" rx="2"/>' +
        '<rect x="244" y="186" width="42" height="26" rx="2"/>' +
      '</g>';

    var minorRoads =
      '<g stroke="' + theme.roadMinor + '" stroke-width="2.2" fill="none" opacity="0.85" stroke-linecap="round">' +
        '<path d="M-10,48 L410,42"/>' +
        '<path d="M-10,98 L410,112"/>' +
        '<path d="M-10,164 L410,154"/>' +
        '<path d="M-10,214 L410,206"/>' +
        '<path d="M52,-10 L44,250"/>' +
        '<path d="M108,-10 L118,250"/>' +
        '<path d="M234,-10 L248,250"/>' +
        '<path d="M294,-10 L282,250"/>' +
        '<path d="M352,-10 L344,250"/>' +
        '<path d="M74,48 L128,176"/>' +
        '<path d="M262,44 L318,162"/>' +
      '</g>';

    var majorPaths =
      '<path d="M-15,196 L192,118 L415,52"/>' +
      '<path d="M98,-15 L192,118 L278,255"/>' +
      '<path d="M-15,78 L192,118 L415,172"/>' +
      '<path d="M252,-15 L218,124 L152,255"/>';

    var majorRoads =
      '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
        '<g stroke="' + theme.roadOuter + '" stroke-width="9">' + majorPaths + '</g>' +
        '<g stroke="' + theme.roadInner + '" stroke-width="6">' + majorPaths + '</g>' +
        '<circle cx="192" cy="118" r="9" fill="' + theme.roadInner + '" stroke="' + theme.roadOuter + '" stroke-width="2"/>' +
        '<circle cx="192" cy="118" r="3.5" fill="' + theme.park + '"/>' +
      '</g>';

    var transitDots =
      '<g fill="' + theme.transitDot + '" stroke="' + theme.roadInner + '" stroke-width="1">' +
        '<rect x="66" y="160" width="6" height="6" rx="1.5"/>' +
        '<rect x="148" y="88" width="6" height="6" rx="1.5"/>' +
        '<rect x="266" y="92" width="6" height="6" rx="1.5"/>' +
        '<rect x="218" y="154" width="6" height="6" rx="1.5"/>' +
        '<rect x="314" y="142" width="6" height="6" rx="1.5"/>' +
      '</g>';

    var labels =
      '<g font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" paint-order="stroke" stroke="' + theme.labelHalo + '" stroke-width="3" stroke-linejoin="round">' +
        '<text x="278" y="92" font-size="8.5" fill="' + theme.mapLabel + '" transform="rotate(-17 278 92)">' + esc(lbls.a) + '</text>' +
        '<text x="116" y="66" font-size="8.2" fill="' + theme.mapLabel + '" transform="rotate(52 116 66)">' + esc(lbls.b) + '</text>' +
        '<text x="28" y="102" font-size="8" fill="' + theme.mapLabel + '" transform="rotate(11 28 102)">' + esc(lbls.c) + '</text>' +
        '<text x="262" y="138" font-size="7.5" letter-spacing="0.8" fill="' + theme.mapLabel + '" opacity="0.72">' + esc(lbls.z) + '</text>' +
      '</g>';

    return '<svg class="dp-map-svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect width="400" height="240" fill="' + theme.mapBg + '"/>' +
      blocks + parkLayer + waterLayer + minorRoads + majorRoads + transitDots + labels +
    '</svg>';
  }

  var css = [
    '.dp-wrap{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:420px;margin:10px auto;color:' + T.text + ';font-size:13px;line-height:1.45;box-sizing:border-box}',
    '.dp-wrap *{box-sizing:border-box}',
    '.dp-phone{background:' + T.bg + ';border:1.5px solid ' + T.border + ';border-radius:20px;overflow:hidden;box-shadow:0 10px 28px rgba(0,0,0,.22)}',
    '.dp-notify-stack{display:flex;flex-direction:column;gap:8px}',
    '.dp-notify-box{background:' + T.card + ';border:1.5px solid ' + T.border + ';border-radius:15px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.18)}',
    '.dp-status{display:flex;justify-content:space-between;align-items:center;padding:7px 14px;background:' + T.barBg + ';color:' + T.barText + ';font-size:11px;font-weight:600;letter-spacing:.2px;border-bottom:1px solid ' + T.border + '}',
    '.dp-sig{display:inline-flex;align-items:flex-end;gap:2px;margin-right:6px;vertical-align:middle}',
    '.dp-sig i{display:inline-block;width:3px;background:currentColor;border-radius:1px}',
    '.dp-alert{background:' + T.accentSoft + ';color:' + T.accent + ';padding:8px 13px;font-size:12px;font-weight:600;border-bottom:1px solid ' + T.border + '}',
    '.dp-body{padding:11px 12px;max-height:490px;overflow-y:auto}',
    '.dp-app-head{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:' + T.sub + ';margin-bottom:5px;font-weight:600}',
    '.dp-app-pill{display:inline-flex;align-items:center;gap:5px;text-transform:uppercase;letter-spacing:.4px}',
    '.dp-tag{display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;padding:2px 8px;border-radius:999px;background:' + T.accentSoft + ';color:' + T.accent + '}',
    '.dp-title{font-size:13.5px;font-weight:700;margin:3px 0 5px}',
    '.dp-line{margin:3px 0;color:' + T.text + '}',
    '.dp-sub{font-size:11.5px;color:' + T.sub + '}',
    '.dp-badge{margin-top:7px;padding:5px 9px;border-radius:8px;background:' + T.accentSoft + ';color:' + T.accent + ';font-size:11.5px;font-weight:600;display:inline-block}',
    '.dp-card{background:' + T.card + ';border:1px solid ' + T.border + ';border-radius:12px;padding:10px 11px;margin-bottom:9px}',
    '.dp-card.uncanny{border-left:3px solid ' + T.accent + '}',
    '.dp-row{display:flex;justify-content:space-between;align-items:baseline;gap:8px}',
    '.dp-msg-invalid{color:#e05d44;font-size:11px;font-weight:600;margin-top:4px}',
    '.dp-msg-unread{border-left:3px solid ' + T.accent + '}',
    '.dp-meta-bar{display:flex;gap:12px;margin-top:6px;font-size:11px;color:' + T.sub + ';font-weight:600}',
    '.dp-cmt{margin-top:6px;padding-left:9px;border-left:2px solid ' + T.border + ';font-size:12px;color:' + T.sub + '}',
    '.dp-cmt.hidden{font-style:italic;opacity:.7}',
    /* Google-Maps-Style Street Map */
    '.dp-map-search{display:flex;align-items:center;justify-content:space-between;background:' + T.card + ';border:1px solid ' + T.border + ';border-radius:999px;padding:6px 12px;font-size:11.5px;color:' + T.sub + ';margin-bottom:8px;box-shadow:0 2px 6px rgba(0,0,0,.08)}',
    '.dp-map-canvas{position:relative;height:230px;border-radius:14px;border:1px solid ' + T.border + ';background:' + T.mapBg + ';overflow:hidden;margin-bottom:9px}',
    '.dp-map-stage{position:absolute;inset:0;transition:transform .25s ease;transform-origin:50% 50%}',
    '.dp-map-stage.zoomed{transform:scale(1.24)}',
    '.dp-map-svg{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.dp-offlimit{position:absolute;background:repeating-linear-gradient(-45deg,' + T.offBg + ',' + T.offBg + ' 6px,transparent 6px,transparent 12px);border:1.5px dashed ' + T.offStroke + ';display:flex;align-items:center;justify-content:center;text-align:center;padding:6px;z-index:2;backdrop-filter:blur(1.5px)}',
    '.dp-offlimit span{background:' + T.card + ';color:' + T.offStroke + ';font-size:9.5px;font-weight:700;padding:2px 6px;border-radius:6px;border:1px solid ' + T.offStroke + ';max-width:136px;line-height:1.25;box-shadow:0 2px 6px rgba(0,0,0,.15)}',
    '.dp-rim-fog{position:absolute;inset:0;box-shadow:inset 0 0 34px 16px ' + T.bg + ';pointer-events:none;z-index:2}',
    '.dp-me{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:4;display:flex;flex-direction:column;align-items:center;pointer-events:none}',
    '.dp-me-dot{width:14px;height:14px;border-radius:50%;background:#1a73e8;border:2.5px solid #fff;box-shadow:0 0 0 6px rgba(26,115,232,.26);animation:dpPulse 2s infinite}',
    '.dp-me-lbl{margin-top:3px;font-size:9px;font-weight:700;background:#174ea6;color:#fff;padding:1px 6px;border-radius:999px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.25)}',
    '.dp-poi{position:absolute;transform:translate(-50%,-50%);z-index:3;display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:transform .15s}',
    '.dp-poi-pin{width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center}',
    '.dp-poi-pin b{transform:rotate(45deg);font-size:10.5px;line-height:1;color:#fff;font-weight:800}',
    '.dp-poi-name{margin-top:2px;font-size:9.5px;font-weight:700;max-width:112px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 3px;border-radius:4px;text-shadow:0 0 3px ' + T.labelHalo + ',0 0 3px ' + T.labelHalo + ',0 1px 2px ' + T.labelHalo + '}',
    '.dp-poi.sel{transform:translate(-50%,-50%) scale(1.16);z-index:6}',
    '.dp-poi.sel .dp-poi-name{background:' + T.card + ';border:1px solid ' + T.accent + ';text-shadow:none;padding:1px 5px;box-shadow:0 2px 6px rgba(0,0,0,.22)}',
    '.dp-map-ctrl{position:absolute;right:8px;bottom:8px;z-index:7;display:flex;flex-direction:column;gap:4px}',
    '.dp-map-btn{width:26px;height:26px;border-radius:8px;border:1px solid ' + T.border + ';background:' + T.card + ';color:' + T.text + ';font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;padding:0}',
    '.dp-place-item{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 9px;border-radius:10px;border:1px solid ' + T.border + ';background:' + T.card + ';margin-bottom:6px;cursor:pointer}',
    '.dp-place-item.sel{border-color:' + T.accent + ';background:' + T.accentSoft + '}',
    '.dp-place-dot{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;color:#fff;font-size:10.5px;font-weight:800;margin-right:7px;flex-shrink:0}',
    '.dp-place-left{display:flex;align-items:center;min-width:0}',
    '.dp-bar-track{height:8px;border-radius:999px;background:' + T.barBg + ';overflow:hidden;margin:6px 0}',
    '.dp-bar-fill{height:100%;background:' + T.accent + ';border-radius:999px}',
    '.dp-nav{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid ' + T.border + ';background:' + T.barBg + '}',
    '.dp-nav button{appearance:none;border:0;background:transparent;color:' + T.sub + ';padding:9px 4px;font-size:11px;font-weight:600;cursor:pointer;border-top:2px solid transparent}',
    '.dp-nav button.active{color:' + T.accent + ';border-top-color:' + T.accent + ';background:' + T.card + '}',
    '@keyframes dpPulse{0%,100%{box-shadow:0 0 0 4px rgba(26,115,232,.28)}50%{box-shadow:0 0 0 11px rgba(26,115,232,.06)}}',
    T.glitch ? '@keyframes dpGlitch{0%,100%{opacity:1}50%{opacity:.82}}.dp-phone,.dp-notify-box{animation:dpGlitch 1.6s infinite}' : ''
  ].join('');

  var statusBar =
    '<div class="dp-status">' +
      '<span>' + signalSvg(T.signal) + esc(S.carrier || 'MẠNG 3791') + '</span>' +
      '<span>' + esc(S.clock || '') + ' • 🔋' + esc(S.battery != null ? S.battery : 80) + '%</span>' +
    '</div>';

  /* ===== MODE 1: SMART PUSH NOTIFICATIONS ===== */
  if (S.view === 'notify') {
    var list = Array.isArray(S.notifies) && S.notifies.length
      ? S.notifies
      : (S.notify ? [S.notify] : []);

    var cards = list.map(function (N, idx) {
      var km = KIND_META[N.kind] || { icon: '🔔', color: T.accent, fallbackApp: N.tag || 'THÔNG BÁO' };
      var linesHtml = (N.lines || []).map(function (l) {
        return '<div class="dp-line">' + esc(l) + '</div>';
      }).join('');
      return '<div class="dp-notify-box" style="border-left:4px solid ' + km.color + '">' +
        (idx === 0 ? statusBar : '') +
        '<div class="dp-body">' +
          '<div class="dp-app-head">' +
            '<span class="dp-app-pill" style="color:' + km.color + '">' + km.icon + ' ' + esc(N.app || km.fallbackApp) + '</span>' +
            '<span>' + esc(N.time || 'Vừa xong') + '</span>' +
          '</div>' +
          (N.sender ? '<div class="dp-sub">Từ: <b>' + esc(N.sender) + '</b></div>' : '') +
          '<div class="dp-title">' + esc(N.title || '') + '</div>' +
          linesHtml +
          (N.badge ? '<div class="dp-badge">' + esc(N.badge) + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    root.innerHTML = '<style>' + css + '</style><div class="dp-wrap"><div class="dp-notify-stack">' + cards + '</div></div>';
    return;
  }

  /* ===== MODE 2: FULL 4-TAB SMARTPHONE ===== */
  var selectedPlaceIdx = -1;
  var mapZoomed = false;

  function renderMsgs() {
    var list = S.msgs || [];
    if (!list.length) return '<div class="dp-card dp-sub">Chưa có tin nhắn hoặc cuộc gọi mới.</div>';
    return list.map(function (m) {
      var cls = 'dp-card' + (m.status === 'unread' ? ' dp-msg-unread' : '');
      var extra = m.status === 'invalid'
        ? '<div class="dp-msg-invalid">❌ Số thuê bao không tồn tại trên mạng lưới này</div>'
        : (m.status === 'missed' ? '<div class="dp-msg-invalid">📞 Cuộc gọi nhỡ</div>' : '');
      return '<div class="' + cls + '">' +
        '<div class="dp-row"><b>' + esc(m.from) + '</b><span class="dp-sub">' + esc(m.time) + '</span></div>' +
        '<div class="dp-line" style="margin-top:4px">' + esc(m.text) + '</div>' +
        extra +
      '</div>';
    }).join('');
  }

  function renderFeed() {
    var h = '';
    if (S.feedPinned) {
      h += '<div class="dp-card" style="background:' + T.accentSoft + '"><div class="dp-tag">🏛️ THÔNG BÁO GHIM</div><div class="dp-line" style="margin-top:4px">' + esc(S.feedPinned) + '</div></div>';
    }
    var posts = S.posts || [];
    if (!posts.length) return h + '<div class="dp-card dp-sub">Không có bài đăng mới.</div>';
    return h + posts.map(function (p) {
      var cmts = (p.comments || []).map(function (c) {
        return '<div class="dp-cmt' + (c.hidden ? ' hidden' : '') + '"><b>' + esc(c.user) + ':</b> ' + esc(c.text) + '</div>';
      }).join('');
      var voteStr = p.votes != null ? '⬆️ ' + esc(p.votes) : '⬆️ 24';
      var cmtCount = (p.comments || []).length;
      return '<div class="dp-card' + (p.uncanny ? ' uncanny' : '') + '">' +
        '<div class="dp-row"><span class="dp-tag">' + esc(p.sub) + '</span><span class="dp-sub">' + esc(p.user) + '</span></div>' +
        '<div class="dp-title">' + esc(p.title) + '</div>' +
        '<div class="dp-line">' + esc(p.body) + '</div>' +
        '<div class="dp-meta-bar"><span>' + voteStr + '</span><span>💬 ' + cmtCount + ' bình luận</span></div>' +
        cmts +
      '</div>';
    }).join('');
  }

  function renderMap() {
    var M = S.map || {};
    var isLocal = M.scope === 'small_town' || mode === 'sim_zone' || mode === 'aurora';
    var mapBadge = mode === 'aurora' ? 'NỘI BỘ 7.0'
      : (isLocal ? 'CỤC BỘ' : (mode === 'buffer' ? 'SÓNG YẾU' : 'GPS TRỰC TIẾP'));
    var defaults = [[22, 26], [76, 72], [24, 74], [76, 26], [50, 18]];

    var places = Array.isArray(M.places) && M.places.length
      ? M.places
      : (M.pins || []).map(function (name, i) {
          var pt = defaults[i % defaults.length];
          return { name: name, type: 'Địa điểm', icon: '📍', dist: 'Gần đây', x: pt[0], y: pt[1] };
        });

    var offHtml = '';
    if (M.offLimit && M.offLimit.label) {
      var pos = M.offLimit.pos || (isLocal ? 'rim' : 'top-right');
      if (pos === 'rim') {
        offHtml = '<div class="dp-rim-fog"></div><div class="dp-offlimit" style="top:6px;left:50%;transform:translateX(-50%);width:78%;height:28px;border-radius:8px"><span>⛔ ' + esc(M.offLimit.label) + '</span></div>';
      } else {
        var boxStyle = pos === 'top-left' ? 'top:8px;left:8px;width:40%;height:38%;border-radius:10px'
          : pos === 'bottom-right' ? 'bottom:8px;right:8px;width:42%;height:38%;border-radius:10px'
          : 'top:8px;right:8px;width:42%;height:38%;border-radius:10px';
        offHtml = '<div class="dp-offlimit" style="' + boxStyle + '"><span>⛔ ' + esc(M.offLimit.label) + '</span></div>';
      }
    } else if (isLocal) {
      offHtml = '<div class="dp-rim-fog"></div>';
    }

    var pinsHtml = places.map(function (p, i) {
      var pt = defaults[i % defaults.length];
      var px = p.x != null ? Math.max(12, Math.min(88, p.x)) : pt[0];
      var py = p.y != null ? Math.max(18, Math.min(84, p.y)) : pt[1];
      var sel = selectedPlaceIdx === i ? ' sel' : '';
      var pm = getPoiMeta(p);
      return '<div class="dp-poi' + sel + '" data-pidx="' + i + '" style="left:' + px + '%;top:' + py + '%">' +
        '<div class="dp-poi-pin" style="background:' + pm.color + '"><b>' + esc(pm.glyph) + '</b></div>' +
        '<div class="dp-poi-name" style="color:' + pm.txtColor + '">' + esc(p.name) + '</div>' +
      '</div>';
    }).join('');

    var listHtml = places.map(function (p, i) {
      var sel = selectedPlaceIdx === i ? ' sel' : '';
      var pm = getPoiMeta(p);
      return '<div class="dp-place-item' + sel + '" data-pidx="' + i + '">' +
        '<div class="dp-place-left">' +
          '<span class="dp-place-dot" style="background:' + pm.color + '">' + esc(pm.glyph) + '</span>' +
          '<div><b>' + esc(p.name) + '</b><div class="dp-sub">' + esc(p.type || 'Công cộng') + '</div></div>' +
        '</div>' +
        '<div class="dp-sub" style="text-align:right;font-weight:600;white-space:nowrap">' + esc(p.dist || '') + '</div>' +
      '</div>';
    }).join('');

    return '<div class="dp-map-search"><span>🔍 ' + esc(M.area || 'Bản đồ khu vực') + '</span><span class="dp-tag">' + mapBadge + '</span></div>' +
      '<div class="dp-map-canvas">' +
        '<div class="dp-map-stage' + (mapZoomed ? ' zoomed' : '') + '">' +
          buildStreetMapSvg(mode, T) +
          offHtml +
          pinsHtml +
          '<div class="dp-me"><div class="dp-me-dot"></div><div class="dp-me-lbl">Bạn đang ở đây</div></div>' +
        '</div>' +
        '<div class="dp-map-ctrl">' +
          '<button type="button" class="dp-map-btn" data-zoom="toggle" title="Phóng to / Thu nhỏ">' + (mapZoomed ? '−' : '+') + '</button>' +
          '<button type="button" class="dp-map-btn" data-zoom="reset" title="Về vị trí hiện tại">◎</button>' +
        '</div>' +
      '</div>' +
      '<div class="dp-card" style="padding:8px 10px"><div class="dp-line"><b>📍 ' + esc(M.currentSpot || M.area || 'Vị trí hiện tại') + '</b></div>' +
      (M.note ? '<div class="dp-sub">' + esc(M.note) + '</div>' : '') + '</div>' +
      listHtml;
  }

  function renderBio() {
    var B = S.bio || {};
    var pct = (B.medDaysMax && B.medDaysLeft != null)
      ? Math.max(0, Math.min(100, Math.round((B.medDaysLeft / B.medDaysMax) * 100)))
      : null;
    var isLow = pct !== null && (B.medDaysMax >= 20 ? B.medDaysLeft <= 4 : B.medDaysLeft <= 1);
    var fillColor = isLow ? '#e05d44' : T.accent;
    return '<div class="dp-card">' +
        '<div class="dp-tag">THẺ ĐỊNH DANH BIO-ID</div>' +
        '<div class="dp-title" style="margin-top:6px">' + esc(B.name || 'Chưa xác định') + '</div>' +
        '<div class="dp-line"><span class="dp-sub">Mã định danh:</span> <b>' + esc(B.idCode || '---') + '</b></div>' +
        '<div class="dp-line"><span class="dp-sub">Trạng thái:</span> ' + esc(B.status || 'Hợp lệ') + '</div>' +
        '<div class="dp-line"><span class="dp-sub">Thiết bị:</span> ' + esc(B.deviceNote || 'Thiết bị cá nhân') + '</div>' +
      '</div>' +
      (pct !== null ? (
        '<div class="dp-card">' +
          '<div class="dp-row"><b>' + esc(B.medLabel || 'Lịch Y Tế') + '</b><span class="dp-sub" style="' + (isLow ? 'color:#e05d44;font-weight:700' : '') + '">' + esc(B.medDaysLeft) + '/' + esc(B.medDaysMax) + ' ngày</span></div>' +
          '<div class="dp-bar-track"><div class="dp-bar-fill" style="width:' + pct + '%;background:' + fillColor + '"></div></div>' +
        '</div>'
      ) : '');
  }

  var active = S.activeTab || 'msgs';
  var tabs = [
    { id: 'msgs', label: '💬 Tin nhắn' },
    { id: 'feed', label: '🌐 Mạng XH' },
    { id: 'map', label: '🗺️ Bản đồ' },
    { id: 'id', label: '🪪 Bio-ID' }
  ];

  function drawFull() {
    var content = active === 'feed' ? renderFeed()
      : active === 'map' ? renderMap()
      : active === 'id' ? renderBio()
      : renderMsgs();

    var navHtml = tabs.map(function (t) {
      return '<button type="button" data-tab="' + t.id + '" class="' + (active === t.id ? 'active' : '') + '">' + t.label + '</button>';
    }).join('');

    root.innerHTML =
      '<style>' + css + '</style>' +
      '<div class="dp-wrap"><div class="dp-phone">' +
        statusBar +
        (S.alert ? '<div class="dp-alert">' + esc(S.alert) + '</div>' : '') +
        '<div class="dp-body">' + content + '</div>' +
        '<div class="dp-nav">' + navHtml + '</div>' +
      '</div></div>';

    var btns = root.querySelectorAll('.dp-nav button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        active = this.getAttribute('data-tab');
        drawFull();
      });
    }

    var poiEls = root.querySelectorAll('[data-pidx]');
    for (var j = 0; j < poiEls.length; j++) {
      poiEls[j].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-pidx'), 10);
        selectedPlaceIdx = selectedPlaceIdx === idx ? -1 : idx;
        drawFull();
      });
    }

    var zoomBtns = root.querySelectorAll('[data-zoom]');
    for (var k = 0; k < zoomBtns.length; k++) {
      zoomBtns[k].addEventListener('click', function () {
        var act = this.getAttribute('data-zoom');
        if (act === 'toggle') {
          mapZoomed = !mapZoomed;
        } else {
          mapZoomed = false;
          selectedPlaceIdx = -1;
        }
        drawFull();
      });
    }
  }

  drawFull();
})();
