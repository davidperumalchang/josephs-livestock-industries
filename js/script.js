'use strict';

const translations = {
  en: {
    'nav.about': 'About',
    'nav.product': 'Our Products',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'hero.title': 'Josephs Livestock Industries',
    'hero.tagline': 'Supporting Farmers. Feeding Livestock. Growing Agriculture.',
    'hero.cta': 'Learn More',
    'about.title': 'Who We Are',
    'about.description': 'Josephs Livestock Industries is a trusted supplier of livestock feed, pet food, farm supplies, and agricultural products. Serving farmers, breeders, and pet owners with quality products and reliable solutions.',
    'about.stat1': 'Farm Supplies',
    'about.stat2': 'Livestock Feed',
    'about.stat3': 'Pet Food',
    'services.title': 'What We Offer',
    'services.feed.title': 'Livestock Feed',
    'services.feed.desc': 'Premium quality feed formulated for cattle, poultry, goats, and other farm animals to ensure healthy growth and productivity.',
    'services.pet.title': 'Pet Food',
    'services.pet.desc': 'Nutritious and balanced pet food for dogs, cats, and other companion animals from trusted brands.',
    'services.farm.title': 'Farm Supplies',
    'services.farm.desc': 'Essential tools, equipment, and supplies for modern farming operations of all sizes.',
    'services.agri.title': 'Agricultural Products',
    'services.agri.desc': 'A wide range of agricultural products including fertilizers and crop care solutions.',
    'cta.title': 'Ready to Partner With Us?',
    'cta.desc': 'Whether you\'re a farmer, breeder, or pet owner, we have the products you need. Get in touch today.',
    'cta.button': 'Contact Us',
    'footer.rights': 'All rights reserved.'
  },
  bm: {
    'nav.about': 'Tentang Kami',
    'nav.product': 'Produk Kami',
    'nav.services': 'Perkhidmatan',
    'nav.contact': 'Hubungi',
    'hero.title': 'Josephs Livestock Industries',
    'hero.tagline': 'Menyokong Petani. Memberi Makan Ternakan. Memajukan Pertanian.',
    'hero.cta': 'Ketahui Lebih Lanjut',
    'about.title': 'Siapa Kami',
    'about.description': 'Josephs Livestock Industries merupakan pembekal dipercayai bagi makanan ternakan, makanan haiwan peliharaan, bekalan ladang, dan produk pertanian. Kami menyediakan produk berkualiti dan penyelesaian yang boleh dipercayai untuk penternak, petani, dan pemilik haiwan peliharaan.',
    'about.stat1': 'Bekalan Ladang',
    'about.stat2': 'Makanan Ternakan',
    'about.stat3': 'Makanan Haiwan',
    'services.title': 'Apa Yang Kami Tawarkan',
    'services.feed.title': 'Makanan Ternakan',
    'services.feed.desc': 'Makanan ternakan berkualiti tinggi yang diformulasikan untuk lembu, ayam, kambing, dan haiwan ternakan lain bagi memastikan pertumbuhan dan produktiviti yang sihat.',
    'services.pet.title': 'Makanan Haiwan Peliharaan',
    'services.pet.desc': 'Makanan haiwan peliharaan yang berkhasiat dan seimbang untuk anjing, kucing, dan haiwan peliharaan lain daripada jenama yang dipercayai.',
    'services.farm.title': 'Bekalan Ladang',
    'services.farm.desc': 'Alatan, peralatan, dan bekalan penting untuk operasi pertanian moden dari pelbagai saiz.',
    'services.agri.title': 'Produk Pertanian',
    'services.agri.desc': 'Pelbagai produk pertanian termasuk baja dan penyelesaian penjagaan tanaman.',
    'cta.title': 'Bersedia Untuk Bekerjasama?',
    'cta.desc': 'Sama ada anda seorang petani, penternak, atau pemilik haiwan peliharaan, kami mempunyai produk yang anda perlukan. Hubungi kami hari ini.',
    'cta.button': 'Hubungi Kami',
    'footer.rights': 'Hak cipta terpelihara.'
  }
};

let currentLang = localStorage.getItem('jli-lang') || 'en';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('jli-lang', lang);
  document.documentElement.lang = lang === 'bm' ? 'bm' : 'en';

  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

document.getElementById('langSwitcher').addEventListener('click', function(e) {
  const btn = e.target.closest('.lang-btn');
  if (!btn) return;
  const lang = btn.getAttribute('data-lang');
  if (lang && lang !== currentLang) {
    setLanguage(lang);
  }
});

// Close Bootstrap mobile nav on link click
document.querySelectorAll('.navbar-nav .nav-link').forEach(function(link) {
  link.addEventListener('click', function() {
    const navCollapse = document.getElementById('mainNav');
    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
    if (bsCollapse) {
      bsCollapse.hide();
    }
  });
});

// Header scroll shadow
window.addEventListener('scroll', function() {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Scroll-triggered fade-in animations
function initFadeAnimations() {
  document.querySelectorAll('.jli-service-card, .jli-stat, .jli-about-text, .jli-cta .container').forEach(function(el) {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(function(el) {
    observer.observe(el);
  });
}

setLanguage(currentLang);
initFadeAnimations();
