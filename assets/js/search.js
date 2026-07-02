(function () {
  var input = document.getElementById("site-search");
  var resultsEl = document.getElementById("search-results");
  if (!input || !resultsEl) return;

  var index = null;
  var loading = false;

  function loadIndex() {
    if (index || loading) return;
    loading = true;
    fetch(input.getAttribute("data-index-url"))
      .then(function (r) { return r.json(); })
      .then(function (data) { index = data; loading = false; run(); })
      .catch(function () { loading = false; });
  }

  function score(post, q) {
    var s = 0;
    var title = (post.title || "").toLowerCase();
    var content = (post.content || "").toLowerCase();
    if (title.indexOf(q) !== -1) s += 3;
    if (content.indexOf(q) !== -1) s += 1;
    return s;
  }

  function render(items) {
    resultsEl.innerHTML = "";
    if (!items.length) {
      resultsEl.hidden = false;
      resultsEl.innerHTML = '<li class="search-empty">결과 없음</li>';
      return;
    }
    items.forEach(function (p) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = p.url;
      a.textContent = p.title;
      var t = document.createElement("time");
      t.textContent = p.date;
      li.appendChild(a);
      li.appendChild(t);
      resultsEl.appendChild(li);
    });
    resultsEl.hidden = false;
  }

  function run() {
    var q = input.value.trim().toLowerCase();
    if (!q) { resultsEl.hidden = true; resultsEl.innerHTML = ""; return; }
    if (!index) { loadIndex(); return; }
    var hits = index
      .map(function (p) { return { p: p, s: score(p, q) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 8)
      .map(function (x) { return x.p; });
    render(hits);
  }

  var timer = null;
  input.addEventListener("focus", loadIndex);
  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(run, 150);
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { input.value = ""; run(); input.blur(); }
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".sidebar-search")) { resultsEl.hidden = true; }
  });
})();
