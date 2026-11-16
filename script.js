/*
  EDIT HERE: one block per story.
  type:   "movie", "series" or "anime"
  poster: file name inside the images folder
  tag:    a line from the poster or a quote you like (leave "" to hide it)
  note:   what it taught you. Rewrite every note in your own words.
*/

var stories = [

  {
    title: "Titanic",
    kind: "Movie, 1997",
    type: "movie",
    poster: "titanic.jpg",
    tag: "Nothing on earth could come between them.",
    note: "It made me see that time with the people we love is never guaranteed, so I try not to waste moments or leave important things unsaid."
  },

  {
    title: "Swapped",
    kind: "Animated movie on Netflix",
    type: "movie",
    poster: "swapped.jpg",
    tag: "Transform your destiny.",
    note: "It showed me how different life looks from someone else’s side, and that I should listen before I judge."
  },

  {
    title: "Obsession",
    kind: "Movie",
    type: "movie",
    poster: "obsession.jpg",
    tag: "Be careful who you wish for…",
    note: "It made me think about how wanting something too badly can take over your judgment, and why I should keep my life balanced."
  },

  {
    title: "My Neighbor Totoro",
    kind: "Anime movie, 1988",
    type: "anime",
    poster: "totoro.jpg",
    tag: "",
    note: "It reminds me to slow down, notice small things, and keep my sense of wonder."
  },

  {
    title: "Ponyo",
    kind: "Anime movie, 2008",
    type: "anime",
    poster: "ponyo.jpg",
    tag: "Welcome to a world where anything is possible.",
    note: "It reminds me that love and kindness can be simple and brave, and that our choices affect the world around us."
  },

  {
    title: "Bet",
    kind: "TV series",
    type: "series",
    poster: "bet.jpg",
    tag: "",
    note: "It made me think about how risky choices and the pressure to win can pull people into things they cannot easily leave."
  }

];


/* the rows shown on the page */
var groups = [
  { name: "All my favorites", test: function () { return true; } },
  { name: "Movies", test: function (s) { return s.type === "movie"; } },
  { name: "Anime and series", test: function (s) { return s.type !== "movie"; } }
];

function $(id) { return document.getElementById(id); }
var modal = $("modal"), nav = $("nav"), current = 0, lastBtn = null;
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* loads a poster; if it is missing, tries the same name with a second .jpg
   (Windows sometimes saves a picture as titanic.jpg.jpg) */
function loadPoster(img, path) {
  img.onerror = function () { img.onerror = null; img.src = path + ".jpg"; };
  img.src = path;
}

/* makes an element lean toward the mouse */
function tilt(el, max) {
  el.addEventListener("mousemove", function (e) {
    var r = el.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", x * max + "deg");
    el.style.setProperty("--rx", -y * max + "deg");
  });
  el.addEventListener("mouseleave", function () {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  });
}

/* the big featured story at the top */
function setHero(i, noAnim) {
  var s = stories[i], hp = $("hPoster"), hd = $("top");
  current = i;
  if (!noAnim) {
    hd.classList.remove("swap");   /* restart the entrance animation */
    void hd.offsetWidth;
    hd.classList.add("swap");
  }
  hp.alt = s.title + " poster";
  hp.onload = function () { $("heroBg").style.backgroundImage = 'url("' + hp.src + '")'; };
  loadPoster(hp, s.poster);
  $("hTitle").textContent = s.title;
  $("hKind").textContent = s.kind;
  $("hNote").textContent = s.note;
}

/* the details window */
function openModal(i, btn) {
  var s = stories[i];
  lastBtn = btn || null;
  $("mPoster").alt = s.title + " poster";
  loadPoster($("mPoster"), s.poster);
  $("mTitle").textContent = s.title;
  $("mKind").textContent = s.kind;
  $("mTag").textContent = s.tag;
  $("mNote").textContent = s.note;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  $("mClose").focus();
}
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastBtn) lastBtn.focus();
}

