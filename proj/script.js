// CHAPTER 1 (plays now): bright -> in between -> dark. Each photo is [path, caption, label].
// Photos inside each section are shuffled every time the slideshow plays.
var SECTIONS = [
  { title: "In the light", items: [
    ["assets/photos/18-park_selfie.jpg", "Still loving you like it is our first date.", "park_selfie"],
    ["assets/photos/19-path_selfie.jpg", "Our park.", "path_selfie"],
    ["assets/photos/20-cap_closeup.jpg", "", "cap_closeup"],
  ]},
  { title: "In between", items: [
    ["assets/photos/01-park_date.jpg", "It started with no plan. Just the park.", "park_date"],
    ["assets/photos/03-feet_path.jpg", "All the times since.", "feet_path"],
    ["assets/photos/02-bench.jpg", "Some people have a house. We have a park.", "bench"],
    ["assets/photos/04-sticker_walk.jpg", "", "sticker_walk"],
    ["assets/photos/21-green_cap.jpg", "", "green_cap"],
  ]},
];
// LOCKED CHAPTERS: photos kept here, ready for when you unlock them (not shown yet).
// The photos of the two of you together also tile the chapters page as a faded wall (assets/backdrop, see WALL_ALL below).
var CHAPTERS = {
  dates: { title: "Dates", items: [
    ["assets/photos/07-unplanned_cafe.jpg", "Unplanned, and still my favourite.", "unplanned_cafe"],
    ["assets/photos/08-plate_book.jpg", "The quiet moments.", "plate_book"],
    ["assets/photos/09-cups_slippers.jpg", "", "cups_slippers"],
    ["assets/photos/05-hearts_dark.jpg", "", "hearts_dark"],
    ["assets/photos/06-phone_dark.jpg", "", "phone_dark"],
  ]},
  flowers: { title: "Flowers", items: [
    ["assets/photos/10-white_rose.jpg", "I brought you flowers.", "white_rose"],
    ["assets/photos/11-roses_bw.jpg", "", "roses_bw"],
    ["assets/photos/12-rose_mask.jpg", "", "rose_mask"],
    ["assets/photos/13-bouquet_park.jpg", "", "bouquet_park"],
    ["assets/photos/14-sunflowers.jpg", "Your favourite.", "sunflowers"],
    ["assets/photos/22-flowers_car1.jpg", "", "flowers_car1"],
    ["assets/photos/23-flowers_car2.jpg", "", "flowers_car2"],
    ["assets/photos/24-car_mirror.jpg", "", "car_mirror"],
    ["assets/photos/25-flowers_burst1.jpg", "", "flowers_burst1"],
    ["assets/photos/26-flowers_burst2.jpg", "", "flowers_burst2"],
    ["assets/photos/15-note.jpg", "", "note"],
  ]},
};
var ROMAN = ["I", "II"];
var SL = [];
function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)), t = a[i];
    a[i] = a[j]; a[j] = t;
  }
  return a;
}
var GROUPS = ["Up close", "The bigger picture"]; // part 1 = photos that fill the screen, part 2 = photos that sit in a frame
var DIMS = null;
function measure(done) {
  if (DIMS) { done(DIMS); return; }
  var items = [], dims = {}, finished = false;
  SECTIONS.forEach(function (sec) { sec.items.forEach(function (it) { items.push(it); }); });
  var left = items.length;
  function end() { if (!finished) { finished = true; DIMS = dims; done(dims); } }
  items.forEach(function (it) {
    var im = new Image();
    im.onload = im.onerror = function () { dims[it[0]] = [im.naturalWidth || 3, im.naturalHeight || 4]; if (--left === 0) end(); };
    im.src = it[0];
  });
  setTimeout(end, 4000);
}
function buildList(dims) {
  var va = innerWidth / innerHeight, full = [], rest = [];
  // inside each part the light -> dark order of the sections is kept, shuffled within each section
  SECTIONS.forEach(function (sec) {
    shuffle(sec.items).forEach(function (it) {
      var d = dims[it[0]] || [3, 4], ia = d[0] / d[1], crop = ia > va ? va / ia : ia / va;
      (crop >= 0.62 ? full : rest).push(it);
    });
  });
  SL = [];
  [full, rest].forEach(function (group, k) {
    if (!group.length) return;
    SL.push(["", GROUPS[k], "part " + (k + 1), "card", ROMAN[k]]);
    group.forEach(function (it) { SL.push(it); });
  });
  SL.push(["", "Meet me at home?", "the_end", "end"]);
}
var AC,
  M,
  muted = false;
