document.addEventListener("DOMContentLoaded", function () {
  // Configure Toastr
  toastr.options = {
    closeButton: true,
    progressBar: true,
    timeOut: "3500",
    positionClass: "toast-top-right",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  setActiveSidebarItem();

  // Initialize sidebar functionality
  initializeSidebar();

  // Initialize animations
  initializeAnimations();

  // Enhance interactivity
  enhanceInteractivity();
});

// Modal functions
function syncModalBodyScrollLock() {
  const hasOpenModal = document.querySelector(
    '.fixed.inset-0:not(.hidden):not(#sidebarOverlay)',
  );

  if (hasOpenModal) {
    document.body.classList.add("modal-open");
  } else {
    document.body.classList.remove("modal-open");
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("animate-fade-in");
    syncModalBodyScrollLock();

    // Focus first input if exists
    const firstInput = modal.querySelector("input, textarea");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("animate-fade-in");
    syncModalBodyScrollLock();
  }
}

// Toast notification functions
function showToast(type, message) {
  toastr[type](message);
}

tailwind.config = {
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-in": "slideIn 0.5s ease-out",
        "bounce-in": "bounceIn 0.8s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
};

// Initialize animations
function initializeAnimations() {
  // Animate sidebar items
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  sidebarItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.classList.add("animate-slide-in");
  });

  // Animate cards
  const cards = document.querySelectorAll(".admin-card");
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add("animate-fade-in");
  });
}

// Enhanced interactivity
function enhanceInteractivity() {
  // Enhanced tab switching with smooth transitions
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Add parallax effect to floating elements
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const floatingElements = document.querySelectorAll(".float-animation");

    floatingElements.forEach((element) => {
      const speed = 0.1;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// Sidebar functionality
function initializeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggleSidebar = document.getElementById("toggleSidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  toggleSidebar.addEventListener("click", (event) => {
    event.stopPropagation();
    openSidebar();
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (event) => {
    if (
      window.innerWidth < 768 &&
      !sidebar.contains(event.target) &&
      !toggleSidebar.contains(event.target)
    ) {
      closeSidebar();
    }
  });
}

// Set active sidebar item
function setActiveSidebarItem() {
  const currentPath = window.location.pathname;
  const sidebarItems = document.querySelectorAll(".sidebar-item");

  sidebarItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (
      href &&
      currentPath.includes(href.replace("../", "").replace(".html", ""))
    ) {
      item.classList.add("active");
    }
  });
}

function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  sidebar && sidebar.classList.remove("-translate-x-full");
  sidebarOverlay && sidebarOverlay.classList.remove("hidden");
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  sidebar && sidebar.classList.add("-translate-x-full");
  sidebarOverlay && sidebarOverlay.classList.add("hidden");
}

// Close modals when clicking outside
document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("fixed") &&
    e.target.classList.contains("inset-0")
  ) {
    const modal = e.target;
    const modalId = modal.id;
    if (modalId && modalId !== "sidebarOverlay") {
      closeModal(modalId);
    }
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Escape key to close modals
  if (e.key === "Escape") {
    const openModals = document.querySelectorAll(".fixed.inset-0:not(.hidden)");
    openModals.forEach((modal) => {
      if (modal.id && modal.id !== "sidebarOverlay") {
        closeModal(modal.id);
      }
    });
  }

  // Ctrl/Cmd + N to add new role
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    openModal("addModal");
  }
});

// Utility functions for admin pages
function confirmDelete(itemName, callback) {
  if (
    confirm(
      `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
    )
  ) {
    callback();
  }
}

function handleFormSubmit(formId, successMessage) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showToast("success", successMessage);
      }, 1500);
    });
  }
}
