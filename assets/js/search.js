(function () {
  var inputs = document.querySelectorAll("[data-search-input]");
  if (!inputs.length) return;

  // index.json은 사이트 전체 글이라 한 번만 받아 모든 위젯이 공유한다
  var index = null;
  var loading = false;
  var waiting = [];

  function loadIndex(url, done) {
    if (index) { done(); return; }
    waiting.push(done);
    if (loading) return;
    loading = true;
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        index = data;
        loading = false;
        var queued = waiting;
        waiting = [];
        queued.forEach(function (fn) { fn(); });
      })
      .catch(function () { loading = false; waiting = []; });
  }

  function tokenize(q) {
    return q.toLowerCase().split(/\s+/).filter(Boolean);
  }

  // 모든 토큰이 제목이나 본문에 있어야 히트(AND) — 제목 매치에 가중치
  function score(post, tokens) {
    var title = (post.title || "").toLowerCase();
    var content = (post.content || "").toLowerCase();
    var total = 0;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      var inTitle = title.indexOf(t) !== -1;
      var inContent = content.indexOf(t) !== -1;
      if (!inTitle && !inContent) return 0;
      if (inTitle) total += 3;
      if (inContent) total += 1;
    }
    return total;
  }

  function excerpt(post, tokens) {
    var content = post.content || "";
    if (!content) return "";
    var at = content.toLowerCase().indexOf(tokens[0]);
    if (at === -1) at = 0;
    var start = Math.max(0, at - 60);
    var text = content.slice(start, start + 160).trim();
    return (start > 0 ? "… " : "") + text + (start + 160 < content.length ? " …" : "");
  }

  function setup(input) {
    var resultsEl = document.querySelector(input.getAttribute("data-search-results"));
    if (!resultsEl) return;
    var indexUrl = input.getAttribute("data-index-url");
    var limit = parseInt(input.getAttribute("data-limit"), 10) || 8;
    var withExcerpt = input.getAttribute("data-excerpt") === "true";
    var emptyLabel = input.getAttribute("data-empty-label") || "결과 없음";

    function render(items, tokens) {
      resultsEl.innerHTML = "";
      if (!items.length) {
        var li = document.createElement("li");
        li.className = "search-empty";
        li.textContent = emptyLabel;
        resultsEl.appendChild(li);
        resultsEl.hidden = false;
        return;
      }
      items.forEach(function (p) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = p.url;
        a.textContent = p.title;
        li.appendChild(a);
        var t = document.createElement("time");
        t.textContent = p.date;
        li.appendChild(t);
        if (withExcerpt) {
          var snippet = excerpt(p, tokens);
          if (snippet) {
            var d = document.createElement("p");
            d.className = "search-excerpt";
            d.textContent = snippet;
            li.appendChild(d);
          }
        }
        resultsEl.appendChild(li);
      });
      resultsEl.hidden = false;
    }

    function run() {
      var tokens = tokenize(input.value.trim());
      if (!tokens.length) {
        resultsEl.hidden = true;
        resultsEl.innerHTML = "";
        return;
      }
      if (!index) { loadIndex(indexUrl, run); return; }
      var hits = index
        .map(function (p) { return { p: p, s: score(p, tokens) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, limit)
        .map(function (x) { return x.p; });
      render(hits, tokens);
    }

    var timer = null;
    input.addEventListener("focus", function () { loadIndex(indexUrl, function () {}); });
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(run, 150);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.value = ""; run(); input.blur(); }
    });

    if (input.getAttribute("data-search-dismiss") === "true") {
      document.addEventListener("click", function (e) {
        if (!e.target.closest(".sidebar-search")) { resultsEl.hidden = true; }
      });
    }

    // /search/?q=... 딥링크 진입
    if (input.getAttribute("data-search-query") === "true") {
      var initial = new URLSearchParams(window.location.search).get("q");
      if (initial) { input.value = initial; run(); }
    }
  }

  Array.prototype.forEach.call(inputs, setup);
})();
