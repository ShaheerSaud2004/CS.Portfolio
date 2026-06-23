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

// ============================================
// DAEDRIC SYMBOL CANVAS RENDERING
// ============================================

function drawDaedricSymbol() {
    const canvas = document.getElementById('daedricCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up drawing properties
    ctx.strokeStyle = '#5a8a5a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw main vertical blade
    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX + 8, 80);
    ctx.lineTo(centerX + 12, 200);
    ctx.lineTo(centerX + 8, 280);
    ctx.lineTo(centerX, 350);
    ctx.lineTo(centerX - 8, 280);
    ctx.lineTo(centerX - 12, 200);
    ctx.lineTo(centerX - 8, 80);
    ctx.closePath();
    ctx.stroke();

    // Draw left wing
    ctx.beginPath();
    ctx.moveTo(centerX - 8, 80);
    ctx.quadraticCurveTo(centerX - 60, 100, centerX - 90, 150);
    ctx.quadraticCurveTo(centerX - 95, 180, centerX - 80, 220);
    ctx.quadraticCurveTo(centerX - 50, 240, centerX - 12, 200);
    ctx.stroke();

    // Draw right wing
    ctx.beginPath();
    ctx.moveTo(centerX + 8, 80);
    ctx.quadraticCurveTo(centerX + 60, 100, centerX + 90, 150);
    ctx.quadraticCurveTo(centerX + 95, 180, centerX + 80, 220);
    ctx.quadraticCurveTo(centerX + 50, 240, centerX + 12, 200);
    ctx.stroke();

    // Draw left horn
    ctx.beginPath();
    ctx.moveTo(centerX - 60, 100);
    ctx.quadraticCurveTo(centerX - 80, 70, centerX - 70, 40);
    ctx.stroke();

    // Draw right horn
    ctx.beginPath();
    ctx.moveTo(centerX + 60, 100);
    ctx.quadraticCurveTo(centerX + 80, 70, centerX + 70, 40);
    ctx.stroke();

    // Draw bottom points
    ctx.beginPath();
    ctx.moveTo(centerX - 8, 280);
    ctx.lineTo(centerX - 25, 320);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + 8, 280);
    ctx.lineTo(centerX + 25, 320);
    ctx.stroke();

    // Draw center glow (green)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
    gradient.addColorStop(0, 'rgba(138, 186, 138, 0.8)');
    gradient.addColorStop(0.5, 'rgba(106, 170, 106, 0.4)');
    gradient.addColorStop(1, 'rgba(90, 138, 90, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(centerX - 30, centerY - 30, 60, 60);

    // Draw center point
    ctx.fillStyle = '#6aaa6a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Initialize canvas when page loads
window.addEventListener('load', function() {
    const canvas = document.getElementById('daedricCanvas');
    if (canvas) {
        canvas.width = 450;
        canvas.height = 550;
        drawDaedricSymbol();
    }
});

// Redraw on resize
window.addEventListener('resize', function() {
    drawDaedricSymbol();
});

// Console message
console.log('%c⚔️ SKYRIM PORTFOLIO ⚔️', 'color: #999; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px rgba(100, 100, 100, 0.5);');
console.log('%cSeek knowledge in these realms...', 'color: #777; font-size: 12px;');