/* build the poster rows */
groups.forEach(function (g) {
  var row = document.createElement("div");
  row.className = "row";
  row.innerHTML = "<h2>" + g.name + "</h2>" +
    '<div class="rowwrap">' +
    '<button class="arrow l" type="button" aria-label="Scroll left">‹</button>' +
    '<div class="strip"></div>' +
    '<button class="arrow r" type="button" aria-label="Scroll right">›</button>' +
    "</div>";
  var strip = row.querySelector(".strip");
  stories.forEach(function (s, i) {
    if (!g.test(s)) return;
    var c = document.createElement("button");
    c.type = "button";
    c.className = "card";
    c.innerHTML = "<span>" + s.title + "</span>";
    var im = document.createElement("img");
    im.alt = s.title + " poster";
    loadPoster(im, s.poster);
    c.insertBefore(im, c.firstChild);
    c.onclick = function () { openModal(i, c); };
    tilt(c, 14);
    strip.appendChild(c);
  });
  row.querySelector(".l").onclick = function () {
    strip.scrollBy({ left: -strip.clientWidth * 0.8, behavior: "smooth" });
  };
  row.querySelector(".r").onclick = function () {
    strip.scrollBy({ left: strip.clientWidth * 0.8, behavior: "smooth" });
  };
  $("rows").appendChild(row);
});

/* hero buttons and window controls */
$("hMore").onclick = function () { openModal(current, this); };
$("surprise").onclick = function () {
  var i;
  do { i = Math.floor(Math.random() * stories.length); } while (i === current && stories.length > 1);
  setHero(i);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
$("mClose").onclick = closeModal;
modal.onclick = function (e) { if (e.target === modal) closeModal(); };
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

/* hero extras: pink spotlight that follows the mouse, tilting poster, floating sparks */
var hero = $("top");
hero.addEventListener("mousemove", function (e) {
  var r = hero.getBoundingClientRect();
  hero.style.setProperty("--mx", e.clientX - r.left + "px");
  hero.style.setProperty("--my", e.clientY - r.top + "px");
});
tilt($("hPoster"), 12);
for (var k = 0; k < 22; k++) {
  var sp = document.createElement("span"), size = 4 + Math.random() * 10;
  sp.className = "spark";
  sp.style.cssText = "left:" + Math.random() * 100 + "%;width:" + size + "px;height:" + size +
    "px;animation-duration:" + (7 + Math.random() * 9) + "s;animation-delay:-" + Math.random() * 12 + "s";
  $("sparks").appendChild(sp);
}

/* scrolling title strip */
var tick = "";
for (var t = 0; t < 6; t++) {
  stories.forEach(function (s) { tick += "<span>" + s.title + "</span>"; });
}
$("tickTrack").innerHTML = tick;

/* numbers that count up */
var movieCount = stories.filter(function (s) { return s.type === "movie"; }).length;
var statData = [
  { n: stories.length, l: "favorite stories" },
  { n: movieCount, l: "movies" },
  { n: stories.length - movieCount, l: "anime and series" },
  { n: 3, l: "ideas that stay with me" }
];
$("stats").innerHTML = statData.map(function (d) {
  return '<div class="stat"><b data-n="' + d.n + '">' + (reduce ? d.n : 0) + "</b><span>" + d.l + "</span></div>";
}).join("");

function countUp(b) {
  var end = +b.dataset.n, start = null;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / 1200, 1);
    b.textContent = Math.round(end * p);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* QUIZ: which of my stories are you? */
function idx(name) {
  for (var i = 0; i < stories.length; i++) if (stories[i].title === name) return i;
  return -1;
}
var quiz = [
  { q: "Pick a mood for tonight.", opts: [
    ["Cozy and calm", ["My Neighbor Totoro", "Ponyo"]],
    ["Emotional and deep", ["Titanic", "Swapped"]],
    ["Edge of my seat", ["Obsession", "Bet"]],
    ["Curious and adventurous", ["Ponyo", "Swapped"]] ] },
  { q: "What matters most in a story?", opts: [
    ["Love and loyalty", ["Titanic", "Ponyo"]],
    ["Wonder and imagination", ["My Neighbor Totoro", "Ponyo"]],
    ["Risk and consequences", ["Bet", "Obsession"]],
    ["Seeing life through someone else’s eyes", ["Swapped", "My Neighbor Totoro"]] ] },
  { q: "When things get hard, you…", opts: [
    ["Slow down and breathe", ["My Neighbor Totoro", "Ponyo"]],
    ["Hold on to the people you love", ["Titanic", "Ponyo"]],
    ["Take a bold chance", ["Bet", "Swapped"]],
    ["Overthink every move", ["Obsession", "Bet"]] ] }
];
var qBox = $("quizBox"), qStep = 0, scores = [];

function qAnim() {
  qBox.classList.remove("pop");
  void qBox.offsetWidth;
  qBox.classList.add("pop");
}
function quizStart() {
  qStep = 0;
  scores = stories.map(function () { return 0; });
  quizShow();
}
function quizShow() {
  var q = quiz[qStep];
  qBox.innerHTML = '<p class="qcount">Question ' + (qStep + 1) + " of " + quiz.length +
    '</p><h3 class="qq">' + q.q + "</h3>";
  q.opts.forEach(function (o) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "opt";
    b.textContent = o[0];
    b.onclick = function () {
      o[1].forEach(function (t) { scores[idx(t)]++; });
      qStep++;
      if (qStep < quiz.length) quizShow(); else quizResult();
    };
    qBox.appendChild(b);
  });
  qAnim();
}
function quizResult() {
  var best = 0;
  scores.forEach(function (v, i) { if (v > scores[best]) best = i; });
  var s = stories[best];
  qBox.innerHTML = '<p class="qcount">Your match</p><div class="qres"><img id="qImg" alt="">' +
    '<div><h3 class="qq"></h3><p class="meta"></p>' +
    '<p class="qtext">This story fits your mood. Tap below to read what it taught me.</p>' +
    '<div class="hbtns"><button class="btn play" id="qMore" type="button">Why I love it</button>' +
    '<button class="btn ghost" id="qAgain" type="button">Try again</button></div></div></div>';
  $("qImg").alt = s.title + " poster";
  loadPoster($("qImg"), s.poster);
  qBox.querySelector(".qq").textContent = s.title;
  qBox.querySelector(".meta").textContent = s.kind;
  $("qMore").onclick = function () { openModal(best, this); };
  $("qAgain").onclick = quizStart;
  qAnim();
}
quizStart();

