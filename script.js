document.addEventListener('DOMContentLoaded', () => {

    // --- General Scene Management ---
    const scenes = {
        catchButton: document.getElementById('catch-button-game'),
        letter: document.getElementById('letter-modal'),
        constellation: document.getElementById('constellation-game'),
        wishingJar: document.getElementById('wishing-jar-scene'),
        paintSky: document.getElementById('paint-sky-scene'), // New scene
        navigation: document.getElementById('project-navigation'),
        ballGame: document.getElementById('ball-game-container'),
        garden: document.getElementById('garden-container'),
    };

    let currentScene = 'catchButton';

    function showScene(sceneName) {
        const oldSceneEl = scenes[currentScene];
        if (oldSceneEl) {
            oldSceneEl.classList.add('fade-out');
            setTimeout(() => {
                oldSceneEl.classList.add('hidden');
                oldSceneEl.classList.remove('fade-out');
            }, 500);
        }

        const newSceneEl = scenes[sceneName];
        if (newSceneEl) {
            setTimeout(() => {
                newSceneEl.classList.remove('hidden');
                currentScene = sceneName;
                if (sceneName === 'paintSky') {
                    initPaintSky(); // Initialize the new scene when shown
                }
            }, 500);
        }
    }

    // --- PROJECT 1 LOGIC (Scenes 1-4) ---

    // Scene 1: Catch the Button
    const catchButton = document.getElementById('catch-button');
    let tapCount = 0;
    const tapsNeeded = Math.floor(Math.random() * 3) + 5; // 5 to 7 taps
    catchButton.addEventListener('click', () => {
        tapCount++;
        if (tapCount >= tapsNeeded) {
            showScene('letter');
        } else {
            const gameArea = scenes.catchButton;
            const btnWidth = catchButton.offsetWidth;
            const btnHeight = catchButton.offsetHeight;
            catchButton.style.top = `${Math.random() * (gameArea.clientHeight - btnHeight)}px`;
            catchButton.style.left = `${Math.random() * (gameArea.clientWidth - btnWidth)}px`;
            catchButton.style.transform = `translate(0, 0)`;
        }
    });

    // Scene 2: Letter Modal
    document.getElementById('close-letter').addEventListener('click', () => {
        showScene('constellation');
        // initConstellationGame is called in its showScene logic block if needed
    });

    // Scene 3: Constellation (Abridged for brevity, full logic is complex)
    document.getElementById('next-from-constellation').addEventListener('click', () => showScene('wishingJar'));
    // NOTE: Full constellation logic from previous versions should be here.
    // This is a placeholder to keep the code readable. The actual logic is in previous turns.
    // A simplified "next" button for demonstration. In real use, this is triggered by solving the puzzle.
    
    // Scene 4: Wishing Jar
    document.getElementById('next-from-wish').addEventListener('click', () => showScene('paintSky'));
    // NOTE: Full wishing jar logic from previous versions should be here.

    // --- PROJECT 1, SCENE 5: PAINT OUR SKY (NEW LOGIC) ---
    const skyCanvas = document.getElementById('sky-canvas');
    const skyCtx = skyCanvas.getContext('2d');
    const instructionEl = document.getElementById('paint-sky-instruction');
    const finalMessageEl = document.getElementById('paint-sky-message');
    const finishPaintingBtn = document.getElementById('finish-painting');

    let isPainting = false;
    let particles = [];
    let hasShownFinalMessage = false;

    function initPaintSky() {
        skyCanvas.width = window.innerWidth;
        skyCanvas.height = window.innerHeight;
        skyCtx.fillStyle = '#000';
        skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);
        particles = [];
        hasShownFinalMessage = false;
        finalMessageEl.classList.add('hidden');
        finishPaintingBtn.classList.add('hidden');
        instructionEl.style.opacity = '1';

        skyCanvas.addEventListener('mousedown', startPainting);
        skyCanvas.addEventListener('mouseup', stopPainting);
        skyCanvas.addEventListener('mousemove', paint);
        skyCanvas.addEventListener('touchstart', startPainting, { passive: false });
        skyCanvas.addEventListener('touchend', stopPainting);
        skyCanvas.addEventListener('touchmove', paint, { passive: false });

        animateSky();
    }

    function getPaintCoordinates(event) {
        event.preventDefault();
        if (event.touches && event.touches.length > 0) {
            return { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }
        return { x: event.clientX, y: event.clientY };
    }

    function startPainting(e) {
        isPainting = true;
        instructionEl.style.opacity = '0'; // Fade out instruction on first touch
        paint(e);
    }

    function stopPainting() {
        isPainting = false;
    }

    function paint(e) {
        if (!isPainting) return;
        const coords = getPaintCoordinates(e);

        // Create a cluster of particles for a richer effect
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(coords.x, coords.y));
        }

        // After a certain number of particles, show the final message
        if (particles.length > 200 && !hasShownFinalMessage) {
            finalMessageEl.classList.remove('hidden');
            finishPaintingBtn.classList.remove('hidden');
            hasShownFinalMessage = true;
        }
    }

    class Particle {
        constructor(x, y) {
            this.x = x + (Math.random() - 0.5) * 40;
            this.y = y + (Math.random() - 0.5) * 40;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.alpha = 1;
            // Nebula colors: pink, purple, light blue
            const colors = ['#ff79c6', '#bd93f9', '#8be9fd', '#f1fa8c'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.02; // Fade out
        }

        draw() {
            skyCtx.globalAlpha = this.alpha;
            skyCtx.fillStyle = this.color;
            skyCtx.beginPath();
            skyCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            skyCtx.fill();
        }
    }

    function animateSky() {
        skyCtx.globalAlpha = 0.1; // For a trailing effect
        skyCtx.fillStyle = '#000';
        skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(animateSky);
    }
    
    finishPaintingBtn.addEventListener('click', () => showScene('navigation'));


    // --- NAVIGATION AND OTHER PROJECT LOGIC ---
    document.getElementById('show-game-btn').addEventListener('click', () => showScene('ballGame'));
    document.getElementById('show-garden-btn').addEventListener('click', () => showScene('garden'));
    document.getElementById('back-to-nav-from-game').addEventListener('click', () => showScene('navigation'));
    document.getElementById('back-to-nav-from-garden').addEventListener('click', () => showScene('navigation'));
    
    // NOTE: The full logic for the other scenes (constellation, wishing jar, ball game, garden)
    // should be included here from the previous versions for the app to be fully functional.
    // They have been abridged here to focus on the new "Paint Our Sky" feature.

    // --- Initial Setup ---
    // Start with the first scene. For testing, you can change 'catchButton' to 'paintSky'.
    showScene('catchButton'); 
});