function ac() {
  if (!AC) {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    M = AC.createGain();
    M.gain.value = 0.5;
    M.connect(AC.destination);
  }
  if (AC.state === "suspended") AC.resume();
  return AC;
}
function tone(f, t, d, v, ty) {
  if (!AC) return;
  var o = AC.createOscillator(),
    g = AC.createGain();
  o.type = ty || "sine";
  o.frequency.value = f;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(v, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g);
  g.connect(M);
  o.start(t);
  o.stop(t + d + 0.05);
}
function pad() {
  if (!AC) return;
  var t = AC.currentTime;
  [130.81, 196, 329.63, 493.88].forEach(function (fr) {
    var o = AC.createOscillator(),
      g = AC.createGain(),
      l = AC.createBiquadFilter();
    o.frequency.value = fr;
    l.type = "lowpass";
    l.frequency.value = 900;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.08, t + 6);
    g.gain.linearRampToValueAtTime(0.05, t + 15);
    g.gain.linearRampToValueAtTime(0, t + 24);
    o.connect(l);
    l.connect(g);
    g.connect(M);
    o.start(t);
    o.stop(t + 24.1);
  });
}
function chime() {
  if (!AC) return;
  var t = AC.currentTime;
  [784, 988, 1319].forEach(function (f, i) {
    tone(f, t + i * 0.2, 2, 0.12);
  });
}
function tick() {
  if (!AC) return;
  var t = AC.currentTime;
  tone(520, t, 0.25, 0.07);
  tone(780, t + 0.07, 0.4, 0.05);
}
function swell() {
  if (!AC) return;
  var t = AC.currentTime;
  [392, 523, 659, 784].forEach(function (f, i) {
    tone(f, t + i * 0.14, 1.6, 0.1);
  });
}
var a = document.getElementById('intro'),
  tms = [];
function intro() {
  tms.forEach(clearTimeout);
  tms = [];
  if (curPg !== 'intro') toPage('intro');
  a.classList.remove('go');
  void a.offsetWidth;
  a.classList.add('go');
  ac();
  pad();
  tms = [
    setTimeout(chime, 4200),
    setTimeout(chime, 9000),
    setTimeout(tick, 13200),
    setTimeout(function () { toPage('browse'); }, 14500),
  ];
}
document.getElementById("gate").onclick = function () {
  this.style.display = "none";
  intro();
};
document.getElementById("replayBtn").onclick = intro;
document.getElementById("soundBtn").onclick = function () {
  muted = !muted;
  if (M) M.gain.value = muted ? 0 : 0.5;
  this.innerHTML = muted ? "&#128263; Muted" : "&#128266; Sound";
};
var p = document.getElementById("player"),
  v = document.getElementById("video"),
  sh = document.getElementById("show"),
  idx = 0,
  cur = null,
  st;
