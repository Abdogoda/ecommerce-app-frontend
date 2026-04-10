/**
 * User-specific JavaScript utilities and functions
 */

// User-specific global variables
let isLoggedIn = false;
let currentUser = null;
let cartItems = [];

// Initialize user functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeUserCommon();
});

/**
 * Initialize user-specific functionality
 */
function initializeUserCommon() {
  // Initialize toastr notifications
  initializeToastr();

  // Initialize intersection observer for animations
  initializeAnimations();

  // Initialize smooth scrolling
  initializeSmoothScrolling();

  // Initialize mobile menu toggler
  initializeMenuToggler();

  // Initialize user session
  initializeUserSession();

  // Initialize user-specific event listeners
  initializeUserEventListeners();
}

/**
 * Initialize Toastr notifications
 */
function initializeToastr() {
  if (typeof toastr !== "undefined") {
    toastr.options = {
      closeButton: true,
      progressBar: true,
      timeOut: "3500",
      positionClass: "toast-top-right",
      preventDuplicates: true,
      showAnimation: "slideDown",
      hideAnimation: "slideUp",
      showDuration: 300,
      hideDuration: 300,
      extendedTimeOut: 1000,
      tapToDismiss: true,
      toastClass: "toast-custom",
    };
  }
}

/**
 * Show toast notification
 * @param {string} type - Type of notification (success, error, info, warning)
 * @param {string} message - Message to display
 */
function showToast(type, message) {
  if (typeof toastr !== "undefined") {
    toastr[type](message);
  } else {
    console.log(`${type.toUpperCase()}: ${message}`);
  }
}

/**
 * Initialize animations using Intersection Observer
 */
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Remove observer after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe animated elements
  document
    .querySelectorAll('[class*="animate-fade-in"], .fade-in')
    .forEach((el) => {
      observer.observe(el);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/**
 * Initialize mobile menu toggler
 */
function initializeMenuToggler() {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (mobileMenuToggle && mobileNav) {
    // Toggle menu
    mobileMenuToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("hidden");

      // Animate hamburger icon
      const spans = mobileMenuToggle.querySelectorAll("span");
      mobileMenuToggle.classList.toggle("active");

      if (mobileMenuToggle.classList.contains("active")) {
        // Transform to X shape
        spans[0].style.transform = "translateY(9px) rotate(45deg)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "translateY(-9px) rotate(-45deg)";
      } else {
        // Reset to hamburger
        spans[0].style.transform = "translateY(0) rotate(0)";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "translateY(0) rotate(0)";
      }
    });

    // Close menu when a link is clicked
    const navLinks = mobileNav.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileNav.classList.add("hidden");
        mobileMenuToggle.classList.remove("active");

        const spans = mobileMenuToggle.querySelectorAll("span");
        spans[0].style.transform = "translateY(0) rotate(0)";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "translateY(0) rotate(0)";
      });
    });
  }
}

/**
 * Initialize user session
 */
function initializeUserSession() {
  const userToken = localStorage.getItem("userToken");
  const userData = localStorage.getItem("userData");

  if (userToken && userData) {
    isLoggedIn = true;
    currentUser = JSON.parse(userData);
    updateUIForLoggedInUser();
  }
}

/**
 * Update UI for logged in user
 */
function updateUIForLoggedInUser() {
  // Update cart badge if it exists (using cart.js function)
  if (typeof updateCartBadge === "function") {
    updateCartBadge();
  }

  // Show/hide elements based on login status
  const authElements = document.querySelectorAll('[data-auth="required"]');
  authElements.forEach((el) => {
    el.style.display = isLoggedIn ? "block" : "none";
  });

  const guestElements = document.querySelectorAll('[data-auth="guest"]');
  guestElements.forEach((el) => {
    el.style.display = isLoggedIn ? "none" : "block";
  });
}

/**
 * Initialize user-specific event listeners
 */
function initializeUserEventListeners() {
  // Handle form submissions with loading states
  document.querySelectorAll("form[data-async]").forEach((form) => {
    form.addEventListener("submit", handleAsyncFormSubmit);
  });

  // Handle modal close on outside click
  document.querySelectorAll(".modal-overlay").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  });

  // Handle escape key for modals
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const visibleModal = document.querySelector(".modal-overlay.show");
      if (visibleModal) {
        closeModal(visibleModal.id);
      }
    }
  });
}

/**
 * Handle async form submissions
 * @param {Event} e - Form submit event
 */
function handleAsyncFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  if (submitBtn) {
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
    submitBtn.disabled = true;

    // Restore button after 3 seconds (or when request completes)
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 3000);
  }
}

/**
 * Open modal with animation
 * @param {string} modalId - ID of the modal to open
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    // Force reflow to ensure the modal is rendered before adding the show class
    modal.offsetHeight;
    modal.classList.add("show");

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }
}

/**
 * Close modal with animation
 * @param {string} modalId - ID of the modal to close
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    // Wait for the transition to complete before hiding
    setTimeout(() => {
      modal.classList.add("hidden");
      // Restore body scroll
      document.body.style.overflow = "";
    }, 300);
  }
}

// Error handling for form fields
function showError(field, message) {
  const errorDiv = document.getElementById(field + "-error");
  const input = document.getElementById(field);

  if (errorDiv && input) {
    errorDiv.querySelector("span").textContent = message;
    errorDiv.classList.remove("hidden");
    input.classList.add("border-red-400", "focus:ring-red-400");
    input.classList.remove("border-white/20", "focus:ring-blue-400");
  }
}

// Clear error message for a form field
function clearError(field) {
  const errorDiv = document.getElementById(field + "-error");
  const input = document.getElementById(field);

  if (errorDiv && input) {
    errorDiv.classList.add("hidden");
    input.classList.remove("border-red-400", "focus:ring-red-400");
    input.classList.add("border-white/20", "focus:ring-blue-400");
  }
}


// Export functions for use in other scripts
window.UserCommon = {
  showToast,
  openModal,
  closeModal,
  showError,
  clearError,
  // Remove updateCartBadge and cartItems from here to avoid conflicts
  isLoggedIn,
  currentUser,
};


// Password visibility toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input
    .closest("div")
    ?.querySelector('button[type="button"]');
  const icon = button?.querySelector("i, svg");

  if (!input || !button || !icon) {
    return;
  }

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}