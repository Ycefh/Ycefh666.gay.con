(() => {
	// Configuration
	const CONFIG = {
		BREAKPOINTS: {
			MOBILE: 1023.5,
		},
		SELECTORS: {
			body: "body",
			navigation: "#cs-navigation",
			hamburger: "#cs-navigation .cs-toggle",
			menuWrapper: "#cs-ul-wrapper",
		},
		CLASSES: {
			active: "cs-active",
			menuOpen: "cs-open",
		},
	};

	// DOM Elements
	const elements = {
		body: document.querySelector(CONFIG.SELECTORS.body),
		navigation: document.querySelector(CONFIG.SELECTORS.navigation),
		hamburger: document.querySelector(CONFIG.SELECTORS.hamburger),
		menuWrapper: document.querySelector(CONFIG.SELECTORS.menuWrapper),
	};

	// Utilities
	const isMobile = () => window.matchMedia(`(max-width: ${CONFIG.BREAKPOINTS.MOBILE}px)`).matches;

	const toggleAttribute = (element, attribute, value1 = "true", value2 = "false") => {
		if (!element) return;
		const current = element.getAttribute(attribute);
		element.setAttribute(attribute, current === value1 ? value2 : value1);
	};

	const toggleInert = (element) => element && (element.inert = !element.inert);

	// Menu Management
	const menuManager = {
		toggle() {
			if (!elements.hamburger || !elements.navigation) return;

			[elements.hamburger, elements.navigation].forEach((el) => el.classList.toggle(CONFIG.CLASSES.active));
			elements.body.classList.toggle(CONFIG.CLASSES.menuOpen);
			toggleAttribute(elements.hamburger, "aria-expanded");

			// Only manage inert state on mobile devices
			if (elements.menuWrapper && isMobile()) {
				toggleInert(elements.menuWrapper);
			}
		},
	};

	// Keyboard Management
	const keyboardManager = {
		handleEscape() {
			if (!elements.navigation || !elements.hamburger) return;

			// Close hamburger menu if open
			if (elements.hamburger.classList.contains(CONFIG.CLASSES.active)) {
				menuManager.toggle();
				elements.hamburger.focus();
			}
		},
	};

	// Event Management
	const eventManager = {
		handleMobileFocus(event) {
			if (!isMobile() || !elements.navigation.classList.contains(CONFIG.CLASSES.active)) return;
			if (elements.menuWrapper.contains(event.target) || elements.hamburger.contains(event.target)) return;

			menuManager.toggle();
		},
	};

	// Initialization & Setup
	const init = {
		inertState() {
			if (!elements.menuWrapper) return;

			// On mobile, menu starts closed, so set inert=true
			// On desktop, menu is always visible, so set inert=false
			elements.menuWrapper.inert = isMobile();
		},

		eventListeners() {
			if (!elements.hamburger || !elements.navigation) return;

			// Hamburger menu
			elements.hamburger.addEventListener("click", menuManager.toggle);
			elements.navigation.addEventListener("click", (e) => {
				if (e.target === elements.navigation && elements.navigation.classList.contains(CONFIG.CLASSES.active)) {
					menuManager.toggle();
				}
			});

			// Global events
			document.addEventListener("keydown", (e) => e.key === "Escape" && keyboardManager.handleEscape());
			document.addEventListener("focusin", eventManager.handleMobileFocus);

			// Resize handling
			window.addEventListener("resize", () => {
				this.inertState();
				if (!isMobile() && elements.navigation.classList.contains(CONFIG.CLASSES.active)) {
					menuManager.toggle();
				}
			});
		},
	};

	// Initialize navigation system
	init.inertState();
	init.eventListeners();
})();

document.addEventListener("DOMContentLoaded", function () {

    // Gallery elements
    const gallery = document.querySelector("#gallery-0");

    const track = gallery.querySelector(".gallery-track");

    const slides = gallery.querySelectorAll(".slide");

    const prevButton = gallery.querySelector(".prev");

    const nextButton = gallery.querySelector(".next");


    // Current position
    let currentIndex = 0;


    // Number of slides visible at the same time
    const visibleSlides = 4;


    // Gap between slides
    const gap = 32; // 2rem = 32px


    // Calculate slide width
    function getSlideWidth() {

        const viewportWidth =
            gallery.querySelector(".gallery-viewport").offsetWidth;

        return (viewportWidth - gap * 3) / visibleSlides;

    }


    // Update slider position
    function updateSlider() {

        const slideWidth = getSlideWidth();

        const moveDistance = slideWidth + gap;

        track.style.transform =
            `translateX(-${currentIndex * moveDistance}px)`;

    }


    // Next button
    nextButton.addEventListener("click", function () {

        currentIndex++;

        /*
        When we reach the end,
        go back to the beginning.
        */

        if (currentIndex > slides.length - visibleSlides) {

            currentIndex = 0;

        }

        updateSlider();

    });


    // Previous button
    prevButton.addEventListener("click", function () {

        currentIndex--;

        /*
        If we go before the first slide,
        jump to the last possible position.
        */

        if (currentIndex < 0) {

            currentIndex = slides.length - visibleSlides;

        }

        updateSlider();

    });


    // Responsive update
    window.addEventListener("resize", function () {

        updateSlider();

    });


    // Initial setup
    updateSlider();

});