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
});

/**
 * Initializes mobile navigation: hamburger menu toggle and overlay behavior.
 */
function initMobileNavigation() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburgerMenu && mobileNavOverlay) {
        // Toggle menu and prevent body scroll
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('open');
            mobileNavOverlay.classList.toggle('open');
            document.body.classList.toggle('overflow-hidden');
        });

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('open');
                mobileNavOverlay.classList.remove('open');
                document.body.classList.remove('overflow-hidden');
            });
        });

        // Auto-close menu on desktop resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                hamburgerMenu.classList.remove('open');
                mobileNavOverlay.classList.remove('open');
                document.body.classList.remove('overflow-hidden');
            }
        });
    } else {
        console.warn("Mobile navigation elements not found.");
    }
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
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
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