function start() {
  ac();
  duckMusic(true);
  swell();
  p.classList.add("on");
  var r = p.requestFullscreen || p.webkitRequestFullscreen;
  try {
    var q = r && r.call(p);
    if (q && q.catch) q.catch(function () {});
  } catch (e) {}
  var pl = v.play();
  if (pl && pl.catch) pl.catch(function () {});
}
function leave() {
  duckMusic(false);
  v.pause();
  p.classList.remove("on");
  try {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
  } catch (e) {}
}
function stopAll() {
  leave();
  clearTimeout(st);
  sh.classList.remove("on");
  if (cur) {
    cur.remove();
    cur = null;
  }
  v.currentTime = 0;
}
document.getElementById("playBtn").onclick = start;
document.getElementById("openPark").onclick = function () { toPage('detail'); };
document.getElementById("closeVideoBtn").onclick = stopAll;
v.onended = function () {
  leave();
  sh.classList.add("on");
  begin();
};
function at(n) {
  clearTimeout(st);
  if (n < 0) n = 0;
  if (n >= SL.length) n = SL.length - 1;
  idx = n;
  var nx = SL[n + 1]; if (nx && nx[0]) new Image().src = nx[0]; // load the next photo ahead of time
  var s = SL[n], type = s[3] || "photo", last = type === "end", dur = type === "card" ? 3800 : 7000;
  if (type !== "photo") sh.classList.remove("framed");
  if (type === "card") { ac(); whoosh(); setLook(); } else tick();
  var d = document.createElement("div");
  d.className = "slide " + (type === "card" ? "chap" : type);
  if (type === "photo") {
    d.innerHTML = '<div class="fr34"><img class="fill" alt="" src="' + s[0] + '"><img class="pic" alt="" src="' + s[0] + '"></div><div class="cap">' + s[1] + "</div>";
    var im = d.querySelector(".pic"), fl = d.querySelector(".fill");
    var fit = function () {
      var ia = im.naturalWidth / im.naturalHeight, va = innerWidth / innerHeight, crop = ia > va ? va / ia : ia / va;
      var full = false; // every slideshow photo sits in the same 3:4 frame over the faded photo wall (full-screen mode is off; set to crop >= 0.62 to bring it back)
      d.classList.toggle("full", full);
      sh.classList.toggle("framed", !full); // framed photos sit over the same faded photo wall as the chapters page
      var near = full || Math.abs(ia - 0.75) < 0.1;
      im.classList.toggle("cover", near); fl.style.display = near ? "none" : "";
      if (s[4]) im.style.objectPosition = s[4];
    };
    window.__fit = fit;
    if (im.complete) fit(); else im.onload = fit;
  }
  else if (type === "card")
    d.innerHTML = '<div class="sec"><small>' + s[4] + "</small><h2>" + s[1] + "</h2></div>";
  else
    d.innerHTML = '<div class="cap big">' + s[1] + "<small>park first, then a movie?</small></div>" + '<button class="rp">&#8635; Watch again</button>';
  if (cur) {
    var o = cur;
    o.classList.add("leaving");
    setTimeout(function () { o.remove(); }, 1300);
  }
  cur = d;
  sh.appendChild(d);
  void d.offsetWidth;
  d.classList.add("on");
  var bar = document.getElementById("progress");
  bar.style.animation = "none";
  void bar.offsetWidth;
  if (!last) bar.style.animation = "barg " + dur + "ms linear forwards";
  document.getElementById("counter").textContent = type === "photo" ? n + 1 + "/" + SL.length + " \u00b7 " + s[2] : "";
  if (last) d.querySelector(".rp").onclick = function (e) { e.stopPropagation(); begin(); };
  else st = setTimeout(function () { at(n + 1); }, dur);
}
function begin() { tcStart = performance.now(); measure(function (dims) { buildList(dims); at(0); }); }
sh.onclick = function (e) {
  if (e.target.closest("button")) return;
  if (idx < SL.length - 1) at(idx + 1);
};
document.getElementById("prevBtn").onclick = function (e) {
  e.stopPropagation();
  at(idx - 1);
};
document.getElementById("closeShowBtn").onclick = function (e) {
  e.stopPropagation();
  stopAll();
};
var mg = document.getElementById("msg"),
  mt;
function deny() {
  if (!AC) return;
  var t = AC.currentTime;
  tone(220, t, 0.5, 0.09);
  tone(165, t + 0.18, 0.7, 0.09);
}
document.querySelectorAll(".lock").forEach(function (c) {
  c.onclick = function () {
    ac();
    deny();
    c.classList.remove("shake");
    void c.offsetWidth;
    c.classList.add("shake");
    mg.querySelector("p").textContent = c.dataset.msg || mg.querySelector("p").textContent;
    mg.classList.add("on");
    clearTimeout(mt);
    mt = setTimeout(function () {
      mg.classList.remove("on");
    }, 4500);
  };
});
mg.onclick = function () {
  mg.classList.remove("on");
};

