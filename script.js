// ===== ANNIVERSARY DATE =====
const ANNIVERSARY = new Date(2024, 2, 12, 0, 0, 0); // March 12, 2024

// ===== REAL-TIME COUNTER =====
function updateCounter() {
    const now = new Date();
    const diff = now - ANNIVERSARY;

    // Total calculations
    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutesVal = Math.floor(totalSeconds / 60);
    const totalHoursVal = Math.floor(totalMinutesVal / 60);
    const totalDaysVal = Math.floor(totalHoursVal / 24);

    // Breakdown
    const years = Math.floor(totalDaysVal / 365.25);
    const remainingAfterYears = diff - (years * 365.25 * 24 * 60 * 60 * 1000);

    const months = Math.floor(remainingAfterYears / (30.44 * 24 * 60 * 60 * 1000));
    const remainingAfterMonths = remainingAfterYears - (months * 30.44 * 24 * 60 * 60 * 1000);

    const days = Math.floor(remainingAfterMonths / (24 * 60 * 60 * 1000));
    const remainingAfterDays = remainingAfterMonths - (days * 24 * 60 * 60 * 1000);

    const hours = Math.floor(remainingAfterDays / (60 * 60 * 1000));
    const remainingAfterHours = remainingAfterDays - (hours * 60 * 60 * 1000);

    const minutes = Math.floor(remainingAfterHours / (60 * 1000));
    const seconds = Math.floor((remainingAfterHours - (minutes * 60 * 1000)) / 1000);

    // Update DOM
    animateValue('years', years);
    animateValue('months', months);
    animateValue('days', days);
    animateValue('hours', hours);
    animateValue('minutes', minutes);
    animateValue('seconds', seconds);

    // Total stats
    document.getElementById('totalDays').textContent = totalDaysVal.toLocaleString('es-ES');
    document.getElementById('totalHours').textContent = totalHoursVal.toLocaleString('es-ES');
    document.getElementById('totalMinutes').textContent = totalMinutesVal.toLocaleString('es-ES');
}

function animateValue(id, newValue) {
    const el = document.getElementById(id);
    const current = parseInt(el.textContent);
    if (current !== newValue) {
        el.textContent = newValue;
        el.style.transform = 'scale(1.2)';
        el.style.transition = 'transform 0.3s ease';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 300);
    }
}

setInterval(updateCounter, 1000);
updateCounter();


// ===== EASING FUNCTIONS =====
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ===== FALLING PETAL CLASS =====
class FallingPetal {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.w;
        this.y = -10 - Math.random() * 50;
        this.size = 3 + Math.random() * 5;
        this.speedY = 15 + Math.random() * 25;
        this.speedX = -10 + Math.random() * 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 2;
        this.opacity = 0.3 + Math.random() * 0.5;
        this.hue = 200 + Math.random() * 40;
        this.swayFreq = 1 + Math.random() * 2;
        this.swayAmp = 15 + Math.random() * 20;
        this.time = Math.random() * 10;
    }

    update(dt) {
        this.time += dt;
        this.y += this.speedY * dt;
        this.x += Math.sin(this.time * this.swayFreq) * this.swayAmp * dt;
        this.rotation += this.rotSpeed * dt;
        if (this.y > this.h + 10) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
    }
}

