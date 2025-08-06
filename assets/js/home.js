/**
 * @fileoverview Contains essential JavaScript functionalities for website interactivity.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all core functionalities on DOM load.
    initMobileNavigation();
    initBackToTop();
    initLogoCarousel();
    initTestimonialsSlider(); // Call the hero slider initialization
    initHeroSlider(); // Call the hero slider initialization

    // Counters animation initialization
    const counters = document.querySelectorAll('.counter');
    const runCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const speed = 200; // Smaller = faster
        const increment = Math.ceil(target / speed);
        let count = 0;

        const update = () => {
            count += increment;
            if (count >= target) {
                counter.textContent = target + " +";
            } else {
                counter.textContent = count + " +";
                requestAnimationFrame(update);
            }
        };
        update();
    };

    // Optional: only animate when visible
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(counter => observer.observe(counter));

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky header
    const header = document.getElementById('main-header');
    if (header) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop;

            if (scrollTop === 0) {
                header.style.transform = 'translateY(0)'; // Ensure header is visible at top
            }
        });
    }

    // Translation button logic
    const translateBtn = document.getElementById('translate-btn');
    if (translateBtn) {
        translateBtn.addEventListener('click', () => {
            // Placeholder for translation functionality
            console.log('Translate button clicked!');
            // You would integrate a translation API here, e.g., Google Translate
            console.log('Translation feature coming soon!');
        });
    }
});

/**
 * Initializes mobile navigation: hamburger menu toggle and overlay behavior.
 * Also handles mobile dropdown functionality.
 */
