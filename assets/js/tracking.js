(function () {
  window.dataLayer = window.dataLayer || [];
  var SITE_KEY = document.documentElement.getAttribute("data-site-key") || "";
  function push(obj) {
    obj.site_key = SITE_KEY;
    window.dataLayer.push(obj);
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track], a, button");
    if (!el) return;
    var category = el.getAttribute("data-category") || (el.tagName === "A" ? "link" : "button");
    var action = el.getAttribute("data-action") || "click";
    var href = el.getAttribute("href");
    var label = el.getAttribute("data-label") || href || (el.textContent || "").trim().slice(0, 80);
    var isExternal = el.tagName === "A" && el.hostname && el.hostname !== location.hostname;
    push({
      event: "user_interaction",
      interaction_category: isExternal ? "outbound" : category,
      interaction_action: action,
      interaction_label: label
    });
  }, true);
})();
