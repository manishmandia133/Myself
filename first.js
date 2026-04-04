document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       0. LENIS SMOOTH SCROLL — Premium buttery scrolling
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

<<<<<<< HEAD
    /* ============================================================
       1. LOADING SCREEN — Letter reveal + progress bar, then hide
       ============================================================ */
    const loader = document.getElementById('js-loader');
    const html = document.documentElement;

    // Pause scrolling during loader
    lenis.stop();

    // After the progress bar animation completes (~2.2s), hide loader
    setTimeout(() => {
        if (loader) {
            loader.classList.add('-hidden');
            html.classList.remove('is-loading');
            html.classList.add('is-loaded');
            lenis.start();
        }
    }, 2400);

    // Split hero lines into individual spans for animation
    document.querySelectorAll('.o-hero_line').forEach(line => {
        const text = line.textContent.trim();
        line.innerHTML = `<span>${text}</span>`;
    });

    /* ============================================================
       2. SCROLL REVEAL — IntersectionObserver for [data-scroll-reveal]
       ============================================================ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-inview');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    // Separate observer for work cards (clip-path reveal)
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay
                const index = Array.from(document.querySelectorAll('.o-works_card')).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('is-inview');
                }, index * 200);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.o-works_card').forEach(card => {
        cardObserver.observe(card);
    });

    /* ============================================================
       3. HEADER — Hide on scroll down, show on scroll up
       ============================================================ */
    const header = document.getElementById('header');
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 300) {
            if (currentScrollY > lastScrollY) {
                header.classList.add('-hidden');
            } else {
                header.classList.remove('-hidden');
            }
        } else {
            header.classList.remove('-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    /* ============================================================
       4. FOOTER HEIGHT — Measure and set placeholder
       ============================================================ */
    function setFooterHeight() {
        const footer = document.querySelector('.o-footer');
        const placeholder = document.querySelector('.o-footer_placeholder');
        if (footer && placeholder) {
            const height = footer.offsetHeight;
            document.documentElement.style.setProperty('--footer-height', height + 'px');
        }
    }

    setFooterHeight();
    window.addEventListener('resize', setFooterHeight);
=======
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });
    }

    /* ----------------------------------------------------
    2. Parallax effect for hero layers
    ---------------------------------------------------- */
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const layers = document.querySelectorAll('.hero-layer');
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            layers[0].style.transform = `translate(${x}px, ${y}px)`;
            layers[1].style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
        });
    }

    /* ----------------------------------------------------
    3. 3D Premium Tilt Effect with Dynamic Glow on Work Cards
    ---------------------------------------------------- */
    const workCards = document.querySelectorAll('.work-card');

    workCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Subtle 10 degree max rotation for premium feel
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            // Dynamic glow position follows cursor (in percentage)
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;

            // Apply transform
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Set CSS custom properties for dynamic glow positioning
            card.style.setProperty('--mouse-x', `${glowX}%`);
            card.style.setProperty('--mouse-y', `${glowY}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    /* ----------------------------------------------------
    4. Big Words Scroll Animation
    ---------------------------------------------------- */
    const bigWordsSection = document.querySelector('.big-words-section');
    if (bigWordsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const words = entry.target.querySelectorAll('.big-words-row span');
                    words.forEach((word, index) => {
                        setTimeout(() => {
                            word.style.opacity = word.classList.contains('-highlighted') ? '1' : '0.15';
                            word.style.transform = 'translateY(0)';
                        }, index * 50);
                    });
                }
            });
        }, { threshold: 0.3 });

        observer.observe(bigWordsSection);
    }

    /* ----------------------------------------------------
    5. Initialize Locomotive Scroll (if available)
    ---------------------------------------------------- */
    if (typeof LocomotiveScroll !== 'undefined') {
        try {
            const scroll = new LocomotiveScroll({
                el: document.querySelector('#main'),
                smooth: true,
                tablet: true
            });
        } catch (e) {
            console.log('Locomotive Scroll not fully loaded, using native scroll');
        }
    }

    /* ----------------------------------------------------
    6. Stats counter animation with CHD style
    ---------------------------------------------------- */
    const statBoxes = document.querySelectorAll('.stat-box');
>>>>>>> b27009903b7e08f6bbce284e1f20a98da1ad7440

    /* ============================================================
       5. SMOOTH SCROLL — Nav link click (uses Lenis)
       ============================================================ */
    document.querySelectorAll('[data-nav]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                lenis.scrollTo(target, { offset: -100 });
            }
        });
    });

    /* ============================================================
       6. PARALLAX — Subtle image movement on scroll in work cards
       ============================================================ */
    function updateParallax() {
        document.querySelectorAll('[data-parallax]').forEach(img => {
            const rect = img.getBoundingClientRect();
            const windowH = window.innerHeight;

            if (rect.top < windowH && rect.bottom > 0) {
                const progress = (windowH - rect.top) / (windowH + rect.height);
                const offset = (progress - 0.5) * 40; // subtle parallax
                img.style.transform = `scale(1.15) translateY(${offset}px)`;
            }
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateParallax);
    });

    /* ============================================================
       7. EXPERTISE ITEMS — Hover with background photo reveal (CHD-style)
       ============================================================ */
    const expertiseItems = document.querySelectorAll('.o-expertise_item');
    const expertiseList = document.querySelector('.o-expertise_list');
    const expertisePhotos = document.querySelectorAll('.o-expertise_photo');

    if (expertiseList) {
        // Cascading opacity on list enter
        expertiseList.addEventListener('mouseenter', () => {
            expertiseItems.forEach(item => {
                item.style.opacity = '0.25';
            });
        });

        // Reset everything on list leave
        expertiseList.addEventListener('mouseleave', () => {
            expertiseItems.forEach(item => {
                item.style.opacity = '';
            });
            // Hide all photos
            expertisePhotos.forEach(photo => {
                photo.classList.remove('-active');
            });
        });

        // Per-item: highlight + reveal matching photo
        expertiseItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.opacity = '1';

                // Activate matching photo
                const index = item.getAttribute('data-index');
                expertisePhotos.forEach(photo => {
                    if (photo.getAttribute('data-expertise-photo') === index) {
                        photo.classList.add('-active');
                    } else {
                        photo.classList.remove('-active');
                    }
                });
            });

            item.addEventListener('mouseleave', () => {
                item.style.opacity = '0.25';
            });
        });
    }

    /* ============================================================
       8. MAGNETIC HOVER — Buttons and contact links
       ============================================================ */
    document.querySelectorAll('.o-contact_link, .o-footer_socialLink').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    /* ============================================================
       9. HERO BACKGROUND — Subtle mouse parallax
       ============================================================ */
    const hero = document.querySelector('.o-hero');
    const heroBg = document.querySelector('.o-hero_bg img');

    if (hero && heroBg) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;

            heroBg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
        });
    }

    /* ============================================================
       10. MAIN CONTENT — Ensure z-index stacking above footer
       ============================================================ */
    const main = document.getElementById('main');
    if (main) {
        main.style.position = 'relative';
        main.style.zIndex = '2';
        main.style.background = 'inherit';
    }

    // Set section backgrounds explicitly (needed for sticky footer)
    document.querySelectorAll('.o-about, .o-journey, .o-contact').forEach(s => {
        s.style.background = '#fff';
    });
    document.querySelectorAll('.o-expertise, .o-works, .o-bigWords').forEach(s => {
        s.style.background = '#000';
    });

<<<<<<< HEAD
=======
    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on load

    /* ----------------------------------------------------
    7. Magnetic cursor effect for buttons and links
    ---------------------------------------------------- */
    const magneticElements = document.querySelectorAll('.btn, .contact-link, .chd-link');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
>>>>>>> b27009903b7e08f6bbce284e1f20a98da1ad7440
});
