/**
 * @fileoverview Contains essential JavaScript functionalities for website interactivity.
 */

document.addEventListener("DOMContentLoaded", () => {
    initFactsheetSlider(); // Call the factsheet slider initialization
});




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
