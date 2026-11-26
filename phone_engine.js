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
      barBg: '#eae6db', barText: '#26292b', mapBg: '#ebe8dd', road: '#ffffff',
      water: '#cfe5e8', offBg: 'rgba(130,136,140,0.22)', offStroke: '#8d9499',
      signal: 4, glitch: false
    },
    switching: {
      bg: '#131012', card: '#1e171b', border: '#a84432', text: '#f4e9e4',
      sub: '#c29990', accent: '#e05d44', accentSoft: '#3a1b18',
      barBg: '#261414', barText: '#ffb3a3', mapBg: '#1c1518', road: '#3a292e',
      water: '#2b1e28', offBg: 'rgba(224,93,68,0.22)', offStroke: '#e05d44',
      signal: 1, glitch: true
    },
    geflich: {
      bg: '#101815', card: '#17231e', border: '#273d33', text: '#e8f1ec',
      sub: '#92aba0', accent: '#48b884', accentSoft: '#193529',
      barBg: '#0c1310', barText: '#d4ebe0', mapBg: '#13201a', road: '#274034',
      water: '#163842', offBg: 'rgba(198,83,75,0.20)', offStroke: '#c6534b',
      signal: 4, glitch: false
    },
    aurora: {
      bg: '#f1f6fb', card: '#ffffff', border: '#cddae8', text: '#162230',
      sub: '#60748a', accent: '#2574df', accentSoft: '#e4effc',
      barBg: '#e2ecf7', barText: '#162230', mapBg: '#e9f0f7', road: '#ffffff',
      water: '#cbe0f5', offBg: 'rgba(196,69,69,0.16)', offStroke: '#c44545',
      signal: 4, glitch: false
    },
    buffer: {
      bg: '#16171a', card: '#1f2126', border: '#3a3d45', text: '#e3e4e8',
      sub: '#8e929c', accent: '#d69e3a', accentSoft: '#302819',
      barBg: '#101114', barText: '#d9b56c', mapBg: '#1a1c20', road: '#2f323b',
      water: '#1e2730', offBg: 'rgba(214,158,58,0.20)', offStroke: '#d69e3a',
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
    '.dp-body{padding:11px 12px;max-height:480px;overflow-y:auto}',
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
    /* Google-Maps-style Map UI */
    '.dp-map-search{display:flex;align-items:center;justify-content:space-between;background:' + T.card + ';border:1px solid ' + T.border + ';border-radius:999px;padding:6px 12px;font-size:11.5px;color:' + T.sub + ';margin-bottom:8px;box-shadow:0 2px 6px rgba(0,0,0,.06)}',
    '.dp-map-canvas{position:relative;height:210px;border-radius:13px;border:1px solid ' + T.border + ';background:' + T.mapBg + ';overflow:hidden;margin-bottom:9px}',
    '.dp-map-roads{position:absolute;inset:0;background-image:linear-gradient(' + T.road + ' 2px,transparent 2px),linear-gradient(90deg,' + T.road + ' 2px,transparent 2px),linear-gradient(' + T.border + ' 1px,transparent 1px),linear-gradient(90deg,' + T.border + ' 1px,transparent 1px);background-size:74px 74px,74px 74px,24px 24px,24px 24px;opacity:.65}',
    '.dp-map-water{position:absolute;background:' + T.water + ';opacity:.75}',
    '.dp-offlimit{position:absolute;background:repeating-linear-gradient(-45deg,' + T.offBg + ',' + T.offBg + ' 6px,transparent 6px,transparent 12px);border:1.5px dashed ' + T.offStroke + ';display:flex;align-items:center;justify-content:center;text-align:center;padding:6px;z-index:2}',
    '.dp-offlimit span{background:' + T.card + ';color:' + T.offStroke + ';font-size:9.5px;font-weight:700;padding:2px 6px;border-radius:6px;border:1px solid ' + T.offStroke + ';max-width:130px;line-height:1.25}',
    '.dp-rim-fog{position:absolute;inset:0;box-shadow:inset 0 0 34px 16px ' + T.bg + ';pointer-events:none;z-index:2}',
    '.dp-me{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:4;display:flex;flex-direction:column;align-items:center}',
    '.dp-me-dot{width:14px;height:14px;border-radius:50%;background:#2563eb;border:2.5px solid #fff;box-shadow:0 0 0 6px rgba(37,99,235,.26);animation:dpPulse 2s infinite}',
    '.dp-me-lbl{margin-top:3px;font-size:9.5px;font-weight:700;background:#1e3a8a;color:#fff;padding:1px 6px;border-radius:999px;white-space:nowrap}',
    '.dp-poi{position:absolute;transform:translate(-50%,-50%);z-index:3;background:' + T.card + ';border:1.5px solid ' + T.border + ';border-radius:999px;padding:2px 7px;font-size:10.5px;font-weight:700;color:' + T.text + ';box-shadow:0 2px 6px rgba(0,0,0,.18);cursor:pointer;white-space:nowrap;max-width:135px;overflow:hidden;text-overflow:ellipsis;transition:transform .15s}',
    '.dp-poi.sel{border-color:' + T.accent + ';background:' + T.accent + ';color:#fff;transform:translate(-50%,-50%) scale(1.08);z-index:5}',
    '.dp-place-item{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 9px;border-radius:10px;border:1px solid ' + T.border + ';background:' + T.card + ';margin-bottom:6px;cursor:pointer}',
    '.dp-place-item.sel{border-color:' + T.accent + ';background:' + T.accentSoft + '}',
    '.dp-bar-track{height:8px;border-radius:999px;background:' + T.barBg + ';overflow:hidden;margin:6px 0}',
    '.dp-bar-fill{height:100%;background:' + T.accent + ';border-radius:999px}',
    '.dp-nav{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid ' + T.border + ';background:' + T.barBg + '}',
    '.dp-nav button{appearance:none;border:0;background:transparent;color:' + T.sub + ';padding:9px 4px;font-size:11px;font-weight:600;cursor:pointer;border-top:2px solid transparent}',
    '.dp-nav button.active{color:' + T.accent + ';border-top-color:' + T.accent + ';background:' + T.card + '}',
    '@keyframes dpPulse{0%,100%{box-shadow:0 0 0 4px rgba(37,99,235,.28)}50%{box-shadow:0 0 0 11px rgba(37,99,235,.06)}}',
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
    var isSmall = M.scope === 'small_town' || mode === 'sim_zone';
    var defaults = [[23, 27], [75, 70], [26, 75], [76, 26], [50, 18]];

    // Normalize places (supports both new `places` array and legacy `pins` array)
    var places = Array.isArray(M.places) && M.places.length
      ? M.places
      : (M.pins || []).map(function (name, i) {
          var pt = defaults[i % defaults.length];
          return { name: name, type: 'Địa điểm', icon: '📍', dist: 'Gần đây', x: pt[0], y: pt[1] };
        });

    // Stylized geography layer (river for Geflich, coast for Aurora)
    var waterHtml = '';
    if (mode === 'geflich') {
      waterHtml = '<div class="dp-map-water" style="left:-10%;bottom:12%;width:120%;height:26px;transform:rotate(-8deg);border-radius:20px"></div>';
    } else if (mode === 'aurora') {
      waterHtml = '<div class="dp-map-water" style="right:0;top:0;width:24%;height:100%;border-left:2px solid ' + T.border + '"></div>';
    }

    // Off-limit / Unmapped restricted area
    var offHtml = '';
    if (M.offLimit && M.offLimit.label) {
      var pos = M.offLimit.pos || (isSmall ? 'rim' : 'top-right');
      if (pos === 'rim') {
        offHtml = '<div class="dp-rim-fog"></div><div class="dp-offlimit" style="top:6px;left:50%;transform:translateX(-50%);width:76%;height:28px;border-radius:8px"><span>⛔ ' + esc(M.offLimit.label) + '</span></div>';
      } else {
        var boxStyle = pos === 'top-left' ? 'top:8px;left:8px;width:40%;height:38%;border-radius:10px'
          : pos === 'bottom-right' ? 'bottom:8px;right:8px;width:42%;height:38%;border-radius:10px'
          : 'top:8px;right:8px;width:42%;height:38%;border-radius:10px';
        offHtml = '<div class="dp-offlimit" style="' + boxStyle + '"><span>⛔ ' + esc(M.offLimit.label) + '</span></div>';
      }
    } else if (isSmall) {
      offHtml = '<div class="dp-rim-fog"></div>';
    }

    var pinsHtml = places.map(function (p, i) {
      var pt = defaults[i % defaults.length];
      var px = p.x != null ? Math.max(12, Math.min(88, p.x)) : pt[0];
      var py = p.y != null ? Math.max(16, Math.min(86, p.y)) : pt[1];
      var sel = selectedPlaceIdx === i ? ' sel' : '';
      return '<div class="dp-poi' + sel + '" data-pidx="' + i + '" style="left:' + px + '%;top:' + py + '%">' + esc(p.icon || '📍') + ' ' + esc(p.name) + '</div>';
    }).join('');

    var listHtml = places.map(function (p, i) {
      var sel = selectedPlaceIdx === i ? ' sel' : '';
      return '<div class="dp-place-item' + sel + '" data-pidx="' + i + '">' +
        '<div><b>' + esc(p.icon || '📍') + ' ' + esc(p.name) + '</b><div class="dp-sub">' + esc(p.type || 'Công cộng') + '</div></div>' +
        '<div class="dp-sub" style="text-align:right;font-weight:600">' + esc(p.dist || '') + '</div>' +
      '</div>';
    }).join('');

    return '<div class="dp-map-search"><span>🔍 ' + esc(M.area || 'Bản đồ khu vực') + '</span><span class="dp-tag">' + (isSmall ? 'CỤC BỘ' : 'GPS TRỰC TIẾP') + '</span></div>' +
      '<div class="dp-map-canvas">' +
        '<div class="dp-map-roads"></div>' +
        waterHtml +
        offHtml +
        pinsHtml +
        '<div class="dp-me"><div class="dp-me-dot"></div><div class="dp-me-lbl">Bạn đang ở đây</div></div>' +
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
    return '<div class="dp-card">' +
        '<div class="dp-tag">THẺ ĐỊNH DANH BIO-ID</div>' +
        '<div class="dp-title" style="margin-top:6px">' + esc(B.name || 'Chưa xác định') + '</div>' +
        '<div class="dp-line"><span class="dp-sub">Mã định danh:</span> <b>' + esc(B.idCode || '---') + '</b></div>' +
        '<div class="dp-line"><span class="dp-sub">Trạng thái:</span> ' + esc(B.status || 'Hợp lệ') + '</div>' +
        '<div class="dp-line"><span class="dp-sub">Thiết bị:</span> ' + esc(B.deviceNote || 'Thiết bị cá nhân') + '</div>' +
      '</div>' +
      (pct !== null ? (
        '<div class="dp-card">' +
          '<div class="dp-row"><b>' + esc(B.medLabel || 'Lịch Y Tế') + '</b><span class="dp-sub">' + esc(B.medDaysLeft) + '/' + esc(B.medDaysMax) + ' ngày</span></div>' +
          '<div class="dp-bar-track"><div class="dp-bar-fill" style="width:' + pct + '%"></div></div>' +
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
  }

  drawFull();
})();