function initMobileNavigation() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelector('.mobile-nav-links'); // Get the main ul for closing all dropdowns
    const mobileDropdowns = document.querySelectorAll('.mobile-nav-links .dropdown-mobile'); // All dropdown parents

    // Function to close all open dropdowns at a specific level
    function closeAllDropdowns(parentUl) {
        const openDropdowns = parentUl.querySelectorAll('.dropdown-mobile.open');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
            const menu = dropdown.querySelector('.dropdown-mobile-menu, .dropdown-mobile-submenu');
            if (menu) {
                menu.classList.remove('open');
                menu.setAttribute('aria-expanded', 'false');
                menu.style.maxHeight = '0'; // Ensure max-height is reset for smooth close
            }
            const link = dropdown.querySelector('a');
            if (link) {
                link.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Toggle mobile menu overlay
    if (hamburgerMenu && mobileNavOverlay) {
        hamburgerMenu.addEventListener('click', () => {
            const isOpen = mobileNavOverlay.classList.toggle('open');
            hamburgerMenu.classList.toggle('open', isOpen);
            hamburgerMenu.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('overflow-hidden', isOpen); // Prevent body scroll

            // If closing the main overlay, close all submenus too
            if (!isOpen) {
                closeAllDropdowns(mobileNavLinks);
            }
        });
    }

    // Handle clicks outside the mobile menu to close it
    document.addEventListener('click', (event) => {
        if (mobileNavOverlay && !mobileNavOverlay.contains(event.target) && !hamburgerMenu.contains(event.target) && mobileNavOverlay.classList.contains('open')) {
            mobileNavOverlay.classList.remove('open');
            if (hamburgerMenu) {
                hamburgerMenu.classList.remove('open');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
            }
            document.body.classList.remove('overflow-hidden'); // Re-enable body scroll
            closeAllDropdowns(mobileNavLinks);
        }
    });

    // Handle mobile dropdowns
    mobileDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-mobile-menu, .dropdown-mobile-submenu');

        if (link && menu) {
            // Set initial aria-expanded state
            link.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-expanded', 'false');

            link.addEventListener('click', (event) => {
                // Prevent default link navigation only if clicking on the dropdown arrow
                if (event.target.classList.contains('dropdown-arrow') || 
                    (link.querySelector('.dropdown-arrow') && link.querySelector('.dropdown-arrow').contains(event.target))) {
                    event.preventDefault();
                } else {
                    // If clicking on the link itself (not the arrow), allow navigation
                    return;
                }

                const isOpen = dropdown.classList.contains('open');

                // Close all sibling dropdowns at the same level (accordion-style)
                const parentUl = dropdown.closest('ul');
                if (parentUl) {
                    Array.from(parentUl.children).forEach(sibling => {
                        if (sibling !== dropdown && sibling.classList.contains('dropdown-mobile') && sibling.classList.contains('open')) {
                            sibling.classList.remove('open');
                            const siblingMenu = sibling.querySelector('.dropdown-mobile-menu, .dropdown-mobile-submenu');
                            if (siblingMenu) {
                                siblingMenu.classList.remove('open');
                                siblingMenu.setAttribute('aria-expanded', 'false');
                                siblingMenu.style.maxHeight = '0'; // Ensure max-height is reset
                            }
                            const siblingLink = sibling.querySelector('a');
                            if (siblingLink) {
                                siblingLink.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });
                }

                // Toggle the clicked dropdown
                dropdown.classList.toggle('open', !isOpen);
                menu.classList.toggle('open', !isOpen);
                link.setAttribute('aria-expanded', !isOpen);
                menu.setAttribute('aria-expanded', !isOpen);

                // Set max-height for smooth animation
                if (dropdown.classList.contains('open')) {
                    menu.style.maxHeight = menu.scrollHeight + 'px';
                } else {
                    menu.style.maxHeight = '0';
                }

                // Optional: Scroll to the newly opened menu item if it's off-screen
                if (!isOpen && mobileNavOverlay) {
                    setTimeout(() => { // Allow transition to start
                        const linkRect = link.getBoundingClientRect();
                        const overlayRect = mobileNavOverlay.getBoundingClientRect();

                        // Check if the link is outside the visible area of the overlay
                        if (linkRect.bottom > overlayRect.bottom || linkRect.top < overlayRect.top) {
                            mobileNavOverlay.scrollTo({
                                top: mobileNavOverlay.scrollTop + linkRect.top - overlayRect.top - 20, // 20px offset from top
                                behavior: 'smooth'
                            });
                        }
                    }, 400); // Match CSS transition duration
                }
            }, { passive: false }); // Use passive: false to allow preventDefault
        }
    });

    // Auto-close menu on desktop resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            if (hamburgerMenu) {
                hamburgerMenu.classList.remove('open');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
            }
            if (mobileNavOverlay) {
                mobileNavOverlay.classList.remove('open');
            }
            document.body.classList.remove('overflow-hidden');
            // Also close any open mobile dropdowns when switching to desktop view
            closeAllDropdowns(mobileNavLinks);
        }
    });
}

/**
 * Manages back-to-top button visibility and smooth scroll.
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'flex'; // Use flex to ensure proper centering of SVG
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        // Scroll to top on click
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        console.warn("Back to Top button not found.");
    }
}

/**
 * Initializes infinite horizontal scrolling for the Industry Focus carousel.
 * NOTE: This function is currently not called as the HTML for industry focus is a static grid.
 * If you intend to have a carousel, update the HTML and uncomment the call to this function in DOMContentLoaded.
 */
function initIndustryCarousel() {
    const carousel = document.getElementById('industryCarousel');

    if (carousel) {
        let scrollSpeed = 0.2;
        let scrollInterval;

        // Clone items for seamless loop
        const originalCards = Array.from(carousel.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            carousel.appendChild(clone);
        });

        // Calculate total original width for looping
        const cardWidth = originalCards[0].offsetWidth + 24; // width + gap-6 (24px)
        const totalOriginalWidth = cardWidth * originalCards.length;

        /** Performs auto-scrolling and resets position for loop. */
        function autoScroll() {
            if (carousel.scrollLeft >= totalOriginalWidth) {
                carousel.scrollLeft = 0;
            } else {
                carousel.scrollBy({ left: scrollSpeed, behavior: 'smooth' });
            }
        }

        /** Starts the auto-scroll interval. */
        function startAutoScroll() {
            stopAutoScroll();
            scrollInterval = setInterval(autoScroll, 2000);
        }

        /** Stops the auto-scroll interval. */
        function stopAutoScroll() {
            clearInterval(scrollInterval);
        }

        // Start autoplay and add hover controls
        startAutoScroll();
        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);
    } else {
        console.warn("Industry carousel not found.");
    }
}

