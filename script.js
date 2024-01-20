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
   
    
    var particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (var i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(255);
    particles.forEach(function(p) {
        p.update();
        p.display();
    });
}

function Particle() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(4, 8);
    this.update = function() {
        this.x += random(-2, 2);
        this.y += random(-2, 2);
    };
    this.display = function() {
        noStroke();
        fill(0);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    };
}

$(document).ready(function() {
    $('#menu-icon').click(function() {
        $('#nav-overlay').fadeToggle('fast'); 
    });
});

$(document).scroll(function() {
    var scroll = $(this).scrollTop();
    if (scroll > 50) {
        $('.header').css('background-color', '#333');
    } else {
        $('.header').css('background-color', 'transparent');
    }
});
    typeWriter();
}