/* ---------- pages + 3D transitions ---------- */
var PG = { intro: document.getElementById('intro'), browse: document.getElementById('browse'), detail: document.getElementById('detail') };
var order = ['intro', 'browse', 'detail'], curPg = 'intro';
function whoosh() {
  if (!AC) return;
  var t = AC.currentTime, n = Math.floor(AC.sampleRate * 1.2), b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
  for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  var s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
  s.buffer = b; f.type = 'bandpass';
  f.frequency.setValueAtTime(300, t);
  f.frequency.exponentialRampToValueAtTime(1800, t + 0.5);
  f.frequency.exponentialRampToValueAtTime(400, t + 1.1);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09, t + 0.4); g.gain.linearRampToValueAtTime(0, t + 1.1);
  s.connect(f); f.connect(g); g.connect(M); s.start(t);
}
function toPage(name) {
  if (name === curPg) return;
  ac(); whoosh();
  var fwd = order.indexOf(name) > order.indexOf(curPg);
  PG[curPg].classList.add(fwd ? 'out-l' : 'out-r');
  PG[name].classList.remove('out-l', 'out-r');
  curPg = name;
  Object.keys(PG).forEach(function (k) { PG[k].inert = k !== curPg; }); // hidden pages can't be tabbed into
}
document.getElementById("backBtn").onclick = function () { toPage('browse'); };

window.addEventListener("resize", function () { if (window.__fit) window.__fit(); });

/* ---------- mood music ---------- */
// Each mood is made in code so it works with no files. To use your own track instead,
// put it in assets/music/ and set src, e.g. src: "assets/music/calm.mp3"
var MOODS = [
  { id: "calm", name: "Calm", icon: "\u{1F33F}", src: "" },
  { id: "dreamy", name: "Dreamy", icon: "\u2728", src: "" },
  { id: "rainy", name: "Rainy day", icon: "\u{1F327}\uFE0F", src: "" },
  { id: "golden", name: "Golden hour", icon: "\u{1F305}", src: "" },
];
var MG, mood = "", mStop = null;
function mgain() { ac(); if (!MG) { MG = AC.createGain(); MG.gain.value = 0.9; MG.connect(M); } return MG; }
function duckMusic(on) { if (MG) MG.gain.setTargetAtTime(on ? 0 : 0.9, AC.currentTime, 0.3); }
function noiseBuf() {
  var n = AC.sampleRate * 2, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
  for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function bus() { var g = AC.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(1, AC.currentTime, 1.2); g.connect(mgain()); return g; }
function chord(freqs, type, cut, vol, out, lfoHz, nodes) {
  var lp = AC.createBiquadFilter(), g = AC.createGain(), lfo = AC.createOscillator(), lg = AC.createGain();
  lp.type = "lowpass"; lp.frequency.value = cut; lp.connect(out);
  g.gain.value = vol; g.connect(lp);
  lfo.frequency.value = lfoHz; lg.gain.value = vol * 0.5; lfo.connect(lg); lg.connect(g.gain); lfo.start(); nodes.push(lfo);
  freqs.forEach(function (f, i) { var o = AC.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = i % 2 ? 5 : -5; o.connect(g); o.start(); nodes.push(o); });
}
function bells(scale, vol, out, timers) {
  (function loop() {
    var t = AC.currentTime, f = scale[Math.floor(Math.random() * scale.length)], o = AC.createOscillator(), g = AC.createGain();
    o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 2.7);
    timers.push(setTimeout(loop, 2500 + Math.random() * 3500));
  })();
}
function synth(id) {
  ac();
  var out = bus(), nodes = [], timers = [];
  if (id === "calm") chord([130.81, 196, 261.63, 329.63, 493.88], "sine", 900, 0.05, out, 0.07, nodes);
  if (id === "dreamy") { chord([220, 277.18, 329.63, 415.3, 554.37], "triangle", 1300, 0.04, out, 0.09, nodes); bells([440, 493.88, 554.37, 659.25, 739.99], 0.05, out, timers); }
  if (id === "golden") { chord([196, 246.94, 293.66, 392], "sine", 1000, 0.045, out, 0.06, nodes); bells([392, 440, 493.88, 587.33, 659.25], 0.05, out, timers); }
  if (id === "rainy") {
    var s = AC.createBufferSource(), hp = AC.createBiquadFilter(), lp = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = noiseBuf(); s.loop = true; hp.type = "highpass"; hp.frequency.value = 600; lp.type = "lowpass"; lp.frequency.value = 6500; g.gain.value = 0.07;
    s.connect(hp); hp.connect(lp); lp.connect(g); g.connect(out); s.start(); nodes.push(s);
    chord([146.83, 220, 293.66, 349.23], "sine", 700, 0.03, out, 0.05, nodes);
  }
  return function () {
    timers.forEach(clearTimeout); out.gain.setTargetAtTime(0, AC.currentTime, 0.35);
    setTimeout(function () { nodes.forEach(function (n) { try { n.stop(); } catch (e) {} }); out.disconnect(); }, 1800);
  };
}
function playFile(m) {
  var a = new Audio(m.src), o = bus(), done = false;
  a.loop = true;
  try { AC.createMediaElementSource(a).connect(o); } catch (e) {}
  a.onerror = function () { if (!done && mood === m.id) { mStop = synth(m.id); } };
  var p = a.play(); if (p && p.catch) p.catch(function () {});
  return function () { done = true; o.gain.setTargetAtTime(0, AC.currentTime, 0.35); setTimeout(function () { a.pause(); o.disconnect(); }, 1800); };
}
function setMood(id) {
  ac();
  if (mStop) { mStop(); mStop = null; }
  mood = id;
  var m = MOODS.filter(function (x) { return x.id === id; })[0];
  if (m) mStop = m.src ? playFile(m) : synth(id);
  document.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c.dataset.id === mood); });
}
function buildChips(el) {
  MOODS.concat([{ id: "", name: "Off", icon: "\u00d7" }]).forEach(function (m) {
    var b = document.createElement("button");
    b.className = "chip" + (m.id === "" ? " on" : ""); b.dataset.id = m.id; b.textContent = m.icon + " " + m.name;
    b.onclick = function (e) { e.stopPropagation(); setMood(m.id); };
    el.appendChild(b);
  });
}
buildChips(document.getElementById("moodRow"));
buildChips(document.getElementById("moodPopRow"));
var mpop = document.getElementById("moodPop");
document.getElementById("moodBtn").onclick = function (e) { e.stopPropagation(); mpop.classList.toggle("on"); };
document.addEventListener("click", function (e) { if (!e.target.closest("#moodPop")) mpop.classList.remove("on"); });