/**
 * Initializes infinite auto-scrolling for the membership logo carousel.
 */
function initLogoCarousel() {
    const logoCarouselTrack = document.querySelector('.logo-carousel-track');

    if (logoCarouselTrack) {
        // Clone logos for seamless loop (CSS handles animation)
        const logos = Array.from(logoCarouselTrack.children);
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            logoCarouselTrack.appendChild(clone);
        });

    } else {
        console.warn("Logo carousel track not found.");
    }
}

/**
 * Initializes the Hero Slider functionality.
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide-content');
    const paginationDotsContainer = document.getElementById('pagination-dots');

    let currentSlideIndex = 0;
    let slideInterval;
    const autoSlideDuration = 5000; // 5 seconds

    /**
     * Initializes the slider by setting background images with a dark overlay
     * and creating pagination dots.
     */
    function initializeSlider() {
        if (!paginationDotsContainer) {
            console.warn("Pagination dots container not found for hero slider.");
            return;
        }

        slides.forEach((slideDiv, index) => {
            const imageUrl = slideDiv.getAttribute('data-image-url');
            // Add a dark uniform layer over the image using linear-gradient
            if (imageUrl) {
                slideDiv.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imageUrl}')`;
            } else {
                // Fallback image if data-image-url is not provided or invalid
                console.warn(`Slide ${index} is missing a data-image-url attribute. Using a placeholder.`);
                slideDiv.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://placehold.co/1920x828/CCCCCC/333333?text=No%20Image')`;
            }

            // Create pagination dot
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('data-slide-index', index);
            dot.onclick = () => showSlides(index); // Attach click event
            paginationDotsContainer.appendChild(dot);
        });
    }

    /**
     * Displays the slide at the given index and updates pagination dots.
     * @param {number} index - The index of the slide to display.
     */
    function showSlides(index) {
        const dots = document.querySelectorAll('.dot');

        // Normalize index to loop around
        if (index >= slides.length) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex = index;
        }

        // Hide all slides and deactivate all dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Show the current slide and activate the current dot
        if (slides[currentSlideIndex]) {
            slides[currentSlideIndex].classList.add('active');
        }
        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add('active');
        }


        // Restart the auto-slide timer whenever a slide is shown (manual or auto)
        resetAutoSlide();
    }

    /**
     * Moves to the next or previous slide.
     * @param {number} n - 1 for next, -1 for previous.
     */
    function plusSlides(n) {
        showSlides(currentSlideIndex + n);
    }

    /**
     * Resets the automatic slide interval.
     */
    function resetAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            plusSlides(1); // Move to next slide
        }, autoSlideDuration);
    }

    // Initialize the slider and show the first slide
    initializeSlider();
    // Only attempt to show slides if there are any
    if (slides.length > 0) {
        showSlides(currentSlideIndex); // Display the initial slide
    } else {
        console.warn("No slides found for hero slider.");
    }
}


/**
 * Initializes the Testimonials Slider functionality.
 * This function now handles a single testimonial slide at a time
 * with left/right navigation buttons and pagination dots.
 */
