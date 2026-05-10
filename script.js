/* =========================================
   1. BASE DE DATOS DE RECUERDOS (Unificada)
   ========================================= */
const memoriesDatabase = [
    { 
        id: 1, 
        shortText: "Te amo porque llegaste...", 
        fullText: "Te amo porque llegaste a mi vida cuando más necesitaba tranquilidad y cariño...", 
        imageUrl: "img/imagen1.jpeg" 
    },
    { 
        id: 2, 
        shortText: "Amo cada detalle de ti", 
        fullText: "Amo cada detalle de ti, incluso aquellos que tú ves pequeños o imperfectos...", 
        imageUrl: "img/imagen2.jpeg" 
    },
    { 
        id: 3, 
        shortText: "Hay muchas razones...", 
        fullText: "Hay muchas razones por las que te amo...", 
        imageUrl: "img/imagen3.jpeg" 
    },
    { 
        id: 4, 
        shortText: "Aprender lo que es amar", 
        fullText: "Te amo porque contigo aprendí que el amor verdadero...", 
        imageUrl: "img/imagen4.jpeg" 
    },
    { 
        id: 5, 
        shortText: "Todo se siente distinto", 
        fullText: "Desde que estás conmigo, todo se siente distinto...", 
        imageUrl: "img/imagen5.jpeg" 
    },
    { 
        id: 6, 
        shortText: "La tranquilidad de tenerte", 
        fullText: "Amo la tranquilidad que siento cuando estoy contigo...", 
        imageUrl: "img/imagen6.jpeg" 
    },
    { id: 7, shortText: "Amo tu ternura.", fullText: "Tu ternura es mi refugio favorito.", imageUrl: null },
    { id: 8, shortText: "Amo tu forma de amar.", fullText: "Nadie ama con tanta entrega y pureza como tú.", imageUrl: null },
    { id: 9, shortText: "Tu sonrisa me calma.", fullText: "En el caos del mundo, tu sonrisa es mi única paz.", imageUrl: null },
    { id: 10, shortText: "Tus abrazos sanan.", fullText: "Tus abrazos tienen el poder de arreglar cualquier mal día.", imageUrl: null },
    { id: 11, shortText: "Amo tu noble corazón.", fullText: "Tu bondad y tu forma de ser son lo que más admiro.", imageUrl: null },
    { id: 12, shortText: "Me haces sentir amado.", fullText: "Gracias por hacerme sentir la persona más afortunada.", imageUrl: null },
    { id: 13, shortText: "Amo cómo me cuidas.", fullText: "Sentir tu cuidado es sentir el amor de verdad.", imageUrl: null },
    { id: 14, shortText: "Contigo siento paz.", fullText: "Eres mi hogar, mi paz y mi alegría constante.", imageUrl: null }
];

/* =========================================
   2. CONFIGURACIÓN Y VARIABLES (Ajuste Móvil)
   ========================================= */
const galaxyScene = document.getElementById('galaxy-scene');
const masterContainer = document.getElementById('master-container');

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 450;

const MEMORY_MULTIPLIER = isMobile ? 6 : 12; 
const PARTICLES_PER_MEMORY = isMobile ? 30 : 80; 
const STATIC_STARS_COUNT = isMobile ? 150 : 500; 

let floatingItems = [];
let rotationX = 0, rotationY = 0, targetRotationX = 0, targetRotationY = 0;

/* =========================================
   3. GENERACIÓN DE ELEMENTOS
   ========================================= */
