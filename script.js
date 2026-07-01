document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------
    // Elements Selectors
    // ----------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const globalNav = document.getElementById('global-nav');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    
    const bagBtn = document.getElementById('bag-btn');
    const bagDropdown = document.getElementById('bag-dropdown');
    
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    // ----------------------------------------
    // Mobile Hamburger Menu Interaction
    // ----------------------------------------
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            globalNav.classList.toggle('menu-open');
            
            if (!isExpanded) {
                mobileOverlay.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Lock scrolling
                // Close overlays if open
                closeSearch();
                closeBag();
            } else {
                mobileOverlay.style.display = 'none';
                document.body.style.overflow = ''; // Unlock scrolling
            }
        });
    }

    // ----------------------------------------
    // Search Overlay Panel Interaction
    // ----------------------------------------
    function openSearch() {
        searchOverlay.classList.add('open');
        searchInput.focus();
        closeBag();
    }
    
    function closeSearch() {
        searchOverlay.classList.remove('open');
        searchInput.value = '';
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (searchOverlay.classList.contains('open')) {
                closeSearch();
            } else {
                openSearch();
            }
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
        });
    }

    // ----------------------------------------
    // Shopping Bag Dropdown Interaction
    // ----------------------------------------
    function openBag() {
        bagDropdown.classList.add('open');
        closeSearch();
    }
    
    function closeBag() {
        bagDropdown.classList.remove('open');
    }
    
    if (bagBtn) {
        bagBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (bagDropdown.classList.contains('open')) {
                closeBag();
            } else {
                openBag();
            }
        });
    }

    // Document click to close overlays
    document.addEventListener('click', (e) => {
        if (searchOverlay && !searchOverlay.contains(e.target) && e.target !== searchBtn) {
            closeSearch();
        }
        if (bagDropdown && !bagDropdown.contains(e.target) && e.target !== bagBtn) {
            closeBag();
        }
    });

    // ESC key close support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
            closeBag();
        }
    });

    // ----------------------------------------
    // Intersection Observer for Entrance Animation
    // ----------------------------------------
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust trigger offset
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ----------------------------------------
    // Apple TV+ Carousel Slider Logic
    // ----------------------------------------
    const carouselTrack = document.getElementById('carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    
    let currentIndex = 0;
    let isPlaying = true;
    let autoScrollTimer = null;
    const slideDuration = 5000; // 5 seconds per slide
    
    function updateCarousel(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;
        
        // Calculate transition translations
        // 33.333% offset per slide
        const offset = -currentIndex * 33.333;
        carouselTrack.style.transform = `translateX(${offset}%)`;
        
        // Update active slide class
        slides.forEach((slide, i) => {
            if (i === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update dots state
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function startAutoScroll() {
        clearInterval(autoScrollTimer);
        autoScrollTimer = setInterval(() => {
            updateCarousel(currentIndex + 1);
        }, slideDuration);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollTimer);
    }
    
    // Controls hooks
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            updateCarousel(currentIndex - 1);
            if (isPlaying) startAutoScroll();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            updateCarousel(currentIndex + 1);
            if (isPlaying) startAutoScroll();
        });
    }
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                stopAutoScroll();
                playPauseBtn.textContent = '▶';
                playPauseBtn.setAttribute('aria-label', 'Play Auto-scroll');
            } else {
                startAutoScroll();
                playPauseBtn.textContent = '⏸';
                playPauseBtn.setAttribute('aria-label', 'Pause Auto-scroll');
            }
            isPlaying = !isPlaying;
        });
    }
    
    // Dot click triggers
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            updateCarousel(i);
            if (isPlaying) startAutoScroll();
        });
    });
    
    // Init auto-scroll
    if (carouselTrack && slides.length > 0) {
        startAutoScroll();
    }

    // ----------------------------------------
    // Mobile Footer Accordion Toggles
    // ----------------------------------------
    const accordionSections = document.querySelectorAll('.footer-directory .column-section');
    
    accordionSections.forEach(section => {
        const title = section.querySelector('.directory-title');
        if (title) {
            title.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    const isActive = section.classList.contains('active');
                    
                    // Close other sections
                    accordionSections.forEach(s => s.classList.remove('active'));
                    
                    if (!isActive) {
                        section.classList.add('active');
                    }
                }
            });
        }
    });

    // Reset footer states if resizing back to desktop layout
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            accordionSections.forEach(s => s.classList.remove('active'));
        }
    });
});
