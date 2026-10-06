  /* ============================================================
     ページを つくる（A4・HTML）
     ============================================================ */
  const WD = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];
  const WDK = ['日', '月', '火', '水', '木', '金', '土'];
  const KINDS = {
    summer: { n: 'なつやすみ', k: '夏休み', ac: '#1C7ED6', acs: '#E7F5FF', ring: ['🌻', '🍉', '🎐', '🏖️', '🎆', '🐚', '🍧', '🌞'], icon: '🌻' },
    winter: { n: 'ふゆやすみ', k: '冬休み', ac: '#5F3DC4', acs: '#F3F0FF', ring: ['⛄', '🎍', '🎄', '🧤', '❄️', '🍊', '🎅', '🪁'], icon: '⛄' },
    spring: { n: 'はるやすみ', k: '春休み', ac: '#E64980', acs: '#FFF0F6', ring: ['🌸', '🌷', '🦋', '🍓', '🐝', '🌱', '🎒', '☀️'], icon: '🌸' }
  };
  const ETO = ['さる🐒', 'とり🐔', 'いぬ🐶', 'いのしし🐗', 'ねずみ🐭', 'うし🐮', 'とら🐯', 'うさぎ🐰', 'たつ🐲', 'へび🐍', 'うま🐴', 'ひつじ🐑'];
  const pd = s => { const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  function daysOf(P) { const a = pd(P.start), b = pd(P.end), out = []; if (!a || !b || b < a) return out; for (let d = new Date(a); d <= b && out.length < 120; d.setDate(d.getDate() + 1)) out.push(new Date(d)); return out; }
  function pickDays(P, span) {
    const all = daysOf(P);
    if (span === 'weekday') return all.filter(d => d.getDay() > 0 && d.getDay() < 6);
    if (span === 'every2') return all.filter((d, i) => i % 2 === 0);
    if (span === 'every3') return all.filter((d, i) => i % 3 === 0);
    if (span === 'week1') return all.filter((d, i) => i % 7 === 0);
    return all;
  }
  // ひらがな／かんじ（ふりがな つき）
  function L(P, hira, kanji) { return P.style.kanji && kanji ? '<ruby class="bk-ruby">' + kanji + '<rt>' + hira + '</rt></ruby>' : hira; }
  const traceSpan = t => '<span class="bk-trace bk-kyo">' + esc(t) + '</span>';
  function nameHTML(P) {
    const st = P.style, nm = P.child || '';
    if (st.nameMode === 'print' && nm) return '<span class="bk-kyo" style="font-size:6mm">' + esc(nm) + '</span>';
    if (st.nameMode === 'trace' && nm) return '<span class="bk-kyo" style="font-size:6mm">' + traceSpan(nm) + '</span>';
    return '<span class="ln" style="display:inline-block;width:46mm;border-bottom:.4mm solid #333;height:7mm"></span>';
  }
  function dateHTML(P, d, fs) {
    const st = P.style;
    const wd = d ? (st.kanji ? WDK : WD)[d.getDay()] : '';
    const txt = d ? (d.getMonth() + 1) + (st.kanji ? '月 ' : 'がつ ') + d.getDate() + (st.kanji ? '日' : 'にち') + '（' + wd + '）' : '';
    const sty = fs ? ' style="font-size:' + fs + 'mm"' : '';
    if (d && st.dateMode === 'print') return '<span class="bk-date bk-kyo"' + sty + '>' + txt + '</span>';
    if (d && st.dateMode === 'trace') return '<span class="bk-date bk-kyo"' + sty + '>' + traceSpan(txt) + '</span>';
    return '<span class="bk-date bk-kyo"' + sty + '><span class="bk-paren">（　　）</span>' + L(P, 'がつ', '月') + '<span class="bk-paren">（　　）</span>' + L(P, 'にち', '日') + '<span class="bk-paren">（　　）</span></span>';
  }
  function weatherHTML(P) {
    const W = P.kind === 'winter' ? [['☀️', 'はれ', '晴れ'], ['☁️', 'くもり', '曇り'], ['☔', 'あめ', '雨'], ['⛄', 'ゆき', '雪']] : [['☀️', 'はれ', '晴れ'], ['⛅', 'はれ／くもり', ''], ['☁️', 'くもり', '曇り'], ['☔', 'あめ', '雨']];
    if (P.style.weather === 'write') return '<span class="bk-field">' + L(P, 'てんき', '天気') + '<span class="ln" style="min-width:30mm"></span></span>';
    return '<span class="bk-weather">' + L(P, 'てんき', '天気') + W.map(w => '<span class="w"><span class="bk-emo">' + w[0] + '</span><small>' + (P.style.kanji && w[2] ? w[2] : w[1]) + '</small></span>').join('') + '</span>';
  }
  function clockSVG() {
    let s = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#333" stroke-width="3"/>';
    for (let i = 1; i <= 12; i++) { const a = (i * 30 - 90) * Math.PI / 180; s += '<text x="' + (50 + 35 * Math.cos(a)).toFixed(1) + '" y="' + (50 + 35 * Math.sin(a) + 4.5).toFixed(1) + '" font-size="12" text-anchor="middle" font-family="sans-serif" font-weight="700" fill="#333">' + i + '</text>'; }
    for (let i = 0; i < 60; i++) { if (i % 5) { const a = i * 6 * Math.PI / 180; s += '<line x1="' + (50 + 44 * Math.cos(a)).toFixed(1) + '" y1="' + (50 + 44 * Math.sin(a)).toFixed(1) + '" x2="' + (50 + 41.5 * Math.cos(a)).toFixed(1) + '" y2="' + (50 + 41.5 * Math.sin(a)).toFixed(1) + '" stroke="#999" stroke-width="1"/>'; } }
    return s + '<circle cx="50" cy="50" r="3" fill="#333"/></svg>';
  }
  // かく ところ（こどもの じったいに あわせて かわる）
  const MASU = { L: 18, M: 14, S: 10 }, GAP = { L: 15, M: 11, S: 8 };
  function writeArea(P, w, h, trace, opts) {
    opts = opts || {};
    const st = P.style, mode = opts.mode || st.writeMode;
    if (mode === 'choose') return chooseHTML(P, opts.choose || 'feel');
    if (mode === 'line') {
      const g = GAP[st.lineGap] || 11, n = Math.max(1, Math.floor(h / g));
      let s = '<div class="bk-lines" style="width:' + w + 'mm;height:' + (n * g) + 'mm">';
      for (let i = 1; i <= n; i++) { if (g >= 13) s += '<div class="l mid" style="top:' + ((i - .5) * g).toFixed(1) + 'mm"></div>'; s += '<div class="l" style="top:' + (i * g).toFixed(1) + 'mm"></div>'; }
      if (trace) s += '<div class="tx" style="top:' + (g * .18).toFixed(1) + 'mm;font-size:' + (g * .62).toFixed(1) + 'mm">' + esc(trace) + '</div>';
      return s + '</div>';
    }
    const z = MASU[st.masu] || 14, cols = Math.max(1, Math.floor(w / z)), rows = Math.max(1, Math.floor(h / z));
    const chars = mode === 'trace' && trace ? Array.from(trace) : [];
    let s = '<div class="bk-masu" style="grid-template-columns:repeat(' + cols + ',' + z + 'mm);grid-auto-rows:' + z + 'mm">';
    for (let i = 0; i < cols * rows; i++) { const ch = chars[i]; s += '<div class="c">' + (ch && ch !== ' ' ? '<span style="font-size:' + (z * .7).toFixed(1) + 'mm">' + esc(ch) + '</span>' : '') + '</div>'; }
    return s + '</div>';
  }
  const CHOOSE = {
    feel: [['😄', 'たのしい'], ['🙂', 'うれしい'], ['😐', 'ふつう'], ['😢', 'かなしい'], ['😴', 'つかれた']],
    do: [['🏠', 'いえ'], ['🏞️', 'こうえん'], ['🏊', 'プール'], ['🛒', 'かいもの'], ['🚗', 'おでかけ'], ['📺', 'テレビ'], ['🎮', 'ゲーム'], ['📚', 'ほん'], ['🧹', 'おてつだい'], ['👵', 'しんせき']],
    book: [['😄', 'おもしろい'], ['🙂', 'ふつう'], ['😐', 'むずかしい']]
  };
  function chooseHTML(P, kind) {
    const list = kind === 'both' ? CHOOSE.do.concat(CHOOSE.feel) : (CHOOSE[kind] || CHOOSE.feel);
    return '<div><div class="bk-small" style="text-align:center">あてはまるものに ○を つけよう</div><div class="bk-choose">' + list.map(o => '<div class="o"><span class="bk-emo">' + o[0] + '</span><small>' + o[1] + '</small></div>').join('') + '</div></div>';
  }
  function photoBox(src, label, cls) { return '<div class="bk-box bk-draw' + (cls ? ' ' + cls : '') + '">' + (src ? '<img src="' + src + '" alt="">' : '<span>' + esc(label || 'えを かこう') + '</span>') + '</div>'; }
  function head(P, icon, title, sub) {
    return '<div class="bk-hd"><span class="ic bk-emo">' + icon + '</span><div class="tt">' + title + (sub ? '<small>' + sub + '</small>' : '') + '</div><div class="nm">' + L(P, 'なまえ', '名前') + ' ' + nameHTML(P) + '</div></div>';
  }
  function frame(P, inner, cls) {
    const K = KINDS[P.kind] || KINDS.summer;
    return '<div class="bk-page' + (cls ? ' ' + cls : '') + '" style="--ac:' + K.ac + ';--acs:' + K.acs + '">' + inner + '<div class="bk-foot"><span>MieeL やすみの しゅくだい ／ mieel-support-school.com</span><span class="pg">%PG%</span></div></div>';
  }
  const titleOf = P => P.title || (KINDS[P.kind] || KINDS.summer).n + 'の しゅくだい';

  /* ---------- ページの しゅるい ---------- */
  const PAGE_TYPES = {
    cover: {
      n: 'ひょうし', e: '📘', d: 'タイトル・しゃしん・なまえ',
      def: () => ({}),
      make(P) {
        const K = KINDS[P.kind] || KINDS.summer, a = pd(P.start), b = pd(P.end);
        const photo = P.coverPhoto && photoById(P, P.coverPhoto);
        const per = a && b ? (a.getMonth() + 1) + L(P, 'がつ', '月') + a.getDate() + L(P, 'にち', '日') + ' 〜 ' + (b.getMonth() + 1) + L(P, 'がつ', '月') + b.getDate() + L(P, 'にち', '日') : '';
        const row = (lab, val) => '<div class="r"><b>' + lab + '</b><span class="bk-kyo" style="flex:1">' + val + '</span></div>';
        return [frame(P, '<div class="yr">' + (a ? (a.getMonth() < 3 ? a.getFullYear() - 1 : a.getFullYear()) + (P.style.kanji ? '年度' : 'ねんど') : '') + '</div>' +
          '<div class="ring bk-emo">' + K.ring.slice(0, 4).join('') + '</div><h1>' + esc(titleOf(P)) + '</h1><div class="ring bk-emo">' + K.ring.slice(4, 8).join('') + '</div>' +
          '<div class="ph">' + (photo ? '<img src="' + photo.src + '" alt="">' : 'じぶんの かおを かこう／しゃしんを はろう') + '</div>' +
          '<div class="info">' + (per ? row(L(P, 'きかん', '期間'), per) : '') + row(L(P, 'がっこう', '学校'), esc(P.school || '')) + row(L(P, 'くみ', '組'), esc(P.klass || '')) + row(L(P, 'なまえ', '名前'), nameHTML(P)) + '</div>', 'bk-cover')];
      }
    },
    list: {
      n: 'しゅくだい いちらん', e: '📋', d: 'やることと チェック・おうちの ひとの サイン',
      def: () => ({ extra: '' }),
      make(P, pg) {
        const rows = [];
        P.pages.forEach(x => { if (['cover', 'list', 'cert'].indexOf(x.type) >= 0) return; const T = PAGE_TYPES[x.type]; if (!T) return; rows.push([x.type === 'ext' ? (x.icon || '📝') : T.e, x.type === 'ext' ? (x.appTitle ? x.appTitle + '：' : '') + (x.itemName || 'プリント') : (x.title || T.n), countOf(P, x)]); });
        String(pg.extra || '').split(/\n/).map(s => s.trim()).filter(Boolean).forEach(s => rows.push(['⭐', s, '']));
        const tr = rows.map((r, i) => '<tr><td>' + (i + 1) + '</td><td class="bk-emo" style="font-size:6mm">' + r[0] + '</td><td class="l bk-kyo" style="font-size:5mm">' + esc(r[1]) + '</td><td style="font-size:3.6mm">' + esc(r[2]) + '</td><td><span class="st"></span></td><td></td></tr>').join('');
        return [frame(P, head(P, '📋', L(P, 'しゅくだい いちらん', '宿題一覧'), 'おわったら ○を かこう・シールを はろう') +
          '<div class="bk-body"><table class="bk-tbl"><colgroup><col style="width:9mm"><col style="width:13mm"><col><col style="width:26mm"><col style="width:22mm"><col style="width:30mm"></colgroup><tr><th>ばん</th><th></th><th>' + L(P, 'やること', '') + '</th><th>' + L(P, 'かず', '数') + '</th><th>できたら ○</th><th>' + L(P, 'おうちの ひと', 'おうちの人') + '</th></tr>' + tr +
          Array.from({ length: Math.max(0, 14 - rows.length) }, () => '<tr><td style="height:12mm"></td><td></td><td></td><td></td><td><span class="st"></span></td><td></td></tr>').join('') + '</table></div>')];
      }
    },
    calendar: {
      n: 'カレンダー', e: '📅', d: 'できた ひに ○・シール。よていも かける',
      def: () => ({ events: '', perPage: 1 }),
      make(P, pg) {
        const days = daysOf(P); if (!days.length) return [frame(P, head(P, '📅', 'カレンダー') + '<div class="bk-small">きかんを せっていしてください</div>')];
        const ev = {}; String(pg.events || '').split(/\n/).forEach(l => { const m = l.match(/^\s*(\d{1,2})[\/\-月がつ.]\s*(\d{1,2})\s*(?:にち|日)?\s*[:：\s]\s*(.+)$/); if (m) ev[(+m[1]) + '-' + (+m[2])] = m[3]; });
        const months = []; days.forEach(d => { const k = d.getFullYear() * 12 + d.getMonth(); if (months.indexOf(k) < 0) months.push(k); });
        const first = days[0], last = days[days.length - 1];
        const monthHTML = (k, hh) => {
          const y = Math.floor(k / 12), m = k % 12, d1 = new Date(y, m, 1), nd = new Date(y, m + 1, 0).getDate();
          let s = '<div style="font-size:6mm;margin:1mm 0" class="bk-kyo">' + (m + 1) + L(P, 'がつ', '月') + '</div><div class="bk-cal" style="grid-template-rows:7mm repeat(' + Math.ceil((d1.getDay() + nd) / 7) + ',' + hh + 'mm)">' + WD.map((w, i) => '<div class="h ' + (i === 0 ? 'sun' : i === 6 ? 'sat' : '') + '">' + (P.style.kanji ? WDK[i] : w) + '</div>').join('');
          for (let i = 0; i < d1.getDay(); i++) s += '<div class="x"></div>';
          for (let dd = 1; dd <= nd; dd++) {
            const dt = new Date(y, m, dd), inR = dt >= new Date(first.getFullYear(), first.getMonth(), first.getDate()) && dt <= last, dw = dt.getDay();
            s += '<div class="d ' + (inR ? '' : 'x ') + (dw === 0 ? 'sun' : dw === 6 ? 'sat' : '') + '">' + dd + (ev[(m + 1) + '-' + dd] ? '<span class="ev">' + esc(ev[(m + 1) + '-' + dd]) + '</span>' : '') + (inR ? '<span class="st"></span>' : '') + '</div>';
          }
          return s + '</div>';
        };
        const per = +pg.perPage === 2 ? 2 : 1, out = [];
        for (let i = 0; i < months.length; i += per) {
          const grp = months.slice(i, i + per), hh = per === 2 ? 17 : 34;
          out.push(frame(P, head(P, '📅', L(P, 'やすみの カレンダー', '休みのカレンダー'), 'できた ひに ○を かこう・シールを はろう') + '<div class="bk-body">' + grp.map(k => monthHTML(k, hh)).join('') + '</div>'));
        }
        return out;
      }
    },
    daily: {
      n: 'まいにちの きろく', e: '🌞', d: 'ひづけ・てんき・できた こと・ひとこと',
      def: () => ({ span: 'week', perPage: 1, items: 'はみがき,おてつだい,しゅくだい,うんどう', clock: true, comment: true, photo: false }),
      make(P, pg) {
        const items = String(pg.items || '').split(/[,、\n]/).map(s => s.trim()).filter(Boolean);
        if (pg.span === 'week') {
          const days = daysOf(P), out = [];
          for (let i = 0; i < days.length; i += 7) {
            const wk = days.slice(i, i + 7);
            const th = '<tr><th style="width:30mm">' + L(P, 'ひづけ', '日付') + '</th><th style="width:28mm">' + L(P, 'てんき', '天気') + '</th>' + (pg.clock ? '<th style="width:18mm">' + L(P, 'おきた', '起きた') + '</th><th style="width:18mm">' + L(P, 'ねた', 'ねた') + '</th>' : '') + items.map(t => '<th style="font-size:3.2mm;line-height:1.2;word-break:break-all">' + esc(t) + '</th>').join('') + (pg.comment ? '<th style="width:42mm">' + L(P, 'ひとこと', '一言') + '</th>' : '') + '</tr>';
            const tr = wk.map(d => '<tr style="height:30mm"><td class="bk-kyo">' + dateHTML(P, d, 4.4) + '</td><td class="bk-emo" style="font-size:6mm;line-height:1.5">' + (P.style.weather === 'write' ? '' : (P.kind === 'winter' ? '☀️☁️<br>☔⛄' : '☀️☁️<br>☔🌈')) + '</td>' + (pg.clock ? '<td style="font-size:3.6mm">　じ<br>　ふん</td><td style="font-size:3.6mm">　じ<br>　ふん</td>' : '') + items.map(() => '<td><span class="st"></span></td>').join('') + (pg.comment ? '<td></td>' : '') + '</tr>').join('');
            out.push(frame(P, head(P, '🌞', L(P, 'まいにちの きろく', '毎日の記録'), (wk[0].getMonth() + 1) + '/' + wk[0].getDate() + ' 〜 ' + (wk[wk.length - 1].getMonth() + 1) + '/' + wk[wk.length - 1].getDate() + '　できたら ○') + '<div class="bk-body"><table class="bk-tbl">' + th + tr + '</table>' + (P.style.weather !== 'write' ? '<div class="bk-small">てんきは ○で かこもう</div>' : '') + '</div>'));
          }
          return out;
        }
        const days = pickDays(P, pg.span), per = +pg.perPage === 2 ? 2 : 1, out = [];
        const block = (d, hgt) => {
          const comH = per === 1 ? (pg.photo ? 55 : 95) : (pg.photo ? 18 : 40);
          return '<div class="bk-box" style="flex:1;padding:3mm;display:flex;flex-direction:column;gap:2.5mm;min-height:0">' +
            '<div class="bk-row" style="justify-content:space-between;align-items:center">' + dateHTML(P, d) + weatherHTML(P) + '</div>' +
            (pg.clock ? '<div class="bk-row" style="gap:10mm;justify-content:center"><span class="bk-clock">' + clockSVG() + L(P, 'おきた じかん', '起きた時間') + '</span><span class="bk-clock">' + clockSVG() + L(P, 'ねた じかん', 'ねた時間') + '</span></div>' : '') +
            (items.length ? '<div class="bk-chk">' + items.map(t => '<span><i></i>' + esc(t) + '</span>').join('') + '</div>' : '') +
            (pg.photo ? photoBox('', 'しゃしん・え') : '') +
            (pg.comment ? '<div><div class="bk-small">' + L(P, 'きょうの ひとこと', '今日の一言') + '</div>' + writeArea(P, 180, comH, P.style.writeMode === 'trace' ? (pg.trace || 'きょうは ') : '', { choose: 'both' }) + '</div>' : '') +
            (!pg.photo && per === 1 ? '<div style="flex:1;min-height:20mm;display:flex">' + photoBox('', 'えを かこう・しゃしんを はろう') + '</div>' : '') + '</div>';
        };
        for (let i = 0; i < days.length; i += per) out.push(frame(P, head(P, '🌞', L(P, 'まいにちの きろく', '毎日の記録')) + '<div class="bk-body">' + days.slice(i, i + per).map(d => block(d)).join('') + '</div>'));
        return out.length ? out : [frame(P, head(P, '🌞', 'まいにちの きろく') + '<div class="bk-small">きかんを せっていしてください</div>')];
      }
    },
    diary: {
      n: 'えにっき', e: '📔', d: 'え（しゃしん）と ぶん',
      def: () => ({ count: 3, photos: false, trace: 'きょうは ' }),
      make(P, pg) {
        const out = [], ph = pg.photos ? P.photos.slice() : [];
        for (let i = 0; i < Math.max(1, +pg.count || 1); i++) {
          const p = ph[i];
          out.push(frame(P, head(P, '📔', L(P, 'えにっき', '絵日記')) + '<div class="bk-body"><div class="bk-row" style="justify-content:space-between;align-items:center">' + (p && p.date ? dateHTML(P, pd(p.date)) : dateHTML(P, null)) + weatherHTML(P) + '</div>' +
            '<div style="height:' + (P.style.writeMode === 'choose' ? 165 : 105) + 'mm;display:flex">' + photoBox(p ? p.src : '', 'えを かこう') + '</div>' +
            (p && p.caption ? '<div class="bk-small">📷 ' + esc(p.caption) + '</div>' : '') +
            '<div style="flex:1;min-height:0">' + writeArea(P, 186, p && p.caption ? 100 : 108, pg.trace || '', { choose: 'both' }) + '</div></div>'));
        }
        return out;
      }
    },
    photos: {
      n: 'おもいで しゃしん', e: '📸', d: 'やすみの しゃしんと ひとこと',
      def: () => ({ perPage: 2, blank: 2, comment: true }),
      make(P, pg) {
        const per = [1, 2, 4].indexOf(+pg.perPage) >= 0 ? +pg.perPage : 2;
        let list = P.photos.slice();
        if (!list.length) list = Array.from({ length: Math.max(per, +pg.blank || per) }, () => null);
        const out = [];
        for (let i = 0; i < list.length; i += per) {
          const grp = list.slice(i, i + per);
          const cell = p => '<div class="bk-card" style="flex:1;padding:2.5mm;gap:2mm">' + '<div style="flex:1;min-height:0;display:flex">' + photoBox(p ? p.src : '', 'しゃしんを はろう', 'contain') + '</div>' +
            '<div class="bk-row" style="align-items:center;justify-content:space-between;font-size:4mm">' + (p && p.date ? dateHTML(P, pd(p.date), 4.4) : dateHTML(P, null, 4.4)) + (p && p.caption ? '<span class="bk-kyo" style="font-size:4.6mm">' + esc(p.caption) + '</span>' : '') + '</div>' +
            (pg.comment ? writeArea(P, per === 4 ? 82 : 180, per === 1 ? 50 : per === 2 ? 24 : 22, '', { choose: 'feel' }) : '') + '</div>';
          const inner = per === 4 ? '<div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:3mm;flex:1;min-height:0">' + grp.map(cell).join('') + '</div>' : grp.map(cell).join('');
          out.push(frame(P, head(P, '📸', L(P, 'おもいで しゃしん', '思い出写真')) + '<div class="bk-body">' + inner + '</div>'));
        }
        return out;
      }
    },
    observe: {
      n: 'かんさつ にっき', e: '🌱', d: 'あさがお など。え・はかった こと・きづいた こと',
      def: () => ({ subject: 'あさがお', count: 3, measure: 'たかさ（　　）cm　はっぱ（　　）まい' }),
      make(P, pg) {
        return Array.from({ length: Math.max(1, +pg.count || 1) }, () => frame(P, head(P, '🌱', esc(pg.subject || 'かんさつ') + 'の ' + L(P, 'かんさつ', '観察')) + '<div class="bk-body"><div class="bk-row" style="justify-content:space-between;align-items:center">' + dateHTML(P, null) + weatherHTML(P) + '</div>' +
          '<div style="height:110mm;display:flex">' + photoBox('', 'よく みて かこう') + '</div>' + (pg.measure ? '<div class="bk-kyo" style="font-size:6mm">' + esc(pg.measure) + '</div>' : '') +
          '<div><div class="bk-small">' + L(P, 'きづいた こと', '気づいたこと') + '</div>' + writeArea(P, 186, 75, '', { choose: 'feel' }) + '</div></div>'));
      }
    },
    chores: {
      n: 'おてつだい ひょう', e: '🧹', d: 'できた ひに ○（2しゅうかん で 1まい）',
      def: () => ({ items: 'しょっきを はこぶ,せんたくものを たたむ,ごみを だす,おふろ そうじ,くつを そろえる' }),
      make(P, pg) {
        const items = String(pg.items || '').split(/[,、\n]/).map(s => s.trim()).filter(Boolean), days = daysOf(P), out = [];
        for (let i = 0; i < Math.max(1, days.length); i += 14) {
          const ds = days.slice(i, i + 14);
          const th = '<tr><th style="width:44mm">' + L(P, 'おてつだい', 'お手伝い') + '</th>' + ds.map(d => '<th class="' + (d.getDay() === 0 ? 'sun' : d.getDay() === 6 ? 'sat' : '') + '" style="font-size:3.2mm">' + (d.getMonth() + 1) + '/' + d.getDate() + '<br>' + WD[d.getDay()] + '</th>').join('') + '</tr>';
          const tr = items.map(t => '<tr style="height:' + Math.min(30, Math.floor(200 / Math.max(1, items.length))) + 'mm"><td class="l bk-kyo" style="font-size:4.8mm">' + esc(t) + '</td>' + ds.map(() => '<td></td>').join('') + '</tr>').join('');
          out.push(frame(P, head(P, '🧹', L(P, 'おてつだい ひょう', 'お手伝い表'), 'できたら ○・シール') + '<div class="bk-body"><table class="bk-tbl">' + th + tr + '</table></div>'));
        }
        return out;
      }
    },
    rhythm: {
      n: 'はやね はやおき ひょう', e: '⏰', d: 'おきた じかん・ねた じかん',
      def: () => ({ wake: '7じ', sleep: '9じ' }),
      make(P, pg) {
        const days = daysOf(P), out = [];
        for (let i = 0; i < Math.max(1, days.length); i += 16) {
          const ds = days.slice(i, i + 16);
          const tr = ds.map(d => '<tr style="height:13.5mm"><td class="bk-kyo">' + dateHTML(P, d, 4.4) + '</td><td>　じ　　ふん</td><td><span class="st"></span></td><td>　じ　　ふん</td><td><span class="st"></span></td></tr>').join('');
          out.push(frame(P, head(P, '⏰', L(P, 'はやね はやおき ひょう', '早ね早起き表'), 'めあて：' + esc(pg.wake || '7じ') + 'までに おきる・' + esc(pg.sleep || '9じ') + 'までに ねる') +
            '<div class="bk-body"><table class="bk-tbl"><tr><th style="width:40mm">' + L(P, 'ひづけ', '日付') + '</th><th>' + L(P, 'おきた じかん', '起きた時間') + '</th><th style="width:20mm">めあて ○</th><th>' + L(P, 'ねた じかん', 'ねた時間') + '</th><th style="width:20mm">めあて ○</th></tr>' + tr + '</table></div>'));
        }
        return out;
      }
    },
    reading: {
      n: 'どくしょ きろく', e: '📚', d: 'よんだ ほんの なまえ・おもしろさ',
      def: () => ({ pages: 1 }),
      make(P, pg) {
        const entry = () => '<div class="bk-box" style="flex:1;padding:3mm;display:flex;gap:3mm"><div style="flex:1;display:flex;flex-direction:column;gap:2mm">' + dateHTML(P, null) + '<div class="bk-small">' + L(P, 'ほんの なまえ', '本の名前') + '</div>' + writeArea(P, 120, 26, '', { mode: P.style.writeMode === 'choose' ? 'line' : undefined }) +
          '<div class="bk-choose" style="justify-content:flex-start;padding:0">' + CHOOSE.book.map(o => '<div class="o" style="font-size:8mm"><span class="bk-emo">' + o[0] + '</span><small>' + o[1] + '</small></div>').join('') + '</div></div><div style="width:52mm;display:flex">' + photoBox('', 'えを かこう') + '</div></div>';
        return Array.from({ length: Math.max(1, +pg.pages || 1) }, () => frame(P, head(P, '📚', L(P, 'どくしょ きろく', '読書記録')) + '<div class="bk-body">' + entry() + entry() + entry() + '</div>'));
      }
    },
    writing: {
      n: 'なぞりがき', e: '✍️', d: 'きせつの ことばを なぞって かく',
      def: () => ({ words: '' }),
      make(P, pg) {
        const SEASON = { summer: 'なつやすみ,すいか,はなび,ひまわり,うみ,かきごおり,せみ,あさがお', winter: 'ふゆやすみ,おしょうがつ,ゆき,こたつ,みかん,おもち,たこあげ,かきぞめ', spring: 'はるやすみ,さくら,ちょうちょ,たんぽぽ,いちご,つくし' };
        const words = String(pg.words || SEASON[P.kind] || SEASON.summer).split(/[,、\s\n]+/).filter(Boolean);
        const z = MASU[P.style.masu] || 14, cols = Math.floor(186 / z), perPage = Math.max(1, Math.floor(232 / (z * 2 + 4)));
        const out = [];
        for (let i = 0; i < words.length; i += perPage) {
          const rows = words.slice(i, i + perPage).map(w => {
            const ch = Array.from(w), cells = [];
            for (let k = 0; k < cols; k++) cells.push(k < ch.length ? '<div class="c"><span class="dk" style="font-size:' + (z * .7) + 'mm">' + esc(ch[k]) + '</span></div>' : '<div class="c"></div>');
            const cells2 = []; for (let k = 0; k < cols; k++) cells2.push('<div class="c">' + (k < ch.length ? '<span style="font-size:' + (z * .7) + 'mm">' + esc(ch[k]) + '</span>' : '') + '</div>');
            return '<div class="bk-masu" style="grid-template-columns:repeat(' + cols + ',' + z + 'mm);grid-auto-rows:' + z + 'mm;margin-bottom:4mm">' + cells.join('') + cells2.join('') + '</div>';
          }).join('');
          out.push(frame(P, head(P, '✍️', L(P, 'なぞりがき', 'なぞり書き'), 'うえの もじを みて、うすい もじを なぞろう。あいた マスにも かいて みよう') + '<div class="bk-body">' + rows + '</div>'));
        }
        return out;
      }
    },
    kakizome: {
      n: 'かきぞめ（ふゆ）', e: '🖌️', d: 'おおきな マスで なぞる',
      def: () => ({ text: 'おしょうがつ' }),
      make(P, pg) {
        const t = Array.from(String(pg.text || 'おしょうがつ').replace(/\s/g, '')).slice(0, 8), z = 40, cols = 4, cells = [];
        const cell = (ch, dark) => '<div class="c">' + (ch ? '<span class="' + (dark ? 'dk' : '') + '" style="font-size:' + (z * .72) + 'mm">' + esc(ch) + '</span>' : '') + '</div>';
        for (let i = 0; i < t.length; i += cols) { const ch = t.slice(i, i + cols); for (let c = 0; c < cols; c++) cells.push(cell(ch[c], true)); for (let c = 0; c < cols; c++) cells.push(cell(ch[c], false)); }
        while (cells.length < cols * 5) cells.push(cell('', false));
        const rows = 5;
        return [frame(P, head(P, '🖌️', L(P, 'かきぞめ', '書き初め'), 'くろい もじを みて、うすい もじを なぞろう') + '<div class="bk-body"><div class="bk-masu" style="grid-template-columns:repeat(' + cols + ',' + z + 'mm);grid-auto-rows:' + z + 'mm">' + cells.slice(0, cols * rows).join('') + '</div></div>')];
      }
    },
    nengajo: {
      n: 'ねんがじょう（ふゆ）', e: '🎍', d: 'はがきの おおきさ・なぞり つき',
      def: () => ({}),
      make(P) {
        const b = pd(P.end) || new Date(), y = b.getMonth() < 6 ? b.getFullYear() : b.getFullYear() + 1, eto = ETO[y % 12];
        const card = '<div class="bk-post"><div class="bk-kyo" style="font-size:8mm;text-align:center">' + traceSpan('あけまして') + '<br>' + traceSpan('おめでとう') + '<br>' + traceSpan('ございます') + '</div>' +
          '<div style="flex:1;display:flex">' + photoBox('', eto.replace(/[^぀-ヿ]/g, '') + 'の えを かこう ' + eto.replace(/[぀-ヿ]/g, '')) + '</div><div class="bk-kyo" style="font-size:5mm">' + y + 'ねん　' + traceSpan('がんたん') + '</div><div class="bk-small">なまえ ' + nameHTML(P) + '</div></div>';
        return [frame(P, head(P, '🎍', L(P, 'ねんがじょうを かこう', '年賀状を書こう'), 'はがきの おおきさ です。きりとって つかえます') + '<div class="bk-body" style="flex-direction:row;justify-content:space-around;align-items:flex-start">' + card + card + '</div>')];
      }
    },
    free: {
      n: 'じゆう ページ', e: '✏️', d: 'タイトルを きめて、え・ぶんを かく',
      def: () => ({ title: 'じゆう けんきゅう', layout: 'both' }),
      make(P, pg) {
        const lay = pg.layout || 'both';
        return [frame(P, head(P, '✏️', esc(pg.title || 'じゆう ページ')) + '<div class="bk-body">' + (lay !== 'write' ? '<div style="flex:' + (lay === 'draw' ? 1 : '0 0 120mm') + ';display:flex">' + photoBox('', 'えを かこう') + '</div>' : '') +
          (lay !== 'draw' ? '<div style="flex:1;min-height:0">' + writeArea(P, 186, lay === 'write' ? 235 : 105, '', { choose: 'both' }) + '</div>' : '') + '</div>')];
      }
    },
    cert: {
      n: 'ひょうしょうじょう', e: '🏆', d: 'さいごの ページに。がんばった ことを ほめる',
      def: () => ({ msg: '' }),
      make(P, pg) {
        const K = KINDS[P.kind] || KINDS.summer;
        const msg = pg.msg || 'あなたは ' + K.n + 'を げんきに すごし、しゅくだいを さいごまで がんばりました。よって ここに ほめたたえます。';
        return [frame(P, '<span class="corner bk-emo" style="left:10mm;top:10mm">' + K.ring[0] + '</span><span class="corner bk-emo" style="right:10mm;top:10mm">' + K.ring[1] + '</span><span class="corner bk-emo" style="left:10mm;bottom:12mm">' + K.ring[2] + '</span><span class="corner bk-emo" style="right:10mm;bottom:12mm">' + K.ring[3] + '</span>' +
          '<div class="bk-emo" style="font-size:22mm">🏆</div><h1>' + L(P, 'ひょうしょうじょう', '表彰状') + '</h1><div class="who bk-kyo">' + (P.child ? esc(P.child) + ' さん' : '　　　　　　　 さん') + '</div><div class="msg bk-kyo">' + esc(msg) + '</div>' +
          '<div class="bk-kyo" style="font-size:6mm;margin-top:8mm">　　ねん　　がつ　　にち</div><div class="bk-kyo" style="font-size:6mm">' + esc(P.school || '') + '　' + esc(P.teacher || '') + '</div>', 'bk-cert')];
      }
    },
    ext: {
      n: 'アプリの プリント', e: '🧩', d: 'MieeL の アプリから えらんで いれる',
      def: () => ({}),
      make() { return []; }   // べつに あつかう
    }
  };
  function countOf(P, x) {
    if (x.type === 'ext') return (x.cache && x.cache.pages ? x.cache.pages.length : 0) + 'まい';
    if (x.type === 'diary' || x.type === 'observe') return (x.count || 1) + 'まい';
    if (x.type === 'daily') return x.span === 'week' ? 'まいにち' : pickDays(P, x.span).length + 'にちぶん';
    if (x.type === 'calendar' || x.type === 'chores' || x.type === 'rhythm') return 'まいにち';
    if (x.type === 'photos') return 'しゃしん';
    return '';
  }