/* scroll: top bar, progress bar, back to top */
var toTop = $("toTop"), prog = $("progress");
window.addEventListener("scroll", function () {
  var h = document.documentElement.scrollHeight - window.innerHeight;
  nav.classList.toggle("solid", window.scrollY > 40);
  prog.style.width = (h > 0 ? window.scrollY / h * 100 : 0) + "%";
  toTop.classList.toggle("show", window.scrollY > 600);
});
toTop.onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };

/* appear-on-scroll animations and number count-up */
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      if (e.target.id === "stats") {
        if (!reduce) e.target.querySelectorAll("b").forEach(countUp);
      } else {
        e.target.classList.add(e.target.classList.contains("row") ? "show" : "in");
      }
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  io.observe($("stats"));
  if (!reduce) {
    document.documentElement.classList.add("anim");
    document.querySelectorAll(".row").forEach(function (r) {
      r.querySelectorAll(".card").forEach(function (c, n) {
        c.style.setProperty("--d", n * 90 + "ms");
      });
      io.observe(r);
    });
    document.querySelectorAll(".panel h2, .qlead, .quizBox, .qa, .thing, .credit, .theEnd").forEach(function (el, n) {
      el.classList.add("reveal");
      el.style.transitionDelay = (n % 3) * 120 + "ms";
      io.observe(el);
    });
  }
}

/* start: fill the hero, then play its entrance after the opening screen lifts */
setHero(0, true);
setTimeout(function () { hero.classList.add("swap"); }, reduce ? 0 : 2300);
setTimeout(function () { var el = $("intro"); if (el) el.remove(); }, 3300);
