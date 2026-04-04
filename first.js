document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       0. LENIS SMOOTH SCROLL
       ============================================================ */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* ============================================================
       1. LOADING SCREEN
       ============================================================ */
    const loader = document.getElementById('js-loader');
    const html = document.documentElement;
    lenis.stop();

    setTimeout(() => {
        if (loader) {
            loader.classList.add('-hidden');
            html.classList.remove('is-loading');
            html.classList.add('is-loaded');
            lenis.start();
        }
    }, 2400);

    /* ============================================================
       2. CURSOR REVEAL — Dual-layer hero background
       ============================================================ */
    const heroSection    = document.querySelector('.o-hero');
    const heroReveal     = document.querySelector('.o-hero_bg_reveal');
    const heroBaseBgImg  = document.querySelector('.o-hero_bg_base img');

    if (heroSection && heroReveal) {
        let mouseX = heroSection.offsetWidth  / 2;
        let mouseY = heroSection.offsetHeight / 2;
        let currX  = mouseX;
        let currY  = mouseY;
        let radius = 0;
        let targetRadius = 0;

        heroSection.addEventListener('mouseenter', () => {
            targetRadius = 170;
        });
        heroSection.addEventListener('mouseleave', () => {
            targetRadius = 0;
        });
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        (function animateReveal() {
            currX  += (mouseX  - currX)  * 0.09;
            currY  += (mouseY  - currY)  * 0.09;
            radius += (targetRadius - radius) * 0.07;
            heroReveal.style.clipPath = `circle(${radius}px at ${currX}px ${currY}px)`;
            requestAnimationFrame(animateReveal);
        })();
    }

    /* ============================================================
       3. TEXT PRESSURE — Hero title
       ============================================================ */
    const heroTitle = document.querySelector('.o-hero_title');

    if (heroTitle) {
        const heroLines = heroTitle.querySelectorAll('.o-hero_line');
        heroLines.forEach(line => {
            const text  = line.textContent.trim();
            const chars = text.split('');
            line.innerHTML =
                `<span class="o-hero_line_inner">` +
                chars.map(ch =>
                    ch === ' '
                        ? `<span class="o-hero_char">&nbsp;</span>`
                        : `<span class="o-hero_char">${ch}</span>`
                ).join('') +
                `</span>`;
        });

        heroTitle.addEventListener('mousemove', (e) => {
            heroTitle.querySelectorAll('.o-hero_char').forEach(ch => {
                const r    = ch.getBoundingClientRect();
                const cx   = r.left + r.width  / 2;
                const cy   = r.top  + r.height / 2;
                const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
                const prox = Math.max(0, 1 - dist / 160);
                ch.style.fontWeight = Math.round(400 + prox * 500);
                ch.style.transform  = `scale(${1 + prox * 0.18})`;
            });
        });

        heroTitle.addEventListener('mouseleave', () => {
            heroTitle.querySelectorAll('.o-hero_char').forEach(ch => {
                ch.style.fontWeight = '';
                ch.style.transform  = '';
            });
        });
    }

    /* ============================================================
       4. SCROLL REVEAL — IntersectionObserver
       ============================================================ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-inview');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('[data-scroll-reveal]').forEach(el => revealObserver.observe(el));

    // Work cards — staggered clip-path reveal
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = Array.from(document.querySelectorAll('.o-works_card')).indexOf(entry.target);
                setTimeout(() => entry.target.classList.add('is-inview'), idx * 200);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.o-works_card').forEach(c => cardObserver.observe(c));

    /* ============================================================
       5. HEADER — hide on scroll-down, show on scroll-up
       ============================================================ */
    const header = document.getElementById('header');
    let lastScrollY = 0, ticking = false;

    function updateHeader() {
        const y = window.scrollY;
        if (y > 300) {
            header.classList.toggle('-hidden', y > lastScrollY);
        } else {
            header.classList.remove('-hidden');
        }
        lastScrollY = y;
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
    });

    /* ============================================================
       6. FOOTER HEIGHT — CSS variable for sticky footer
       ============================================================ */
    function setFooterHeight() {
        const footer      = document.querySelector('.o-footer');
        const placeholder = document.querySelector('.o-footer_placeholder');
        if (footer && placeholder) {
            document.documentElement.style.setProperty('--footer-height', footer.offsetHeight + 'px');
        }
    }
    setFooterHeight();
    window.addEventListener('resize', setFooterHeight);

    /* ============================================================
       7. SMOOTH SCROLL — nav links via Lenis
       ============================================================ */
    document.querySelectorAll('[data-nav]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) lenis.scrollTo(target, { offset: -100 });
        });
    });

    /* ============================================================
       8. PARALLAX — work-card images on scroll
       ============================================================ */
    function updateParallax() {
        document.querySelectorAll('[data-parallax]').forEach(img => {
            const rect = img.getBoundingClientRect();
            const wh   = window.innerHeight;
            if (rect.top < wh && rect.bottom > 0) {
                const progress = (wh - rect.top) / (wh + rect.height);
                img.style.transform = `scale(1.15) translateY(${(progress - 0.5) * 40}px)`;
            }
        });
    }
    window.addEventListener('scroll', () => requestAnimationFrame(updateParallax));

    /* ============================================================
       9. EXPERTISE ITEMS — CHD photo reveal on hover
       ============================================================ */
    const expertiseItems  = document.querySelectorAll('.o-expertise_item');
    const expertiseList   = document.querySelector('.o-expertise_list');
    const expertisePhotos = document.querySelectorAll('.o-expertise_photo');

    if (expertiseList) {
        expertiseList.addEventListener('mouseenter', () => {
            expertiseItems.forEach(it => { it.style.opacity = '0.25'; });
        });
        expertiseList.addEventListener('mouseleave', () => {
            expertiseItems.forEach(it => { it.style.opacity = ''; });
            expertisePhotos.forEach(ph => ph.classList.remove('-active'));
        });
        expertiseItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.opacity = '1';
                const idx = item.getAttribute('data-index');
                expertisePhotos.forEach(ph => {
                    ph.classList.toggle('-active', ph.getAttribute('data-expertise-photo') === idx);
                });
            });
            item.addEventListener('mouseleave', () => { item.style.opacity = '0.25'; });
        });
    }

    /* ============================================================
       10. MAGNETIC HOVER — contact links
       ============================================================ */
    document.querySelectorAll('.o-contact_link, .o-footer_socialLink').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width  / 2;
            const y = e.clientY - rect.top  - rect.height / 2;
            el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    /* ============================================================
       11. HERO BG BASE — subtle mouse parallax
       ============================================================ */
    if (heroSection && heroBaseBgImg) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth  - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            heroBaseBgImg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
        });
    }

    /* ============================================================
       12. Z-INDEX STACKING — main above sticky footer
       ============================================================ */
    const main = document.getElementById('main');
    if (main) { main.style.position = 'relative'; main.style.zIndex = '2'; main.style.background = 'inherit'; }

    document.querySelectorAll('.o-about, .o-contact').forEach(s => { s.style.background = '#fff'; });
    document.querySelectorAll('.o-expertise, .o-works, .o-bigWords, .o-journey').forEach(s => {
        s.style.background = '#000';
    });

    /* ============================================================
       13. PREMIUM TIMELINE — scroll-driven line + card reveal
       ============================================================ */
    const timelineFill    = document.querySelector('.o-timeline_line_fill');
    const timelineSection = document.querySelector('.o-journey');
    const timelineItems   = document.querySelectorAll('.o-timeline_item');

    // Animated vertical line driven by scroll progress through section
    if (timelineFill && timelineSection) {
        function updateTimelineLine() {
            const rect     = timelineSection.getBoundingClientRect();
            const wh       = window.innerHeight;
            const scrolled = Math.max(0, wh - rect.top);
            const total    = rect.height + wh;
            timelineFill.style.transform = `scaleY(${Math.min(1, scrolled / total)})`;
        }
        window.addEventListener('scroll', () => requestAnimationFrame(updateTimelineLine));
        updateTimelineLine();
    }

    // Card reveal observer
    const tlCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-inview');
                tlCardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' });

    timelineItems.forEach(it => tlCardObserver.observe(it));

});