// ===== FLOWER CANVAS ANIMATION =====
const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Flower class
class Flower {
    constructor(x, y, size, delay) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.delay = delay;
        this.time = -delay;
        this.stemHeight = size * 3;
        this.swayAmount = 0;
        this.swaySpeed = 0.8 + Math.random() * 0.5;
        this.petalCount = 5 + Math.floor(Math.random() * 4);
        this.bloomProgress = 0;
        this.hue = 210 + Math.random() * 40; // blue range
        this.leafAngle = Math.random() > 0.5 ? 1 : -1;
        this.sparkles = [];
        for (let i = 0; i < 3; i++) {
            this.sparkles.push({
                angle: Math.random() * Math.PI * 2,
                dist: size * 1.2 + Math.random() * size * 0.5,
                speed: 0.5 + Math.random() * 1,
                size: 1 + Math.random() * 2
            });
        }
    }

    update(dt) {
        this.time += dt;
        if (this.time < 0) return;

        // Grow stem
        const growDuration = 2;
        const growProgress = Math.min(this.time / growDuration, 1);
        this.currentStemHeight = this.stemHeight * easeOutCubic(growProgress);

        // Bloom petals
        if (this.time > growDuration * 0.7) {
            const bloomTime = this.time - growDuration * 0.7;
            this.bloomProgress = Math.min(bloomTime / 1.5, 1);
        }

        // Sway
        this.swayAmount = Math.sin(this.time * this.swaySpeed) * 8;

        // Sparkles
        this.sparkles.forEach(s => {
            s.angle += s.speed * dt;
        });
    }

    draw(ctx) {
        if (this.time < 0) return;

        const baseX = this.x;
        const baseY = this.y;
        const topX = baseX + this.swayAmount;
        const topY = baseY - this.currentStemHeight;

        ctx.save();

        // Stem
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        const cp1x = baseX + this.swayAmount * 0.3;
        const cp1y = baseY - this.currentStemHeight * 0.5;
        ctx.quadraticCurveTo(cp1x, cp1y, topX, topY);
        ctx.strokeStyle = `hsl(120, 40%, 30%)`;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Leaf
        if (this.currentStemHeight > this.stemHeight * 0.4) {
            const leafY = baseY - this.currentStemHeight * 0.45;
            const leafX = baseX + this.swayAmount * 0.3;
            ctx.save();
            ctx.translate(leafX, leafY);
            ctx.rotate(this.leafAngle * 0.5 + Math.sin(this.time * this.swaySpeed) * 0.1);
            ctx.beginPath();
            ctx.ellipse(this.leafAngle * 12, 0, 15, 6, this.leafAngle * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(130, 50%, 35%, 0.8)`;
            ctx.fill();
            ctx.restore();
        }

        // Petals
        if (this.bloomProgress > 0) {
            ctx.save();
            ctx.translate(topX, topY);
            const petalSize = this.size * easeOutBack(this.bloomProgress);

            // Outer glow
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petalSize * 2);
            gradient.addColorStop(0, `hsla(${this.hue}, 80%, 70%, 0.3)`);
            gradient.addColorStop(1, `hsla(${this.hue}, 80%, 70%, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, petalSize * 2, 0, Math.PI * 2);
            ctx.fill();

            // Petals
            for (let i = 0; i < this.petalCount; i++) {
                const angle = (i / this.petalCount) * Math.PI * 2 + Math.sin(this.time * 0.5) * 0.1;
                ctx.save();
                ctx.rotate(angle);

                // Petal shape
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(
                    petalSize * 0.5, -petalSize * 0.3,
                    petalSize * 0.8, -petalSize * 0.2,
                    petalSize, 0
                );
                ctx.bezierCurveTo(
                    petalSize * 0.8, petalSize * 0.2,
                    petalSize * 0.5, petalSize * 0.3,
                    0, 0
                );

                const petalGrad = ctx.createLinearGradient(0, 0, petalSize, 0);
                petalGrad.addColorStop(0, `hsla(${this.hue}, 90%, 75%, 0.95)`);
                petalGrad.addColorStop(0.5, `hsla(${this.hue}, 85%, 65%, 0.9)`);
                petalGrad.addColorStop(1, `hsla(${this.hue + 20}, 80%, 55%, 0.85)`);
                ctx.fillStyle = petalGrad;
                ctx.fill();

                // Petal vein
                ctx.beginPath();
                ctx.moveTo(2, 0);
                ctx.lineTo(petalSize * 0.7, 0);
                ctx.strokeStyle = `hsla(${this.hue}, 70%, 55%, 0.3)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();

                ctx.restore();
            }

            // Center
            const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, petalSize * 0.3);
            centerGrad.addColorStop(0, `hsla(45, 100%, 75%, 1)`);
            centerGrad.addColorStop(0.7, `hsla(45, 90%, 60%, 0.9)`);
            centerGrad.addColorStop(1, `hsla(${this.hue}, 80%, 50%, 0.7)`);
            ctx.beginPath();
            ctx.arc(0, 0, petalSize * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = centerGrad;
            ctx.fill();

            // Sparkles
            this.sparkles.forEach(s => {
                const sx = Math.cos(s.angle) * s.dist * this.bloomProgress;
                const sy = Math.sin(s.angle) * s.dist * this.bloomProgress;
                ctx.beginPath();
                ctx.arc(sx, sy, s.size * this.bloomProgress, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 80%, 80%, ${0.5 + Math.sin(this.time * 3 + s.angle) * 0.3})`;
                ctx.fill();
            });

            ctx.restore();
        }

        ctx.restore();
    }
}