function createGalaxyElements() {
    // CORRECCIÓN: Limpieza profunda para evitar el doble corazón
    masterContainer.innerHTML = '';
    const oldHearts = galaxyScene.querySelectorAll('img:not(.floating-item img)');
    oldHearts.forEach(h => h.remove());
    
    floatingItems = [];

    // --- 1. ESTRELLAS ESTÁTICAS (FONDO) ---
    for (let i = 0; i < STATIC_STARS_COUNT; i++) {
        const star = document.createElement('div');
        const size = Math.random() * (isMobile ? 1 : 1.5);
        star.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            width: ${size}px;
            height: ${size}px;
            background: white;
            border-radius: 50%;
            opacity: ${Math.random() * 0.4 + 0.1};
            pointer-events: none;
            z-index: -1;
        `;
        if (Math.random() > 0.8) {
            star.style.animation = `twinkle ${Math.random() * 4 + 2}s infinite ease-in-out`;
        }
        galaxyScene.appendChild(star);
    }

    // --- 2. CORAZÓN CENTRAL (CORREGIDO PARA 375px) ---
    const centerHeart = document.createElement('img');
    centerHeart.src = "https://i.pinimg.com/originals/29/57/f7/2957f7c7d2ef62de281dac2765bb7acb.gif";
    // Si es 375px o similar, usamos 80px para que no se vea "grande" y duplicado
    const heartSize = isMobile ? "80px" : "150px";
    centerHeart.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:${heartSize}; z-index:1; pointer-events:none;`;
    galaxyScene.appendChild(centerHeart);

    // --- 3. RECUERDOS (ESFERA GRAVITACIONAL) ---
    for (let i = 0; i < MEMORY_MULTIPLIER; i++) {
        memoriesDatabase.forEach((memory) => {
            const item = document.createElement('div');
            item.className = 'floating-item';
            const itemWidth = isMobile ? 35 : 55;
            item.style.cssText = `position:absolute; width:${itemWidth}px; cursor:pointer; z-index:5000;`;

            if (memory.imageUrl) {
                const img = document.createElement('img');
                img.src = memory.imageUrl;
                img.style.width = "100%";
                img.style.borderRadius = "5px";
                item.appendChild(img);
            } else {
                const textSpan = document.createElement('span');
                textSpan.innerText = memory.shortText;
                textSpan.className = 'floating-text ' + (Math.random() > 0.5 ? 'neon-pink' : 'neon-blue');
                textSpan.style.fontSize = isMobile ? "7px" : "9px";
                item.appendChild(textSpan);
            }

            item.onclick = (e) => { e.stopPropagation(); openModal(memory); };

            const myParticles = [];
            for (let pIdx = 0; pIdx < PARTICLES_PER_MEMORY; pIdx++) {
                const pEl = document.createElement('div');
                pEl.style.cssText = `position: absolute; width: 1.2px; height: 1.2px; background: #fff; border-radius: 50%; pointer-events: none;`;
                item.appendChild(pEl);
                myParticles.push({
                    el: pEl,
                    rX: (Math.random() * 20 + 20), 
                    rY: (Math.random() * 20 + 20),
                    angle: Math.random() * Math.PI * 2,
                    speed: (Math.random() * 0.04 + 0.02) 
                });
            }

            const orbitData = {
                el: item,
                particles: myParticles,
                // CORRECCIÓN RADIOS: Ajustados para que en 375px no se salgan de la pantalla
                rX: isMobile ? (Math.random() * 100 + 50) : (Math.random() * 0.25 + 0.1) * window.innerWidth, 
                rY: isMobile ? (Math.random() * 80 + 50) : (Math.random() * 0.2 + 0.08) * window.innerHeight, 
                angle: Math.random() * Math.PI * 2,
                tilt: (Math.random() - 0.5) * 0.6, 
                speed: (Math.random() * 0.002 + 0.0005) 
            };
            masterContainer.appendChild(item);
            floatingItems.push(orbitData);
        });
    }
}

/* =========================================
   4. ANIMACIÓN Y SENSORES
   ========================================= */
window.addEventListener('mousemove', (e) => {
    if (isMobile) return;
    targetRotationY = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) * 15; 
    targetRotationX = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2) * -15;
});

window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    targetRotationY = (touch.clientX - window.innerWidth / 2) / (window.innerWidth / 2) * 20; 
    targetRotationX = (touch.clientY - window.innerHeight / 2) / (window.innerHeight / 2) * -20;
}, { passive: true });

function animate() {
    rotationX += (targetRotationX - rotationX) * 0.05;
    rotationY += (targetRotationY - rotationY) * 0.05;
    masterContainer.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    floatingItems.forEach(it => {
        it.angle += it.speed;
        const cosMain = Math.cos(it.angle);
        const sinMain = Math.sin(it.angle);
        const mainX = centerX + cosMain * it.rX;
        const mainY = centerY + sinMain * it.rY + (cosMain * it.tilt * 100); 
        const depthMain = sinMain; 
        const scaleMain = 0.85 + (depthMain * 0.15); 

        it.particles.forEach(p => {
            p.angle += p.speed;
            p.el.style.left = `calc(50% + ${Math.cos(p.angle) * p.rX}px)`;
            p.el.style.top = `calc(50% + ${Math.sin(p.angle) * p.rY}px)`;
        });

        it.el.style.left = mainX + "px";
        it.el.style.top = mainY + "px";
        it.el.style.transform = `translate(-50%, -50%) scale(${scaleMain}) rotateY(${-rotationY}deg) rotateX(${-rotationX}deg)`;
        it.el.style.opacity = 0.6 + (depthMain + 1) * 0.2;
        it.el.style.zIndex = Math.floor((depthMain + 1) * 1000);
    });
    requestAnimationFrame(animate);
}

/* =========================================
   5. LÓGICA DEL MODAL E INICIO
   ========================================= */
function openModal(memory) {
    const modal = document.getElementById('memory-modal');
    document.getElementById('modal-image').src = memory.imageUrl || '';
    document.getElementById('modal-image').style.display = memory.imageUrl ? 'block' : 'none';
    document.getElementById('modal-text').innerText = memory.fullText || memory.shortText;
    modal.style.display = 'block';
}

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('welcome-screen').style.display = 'none';
    galaxyScene.style.opacity = '1';
    createGalaxyElements();
    animate();
});

document.querySelector('.close-button').onclick = () => document.getElementById('memory-modal').style.display = 'none';
window.onclick = (e) => { if (e.target.id == 'memory-modal') e.target.style.display = 'none'; };