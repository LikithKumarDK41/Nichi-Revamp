/**
 * @fileoverview Contains essential JavaScript functionalities for website interactivity.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all core functionalities on DOM load.
    initMobileNavigation();
    initBackToTop();
    // Removed initIndustryCarousel() call as it's not used with the current HTML structure.
    initLogoCarousel();
    initTestimonialsSlider();
    initHeroSlider(); // Call the hero slider initialization
    initFactsheetSlider(); // Call the factsheet slider initialization

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
                // Prevent default link navigation for dropdown toggles
                // Only prevent if the link has a dropdown-arrow, indicating it's a toggle
                if (link.querySelector('.dropdown-arrow')) {
                    event.preventDefault();
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
 */
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-main-slide');
    const dots = document.querySelectorAll('.testimonial-dot-main');

    let currentIndex = 0;
    let autoSlideInterval;

    if (slides.length === 0 || dots.length === 0) {
        console.warn("Testimonial slider elements not found or insufficient for functionality.");
        return;
    }

    /**
     * Displays the testimonial slide at the given index and updates pagination dots.
     * @param {number} index - The index of the slide to display.
     */
    function showTestimonialSlide(index) {
        // Ensure index wraps around for continuous loop
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    /**
     * Moves to the next testimonial slide automatically.
     */
    function nextTestimonial() {
        showTestimonialSlide(currentIndex + 1);
    }

    /**
     * Resets the automatic slide interval for testimonials.
     */
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextTestimonial, 6000); // 6 seconds for testimonial auto-slide
    }

    // Attach click events to pagination dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-slide-index'));
            showTestimonialSlide(index);
            resetAutoSlide(); // Reset timer on manual navigation
        });
    });

    // Initialize the testimonials slider
    showTestimonialSlide(currentIndex);
    resetAutoSlide(); // Start auto-sliding
}

/**
 * Initializes the Factsheet Slider functionality.
 * This slider enables vertical scrolling through "factsheet-slide" elements
 * and updates "factsheet-pagination" bars based on the active slide.
 * It also includes an auto-scroll feature.
 */
function initFactsheetSlider() {
  const scrollArea = document.getElementById("factsheet-scroll");
  const slides = document.querySelectorAll(".factsheet-slide");
  const bars = document.querySelectorAll(".factsheet-pagination .bar");

  let currentIndex = 0;
  let interval; // Variable to hold the auto-scroll interval ID

  // Check if all necessary elements are present
  if (slides.length === 0 || !scrollArea || bars.length === 0) {
    console.warn("Factsheet slider elements not found or insufficient for functionality.");
    return; // Exit if elements are missing
  }

  /**
   * Scrolls the `scrollArea` to the specified slide index.
   * Updates the active pagination bar and the `currentIndex`.
   * @param {number} index - The index of the slide to scroll to.
   */
  function scrollToSlide(index) {
    // Ensure the index is within bounds and wraps around for continuous effect if desired
    currentIndex = (index + slides.length) % slides.length;

    // Calculate the top offset of the target slide
    const offsetTop = slides[currentIndex].offsetTop;

    // Smoothly scroll the area to the target slide
    scrollArea.scrollTo({ top: offsetTop, behavior: "smooth" });

    // Remove 'active' class from all bars
    bars.forEach(bar => bar.classList.remove("active"));
    // Add 'active' class to the current bar
    if (bars[currentIndex]) bars[currentIndex].classList.add("active");
  }

  /**
   * Starts the automatic vertical scrolling of the factsheet slides.
   * Moves to the next slide every 3 seconds.
   */
  function autoScroll() {
    // Clear any existing interval to prevent multiple intervals running
    clearInterval(interval);
    interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length; // Calculate next slide index, looping back to start
      scrollToSlide(nextIndex); // Scroll to the next slide
    }, 3000); // Auto-scroll every 3 seconds
  }

  // Attach click events to pagination bars for manual navigation
  bars.forEach(bar => {
    bar.addEventListener("click", () => {
      clearInterval(interval); // Stop auto-scroll on manual interaction
      // Parse the data-index attribute to get the target slide index
      scrollToSlide(Number(bar.dataset.index));
      autoScroll(); // Restart auto-scroll after manual navigation
    }, { passive: true }); // Added passive: true for performance
  });

  // Initial setup: show the first slide and start auto-scrolling
  scrollToSlide(0); // Display the first slide when the page loads
  autoScroll();     // Start the automatic scrolling
}
