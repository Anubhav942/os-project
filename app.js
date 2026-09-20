/* =========================================================
   University Student Information System - front-end logic
   Everything here uses sample data + localStorage so the UI
   works on its own. Replace the "DATA" section with fetch()
   calls to your Flask API when the backend is ready.
   ========================================================= */

const UNIVERSITY = { name: "Noida Institute of Engineering and Technology", tagline: "Student Information System" };

/* ---------- Icons & crest ---------- */
const CREST = `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <path d="M24 3l17 6v13c0 11-7.5 19.5-17 23C14.5 41.5 7 33 7 22V9z" fill="currentColor" opacity=".12"/>
  <path d="M24 3l17 6v13c0 11-7.5 19.5-17 23C14.5 41.5 7 33 7 22V9z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <path d="M14 19c4-1.5 7-1 10 1 3-2 6-2.5 10-1v12c-4-1.5-7-1-10 1-3-2-6-2.5-10-1z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <path d="M24 20v12" stroke="currentColor" stroke-width="2"/>
</svg>`;

const ICONS = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  courses: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 8h6"/>',
  attendance: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M9 15l2 2 4-4"/>',
  results: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  os: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'
};
const icon = (name) =>
  `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

const NAV = [
  { id: "dashboard",  label: "Dashboard",  href: "dashboard.html",  icon: "dashboard" },
  { id: "profile",    label: "My Profile", href: "profile.html",    icon: "profile" },
  { id: "courses",    label: "My Courses", href: "courses.html",    icon: "courses" },
  { id: "attendance", label: "Attendance", href: "attendance.html", icon: "attendance" },
  { id: "results",    label: "Results",    href: "results.html",    icon: "results" },
  // { id: "os-process", label: "OS Process", href: "os-process.html", icon: "os" }
];

/* ---------- DATA (sample values - swap for Flask API calls) ---------- */
const DEFAULT_PROFILE = {
  name: "Anubhav Anand", roll: "0261DCS022", course: "B.Tech", branch: "Computer Science and Engineering",
  year: "2nd Year", semester: "3", email: "0261DCS022@niet.co.in", phone: "+91 9431920930"
};
const COURSES = [
  { code: "OS",   name: "Operating Systems",          credits: 4, color: "#4536b0" },
  { code: "DSA",  name: "Data Structures and Algorithms", credits: 4, color: "#12806f" },
  { code: "DBMS", name: "Database Management Systems", credits: 3, color: "#c0362c" },
  { code: "AI",   name: "Artificial Intelligence",     credits: 3, color: "#b97a06" },
  { code: "CN",   name: "Computer Networks",           credits: 3, color: "#0d7aa8" }
];
const ATTENDANCE = [
  { code: "OS", name: "Operating Systems", percent: 85 },
  { code: "DBMS", name: "Database Management Systems", percent: 78 },
  { code: "DSA", name: "Data Structures and Algorithms", percent: 90 },
  { code: "AI", name: "Artificial Intelligence", percent: 82 },
  { code: "CN", name: "Computer Networks", percent: 88 }
];
const RESULTS = [
  { code: "OS", name: "Operating Systems", marks: 78 },
  { code: "DSA", name: "Data Structures and Algorithms", marks: 84 },
  { code: "DBMS", name: "Database Management Systems", marks: 72 },
  { code: "AI", name: "Artificial Intelligence", marks: 80 },
  { code: "CN", name: "Computer Networks", marks: 76 }
];
const MIN_ATTENDANCE = 75;

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const initialsOf = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "U";
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

const Store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
  },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ } },
  remove(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }
};

const getProfile = () => Object.assign({}, DEFAULT_PROFILE, Store.get("sis_profile", {}));

const Session = {
  get: () => Store.get("sis_session", null),
  login(username, role) { Store.set("sis_session", { username, role }); },
  logout() { Store.remove("sis_session"); location.href = "index.html"; },
  displayName(s) {
    if (s.role === "student") return getProfile().name;
    if (s.role === "teacher") return "Prof. " + cap(s.username);
    return cap(s.username);
  }
};

const gradeFor = (m) => (m >= 90 ? "O" : m >= 80 ? "A+" : m >= 70 ? "A" : m >= 60 ? "B+" : m >= 50 ? "B" : m >= 40 ? "C" : "F");
const attendanceLevel = (p) => (p >= 85 ? "good" : p >= MIN_ATTENDANCE ? "warn" : "low");
const attendanceLabel = (p) => (p >= 85 ? "Good" : p >= MIN_ATTENDANCE ? "Close to limit" : "Below minimum");

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $$("[data-crest]").forEach((el) => (el.innerHTML = CREST));
  $$("[data-uni-name]").forEach((el) => (el.textContent = UNIVERSITY.name));
  $$("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));

  const page = document.body.dataset.page;
  if (page === "login") return initLogin();

  const session = Session.get();
  if (!session) { location.replace("index.html"); return; }

  buildShell(page, session);
  const inits = {
    dashboard: initDashboard, profile: initProfile, courses: initCourses,
    attendance: initAttendance, results: initResults, "os-process": initOsProcess
  };
  if (inits[page]) inits[page](session);
});

/* ---------- Login (Page 1) ---------- */
function initLogin() {
  if (Session.get()) { location.replace("dashboard.html"); return; }
  const form = $("#loginForm"), err = $("#loginError");
  const pw = $("#password"), toggle = $("#pwToggle");

  toggle.addEventListener("click", () => {
    const show = pw.type === "password";
    pw.type = show ? "text" : "password";
    toggle.textContent = show ? "Hide" : "Show";
    toggle.setAttribute("aria-pressed", String(show));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = $("#username").value.trim();
    const password = pw.value;
    const role = form.elements.role.value;
    if (!username || !password) { err.textContent = "Enter both your username and password."; return; }
    if (password.length < 4) { err.textContent = "Password must be at least 4 characters."; return; }
    err.textContent = "";
    // TODO: replace with fetch("/api/login", ...) against Flask
    Session.login(username, role);
    location.href = "dashboard.html";
  });
}

/* ---------- Shell: sidebar + top bar ---------- */
function buildShell(active, session) {
  const name = Session.displayName(session);
  const current = NAV.find((n) => n.id === active) || NAV[0];

  $("#sidebar").innerHTML = `
    <div class="brand"><span class="crest">${CREST}</span>
      <div><strong>${esc(UNIVERSITY.name)}</strong><small>${esc(UNIVERSITY.tagline)}</small></div></div>
    <nav aria-label="Main">${NAV.map((n) =>
      `<a class="nav-link${n.id === active ? " active" : ""}" href="${n.href}"${n.id === active ? ' aria-current="page"' : ""}>${icon(n.icon)}<span>${n.label}</span></a>`
    ).join("")}</nav>
    <div class="sidebar-foot"><button class="btn btn-ghost btn-block" id="logoutBtn" type="button">Log out</button></div>`;

  $("#topbar").innerHTML = `
    <button class="menu-btn" id="menuBtn" type="button" aria-label="Open menu">${icon("dashboard")}</button>
    <h1 class="page-title">${current.label}</h1>
    <div class="user-chip"><span class="avatar">${esc(initialsOf(name))}</span>
      <div><strong>${esc(name)}</strong><small>${cap(session.role)}</small></div></div>`;

  const sidebar = $("#sidebar"), scrim = $("#scrim");
  const setOpen = (open) => { sidebar.classList.toggle("open", open); scrim.classList.toggle("show", open); };
  $("#menuBtn").addEventListener("click", () => setOpen(true));
  scrim.addEventListener("click", () => setOpen(false));
  $("#logoutBtn").addEventListener("click", () => Session.logout());
}

/* ---------- Dashboard (Page 2) ---------- */
function initDashboard(session) {
  const profile = getProfile();
  $("#welcomeName").textContent = Session.displayName(session);
  $("#today").textContent = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  $("#welcomeSub").textContent = session.role === "student"
    ? `${profile.branch}, ${profile.year}, Semester ${profile.semester}`
    : `Signed in as ${session.role}. Student tools are shown below until the ${session.role} pages are built.`;
  $("#statAttendance").textContent = Math.round(mean(ATTENDANCE.map((a) => a.percent))) + "%";
  $("#statCourses").textContent = COURSES.length;
  $("#statSemester").textContent = profile.semester;
  $("#statMarks").textContent = Math.round(mean(RESULTS.map((r) => r.marks)));
}

/* ---------- My Profile ---------- */
function initProfile() {
  const FIELDS = [
    { k: "name", l: "Full name", t: "text", edit: true },
    { k: "roll", l: "Roll number", t: "text", edit: true },
    { k: "course", l: "Course", t: "text", edit: true },
    { k: "branch", l: "Branch", t: "text", edit: true },
    { k: "year", l: "Year", t: "text", edit: true },
    { k: "semester", l: "Semester", t: "text", edit: true },
    { k: "email", l: "Email", t: "email", edit: true },
    { k: "phone", l: "Phone", t: "tel", edit: true }
  ];
  const grid = $("#profileGrid"), editBtn = $("#editBtn"), saveBtn = $("#saveBtn"), cancelBtn = $("#cancelBtn");
  const msg = $("#profileMsg"), err = $("#profileError");
  let profile = getProfile();

  function render(editing) {
    grid.innerHTML = FIELDS.map((f) => `
      <div class="field">
        <label for="f-${f.k}">${f.l}</label>
        <input id="f-${f.k}" type="${f.t}" value="${esc(profile[f.k])}" ${editing && f.edit ? "" : "readonly"} ${f.k === "phone" ? 'inputmode="tel"' : ""}>
      </div>`).join("");
    $("#profileName").textContent = profile.name;
    $("#profileSub").textContent = `${profile.roll}, ${profile.branch}`;
    $("#profileAvatar").textContent = initialsOf(profile.name);
    editBtn.hidden = editing; saveBtn.hidden = !editing; cancelBtn.hidden = !editing;
    err.textContent = "";
    if (editing) $("#f-name").focus();
  }

  editBtn.addEventListener("click", () => { msg.textContent = ""; render(true); });
  cancelBtn.addEventListener("click", () => render(false));
  saveBtn.addEventListener("click", () => {
    const next = Object.assign({}, profile);
    FIELDS.filter((f) => f.edit).forEach((f) => (next[f.k] = $("#f-" + f.k).value.trim()));
    if (!next.name) { err.textContent = "Name cannot be empty."; return; }
    if (!/^\S+@\S+\.\S+$/.test(next.email)) { err.textContent = "Enter a valid email address."; return; }
    if (!/^[+\d][\d\s-]{7,}$/.test(next.phone)) { err.textContent = "Enter a valid phone number."; return; }
    profile = next;
    Store.set("sis_profile", profile); // TODO: PUT /api/profile
    render(false);
    msg.textContent = "Profile saved.";
    const nameEl = $(".user-chip strong"); if (nameEl) nameEl.textContent = profile.name;
    const av = $(".user-chip .avatar"); if (av) av.textContent = initialsOf(profile.name);
  });
  render(false);
}

/* ---------- My Courses ---------- */
function initCourses() {
  $("#courseGrid").innerHTML = COURSES.map((c) => `
    <article class="course" style="--c:${c.color}">
      <div class="code">${esc(c.code)}</div>
      <h3>${esc(c.name)}</h3>
      <p>${c.credits} credits</p>
      ${c.code === "OS" ? '<a class="link" href="os-process.html">Open the OS process lab</a>' : ""}
    </article>`).join("");
}

/* ---------- Attendance ---------- */
function initAttendance() {
  $("#attBody").innerHTML = ATTENDANCE.map((a) => {
    const lvl = attendanceLevel(a.percent);
    return `<tr>
      <td><strong>${esc(a.code)}</strong><br><span class="hint" style="margin:0">${esc(a.name)}</span></td>
      <td><div class="bar-cell"><div class="bar" role="img" aria-label="${a.percent} percent"><span class="${lvl}" style="width:${a.percent}%"></span></div><strong>${a.percent}%</strong></div></td>
      <td><span class="badge ${lvl}">${attendanceLabel(a.percent)}</span></td>
    </tr>`;
  }).join("");
  const overall = Math.round(mean(ATTENDANCE.map((a) => a.percent)));
  $("#attOverall").textContent = overall + "%";
  $("#attMin").textContent = MIN_ATTENDANCE + "%";
}

/* ---------- Results ---------- */
function initResults() {
  $("#resBody").innerHTML = RESULTS.map((r) => `<tr>
    <td><strong>${esc(r.code)}</strong><br><span class="hint" style="margin:0">${esc(r.name)}</span></td>
    <td class="num"><strong>${r.marks}</strong> / 100</td>
    <td><span class="badge ${r.marks >= 40 ? "good" : "low"}">${gradeFor(r.marks)}</span></td>
    <td style="min-width:140px"><div class="bar"><span class="${r.marks >= 75 ? "good" : r.marks >= 50 ? "warn" : "low"}" style="width:${r.marks}%"></span></div></td>
  </tr>`).join("");
  const total = RESULTS.reduce((a, r) => a + r.marks, 0);
  $("#resTotal").textContent = `${total} / ${RESULTS.length * 100}`;
  $("#resAvg").textContent = mean(RESULTS.map((r) => r.marks)).toFixed(1) + "%";
}

/* =========================================================
   OS PROCESS (CPU scheduling, priority scheduling,
   process queue management, synchronization)
   ========================================================= */

const ALGOS = {
  fcfs:   { name: "First Come First Served (FCFS)" },
  sjf:    { name: "Shortest Job First (non-preemptive)" },
  prio:   { name: "Priority (non-preemptive)" },
  "prio-p": { name: "Priority (preemptive)" },
  rr:     { name: "Round Robin" }
};
const PROC_COLORS = ["#4536b0", "#12806f", "#c0362c", "#b97a06", "#0d7aa8", "#8a3fb3", "#c2456e", "#5a7d2a", "#7a5c3e", "#556080"];

/* Pure scheduler: works one time unit at a time so every algorithm
   (including preemption) shares the same loop. */
function schedule(list, algo, quantum) {
  const P = list.map((p, i) => ({ pid: p.pid, arrival: p.arrival, burst: p.burst, priority: p.priority, idx: i, rem: p.burst, start: null, finish: null }));
  const n = P.length;
  const timeline = [];
  let t = 0, done = 0, cur = null, used = 0;
  const ready = [];

  const keys = algo === "fcfs" ? ["arrival", "idx"] : algo === "sjf" ? ["burst", "arrival", "idx"] : ["priority", "arrival", "idx"];
  const cmp = (a, b) => { for (const k of keys) if (a[k] !== b[k]) return a[k] - b[k]; return 0; };
  const ordered = (arr) => (algo === "rr" ? arr.slice() : arr.slice().sort(cmp));
  const arrive = (time) => P.filter((p) => p.arrival === time).forEach((p) => ready.push(p));

  arrive(0);
  const limit = P.reduce((s, p) => s + p.burst, 0) + Math.max(...P.map((p) => p.arrival)) + 2;

  while (done < n && t <= limit) {
    if (cur === null && ready.length) {
      cur = ordered(ready)[0];
      ready.splice(ready.indexOf(cur), 1);
      used = 0;
    } else if (cur && algo === "prio-p" && ready.length) {
      const best = ordered(ready)[0];
      if (best.priority < cur.priority) {
        ready.splice(ready.indexOf(best), 1);
        ready.push(cur);
        cur = best;
        used = 0;
      }
    }
    if (cur && cur.start === null) cur.start = t;
    timeline.push({ t, run: cur ? cur.pid : null, idx: cur ? cur.idx : -1, queue: ordered(ready).map((p) => p.pid) });

    if (cur) { cur.rem--; used++; }
    t++;
    arrive(t);
    if (cur) {
      if (cur.rem === 0) { cur.finish = t; done++; cur = null; }
      else if (algo === "rr" && used >= quantum) { ready.push(cur); cur = null; }
    }
  }

  const segments = [];
  timeline.forEach((tick) => {
    const last = segments[segments.length - 1];
    if (last && last.pid === tick.run) last.end = tick.t + 1;
    else segments.push({ pid: tick.run, idx: tick.idx, start: tick.t, end: tick.t + 1 });
  });

  const rows = P.map((p) => {
    const ct = p.finish, tat = ct - p.arrival, wt = tat - p.burst, rt = p.start - p.arrival;
    return { pid: p.pid, idx: p.idx, arrival: p.arrival, burst: p.burst, priority: p.priority, ct, tat, wt, rt };
  });
  const total = timeline.length;
  const busy = timeline.filter((x) => x.run !== null).length;
  return {
    timeline, segments, rows, total,
    avgWT: mean(rows.map((r) => r.wt)), avgTAT: mean(rows.map((r) => r.tat)), avgRT: mean(rows.map((r) => r.rt)),
    utilization: total ? (busy / total) * 100 : 0, throughput: total ? n / total : 0
  };
}

if (typeof module !== "undefined") module.exports = { schedule };

function initOsProcess() {
  $$(".tab").forEach((tab) => tab.addEventListener("click", () => {
    $$(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    $$(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + tab.dataset.tab));
  }));
  initScheduler();
  initSync();
}

/* ---------- CPU scheduler UI ---------- */
function initScheduler() {
  const SAMPLE = () => [
    { pid: "P1", arrival: 0, burst: 5, priority: 2 },
    { pid: "P2", arrival: 1, burst: 3, priority: 1 },
    { pid: "P3", arrival: 2, burst: 8, priority: 4 },
    { pid: "P4", arrival: 3, burst: 6, priority: 3 }
  ];
  let procs = Store.get("sis_procs", null) || SAMPLE();
  const color = (i) => PROC_COLORS[i % PROC_COLORS.length];
  const colorOf = (pid) => { const i = procs.findIndex((p) => p.pid === pid); return color(i < 0 ? 0 : i); };

  const body = $("#procBody"), algoSel = $("#algo"), quantumIn = $("#quantum"), errEl = $("#schedError");
  let sim = null; // { res, t, timer }

  const save = () => Store.set("sis_procs", procs);

  function renderProcs() {
    body.innerHTML = procs.length ? procs.map((p, i) => `<tr>
      <td><span class="dot" style="background:${color(i)}"></span><strong>${esc(p.pid)}</strong></td>
      <td><input type="number" min="0" max="99" value="${p.arrival}" data-i="${i}" data-f="arrival" aria-label="Arrival time of ${esc(p.pid)}"></td>
      <td><input type="number" min="1" max="99" value="${p.burst}" data-i="${i}" data-f="burst" aria-label="Burst time of ${esc(p.pid)}"></td>
      <td><input type="number" min="1" max="99" value="${p.priority}" data-i="${i}" data-f="priority" aria-label="Priority of ${esc(p.pid)}"></td>
      <td><button class="icon-btn" type="button" data-del="${i}" aria-label="Remove ${esc(p.pid)}">&#10005;</button></td>
    </tr>`).join("") : `<tr><td colspan="5" class="hint">The queue is empty. Add a process to begin.</td></tr>`;
  }

  body.addEventListener("change", (e) => {
    const inp = e.target.closest("input[data-i]");
    if (!inp) return;
    const min = inp.dataset.f === "arrival" ? 0 : 1;
    let v = parseInt(inp.value, 10);
    if (Number.isNaN(v) || v < min) v = min;
    if (v > 99) v = 99;
    procs[+inp.dataset.i][inp.dataset.f] = v;
    inp.value = v; save();
  });
  body.addEventListener("click", (e) => {
    const del = e.target.closest("[data-del]");
    if (!del) return;
    procs.splice(+del.dataset.del, 1); save(); renderProcs();
  });

  $("#addProc").addEventListener("click", () => {
    if (procs.length >= 10) { errEl.textContent = "You can simulate up to 10 processes."; return; }
    errEl.textContent = "";
    const next = procs.reduce((m, p) => Math.max(m, parseInt(p.pid.slice(1), 10) || 0), 0) + 1;
    procs.push({ pid: "P" + next, arrival: 0, burst: 4, priority: 1 });
    save(); renderProcs();
  });
  $("#sampleProc").addEventListener("click", () => { procs = SAMPLE(); errEl.textContent = ""; save(); renderProcs(); });
  $("#clearProc").addEventListener("click", () => { procs = []; save(); renderProcs(); $("#results").hidden = true; stop(); });

  algoSel.addEventListener("change", () => { $("#quantumWrap").hidden = algoSel.value !== "rr"; });

  function readInputs() {
    if (!procs.length) { errEl.textContent = "Add at least one process."; return null; }
    const q = parseInt(quantumIn.value, 10);
    if (algoSel.value === "rr" && (!q || q < 1)) { errEl.textContent = "Time quantum must be 1 or more."; return null; }
    errEl.textContent = "";
    return { algo: algoSel.value, q: q || 1 };
  }

  /* ----- run + render ----- */
  $("#runBtn").addEventListener("click", () => {
    const inp = readInputs(); if (!inp) return;
    stop();
    const res = schedule(procs, inp.algo, inp.q);
    sim = { res, t: res.total, timer: null };
    renderResults(inp);
  });

  $("#compareBtn").addEventListener("click", () => {
    const inp = readInputs(); if (!inp) return;
    const rows = Object.keys(ALGOS).map((a) => ({ a, r: schedule(procs, a, inp.q) }));
    const best = Math.min(...rows.map((x) => x.r.avgWT));
    $("#compareBody").innerHTML = rows.map((x) => `<tr>
      <td>${ALGOS[x.a].name}${x.a === "rr" ? ` (quantum ${inp.q})` : ""}</td>
      <td class="num">${x.r.avgWT.toFixed(2)}</td><td class="num">${x.r.avgTAT.toFixed(2)}</td><td class="num">${x.r.avgRT.toFixed(2)}</td>
      <td>${x.r.avgWT === best ? '<span class="badge good">Lowest waiting time</span>' : ""}</td></tr>`).join("");
    $("#compareCard").hidden = false;
  });

  function renderResults(inp) {
    const { res } = sim;
    $("#results").hidden = false;
    $("#resultTitle").textContent = ALGOS[inp.algo].name + (inp.algo === "rr" ? `, quantum ${inp.q}` : "");

    $("#metricRow").innerHTML = [
      ["Average waiting time", res.avgWT.toFixed(2)], ["Average turnaround", res.avgTAT.toFixed(2)],
      ["Average response", res.avgRT.toFixed(2)], ["CPU utilisation", res.utilization.toFixed(0) + "%"],
      ["Throughput", res.throughput.toFixed(2) + " /unit"]
    ].map(([l, v]) => `<div class="metric"><span>${l}</span><strong>${v}</strong></div>`).join("");

    const track = $("#ganttTrack");
    track.style.width = Math.max(res.total * 34, 0) + "px";
    track.style.minWidth = "100%";
    track.innerHTML = res.segments.map((s, i) => {
      const w = ((s.end - s.start) / res.total) * 100;
      const bg = s.pid ? `background:${colorOf(s.pid)}` : "";
      return `<div class="seg${s.pid ? "" : " idle"}" data-start="${s.start}" style="width:${w}%;${bg}" title="${s.pid || "Idle"}: ${s.start} to ${s.end}">
        ${s.pid ? esc(s.pid) : "idle"}<span class="tick">${s.start}</span>${i === res.segments.length - 1 ? `<span class="tick end">${s.end}</span>` : ""}</div>`;
    }).join("") + '<div class="playhead" id="playhead"></div>';

    $("#slider").max = res.total; $("#slider").value = res.total;
    $("#playBtn").textContent = "Play";
    showTime(res.total);

    $("#metricsBody").innerHTML = res.rows.map((r) => `<tr>
      <td><span class="dot" style="background:${colorOf(r.pid)}"></span><strong>${esc(r.pid)}</strong></td>
      <td class="num">${r.arrival}</td><td class="num">${r.burst}</td><td class="num">${r.priority}</td>
      <td class="num">${r.ct}</td><td class="num">${r.tat}</td><td class="num">${r.wt}</td><td class="num">${r.rt}</td></tr>`).join("");
    $("#metricsFoot").innerHTML = `<tr><td colspan="5">Average</td><td class="num">${res.avgTAT.toFixed(2)}</td><td class="num">${res.avgWT.toFixed(2)}</td><td class="num">${res.avgRT.toFixed(2)}</td></tr>`;

    // queue log: only rows where the running process or the queue changes
    const log = []; let prev = "";
    res.timeline.forEach((tick) => {
      const key = tick.run + "|" + tick.queue.join(",");
      if (key !== prev) log.push(tick);
      prev = key;
    });
    $("#queueBody").innerHTML = log.map((tick) => `<tr>
      <td class="num">${tick.t}</td>
      <td>${tick.run ? `<span class="chip" style="background:${colorOf(tick.run)}">${esc(tick.run)}</span>` : '<span class="hint" style="margin:0">Idle</span>'}</td>
      <td>${tick.queue.length ? `<div class="chips">${tick.queue.map((q) => `<span class="chip" style="background:${colorOf(q)}">${esc(q)}</span>`).join("")}</div>` : '<span class="hint" style="margin:0">Empty</span>'}</td></tr>`).join("");
  }

  /* ----- player: step through time ----- */
  function showTime(t) {
    if (!sim) return;
    const { res } = sim;
    sim.t = t;
    $("#slider").value = t;
    $("#clock").textContent = `Time ${t} of ${res.total}`;
    $("#playhead").style.left = (t / res.total) * 100 + "%";
    $$(".seg", $("#ganttTrack")).forEach((seg) => seg.classList.toggle("future", +seg.dataset.start >= t && t < res.total));

    const tick = res.timeline[t]; // state at the start of unit t
    const chip = (pid) => `<span class="chip" style="background:${colorOf(pid)}">${esc(pid)}</span>`;
    $("#liveCpu").innerHTML = t >= res.total ? '<span class="chip empty">All processes finished</span>'
      : tick.run ? chip(tick.run) : '<span class="chip empty">Idle</span>';
    $("#liveQueue").innerHTML = t >= res.total || !tick.queue.length ? '<span class="chip empty">Empty</span>' : tick.queue.map(chip).join("");
    const finished = res.rows.filter((r) => r.ct <= t).map((r) => r.pid);
    $("#liveDone").innerHTML = finished.length ? finished.map(chip).join("") : '<span class="chip empty">None yet</span>';
  }
  function stop() {
    if (sim && sim.timer) { clearInterval(sim.timer); sim.timer = null; }
    $("#playBtn").textContent = "Play";
  }
  $("#playBtn").addEventListener("click", () => {
    if (!sim) return;
    if (sim.timer) { stop(); return; }
    if (sim.t >= sim.res.total) showTime(0);
    $("#playBtn").textContent = "Pause";
    sim.timer = setInterval(() => {
      if (sim.t >= sim.res.total) { stop(); return; }
      showTime(sim.t + 1);
      if (sim.t >= sim.res.total) stop();
    }, 700);
  });
  $("#stepBack").addEventListener("click", () => { if (sim) { stop(); showTime(Math.max(0, sim.t - 1)); } });
  $("#stepFwd").addEventListener("click", () => { if (sim) { stop(); showTime(Math.min(sim.res.total, sim.t + 1)); } });
  $("#slider").addEventListener("input", (e) => { if (sim) { stop(); showTime(+e.target.value); } });

  renderProcs();
}

/* ---------- Synchronization: producer-consumer with semaphores ---------- */
function initSync() {
  const N = 5;
  let s, autoTimer = null;
  const fresh = () => ({ buf: [], empty: N, full: 0, mutex: 1, pBlocked: false, cBlocked: false, counter: 1, lines: [] });
  s = fresh();

  const log = (text, cls = "") => { s.lines.unshift({ text, cls }); if (s.lines.length > 80) s.lines.pop(); };

  function produce() {
    if (s.pBlocked) return;
    if (s.empty === 0) { s.pBlocked = true; log("Producer: wait(empty) failed, buffer is full. Producer is BLOCKED.", "warn"); return; }
    const item = s.counter++;
    s.empty--; log(`Producer: wait(empty), empty = ${s.empty}`);
    s.mutex--; log("Producer: wait(mutex), enters critical section");
    s.buf.push(item); log(`Producer: places item ${item} in the buffer`);
    s.mutex++; log("Producer: signal(mutex), leaves critical section");
    s.full++; log(`Producer: signal(full), full = ${s.full}`);
    if (s.cBlocked) { s.cBlocked = false; log("Consumer wakes up because an item is available.", "ok"); consume(); }
  }
  function consume() {
    if (s.cBlocked) return;
    if (s.full === 0) { s.cBlocked = true; log("Consumer: wait(full) failed, buffer is empty. Consumer is BLOCKED.", "warn"); return; }
    s.full--; log(`Consumer: wait(full), full = ${s.full}`);
    s.mutex--; log("Consumer: wait(mutex), enters critical section");
    const item = s.buf.shift(); log(`Consumer: takes item ${item} from the buffer`);
    s.mutex++; log("Consumer: signal(mutex), leaves critical section");
    s.empty++; log(`Consumer: signal(empty), empty = ${s.empty}`);
    if (s.pBlocked) { s.pBlocked = false; log("Producer wakes up because a slot is free.", "ok"); produce(); }
  }

  function render() {
    $("#buffer").innerHTML = Array.from({ length: N }, (_, i) =>
      `<div class="slot${i < s.buf.length ? " filled" : ""}" aria-label="${i < s.buf.length ? "Item " + s.buf[i] : "Empty slot"}">${i < s.buf.length ? s.buf[i] : ""}</div>`).join("");
    $("#semEmpty").textContent = s.empty; $("#semFull").textContent = s.full; $("#semMutex").textContent = s.mutex;
    const setState = (id, blocked) => { const el = $(id); el.textContent = blocked ? "Blocked" : "Running"; el.className = "badge " + (blocked ? "low" : "good"); };
    setState("#producerState", s.pBlocked); setState("#consumerState", s.cBlocked);
    $("#produceBtn").disabled = s.pBlocked; $("#consumeBtn").disabled = s.cBlocked;
    $("#syncLog").innerHTML = s.lines.length ? s.lines.map((l) => `<div class="${l.cls}">${esc(l.text)}</div>`).join("") : "Press Produce or Consume to see each semaphore operation.";
  }

  $("#produceBtn").addEventListener("click", () => { produce(); render(); });
  $("#consumeBtn").addEventListener("click", () => { consume(); render(); });
  $("#resetSync").addEventListener("click", () => { stopAuto(); s = fresh(); render(); });

  function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } $("#autoBtn").textContent = "Auto run"; }
  $("#autoBtn").addEventListener("click", () => {
    if (autoTimer) { stopAuto(); return; }
    $("#autoBtn").textContent = "Stop auto run";
    autoTimer = setInterval(() => {
      if (Math.random() < 0.5) produce(); else consume();
      render();
    }, 1100);
  });
  render();
}
