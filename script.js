/* =========================================================
   BIRTHDAY GATE
========================================================= */

const birthdayForm = document.getElementById("birthdayForm");

if (birthdayForm) {

    birthdayForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const nameInput = document.getElementById("name");
        const busesInput = document.getElementById("buses");
        const hint = document.getElementById("hint");

        const name = nameInput.value.trim();
        const buses = busesInput.value.trim();

        /*
          Normalize the name so these all work:

          I am a Rabbit
          i am a rabbit
          I AM A RABBIT
        */

        const normalizedName = name
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();


        /* =========================================
           CORRECT ANSWER
        ========================================= */

        if (normalizedName === "i am a rabbit") {

            /*
              Save the visitor information.
            */

            const entry = {
                name: name,
                buses: buses,
                time: new Date().toISOString()
            };


            /*
              Get existing entries.
            */

            const existingEntries =
                JSON.parse(
                    localStorage.getItem("rabbitBirthdayEntries")
                ) || [];


            /*
              Add new entry.
            */

            existingEntries.push(entry);


            /*
              Save entries.
            */

            localStorage.setItem(
                "rabbitBirthdayEntries",
                JSON.stringify(existingEntries)
            );


            /*
              Tell birthday page that the user
              successfully passed the gate.
            */

            sessionStorage.setItem(
                "birthdayAccess",
                "granted"
            );


            /*
              Redirect to birthday page.
            */

            window.location.href = "birthday.html";

        }


        /* =========================================
           WRONG ANSWER
        ========================================= */

        else {

            hint.textContent =
                "Uhuu… maybe your name is something else, as far as I know. 🤨 Maybe it's “Rabbit”. Try: I am a Rabbit";

            hint.classList.add("show");


            /*
              Shake the name input.
            */

            nameInput.classList.remove("shake");

            void nameInput.offsetWidth;

            nameInput.classList.add("shake");


            /*
              Focus the input again.
            */

            nameInput.focus();
        }

    });

}



/* =========================================================
   BIRTHDAY PAGE
========================================================= */

const birthdayMusic =
    document.getElementById("birthdayMusic");

const musicControl =
    document.getElementById("musicControl");


/* =========================================================
   MUSIC
========================================================= */

if (birthdayMusic && musicControl) {

    /*
      Set comfortable volume.

      0 = silent
      1 = maximum

      0.35 = 35%
    */

    birthdayMusic.volume = 0.35;


    /*
      Function to update button appearance.
    */

    function updateMusicButton() {

        if (!birthdayMusic.paused) {

            musicControl.textContent =
                "🎵 Music On";

            musicControl.setAttribute(
                "aria-label",
                "Turn music off"
            );

            musicControl.classList.add("playing");

        }

        else {

            musicControl.textContent =
                "🔇 Music Off";

            musicControl.setAttribute(
                "aria-label",
                "Turn music on"
            );

            musicControl.classList.remove("playing");

        }

    }


    /*
      Try to start music automatically.
      
      IMPORTANT:
      Browsers may block autoplay with sound.
    */

    birthdayMusic
        .play()
        .then(function () {

            updateMusicButton();

        })
        .catch(function () {

            /*
              Autoplay was blocked.

              The user can press the music button.
            */

            updateMusicButton();

        });


    /*
      Music button.
    */

    musicControl.addEventListener(
        "click",
        function () {

            if (birthdayMusic.paused) {

                birthdayMusic
                    .play()
                    .then(function () {

                        updateMusicButton();

                    })
                    .catch(function (error) {

                        console.log(
                            "Music could not be played:",
                            error
                        );

                    });

            }

            else {

                birthdayMusic.pause();

                updateMusicButton();

            }

        }
    );

}



/* =========================================================
   LIVE FIREWORKS
========================================================= */

const canvas =
    document.getElementById("fireworks");


