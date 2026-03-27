'use strict';

(function () {
  var storeData = null;
  var activeCategory = 'all';
  var searchQuery = '';

  function getLang() {
    return localStorage.getItem('jli-lang') || 'en';
  }

  function getCategoryName(catKey) {
    if (!storeData || !storeData.categories[catKey]) return catKey;
    var lang = getLang();
    return storeData.categories[catKey][lang] || storeData.categories[catKey].en;
  }

  function getWhatsAppText(product) {
    var lang = getLang();
    var tpl = storeData.whatsappTemplate[lang] || storeData.whatsappTemplate.en;
    return tpl.replace('{{name}}', product.name);
  }

  function buildCategorySidebar() {
    var list = document.getElementById('categoryList');
    if (!list || !storeData) return;

    var counts = {};
    storeData.products.forEach(function (p) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    var lang = getLang();
    var allLabel = lang === 'bm' ? 'Semua Produk' : 'All Products';

    var html = '<li><a href="#" class="jli-cat-link active" data-cat="all">' +
      allLabel + ' <span class="jli-cat-count">(' + storeData.products.length + ')</span></a></li>';

    Object.keys(storeData.categories).forEach(function (key) {
      var name = getCategoryName(key);
      var count = counts[key] || 0;
      html += '<li><a href="#" class="jli-cat-link" data-cat="' + key + '">' +
        name + ' <span class="jli-cat-count">(' + count + ')</span></a></li>';
    });

    list.innerHTML = html;

    list.addEventListener('click', function (e) {
      var link = e.target.closest('.jli-cat-link');
      if (!link) return;
      e.preventDefault();
      activeCategory = link.getAttribute('data-cat');
      list.querySelectorAll('.jli-cat-link').forEach(function (l) {
        l.classList.remove('active');
      });
      link.classList.add('active');
      renderProducts();
    });
  }

  function createProductCard(product) {
    var lang = getLang();
    var sizes = product.sizes.length > 0
      ? product.sizes
      : [lang === 'bm' ? 'Pelbagai saiz' : 'Various sizes'];
    var sizeBadges = sizes.map(function (s) {
      return '<span class="badge jli-size-badge">' + s + '</span>';
    }).join('');

    var waText = encodeURIComponent(getWhatsAppText(product));
    var waLink = 'https://wa.me/?text=' + waText;

    var enquireLabel = lang === 'bm' ? 'Pertanyaan WhatsApp' : 'WhatsApp Enquiry';

    var isInHouse = product.category === 'in-house';
    var badgeText = isInHouse ? (lang === 'bm' ? '★ JLI' : '★ JLI') : '';

    return '<div class="col-xl-3 col-lg-4 col-md-4 col-6">' +
      '<div class="card jli-product-card h-100' + (isInHouse ? ' jli-product-inhouse" data-badge="' + badgeText : '') + '">' +
        '<div class="jli-product-img-wrap">' +
          '<img src="' + product.image + '" class="card-img-top jli-product-img" alt="' + product.name + '" loading="lazy">' +
        '</div>' +
        '<div class="card-body d-flex flex-column">' +
          '<h6 class="jli-product-name">' + product.name + '</h6>' +
          '<div class="jli-size-row mb-2">' + sizeBadges + '</div>' +
          '<div class="mt-auto">' +
            '<a href="' + waLink + '" target="_blank" rel="noopener noreferrer" class="btn btn-sm jli-btn-whatsapp w-100">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="me-1"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.932 1.396 5.608L0 24l6.545-1.317A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.632-.5-5.15-1.373l-.37-.22-3.826.77.833-3.643-.24-.383A9.71 9.71 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>' +
              enquireLabel +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderProducts() {
    var grid = document.getElementById('productGrid');
    var noResults = document.getElementById('noResults');
    var countEl = document.getElementById('resultCount');
    if (!grid || !storeData) return;

    var filtered = storeData.products.filter(function (p) {
      var matchCat = activeCategory === 'all' || p.category === activeCategory;
      var matchSearch = !searchQuery || p.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
      return matchCat && matchSearch;
    });

    if (activeCategory === 'all' && !searchQuery) {
      var inHouse = filtered.filter(function (p) { return p.category === 'in-house'; });
      var rest = filtered.filter(function (p) { return p.category !== 'in-house'; });
      for (var i = rest.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = rest[i];
        rest[i] = rest[j];
        rest[j] = temp;
      }
      filtered = inHouse.concat(rest);
    }

    var lang = getLang();

    if (countEl) {
      var showingLabel = lang === 'bm' ? 'Menunjukkan' : 'Showing';
      var resultsLabel = lang === 'bm' ? 'hasil' : 'results';
      var allLabel = lang === 'bm' ? 'semua' : 'all';
      countEl.textContent = showingLabel + ' ' + (filtered.length === storeData.products.length && !searchQuery ? allLabel + ' ' : '') + filtered.length + ' ' + resultsLabel;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (noResults) noResults.classList.remove('d-none');
      return;
    }

    if (noResults) noResults.classList.add('d-none');

    grid.innerHTML = filtered.map(createProductCard).join('');
  }

  function initSearch() {
    var input = document.getElementById('productSearch');
    if (!input) return;

    var debounceTimer;
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        searchQuery = input.value.trim();
        renderProducts();
      }, 250);
    });
  }

  function loadProducts() {
    fetch('assets/products/products.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        storeData = data;
        buildCategorySidebar();
        renderProducts();
        initSearch();
      })
      .catch(function (err) {
        console.error('Failed to load products:', err);
        var grid = document.getElementById('productGrid');
        if (grid) {
          grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">Unable to load products. Please use a local server to view this page.</p></div>';
        }
      });
  }

  // Re-render when language changes
  var origSetLanguage = window.setLanguage;
  if (typeof origSetLanguage === 'function') {
    window.setLanguage = function (lang) {
      origSetLanguage(lang);
      if (storeData) {
        buildCategorySidebar();
        renderProducts();
      }
    };
  }

  if (document.getElementById('productGrid')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadProducts);
    } else {
      loadProducts();
    }
  }
})();