/* ---------- safety nets ---------- */
// If the video can't load, go straight to the photos instead of a black screen.
function videoFailed() { leave(); sh.classList.add("on"); begin(); }
v.addEventListener("error", function () { if (p.classList.contains("on")) videoFailed(); });
// Phone Back button: close the video/photos first, otherwise go back one page.
history.replaceState({ pg: "intro" }, "");
var _toPage = toPage;
toPage = function (name, fromPop) {
  var was = curPg; _toPage(name);
  if (!fromPop && order.indexOf(name) > order.indexOf(was)) history.pushState({ pg: name }, "");
};
var _start = start;
start = function () { history.pushState({ v: 1 }, ""); _start(); if (v.error) videoFailed(); };
window.addEventListener("popstate", function () {
  if (typeof _skipPop !== "undefined" && _skipPop) { _skipPop = false; return; } // the Back we triggered ourselves when closing the viewer
  if (typeof lb !== "undefined" && !lb.hidden) { lbClose(true); return; }
  if (p.classList.contains("on") || sh.classList.contains("on")) { stopAll(); return; }
  var i = order.indexOf(curPg);
  if (i > 0) _toPage(order[i - 1]);
});
document.getElementById("playBtn").onclick = function () { start(); };
document.getElementById("openPark").onclick = function () { toPage("detail"); };