if (canvas) {

    const ctx = canvas.getContext("2d");

    let width;
    let height;

    let fireworks = [];
    let particles = [];


    /* =====================================================
       RESIZE CANVAS
    ===================================================== */

    function resizeCanvas() {

        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

    }


    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );


    /* =====================================================
       FIREWORK CLASS
    ===================================================== */

    class Firework {

        constructor(
            startX,
            startY,
            targetX,
            targetY
        ) {

            this.x = startX;
            this.y = startY;

            this.startX = startX;
            this.startY = startY;

            this.targetX = targetX;
            this.targetY = targetY;

            this.speed = 5 + Math.random() * 3;

            this.angle =
                Math.atan2(
                    targetY - startY,
                    targetX - startX
                );

            this.velocityX =
                Math.cos(this.angle) * this.speed;

            this.velocityY =
                Math.sin(this.angle) * this.speed;

            this.exploded = false;

            this.trail = [];

            this.color =
                `hsl(${Math.random() * 360}, 100%, 65%)`;
        }


        update() {

            this.trail.push({
                x: this.x,
                y: this.y
            });


            if (this.trail.length > 8) {
                this.trail.shift();
            }


            this.x += this.velocityX;
            this.y += this.velocityY;


            const distance =
                Math.hypot(
                    this.targetX - this.x,
                    this.targetY - this.y
                );


            if (distance < 15) {

                this.exploded = true;

                this.explode();

            }

        }


        explode() {

            const particleCount = 55;


            for (
                let i = 0;
                i < particleCount;
                i++
            ) {

                const angle =
                    (Math.PI * 2 * i) /
                    particleCount;


                const speed =
                    1.5 + Math.random() * 5;


                particles.push(
                    new Particle(
                        this.x,
                        this.y,
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed,
                        this.color
                    )
                );

            }

        }


        draw() {

            ctx.beginPath();

            ctx.moveTo(
                this.x,
                this.y
            );

            for (
                let i = this.trail.length - 1;
                i >= 0;
                i--
            ) {

                ctx.lineTo(
                    this.trail[i].x,
                    this.trail[i].y
                );

            }

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;

            ctx.stroke();


            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                2,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "#ffffff";

            ctx.fill();

        }

    }



    /* =====================================================
       PARTICLE CLASS
    ===================================================== */

    class Particle {

        constructor(
            x,
            y,
            velocityX,
            velocityY,
            color
        ) {

            this.x = x;
            this.y = y;

            this.velocityX = velocityX;
            this.velocityY = velocityY;

            this.color = color;

            this.alpha = 1;

            this.gravity = 0.05;

            this.friction = 0.985;

            this.size =
                1 + Math.random() * 2;

        }


        update() {

            this.velocityX *= this.friction;
            this.velocityY *= this.friction;

            this.velocityY += this.gravity;

            this.x += this.velocityX;
            this.y += this.velocityY;

            this.alpha -= 0.012;

        }


        draw() {

            ctx.save();

            ctx.globalAlpha =
                Math.max(this.alpha, 0);

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = this.color;

            ctx.fill();

            ctx.restore();

        }

    }



    /* =====================================================
       CREATE FIREWORK
    ===================================================== */

    function createFirework() {

        const startX =
            Math.random() * width;

        const startY =
            height + 10;


        const targetX =
            width * 0.15 +
            Math.random() * width * 0.7;


        const targetY =
            height * 0.12 +
            Math.random() * height * 0.42;


        fireworks.push(
            new Firework(
                startX,
                startY,
                targetX,
                targetY
            )
        );

    }



    /* =====================================================
       ANIMATION LOOP
    ===================================================== */

    function animate() {

        /*
          Slight transparent background creates
          beautiful firework trails.
        */

        ctx.fillStyle =
            "rgba(5, 8, 25, 0.20)";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* Fireworks */

        for (
            let i = fireworks.length - 1;
            i >= 0;
            i--
        ) {

            const firework =
                fireworks[i];


            firework.update();

            firework.draw();


            if (firework.exploded) {

                fireworks.splice(i, 1);

            }

        }


        /* Particles */

        for (
            let i = particles.length - 1;
            i >= 0;
            i--
        ) {

            const particle =
                particles[i];


            particle.update();

            particle.draw();


            if (particle.alpha <= 0) {

                particles.splice(i, 1);

            }

        }


        requestAnimationFrame(animate);

    }


    animate();



    /* =====================================================
       AUTOMATIC FIREWORK LAUNCH
    ===================================================== */

    setInterval(
        createFirework,
        850
    );


    /*
      Initial fireworks.
    */

    setTimeout(
        createFirework,
        500
    );

    setTimeout(
        createFirework,
        1000
    );

    setTimeout(
        createFirework,
        1500
    );

}



/* =========================================================
   FLOATING PETALS
========================================================= */

const petalsContainer =
    document.querySelector(".petals");


if (petalsContainer) {

    const petalCount = 25;


    for (
        let i = 0;
        i < petalCount;
        i++
    ) {

        const petal =
            document.createElement("span");


        petal.className = "petal";


        petal.style.left =
            Math.random() * 100 + "%";


        petal.style.animationDelay =
            Math.random() * 10 + "s";


        petal.style.animationDuration =
            8 + Math.random() * 8 + "s";


        petal.style.transform =
            `rotate(${Math.random() * 360}deg)`;


        petalsContainer.appendChild(petal);

    }

}