// Gerbera Flower class - Large special blue gerbera
class GerberaFlower {
    constructor(x, y, size, delay) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.delay = delay;
        this.time = -delay;
        this.stemHeight = size * 3.5;
        this.swayAmount = 0;
        this.swaySpeed = 0.5;
        this.bloomProgress = 0;
        this.currentStemHeight = 0;
        this.sparkles = [];
        for (let i = 0; i < 8; i++) {
            this.sparkles.push({
                angle: Math.random() * Math.PI * 2,
                dist: size * 1.3 + Math.random() * size * 0.8,
                speed: 0.3 + Math.random() * 0.8,
                size: 1.5 + Math.random() * 2.5
            });
        }
    }

    update(dt) {
        this.time += dt;
        if (this.time < 0) return;

        const growDuration = 2.5;
        const growProgress = Math.min(this.time / growDuration, 1);
        this.currentStemHeight = this.stemHeight * easeOutCubic(growProgress);

        if (this.time > growDuration * 0.6) {
            const bloomTime = this.time - growDuration * 0.6;
            this.bloomProgress = Math.min(bloomTime / 2, 1);
        }

        this.swayAmount = Math.sin(this.time * this.swaySpeed) * 6;

        this.sparkles.forEach(s => {
            s.angle += s.speed * dt;
        });
    }

    draw(ctx) {
        if (this.time < 0) return;

        const baseX = this.x;
        const baseY = this.y;
        const topX = baseX + this.swayAmount;
        const topY = baseY - this.currentStemHeight;

        ctx.save();

        // Thick stem
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        const cp1x = baseX + this.swayAmount * 0.3;
        const cp1y = baseY - this.currentStemHeight * 0.5;
        ctx.quadraticCurveTo(cp1x, cp1y, topX, topY);
        ctx.strokeStyle = `hsl(125, 45%, 28%)`;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Two leaves on each side
        if (this.currentStemHeight > this.stemHeight * 0.3) {
            for (let side = -1; side <= 1; side += 2) {
                const leafY = baseY - this.currentStemHeight * (side === -1 ? 0.35 : 0.55);
                const leafX = baseX + this.swayAmount * (side === -1 ? 0.2 : 0.35);
                ctx.save();
                ctx.translate(leafX, leafY);
                ctx.rotate(side * 0.6 + Math.sin(this.time * this.swaySpeed) * 0.08);
                ctx.beginPath();
                ctx.ellipse(side * 18, 0, 22, 8, side * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(130, 50%, 32%, 0.85)`;
                ctx.fill();
                // Leaf vein
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(side * 28, 0);
                ctx.strokeStyle = `hsla(130, 40%, 25%, 0.5)`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
                ctx.restore();
            }
        }

        // Gerbera petals
        if (this.bloomProgress > 0) {
            ctx.save();
            ctx.translate(topX, topY);
            const petalSize = this.size * easeOutBack(this.bloomProgress);

            // Big outer glow
            const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, petalSize * 2);
            outerGlow.addColorStop(0, `hsla(220, 90%, 70%, 0.25)`);
            outerGlow.addColorStop(0.4, `hsla(220, 80%, 60%, 0.1)`);
            outerGlow.addColorStop(1, `hsla(220, 80%, 60%, 0)`);
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(0, 0, petalSize * 2, 0, Math.PI * 2);
            ctx.fill();

            // Outer petal layer (thin, many petals) - Gerbera signature
            const outerPetalCount = 24;
            for (let i = 0; i < outerPetalCount; i++) {
                const angle = (i / outerPetalCount) * Math.PI * 2 + Math.sin(this.time * 0.3) * 0.05;
                ctx.save();
                ctx.rotate(angle);

                const len = petalSize * 1.1;
                const wid = petalSize * 0.12;
                ctx.beginPath();
                ctx.moveTo(petalSize * 0.3, 0);
                ctx.bezierCurveTo(
                    petalSize * 0.5, -wid,
                    len * 0.8, -wid * 0.8,
                    len, 0
                );
                ctx.bezierCurveTo(
                    len * 0.8, wid * 0.8,
                    petalSize * 0.5, wid,
                    petalSize * 0.3, 0
                );

                const grad = ctx.createLinearGradient(petalSize * 0.3, 0, len, 0);
                grad.addColorStop(0, `hsla(215, 85%, 65%, 0.9)`);
                grad.addColorStop(0.5, `hsla(220, 90%, 60%, 0.85)`);
                grad.addColorStop(1, `hsla(230, 85%, 50%, 0.8)`);
                ctx.fillStyle = grad;
                ctx.fill();

                ctx.restore();
            }

            // Middle petal layer
            const midPetalCount = 16;
            for (let i = 0; i < midPetalCount; i++) {
                const angle = (i / midPetalCount) * Math.PI * 2 + (Math.PI / midPetalCount) + Math.sin(this.time * 0.4) * 0.08;
                ctx.save();
                ctx.rotate(angle);

                const len = petalSize * 0.8;
                const wid = petalSize * 0.18;
                ctx.beginPath();
                ctx.moveTo(petalSize * 0.15, 0);
                ctx.bezierCurveTo(
                    petalSize * 0.35, -wid,
                    len * 0.7, -wid * 1.1,
                    len, 0
                );
                ctx.bezierCurveTo(
                    len * 0.7, wid * 1.1,
                    petalSize * 0.35, wid,
                    petalSize * 0.15, 0
                );

                const grad = ctx.createLinearGradient(petalSize * 0.15, 0, len, 0);
                grad.addColorStop(0, `hsla(210, 95%, 75%, 0.95)`);
                grad.addColorStop(0.6, `hsla(215, 90%, 65%, 0.9)`);
                grad.addColorStop(1, `hsla(225, 85%, 55%, 0.85)`);
                ctx.fillStyle = grad;
                ctx.fill();

                // Petal vein
                ctx.beginPath();
                ctx.moveTo(petalSize * 0.2, 0);
                ctx.lineTo(len * 0.8, 0);
                ctx.strokeStyle = `hsla(220, 70%, 50%, 0.25)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();

                ctx.restore();
            }

            // Inner petal layer
            const innerPetalCount = 10;
            for (let i = 0; i < innerPetalCount; i++) {
                const angle = (i / innerPetalCount) * Math.PI * 2 + Math.sin(this.time * 0.5) * 0.1;
                ctx.save();
                ctx.rotate(angle);

                const len = petalSize * 0.5;
                const wid = petalSize * 0.14;
                ctx.beginPath();
                ctx.moveTo(petalSize * 0.1, 0);
                ctx.bezierCurveTo(
                    petalSize * 0.2, -wid,
                    len * 0.7, -wid,
                    len, 0
                );
                ctx.bezierCurveTo(
                    len * 0.7, wid,
                    petalSize * 0.2, wid,
                    petalSize * 0.1, 0
                );

                ctx.fillStyle = `hsla(205, 95%, 80%, 0.9)`;
                ctx.fill();
                ctx.restore();
            }

            // Center disc - detailed gerbera center
            const centerSize = petalSize * 0.3;
            const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, centerSize);
            centerGrad.addColorStop(0, `hsla(50, 100%, 80%, 1)`);
            centerGrad.addColorStop(0.4, `hsla(45, 100%, 65%, 0.95)`);
            centerGrad.addColorStop(0.7, `hsla(35, 90%, 50%, 0.9)`);
            centerGrad.addColorStop(1, `hsla(220, 70%, 45%, 0.8)`);
            ctx.beginPath();
            ctx.arc(0, 0, centerSize, 0, Math.PI * 2);
            ctx.fillStyle = centerGrad;
            ctx.fill();

            // Center seed pattern
            for (let ring = 0; ring < 3; ring++) {
                const ringRadius = centerSize * (0.25 + ring * 0.25);
                const dotCount = 6 + ring * 4;
                for (let d = 0; d < dotCount; d++) {
                    const dotAngle = (d / dotCount) * Math.PI * 2 + this.time * 0.2 * (ring % 2 === 0 ? 1 : -1);
                    const dx = Math.cos(dotAngle) * ringRadius;
                    const dy = Math.sin(dotAngle) * ringRadius;
                    ctx.beginPath();
                    ctx.arc(dx, dy, 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(40, 90%, ${60 + ring * 10}%, 0.7)`;
                    ctx.fill();
                }
            }

            // Sparkles around gerbera
            this.sparkles.forEach(s => {
                const sx = Math.cos(s.angle) * s.dist * this.bloomProgress;
                const sy = Math.sin(s.angle) * s.dist * this.bloomProgress;
                const sparkleAlpha = 0.5 + Math.sin(this.time * 2.5 + s.angle) * 0.4;

                // Star-shaped sparkle
                ctx.save();
                ctx.translate(sx, sy);
                ctx.rotate(this.time * 0.5 + s.angle);
                const sSize = s.size * this.bloomProgress;
                ctx.beginPath();
                for (let p = 0; p < 4; p++) {
                    const a = (p / 4) * Math.PI * 2;
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(a) * sSize * 2, Math.sin(a) * sSize * 2);
                }
                ctx.strokeStyle = `hsla(220, 90%, 85%, ${sparkleAlpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(0, 0, sSize * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(220, 80%, 90%, ${sparkleAlpha})`;
                ctx.fill();
                ctx.restore();
            });

            ctx.restore();
        }

        ctx.restore();
    }
}

// Create flowers
const flowers = [];
const gerberaFlowers = [];
const displayWidth = canvas.width / window.devicePixelRatio;
const displayHeight = canvas.height / window.devicePixelRatio;

function createFlowers() {
    flowers.length = 0;
    gerberaFlowers.length = 0;
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const baseY = h * 0.85;
    const isMobile = w < 500;
    const sizeScale = isMobile ? 0.65 : 1;

    const positions = [
        { x: w * 0.06, size: 18, delay: 0.5 },
        { x: w * 0.14, size: 22, delay: 0.2 },
        { x: w * 0.22, size: 20, delay: 0.8 },
        { x: w * 0.30, size: 24, delay: 0.1 },
        { x: w * 0.38, size: 22, delay: 0.6 },
        // Center gap for gerbera
        { x: w * 0.62, size: 23, delay: 0.3 },
        { x: w * 0.70, size: 21, delay: 0.7 },
        { x: w * 0.78, size: 25, delay: 0.4 },
        { x: w * 0.86, size: 19, delay: 0.9 },
        { x: w * 0.94, size: 17, delay: 0.5 },
    ];

    // Add second row only on larger screens
    if (!isMobile) {
        positions.push(
            { x: w * 0.10, size: 15, delay: 1.2 },
            { x: w * 0.26, size: 16, delay: 1.0 },
            { x: w * 0.74, size: 14, delay: 1.1 },
            { x: w * 0.90, size: 15, delay: 1.4 },
        );
    }

    positions.forEach(p => {
        flowers.push(new Flower(p.x, baseY + (Math.random() * 10 - 5), p.size * sizeScale, p.delay));
    });

    // Large center Gerbera - scale for mobile
    const gerberaSize = isMobile ? 38 : 60;
    gerberaFlowers.push(new GerberaFlower(w * 0.5, baseY - 5, gerberaSize, 0.0));
}
createFlowers();
window.addEventListener('resize', () => {
    resizeCanvas();
    createFlowers();
    fallingPetals.length = 0;
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    for (let i = 0; i < 20; i++) {
        fallingPetals.push(new FallingPetal(w, h));
    }
});

// Create falling petals
const fallingPetals = [];
for (let i = 0; i < 20; i++) {
    fallingPetals.push(new FallingPetal(displayWidth, displayHeight));
}

// Draw grass
function drawGrass(ctx, w, h) {
    const grassY = h * 0.82;
    const gradient = ctx.createLinearGradient(0, grassY, 0, h);
    gradient.addColorStop(0, 'hsla(130, 40%, 25%, 0.6)');
    gradient.addColorStop(0.5, 'hsla(130, 35%, 18%, 0.5)');
    gradient.addColorStop(1, 'hsla(130, 30%, 12%, 0.3)');

    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 3) {
        const y = grassY + Math.sin(x * 0.05 + performance.now() * 0.001) * 5 +
            Math.sin(x * 0.02) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Grass blades
    for (let x = 0; x < w; x += 8) {
        const bladeHeight = 15 + Math.random() * 15;
        const sway = Math.sin(performance.now() * 0.002 + x * 0.05) * 3;
        const by = grassY + Math.sin(x * 0.05) * 5 + Math.sin(x * 0.02) * 10;

        ctx.beginPath();
        ctx.moveTo(x, by);
        ctx.quadraticCurveTo(x + sway, by - bladeHeight * 0.6, x + sway * 1.5, by - bladeHeight);
        ctx.strokeStyle = `hsla(${120 + Math.random() * 20}, 40%, ${25 + Math.random() * 10}%, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

// Animation loop
let lastTime = performance.now();

function animate(now) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;

    ctx.clearRect(0, 0, w, h);

    // Draw grass
    drawGrass(ctx, w, h);

    // Update & draw falling petals
    fallingPetals.forEach(p => {
        p.update(dt);
        p.draw(ctx);
    });

    // Update & draw flowers
    flowers.forEach(f => {
        f.update(dt);
        f.draw(ctx);
    });

    // Update & draw gerbera flowers
    gerberaFlowers.forEach(f => {
        f.update(dt);
        f.draw(ctx);
    });

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);


// ===== PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = 2 + Math.random() * 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${8 + Math.random() * 12}s`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(particle);
    }
}
createParticles();


// ===== FIREFLIES =====
function createFireflies() {
    const container = document.getElementById('fireflies');
    for (let i = 0; i < 12; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${Math.random() * 100}%`;
        firefly.style.setProperty('--moveX', `${-100 + Math.random() * 200}px`);
        firefly.style.setProperty('--moveY', `${-100 + Math.random() * 200}px`);
        firefly.style.animationDuration = `${5 + Math.random() * 10}s`;
        firefly.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(firefly);
    }
}
createFireflies();


// ===== MUSIC TOGGLE =====
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🎵';
        musicToggle.classList.remove('playing');
    } else {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => {});
        musicToggle.textContent = '🎶';
        musicToggle.classList.add('playing');
    }
    isPlaying = !isPlaying;
});


// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.counter-card, .stat, .message-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});