/* ---------- faded walls of small photos (chapters page + intro) ---------- */
// Chapters wall: every photo once before any repeats. Photos already used on the cards (park selfie, cafe, bouquet) are left out.
var WALL_ALL = [
  "assets/backdrop/t-park_selfie.jpg",
  "assets/backdrop/t-path_selfie.jpg",
  "assets/backdrop/t-park_date.jpg",
  "assets/backdrop/t-bench.jpg",
  "assets/backdrop/t-feet_path.jpg",
  "assets/backdrop/t-sticker_walk.jpg",
  "assets/backdrop/t-hearts_dark.jpg",
  "assets/backdrop/t-phone_dark.jpg",
  "assets/backdrop/t-unplanned_cafe.jpg",
  "assets/backdrop/t-plate_book.jpg",
  "assets/backdrop/t-cups_slippers.jpg",
  "assets/backdrop/t-white_rose.jpg",
  "assets/backdrop/t-roses_bw.jpg",
  "assets/backdrop/t-rose_mask.jpg",
  "assets/backdrop/t-bouquet_park.jpg",
  "assets/backdrop/t-sunflowers.jpg",
  "assets/backdrop/t-note.jpg",
  "assets/backdrop/t-building_1.jpg",
  "assets/backdrop/t-building_2.jpg",
  "assets/backdrop/t-building_3.jpg",
  "assets/backdrop/t-peace.jpg",
  "assets/backdrop/t-cap_closeup.jpg",
  "assets/backdrop/t-green_cap.jpg",
  "assets/backdrop/t-matching_necklaces.jpg",
  "assets/backdrop/t-flowers_car1.jpg",
  "assets/backdrop/t-flowers_car2.jpg",
  "assets/backdrop/t-car_mirror.jpg",
  "assets/backdrop/t-flowers_burst1.jpg",
  "assets/backdrop/t-flowers_burst2.jpg",
  "assets/backdrop/t-her_home.jpg",
  "assets/backdrop/t-bending.jpg",
  "assets/backdrop/t-blurry_frame.jpg",
];
// Intro wall: only the photos of the two of you, fewer and fainter.
var WALL_SOFT = [
  "assets/backdrop/t-park_selfie.jpg",
  "assets/backdrop/t-path_selfie.jpg",
  "assets/backdrop/t-building_1.jpg",
  "assets/backdrop/t-building_2.jpg",
  "assets/backdrop/t-building_3.jpg",
  "assets/backdrop/t-peace.jpg",
  "assets/backdrop/t-cap_closeup.jpg",
  "assets/backdrop/t-park_date.jpg",
  "assets/backdrop/t-matching_necklaces.jpg",
];
function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function buildWall(el, pool, minSize, maxSize, floorRows, repeat) {
  var W = innerWidth, H = innerHeight, N = pool.length, best = null, pick = null;
  if (repeat) {
    // small tiles all over the screen; every photo shows once before any photo repeats
    var c0 = Math.max(2, Math.floor(W / minSize)), tw0 = W / c0;
    pick = { cols: c0, n: c0 * Math.ceil(H / tw0) };
  } else {
    // choose the number of columns so the tiles (about) never need to repeat a photo
    for (var cols = Math.ceil(W / minSize); cols >= Math.max(2, Math.ceil(W / maxSize)); cols--) {
      var tw = W / cols, r = (H * 0.92) / tw, rows = Math.max(1, Math.floor(r + (floorRows ? 0 : 0.45))), n = cols * rows;
      if (n <= N + 2) { pick = { cols: cols, n: Math.min(n, N) }; break; } // a short last row is fine, it sits in the dark fade
      if (!best || n < best.n) best = { cols: cols, n: n };
    }
    pick = pick || best || { cols: 2, n: 4 };
  }
  var order = [];
  while (order.length < pick.n) order = order.concat(shuf(pool)); // every photo once before any repeats
  el.style.gridTemplateColumns = "repeat(" + pick.cols + ", 1fr)";
  el.innerHTML = "";
  for (var i = 0; i < pick.n; i++) {
    var im = document.createElement("img");
    im.alt = ""; im.decoding = "async"; im.src = order[i];
    im.style.setProperty("--d", ((i * 0.37) % 9).toFixed(2) + "s");
    el.appendChild(im);
  }
}
function buildWalls() {
  buildChaptersWall(document.getElementById("wallChapters"), WALL_ALL, 86); // small tiles (~80px)
  buildWall(document.getElementById("showWall"), WALL_ALL, 86, 220, false, true);
}
/* ---------- the wall behind the chapters page ---------- */
// Smaller tiles that cover the whole page, so they scroll with it and stop where the page stops.
// Every photo shows once before any repeats; no photo sits right beside or above itself.
var IW = { pool: [], cells: [], batch: [], cols: 4 };
function iwGen(i) {
  if (!IW.batch.length) IW.batch = shuf(IW.pool);
  var left = i % IW.cols ? IW.cells[i - 1] : null, top = i >= IW.cols ? IW.cells[i - IW.cols] : null, k = 0;
  while (k < IW.batch.length - 1 && (IW.batch[k] === left || IW.batch[k] === top)) k++;
  IW.cells.push(IW.batch.splice(k, 1)[0]);
}
function buildChaptersWall(el, pool, minSize) {
  var sc = document.getElementById("browse");
  IW.pool = pool; IW.cols = Math.max(4, Math.round(innerWidth / minSize)); IW.cells = []; IW.batch = [];
  var gap = 6, tileW = (innerWidth - (IW.cols - 1) * gap) / IW.cols, pitch = tileW + gap;
  el.innerHTML = ""; el.style.gridTemplateColumns = "repeat(" + IW.cols + ", 1fr)";
  var h = Math.max(sc.scrollHeight, sc.clientHeight); // the page's own length (the wall is empty right now, so it doesn't count)
  var n = (Math.ceil(h / pitch) + 1) * IW.cols, frag = document.createDocumentFragment();
  for (var i = 0; i < n; i++) {
    iwGen(i);
    var im = document.createElement("img");
    im.alt = ""; im.decoding = "async"; im.src = IW.cells[i];
    if (i < 120) im.style.setProperty("--d", ((i * 0.37) % 9).toFixed(2) + "s"); else im.className = "still"; // only the first tiles shimmer
    frag.appendChild(im);
  }
  el.appendChild(frag);
}
document.getElementById("toTop").onclick = function () { document.getElementById("browse").scrollTo({ top: 0, behavior: "smooth" }); };
window.addEventListener("load", function () { buildWalls(); });
buildWalls();
var _wt; window.addEventListener("resize", function () { clearTimeout(_wt); _wt = setTimeout(buildWalls, 250); });

