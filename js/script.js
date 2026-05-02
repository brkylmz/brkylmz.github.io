// ============================================
// Yörük Gold Lojistik
// ============================================

// ============ Toast Bildirim ============
window.showToast = function(options) {
    const opts = typeof options === 'string'
        ? { message: options, type: 'success' }
        : (options || {});
    const type = opts.type || 'success';
    const message = opts.message || '';
    const titles = { success: 'Başarılı', error: 'Hata Oluştu', info: 'Bilgi' };
    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
    const title = opts.title || titles[type] || 'Bildirim';
    const duration = opts.duration || 4500;

    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'status');
    toast.innerHTML =
        '<div class="toast-icon"><i class="fa-solid ' + (icons[type] || icons.info) + '"></i></div>' +
        '<div class="toast-content">' +
            '<div class="toast-title">' + title + '</div>' +
            '<div class="toast-message">' + message + '</div>' +
        '</div>' +
        '<button class="toast-close" aria-label="Kapat"><i class="fa-solid fa-xmark"></i></button>' +
        '<div class="toast-progress"></div>';

    container.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

    let timer;
    const close = () => {
        clearTimeout(timer);
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    };
    toast.querySelector('.toast-close').addEventListener('click', close);
    timer = setTimeout(close, duration);
};

document.addEventListener('DOMContentLoaded', () => {

    // Yıl
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobil menü
    const navToggle = document.getElementById('navToggle');
    const navClose = document.getElementById('navClose');
    const nav = document.getElementById('nav');

    if (navToggle && nav) navToggle.addEventListener('click', () => nav.classList.add('open'));
    if (navClose && nav) navClose.addEventListener('click', () => nav.classList.remove('open'));
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => nav?.classList.remove('open'));
    });

    // Header scroll efekti
    const header = document.getElementById('header');
    const backTop = document.getElementById('backTop');

    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 30);
        if (backTop) backTop.classList.toggle('show', window.scrollY > 600);
    });

    if (backTop) {
        backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // AOS-benzeri animasyon
    const animatedEls = document.querySelectorAll('[data-aos]');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => entry.target.classList.add('aos-show'), parseInt(delay));
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    animatedEls.forEach(el => io.observe(el));

    // İstatistik sayaç
    const counters = document.querySelectorAll('.stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased).toLocaleString('tr-TR');
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('tr-TR');
        }
        requestAnimationFrame(step);
    }

    // ============ Hero Slider ============
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots button');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');

    if (slides.length > 0) {
        let current = 0;
        let timer;

        function show(idx) {
            slides[current].classList.remove('active');
            dots[current]?.classList.remove('active');
            current = (idx + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current]?.classList.add('active');
        }

        function next() { show(current + 1); }
        function prev() { show(current - 1); }

        function startAuto() {
            stopAuto();
            timer = setInterval(next, 6000);
        }
        function stopAuto() { if (timer) clearInterval(timer); }

        dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); startAuto(); }));
        nextBtn?.addEventListener('click', () => { next(); startAuto(); });
        prevBtn?.addEventListener('click', () => { prev(); startAuto(); });

        startAuto();
    }

    // ============ Custom Combobox ============
    const TR_CITIES = [
        'Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya',
        'Ardahan','Artvin','Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik',
        'Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli',
        'Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep',
        'Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta','İstanbul','İzmir',
        'Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kırıkkale',
        'Kırklareli','Kırşehir','Kilis','Kocaeli','Konya','Kütahya','Malatya','Manisa',
        'Mardin','Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye','Rize',
        'Sakarya','Samsun','Siirt','Sinop','Sivas','Şanlıurfa','Şırnak','Tekirdağ','Tokat',
        'Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak'
    ];

    function trLower(s) {
        return (s || '').toLocaleLowerCase('tr-TR')
            .replace(/i̇/g, 'i').replace(/İ/g, 'i').replace(/I/g, 'ı');
    }

    function initCombobox(wrapper) {
        if (!wrapper || wrapper.dataset.comboboxInit) return;
        wrapper.dataset.comboboxInit = '1';

        const input = wrapper.querySelector('.combobox-input');
        const list = wrapper.querySelector('.combobox-list');
        if (!input || !list) return;

        const source = wrapper.dataset.combobox === 'cities' ? TR_CITIES : [];

        function render(filter) {
            const q = trLower(filter || '');
            list.innerHTML = '';
            const matches = source.filter(c => trLower(c).includes(q));
            if (matches.length === 0) {
                const empty = document.createElement('li');
                empty.className = 'combobox-empty';
                empty.textContent = 'Sonuç bulunamadı';
                list.appendChild(empty);
                return;
            }
            matches.forEach(city => {
                const li = document.createElement('li');
                li.className = 'combobox-item';
                li.textContent = city;
                li.addEventListener('mousedown', e => {
                    e.preventDefault();
                    input.value = city;
                    close();
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });
                list.appendChild(li);
            });
        }

        function open() {
            wrapper.classList.add('open');
            render(input.value);
        }
        function close() {
            wrapper.classList.remove('open');
        }
        function toggle() {
            wrapper.classList.contains('open') ? close() : open();
        }

        input.addEventListener('focus', open);
        input.addEventListener('click', open);
        input.addEventListener('input', () => {
            wrapper.classList.add('open');
            render(input.value);
        });
        input.addEventListener('blur', () => {
            setTimeout(close, 160);
        });
        input.addEventListener('keydown', e => {
            if (e.key === 'Escape') { close(); input.blur(); }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!wrapper.classList.contains('open')) open();
                const first = list.querySelector('.combobox-item');
                if (first) first.classList.add('active');
            }
        });

        // İlk render boş listeyi gizler ama ihtiyaç olduğunda dolar
        render('');
    }

    document.querySelectorAll('[data-combobox]').forEach(initCombobox);

    // ============ Telefon Mask ============
    function formatPhone(raw) {
        let v = (raw || '').replace(/\D/g, '');
        if (v.startsWith('90') && v.length > 10) v = v.slice(2);
        if (v.startsWith('0')) v = v.slice(1);
        v = v.slice(0, 10);
        if (v.length === 0) return '';
        let out = '0 (' + v.slice(0, 3);
        if (v.length > 3) out += ') ' + v.slice(3, 6);
        if (v.length > 6) out += ' ' + v.slice(6, 8);
        if (v.length > 8) out += ' ' + v.slice(8, 10);
        return out;
    }

    function applyPhoneMask(input) {
        if (!input || input.dataset.phoneMaskApplied) return;
        input.dataset.phoneMaskApplied = '1';
        if (!input.placeholder) input.placeholder = '0 (5__) ___ __ __';
        input.setAttribute('inputmode', 'tel');
        input.setAttribute('autocomplete', 'tel');
        input.setAttribute('maxlength', '20');

        input.addEventListener('input', function(e) {
            const formatted = formatPhone(e.target.value);
            if (e.target.value !== formatted) e.target.value = formatted;
        });
        input.addEventListener('blur', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
        input.addEventListener('focus', function(e) {
            if (!e.target.value) e.target.value = '';
        });
    }

    // type="tel" tüm input'lar + name/id'sinde phone/telefon geçen text input'lar
    document.querySelectorAll('input[type="tel"]').forEach(applyPhoneMask);
    document.querySelectorAll('input[type="text"]').forEach(input => {
        const hint = ((input.name || '') + ' ' + (input.id || '') + ' ' + (input.placeholder || '')).toLowerCase();
        if (hint.includes('telefon') || hint.includes('phone') || hint.includes('gsm')) {
            applyPhoneMask(input);
        }
    });

    // ============ KVKK Banner ============
    const banner = document.getElementById('kvkkBanner');
    const acceptBtn = document.getElementById('kvkkAccept');
    if (banner && acceptBtn) {
        const STORAGE_KEY = 'yg_kvkk_accepted_at';
        const VALID_DAYS = 180;
        const acceptedAt = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
        const now = Date.now();
        const validMs = VALID_DAYS * 24 * 60 * 60 * 1000;

        if (!acceptedAt || (now - acceptedAt) > validMs) {
            setTimeout(() => banner.classList.add('show'), 1200);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
            banner.classList.remove('show');
        });
    }
});
