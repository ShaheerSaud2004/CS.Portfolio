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

    $('.info-btn').click(function() {
        var targetId = $(this).data('target');
        $(targetId).slideToggle();
    });

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

$('#menu-icon').click(function() {
    $('#nav-overlay').fadeToggle('slow');
});

$(document).scroll(function() {
    var scroll = $(this).scrollTop();
    if (scroll > 50) {
        $('.header').css('background-color', '#333');
    } else {
        $('.header').css('background-color', 'transparent');
    }
});