/* ---------- film looks: one is picked at random for each section ---------- */
// Off by default. Add ?look=tv, ?look=view, ?look=strip or ?look=mix to the link to try one.
var LOOKS = ["tv", "view", "strip", "mix"], lastLook = "", tcStart = performance.now();
function setLook() {
  var forced = new URLSearchParams(location.search).get("look"), l = forced && LOOKS.indexOf(forced) >= 0 ? forced : "";
  LOOKS.forEach(function (x) { sh.classList.remove("look-" + x); });
  if (l) sh.classList.add("look-" + l); // off by default; ?look=tv|view|strip|mix turns one on for testing
  lastLook = l;
}
var tcEl = document.getElementById("tc");
function p2(n) { return (n < 10 ? "0" : "") + n; }
setInterval(function () {
  if (!sh.classList.contains("on") || !sh.classList.contains("look-view")) return;
  var t = (performance.now() - tcStart) / 1000;
  tcEl.textContent = [Math.floor(t / 3600), Math.floor(t / 60) % 60, Math.floor(t) % 60, Math.floor((t % 1) * 24)].map(p2).join(":");
}, 80);

/* ---------- search ---------- */
var qEl = document.getElementById("q"), qNo = document.getElementById("noMatch"), qClear = document.getElementById("qClear");
function runSearch() {
  var v = qEl.value.trim().toLowerCase(), any = false;
  document.querySelectorAll("#browse .cw").forEach(function (cw) {
    var hit = !v || (cw.dataset.keys || "").toLowerCase().indexOf(v) >= 0;
    cw.hidden = !hit; if (hit) any = true;
  });
  qNo.hidden = any; qClear.hidden = !v;
}
qEl.addEventListener("input", runSearch);
qEl.addEventListener("keydown", function (e) { if (e.key === "Enter") qEl.blur(); });
qClear.onclick = function () { qEl.value = ""; runSearch(); qEl.focus(); };

/* ---------- light / dark theme ---------- */
var themeBtn = document.getElementById("themeBtn");
function setTheme(light) {
  document.body.classList.toggle("light", light);
  themeBtn.innerHTML = light ? "&#9790;" : "&#9728;";
  themeBtn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  var m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = light ? "#f6f2ea" : "#0b0b0b";
  try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (e) {}
}
themeBtn.onclick = function () { setTheme(!document.body.classList.contains("light")); };
try { if (localStorage.getItem("theme") === "light") setTheme(true); } catch (e) {}

