// ============================================
// SKYRIM PORTFOLIO - MENU & CONTENT MANAGEMENT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    setupMenuListeners();
    setupContentCloseListeners();
});

// Setup menu item click listeners
function setupMenuListeners() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't prevent default for links that open new tabs (resume)
            const href = this.getAttribute('href');
            if (href && href.startsWith('http')) {
                return;
            }

            e.preventDefault();
            const menuType = this.getAttribute('data-menu');

            if (menuType === 'resume') {
                window.open(href, '_blank');
            } else {
                showContent(menuType);
            }
        });
    });
}

// Show content section
function showContent(sectionId) {
    const overlay = document.getElementById('contentOverlay');
    const sections = document.querySelectorAll('.content-section');

    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        overlay.classList.add('active');
        selectedSection.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// Close content overlay
function closeContent() {
    const overlay = document.getElementById('contentOverlay');
    overlay.classList.remove('active');
}

// Setup close button and overlay click
function setupContentCloseListeners() {
    const overlay = document.getElementById('contentOverlay');

    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeContent();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeContent();
        }
    });
}

// Setup smooth scroll for anchor links in content
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        const href = e.target.getAttribute('href');
        if (href === '#') return;

        // Open the appropriate section first
        const sectionId = href.substring(1);
        if (sectionId) {
            showContent(sectionId);
        }
    }
});

// Add glow effect to menu on hover
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.color = '#fff';
    });

    item.addEventListener('mouseleave', function() {
        this.style.color = '#d4af37';
    });
});

// Console message
console.log('%c⚔️ Welcome to the Elder Scrolls Portfolio ⚔️', 'color: #d4af37; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);');
console.log('%cPress any menu option to begin your quest...', 'color: #b8860b; font-size: 12px;');
