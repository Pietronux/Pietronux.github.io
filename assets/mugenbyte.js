/* Mugenbyte — la lingua della pagina e poco altro.
   Va incluso nell'<head>, senza defer: sceglie la lingua prima che il browser
   disegni il testo, cosi' non si vede mai il doppio per un istante. */
(function () {
  var root = document.documentElement;
  var LANGS = ['en', 'it'];

  function valid(l) { return LANGS.indexOf(l) !== -1 ? l : null; }

  function choose() {
    // 1. ?lang= nell'indirizzo (lo store e i link espliciti);
    // 2. la scelta fatta l'ultima volta;
    // 3. la lingua del browser, se e' italiano; altrimenti inglese.
    var fromUrl = valid(new URLSearchParams(location.search).get('lang'));
    if (fromUrl) return fromUrl;
    try { var saved = valid(localStorage.getItem('mb-lang')); if (saved) return saved; } catch (e) {}
    var nav = (navigator.language || '').toLowerCase();
    return nav.indexOf('it') === 0 ? 'it' : 'en';
  }

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    var title = document.querySelector('title');
    if (title && title.dataset[lang]) title.textContent = title.dataset[lang];
    var desc = document.querySelector('meta[name="description"]');
    if (desc && desc.dataset[lang]) desc.setAttribute('content', desc.dataset[lang]);
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
  }

  apply(choose());

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-lang'));
    document.querySelectorAll('.lang').forEach(function (group) {
      group.addEventListener('click', function (event) {
        var b = event.target.closest('button[data-lang]');
        if (!b) return;
        apply(b.dataset.lang);
        try { localStorage.setItem('mb-lang', b.dataset.lang); } catch (e) {}
      });
    });
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  });
})();