/* ---------- memories: plain photos she can open herself (no slideshow) ---------- */
// Memories: "Us" (every photo with both of you), then "Her" and "Him" (solo photos), each photo once. [small picture in the row, bigger picture when opened]
var MEM_GROUPS = [
  { title: "Us", items: [
    ["assets/backdrop/t-park_selfie.jpg", "assets/photos/18-park_selfie.jpg"],
    ["assets/backdrop/t-path_selfie.jpg", "assets/photos/19-path_selfie.jpg"],
    ["assets/backdrop/t-building_3.jpg", "assets/memories/building_3.jpg"],
    ["assets/backdrop/t-building_2.jpg", "assets/memories/building_2.jpg"],
    ["assets/backdrop/t-building_1.jpg", "assets/memories/building_1.jpg"],
    ["assets/backdrop/t-cap_closeup.jpg", "assets/photos/20-cap_closeup.jpg"],
    ["assets/backdrop/t-matching_necklaces.jpg", "assets/memories/matching_necklaces.jpg"],
    ["assets/backdrop/t-park_date.jpg", "assets/photos/01-park_date.jpg"],
    ["assets/backdrop/t-bench.jpg", "assets/photos/02-bench.jpg"],
    ["assets/backdrop/t-feet_path.jpg", "assets/photos/03-feet_path.jpg"],
    ["assets/backdrop/t-sticker_walk.jpg", "assets/photos/04-sticker_walk.jpg"],
    ["assets/backdrop/t-hearts_dark.jpg", "assets/photos/05-hearts_dark.jpg"],
    ["assets/backdrop/t-phone_dark.jpg", "assets/photos/06-phone_dark.jpg"],
  ]},
  { title: "Her", items: [
    ["assets/backdrop/t-her_home.jpg", "assets/memories/her_home.jpg"],
  ]},
  { title: "Him", items: [
    ["assets/backdrop/t-green_cap.jpg", "assets/photos/21-green_cap.jpg"],
    ["assets/backdrop/t-bending.jpg", "assets/memories/bending.jpg"],
  ]},
];
var MEM = []; // one flat list for the viewer: Us, then Her, then Him
MEM_GROUPS.forEach(function (g) { g.items.forEach(function (it) { MEM.push(it); }); });
var memRow = document.getElementById("memRow"), lb = document.getElementById("lb"), lbI = 0;
var lbPic = lb.querySelector(".pic"), lbFill = lb.querySelector(".fill");
function lbFit() {
  var ia = lbPic.naturalWidth / lbPic.naturalHeight, va = innerWidth / innerHeight, crop = ia > va ? va / ia : ia / va;
  var full = crop >= 0.62; // same rule as the slideshow
  lb.classList.toggle("full", full);
  var near = full || Math.abs(ia - 0.75) < 0.1;
  lbPic.classList.toggle("cover", near); lbFill.style.display = near ? "none" : "";
}
lbPic.onload = lbFit;
window.addEventListener("resize", function () { if (!lb.hidden) lbFit(); });
function lbShow(i) {
  lbI = (i + MEM.length) % MEM.length;
  lbFill.src = MEM[lbI][1]; lbPic.src = MEM[lbI][1];
  if (lbPic.complete) lbFit();
}
function lbOpen(i) { lbShow(i); if (lb.hidden) { lb.hidden = false; history.pushState({ lb: 1 }, ""); } }
var _skipPop = false;
function lbClose(fromPop) { if (lb.hidden) return; lb.hidden = true; if (!fromPop && history.state && history.state.lb) { _skipPop = true; history.back(); } }
var _n = 0;
MEM_GROUPS.forEach(function (g) {
  var h3 = document.createElement("h3"); h3.className = "memsub"; h3.textContent = g.title; memRow.appendChild(h3);
  var row = document.createElement("div"); row.className = "row mem"; memRow.appendChild(row);
  g.items.forEach(function (m) {
    var i = _n++, b = document.createElement("button"), im = document.createElement("img");
    b.className = "mem-tile"; b.type = "button"; b.setAttribute("aria-label", "Open photo " + (i + 1));
    im.alt = ""; im.src = m[0]; b.appendChild(im);
    b.onclick = function () { lbOpen(i); };
    row.appendChild(b);
  });
});
document.getElementById("lbClose").onclick = function () { lbClose(); };
document.getElementById("lbPrev").onclick = function () { lbShow(lbI - 1); };
document.getElementById("lbNext").onclick = function () { lbShow(lbI + 1); };
document.addEventListener("keydown", function (e) {
  if (lb.hidden) return;
  if (e.key === "Escape") lbClose(); else if (e.key === "ArrowLeft") lbShow(lbI - 1); else if (e.key === "ArrowRight") lbShow(lbI + 1);
});
var _sx = null;
lb.addEventListener("touchstart", function (e) { _sx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", function (e) {
  if (_sx === null) return;
  var dx = e.changedTouches[0].clientX - _sx; _sx = null;
  if (Math.abs(dx) > 50) lbShow(lbI + (dx < 0 ? 1 : -1));
}, { passive: true });
