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
      bg: '#f6f5f0', card: '#ffffff', border: '#dfd9cc', text: '#2b2d2f',
      sub: '#707478', accent: '#3d7a6e', accentSoft: '#e6f1ee',
      barBg: '#ece9df', barText: '#2b2d2f', signal: 4, glitch: false
    },
    switching: {
      bg: '#141114', card: '#1f191d', border: '#a84432', text: '#f4e9e4',
      sub: '#c29990', accent: '#e05d44', accentSoft: '#3a1b18',
      barBg: '#261414', barText: '#ffb3a3', signal: 1, glitch: true
    },
    geflich: {
      bg: '#101815', card: '#17231e', border: '#273d33', text: '#e8f1ec',
      sub: '#92aba0', accent: '#48b884', accentSoft: '#193529',
      barBg: '#0c1310', barText: '#d4ebe0', signal: 4, glitch: false
    },
    aurora: {
      bg: '#f2f6fa', card: '#ffffff', border: '#cfdbe8', text: '#172330',
      sub: '#62768c', accent: '#2c7be5', accentSoft: '#e6f0fc',
      barBg: '#e4edf6', barText: '#172330', signal: 4, glitch: false
    },
    buffer: {
      bg: '#16171a', card: '#1f2126', border: '#3a3d45', text: '#e3e4e8',
      sub: '#8e929c', accent: '#d69e3a', accentSoft: '#302819',
      barBg: '#101114', barText: '#d9b56c', signal: 2, glitch: false
    }
  };

  var mode = THEMES[S.netMode] ? S.netMode : 'geflich';
  var T = THEMES[mode];

  function signalSvg(bars) {
    var html = '<span class="dp-sig">';
    for (var i = 1; i <= 4; i++) {
      var on = i <= bars;
      html += '<i style="height:' + (i * 3 + 2) + 'px;opacity:' + (on ? '1' : '0.25') + '"></i>';
    }
    return html + '</span>';
  }

  var css = [
    '.dp-wrap{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:410px;margin:10px auto;color:' + T.text + ';font-size:13px;line-height:1.45;box-sizing:border-box}',
    '.dp-wrap *{box-sizing:border-box}',
    '.dp-phone{background:' + T.bg + ';border:1.5px solid ' + T.border + ';border-radius:20px;overflow:hidden;box-shadow:0 10px 28px rgba(0,0,0,.22)}',
    '.dp-notify-box{background:' + T.card + ';border:1.5px solid ' + T.border + ';border-left:4px solid ' + T.accent + ';border-radius:14px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.18)}',
    '.dp-status{display:flex;justify-content:space-between;align-items:center;padding:7px 14px;background:' + T.barBg + ';color:' + T.barText + ';font-size:11px;font-weight:600;letter-spacing:.2px;border-bottom:1px solid ' + T.border + '}',
    '.dp-sig{display:inline-flex;align-items:flex-end;gap:2px;margin-right:6px;vertical-align:middle}',
    '.dp-sig i{display:inline-block;width:3px;background:currentColor;border-radius:1px}',
    '.dp-alert{background:' + T.accentSoft + ';color:' + T.accent + ';padding:8px 13px;font-size:12px;font-weight:600;border-bottom:1px solid ' + T.border + '}',
    '.dp-body{padding:12px 13px;max-height:460px;overflow-y:auto}',
    '.dp-tag{display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;padding:2px 8px;border-radius:999px;background:' + T.accentSoft + ';color:' + T.accent + ';margin-bottom:6px}',
    '.dp-title{font-size:14px;font-weight:700;margin:2px 0 6px}',
    '.dp-line{margin:4px 0;color:' + T.text + '}',
    '.dp-sub{font-size:11.5px;color:' + T.sub + '}',
    '.dp-badge{margin-top:8px;padding:6px 9px;border-radius:8px;background:' + T.accentSoft + ';color:' + T.accent + ';font-size:11.5px;font-weight:600}',
    '.dp-card{background:' + T.card + ';border:1px solid ' + T.border + ';border-radius:12px;padding:10px 11px;margin-bottom:9px}',
    '.dp-card.uncanny{border-left:3px solid ' + T.accent + '}',
    '.dp-row{display:flex;justify-content:space-between;align-items:baseline;gap:8px}',
    '.dp-msg-invalid{color:#d9534f;font-size:11px;font-weight:600;margin-top:4px}',
    '.dp-msg-unread{border-left:3px solid ' + T.accent + '}',
    '.dp-cmt{margin-top:6px;padding-left:9px;border-left:2px solid ' + T.border + ';font-size:12px;color:' + T.sub + '}',
    '.dp-cmt.hidden{font-style:italic;opacity:.7}',
    '.dp-map-grid{position:relative;height:150px;border-radius:10px;border:1px solid ' + T.border + ';background-image:linear-gradient(' + T.border + ' 1px,transparent 1px),linear-gradient(90deg,' + T.border + ' 1px,transparent 1px);background-size:22px 22px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:10px;text-align:center;overflow:hidden;margin-bottom:9px}',
    '.dp-map-fog{position:absolute;inset:0;box-shadow:inset 0 0 38px 18px ' + T.bg + ';pointer-events:none}',
    '.dp-pin{display:inline-block;padding:3px 9px;border-radius:999px;background:' + T.accent + ';color:#fff;font-size:11px;font-weight:700;margin:3px}',
    '.dp-bar-track{height:8px;border-radius:999px;background:' + T.barBg + ';overflow:hidden;margin:6px 0}',
    '.dp-bar-fill{height:100%;background:' + T.accent + ';border-radius:999px}',
    '.dp-nav{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid ' + T.border + ';background:' + T.barBg + '}',
    '.dp-nav button{appearance:none;border:0;background:transparent;color:' + T.sub + ';padding:9px 4px;font-size:11px;font-weight:600;cursor:pointer;border-top:2px solid transparent}',
    '.dp-nav button.active{color:' + T.accent + ';border-top-color:' + T.accent + ';background:' + T.card + '}',
    T.glitch ? '@keyframes dpGlitch{0%,100%{opacity:1}50%{opacity:.82}}.dp-phone,.dp-notify-box{animation:dpGlitch 1.6s infinite}' : ''
  ].join('');

  var statusBar =
    '<div class="dp-status">' +
      '<span>' + signalSvg(T.signal) + esc(S.carrier || 'MẠNG 3791') + '</span>' +
      '<span>' + esc(S.clock || '') + ' • 🔋' + esc(S.battery != null ? S.battery : 80) + '%</span>' +
    '</div>';

  if (S.view === 'notify') {
    var N = S.notify || {};
    var linesHtml = (N.lines || []).map(function (l) {
      return '<div class="dp-line">' + esc(l) + '</div>';
    }).join('');
    root.innerHTML =
      '<style>' + css + '</style>' +
      '<div class="dp-wrap"><div class="dp-notify-box">' +
        statusBar +
        '<div class="dp-body">' +
          '<div class="dp-tag">' + esc(N.tag || 'THÔNG BÁO') + '</div>' +
          (N.sender ? '<div class="dp-sub">Từ: <b>' + esc(N.sender) + '</b></div>' : '') +
          '<div class="dp-title">' + esc(N.title || '') + '</div>' +
          linesHtml +
          (N.badge ? '<div class="dp-badge">' + esc(N.badge) + '</div>' : '') +
        '</div>' +
      '</div></div>';
    return;
  }

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
      h += '<div class="dp-card" style="background:' + T.accentSoft + '"><div class="dp-tag">THÔNG BÁO GHIM</div><div class="dp-line">' + esc(S.feedPinned) + '</div></div>';
    }
    var posts = S.posts || [];
    if (!posts.length) return h + '<div class="dp-card dp-sub">Không có bài đăng mới.</div>';
    return h + posts.map(function (p) {
      var cmts = (p.comments || []).map(function (c) {
        return '<div class="dp-cmt' + (c.hidden ? ' hidden' : '') + '"><b>' + esc(c.user) + ':</b> ' + esc(c.text) + '</div>';
      }).join('');
      return '<div class="dp-card' + (p.uncanny ? ' uncanny' : '') + '">' +
        '<div class="dp-row"><span class="dp-tag">' + esc(p.sub) + '</span><span class="dp-sub">' + esc(p.user) + '</span></div>' +
        '<div class="dp-title">' + esc(p.title) + '</div>' +
        '<div class="dp-line">' + esc(p.body) + '</div>' +
        cmts +
      '</div>';
    }).join('');
  }

  function renderMap() {
    var M = S.map || {};
    var isSmall = M.scope === 'small_town' || mode === 'sim_zone';
    var pins = (M.pins || []).map(function (p) {
      return '<span class="dp-pin">📍 ' + esc(p) + '</span>';
    }).join('');
    return '<div class="dp-map-grid">' +
        (isSmall ? '<div class="dp-map-fog"></div>' : '') +
        '<div class="dp-tag">' + (isSmall ? 'BẢN ĐỒ CỤC BỘ' : 'BẢN ĐỒ ĐẠI LỤC 3791') + '</div>' +
        '<div class="dp-title">' + esc(M.area || 'Đang định vị...') + '</div>' +
        '<div>' + pins + '</div>' +
      '</div>' +
      '<div class="dp-card"><div class="dp-sub">' + esc(M.note || '') + '</div></div>';
  }

  function renderBio() {
    var B = S.bio || {};
    var pct = (B.medDaysMax && B.medDaysLeft != null)
      ? Math.max(0, Math.min(100, Math.round((B.medDaysLeft / B.medDaysMax) * 100)))
      : null;
    return '<div class="dp-card">' +
        '<div class="dp-tag">THẺ ĐỊNH DANH BIO-ID</div>' +
        '<div class="dp-title">' + esc(B.name || 'Chưa xác định') + '</div>' +
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
  }

  drawFull();
})();
