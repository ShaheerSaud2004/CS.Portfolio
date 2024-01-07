$(document).ready(function() {
    $('.project-link').click(function() {
        window.open($(this).attr('data-href'), '_blank');
    });

    $('header a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear');
    });

    // Combine these two into one if they are intended to do the same thing
    $('.info-btn').click(function() {
        var targetId = $(this).data('target');
        $(targetId).slideToggle(); // Use slideToggle for a cool effect
        // $(targetId).toggle(); // Comment out or remove if not needed
    });

    // Call simpleType directly here
    simpleType();
});

function simpleType() {
    console.log("Typing effect started.");
    const text = "Hi, I'm Shaheer Saud, and I am pursuing a BS at Rutgers University - New Brunswick in Computer Science with a minor in Data Science and Criminology";
    let i = 0;
    const elem = document.getElementById("typing");

    function typeWriter() {
        if (i < text.length) {
            elem.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    typeWriter();
}