function initTestimonialsSlider() {
const testimonialsData = [
    {
        text: "We consider Nichi-In Software as one of our strong partners due to their Japanese language expertise and experience of their team in delivering quality solutions.",
        designation: "",
        company: "Mitsubishi Electric India Pvt. Ltd.",
        logo: "/assets/img/dashboard/testimonials/Client_Mitsubishi.jpg"
    },
    {
        text: "Nichi-In Software is supporting us in offshore software development, onsite software development support and is a very important vendor for us.",
        designation: "",
        company: "Toyota Connected India Pvt. Ltd.",
        logo: "/assets/img/dashboard/testimonials/Client_Toyota.jpg"
    },
    {
        text: "We evaluated Nichi-In Software in terms of design ability, schedule management, issue management. We found Nichi-In Software very professional in all these and we are happy to work with Nichi-In Software as one of the preferred outsourcing partners.",
        designation: "",
        company: "NRI, Nomura Research Institute", // Updated company name for clarity
        logo: "/assets/img/dashboard/testimonials/Client_NRI.jpg"
    },
    {
        text: "With bilingual system engineers who can speak Japanese, the Nichi-In team understands the client's perspective and provides support. They are flexible, have high technical skills, and have also created high-quality design documents. They also provided prompt and thorough support after implementation. They are a reliable partner that takes the initiative in development by making proposals rather than waiting for instructions.",
        designation: "",
        company: "Telenet Co., Ltd.",
        logo: "/assets/img/dashboard/testimonials/Telenet.png"
    },
    {
        text: "Nichi-In Software supported us in the development of software based on our intrinsic base concept. Since the structure of the existing software is very different from the usual one, there were a few hurdles initially. However, Nichi-In Software team was able to adapt quickly and fulfill the expectations and requirements of basic software structure, maintainability etc. Further, even though our PIC was in Japan and Nichi-In Software members had to shift to Work From Home during lockdown due to Covid-19, they were able to successfully complete the development without any significant delay by using Azure Devops, Skype etc. We can confidently say that development work can be outsourced to Nichi-In Software without any concerns about being in a different country or flexibility in project execution.",
        designation: "",
        company: "Japan Automatic Machine Co., Ltd.", // Simplified company name
        logo: "/assets/img/dashboard/testimonials/Client_JAM.jpg"
    },
    {
        text: "We created a good partnership with Nichi-In Software as their dedication to our projects and visions is evident in all aspects of their deliverance. We appreciate their attention to detail and creative approach of bringing out projects to life on time.",
        designation: "",
        company: "Cosmos Impex(I) Pvt. Ltd.",
        logo: "/assets/img/dashboard/testimonials/Client_Cosmos.jpg"
    },
    {
        text: "Nichi-In Software Solutions – USA is supporting us in offshore software development, QA Testing, Production DBA and application support , onsite software development and support. Nichi-In Software Solutions – USA is a very important vendor for us and we are pleased with their service and commitment.",
        author: "Associate Vice President",
        designation: "Enterprise Technology",
        company: "A Top 10 U.S University",
        logo: "https://placehold.co/100x50/CCCCCC/333333?text=University" // Placeholder
    },
    {
        text: "Our experience over the years with Nichi-In Software has been just excellent. Their work is exemplary backed by a very professional and capable technical team. Their team has extensive experience and expertise in custom application development in dotnet framework, API development, and IOS and Android based Mobile App development. A definite recommendation!",
        author: "CEO",
        designation: "Custom Technology Solutions",
        company: "Houston, Texas, USA",
        logo: "https://placehold.co/100x50/CCCCCC/333333?text=CustomTech" // Placeholder
    },
    {
        text: "The professionals at Nichi-In Software Solutions are knowledgeable and experienced in the IT industry. In the early 2000’s Phoenix Solutions engaged Nichi-In Software as a trusted partner to develop a unique speech processing system for providing a single best answer to a question. Nichi-In Software delivered the most efficient solution and highest quality product consistent with our specifications. The outcomes were highly successful - their work enabled Phoenix to develop an extensive intellectual property portfolio encompassing distributed speech recognition and semantic speech understanding and other key contributions to the present burgeoning speech conversational market.",
        designation: "",
        company: "Phoenix Solutions Inc., Palo Alto", // Included location for clarity
        logo: "https://placehold.co/100x50/CCCCCC/333333?text=Phoenix" // Placeholder
    }
];

    const sliderMain = document.getElementById('testimonials-slider-main');
    const prevButton = document.querySelector('.testimonial-slider-wrapper .prev-button');
    const nextButton = document.querySelector('.testimonial-slider-wrapper .next-button');
    const paginationDotsContainer = document.getElementById('testimonial-pagination-dots-main');

    let currentIndex = 0;
    let autoSlideInterval;
    const autoSlideDuration = 6000; // 6 seconds for auto-slide

    if (!sliderMain || !prevButton || !nextButton || !paginationDotsContainer || testimonialsData.length === 0) {
        console.warn("Testimonial slider elements or data not found or insufficient for functionality.");
        return;
    }

    /**
     * Renders the testimonial slides and pagination dots based on the testimonialsData.
     */
    function renderSlidesAndDots() {
        sliderMain.innerHTML = ''; // Clear existing slides
        paginationDotsContainer.innerHTML = ''; // Clear existing dots

        testimonialsData.forEach((testimonial, index) => {
            // Create slide item
            const slideItem = document.createElement('div');
            slideItem.classList.add('testimonial-slide-item');
            slideItem.setAttribute('data-slide-index', index);

            // Create testimonial card content
            slideItem.innerHTML = `
                <div class="testimonial-card">
                    ${testimonial.logo ? `<img src="${testimonial.logo}" alt="${testimonial.company} Logo" class="company-logo">` : ''}
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="testimonial-author">
                        <span class="author-name">${testimonial?.author ?? ""}</span>
                        ${testimonial.designation ? `<span class="author-designation">${testimonial.designation}</span>` : ''}
                        <span class="author-company">${testimonial.company}</span>
                    </div>
                </div>
            `;
            sliderMain.appendChild(slideItem);

            // Create pagination dot
            const dot = document.createElement('span');
            dot.classList.add('testimonial-dot-main');
            dot.setAttribute('data-slide-index', index);
            dot.addEventListener('click', () => {
                showTestimonialSlide(index);
                resetAutoSlide();
            });
            paginationDotsContainer.appendChild(dot);
        });
    }

    /**
     * Displays the testimonial slide at the given index and updates pagination dots.
     * Handles slide transitions.
     * @param {number} index - The index of the slide to display.
     * @param {string} [direction='next'] - The direction of the slide ('next' or 'prev').
     */
    function showTestimonialSlide(index, direction = 'next') {
        const slides = document.querySelectorAll('.testimonial-slide-item');
        const dots = document.querySelectorAll('.testimonial-dot-main');

        if (slides.length === 0) return;

        // Determine the old index for transition
        const oldIndex = currentIndex;

        // Normalize index to loop around
        currentIndex = (index + slides.length) % slides.length;

        // Remove active and direction classes from all slides
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });

        // Add appropriate classes for transition
        if (oldIndex !== currentIndex) {
            // If moving from oldIndex to currentIndex
            if (direction === 'next' || index > oldIndex) { // 'next' or forward jump
                slides[oldIndex].classList.add('prev'); // Old slide moves left
                slides[currentIndex].classList.add('active'); // New slide comes from right
            } else { // 'prev' or backward jump
                slides[oldIndex].classList.add('next'); // Old slide moves right (off-screen)
                slides[currentIndex].classList.add('active'); // New slide comes from left
            }
        } else {
            // If it's the initial load or clicking the current dot, just make it active
            slides[currentIndex].classList.add('active');
        }


        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Restart the auto-slide timer whenever a slide is shown (manual or auto)
        resetAutoSlide();
    }

    /**
     * Moves to the next testimonial slide.
     */
    function nextTestimonial() {
        showTestimonialSlide(currentIndex + 1, 'next');
    }

    /**
     * Moves to the previous testimonial slide.
     */
    function prevTestimonial() {
        showTestimonialSlide(currentIndex - 1, 'prev');
    }

    /**
     * Resets the automatic slide interval for testimonials.
     */
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextTestimonial, autoSlideDuration);
    }

    // Attach click events to navigation buttons
    prevButton.addEventListener('click', () => {
        prevTestimonial();
        resetAutoSlide(); // Reset timer on manual navigation
    });

    nextButton.addEventListener('click', () => {
        nextTestimonial();
        resetAutoSlide(); // Reset timer on manual navigation
    });

    // Initial setup
    renderSlidesAndDots(); // Populate slides and dots
    showTestimonialSlide(currentIndex); // Display the first slide
    resetAutoSlide(); // Start auto-sliding
}