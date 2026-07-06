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
    var isExternal = el.tagName === "A" && el.hostname && el.hostname !== location.hostname;
    var action = el.getAttribute("data-action");
    if (!action) {
      action = isExternal ? "outbound_click" : (el.tagName === "A" ? "link_click" : "button_click");
    }
    action = action.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (/^[0-9]/.test(action)) action = "e_" + action;
    action = action.slice(0, 40);
    var href = el.getAttribute("href");
    var label = el.getAttribute("data-label") || href || (el.textContent || "").trim().slice(0, 80);
    push({
      event: "user_interaction",
      interaction_category: isExternal ? "outbound" : category,
      interaction_action: action,
      interaction_label: label
    });
  }, true);
})();
