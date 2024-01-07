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
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Python', 'Java', 'HTML/CSS', 'C/C++', 'JavaScript', 'R'],
            datasets: [{
                label: 'Proficiency',
                data: [98, 96, 94, 93, 92, 91, 90], // Example proficiency levels
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
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


    typeWriter();
}
