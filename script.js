// ============================================
// SKYRIM PORTFOLIO - MENU CONTROL
// ============================================

function openSection(sectionId) {
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

function closeSection() {
    const overlay = document.getElementById('contentOverlay');
    overlay.classList.remove('active');
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSection();
    }
});

// Close when clicking outside the content
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('contentOverlay');
    const container = document.querySelector('.content-container');

    if (overlay.classList.contains('active') &&
        e.target === overlay) {
        closeSection();
    }
});

// Add hover effects to menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.color = '#d4d4d4';
    });

    item.addEventListener('mouseleave', function() {
        this.style.color = '#888';
    });
});

// Console message
console.log('%c⚔️ SKYRIM PORTFOLIO ⚔️', 'color: #999; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px rgba(100, 100, 100, 0.5);');
console.log('%cSeek knowledge in these realms...', 'color: #777; font-size: 12px;');
