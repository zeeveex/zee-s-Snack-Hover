

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const mouse = {
        x: width / 2,
        y: height / 2
    };

    // --- Snake Properties ---
    const numSegments = 60;
    const segmentLength = 10;
    const segments = [];

    for (let i = 0; i < numSegments; i++) {
        segments.push({
            x: width / 2,
            y: height / 2
        });
    }

    // --- Physics Properties ---
    const springStiffness = 0.09;
    const damping = 0.85;

    // --- Animation Loop ---
    let time = 0;

    function animate() {
        // 1. Update Time for Ambient Gradients
        time += 0.005;

        // 2. Clear and Draw Background
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Fading trail effect
        ctx.fillRect(0, 0, width, height);
        
        drawAmbientGradients();

        // 3. Update and Draw Snake
        updateSnake();
        drawSnake();

        requestAnimationFrame(animate);
    }

    // --- Drawing Functions ---
    function drawAmbientGradients() {
        ctx.globalCompositeOperation = 'lighter';

        // Gradient 1 (Animated)
        const grad1X = width / 2 + Math.sin(time) * (width / 4);
        const grad1Y = height / 2 + Math.cos(time) * (height / 4);
        const grad1 = ctx.createRadialGradient(grad1X, grad1Y, 0, grad1X, grad1Y, width / 2);
        grad1.addColorStop(0, 'rgba(0, 50, 20, 0.4)');
        grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);

        // Gradient 2 (Animated)
        const grad2X = width / 2 + Math.cos(time * 0.7) * (width / 3);
        const grad2Y = height / 2 + Math.sin(time * 0.7) * (height / 3);
        const grad2 = ctx.createRadialGradient(grad2X, grad2Y, 0, grad2X, grad2Y, width / 2);
        grad2.addColorStop(0, 'rgba(20, 0, 40, 0.3)');
        grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);
    }
    
    function drawSnake() {
        ctx.shadowColor = '#0f0';
        ctx.shadowBlur = 20;

        segments.forEach((segment, index) => {
            const opacity = 1 - (index / numSegments) * 0.7;
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, (numSegments - index) / 8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
            ctx.fill();
        });
        
        ctx.shadowBlur = 0;
    }

    // --- Physics and Update Functions ---
    function updateSnake() {
        const head = segments[0];

        // Spring physics for the head to follow the mouse
        const dx = mouse.x - head.x;
        const dy = mouse.y - head.y;
        const ax = dx * springStiffness;
        const ay = dy * springStiffness;

        head.vx = (head.vx || 0) + ax;
        head.vy = (head.vy || 0) + ay;

        head.vx *= damping;
        head.vy *= damping;

        head.x += head.vx;
        head.y += head.vy;

        // Update body segments to follow the one in front
        for (let i = 1; i < numSegments; i++) {
            const prev = segments[i - 1];
            const current = segments[i];
            
            const segDx = prev.x - current.x;
            const segDy = prev.y - current.y;
            const dist = Math.sqrt(segDx * segDx + segDy * segDy);
            
            const angle = Math.atan2(segDy, segDx);

            current.x = prev.x - Math.cos(angle) * segmentLength;
            current.y = prev.y - Math.sin(angle) * segmentLength;
        }
    }

    // --- Event Listeners ---
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    // --- Start Animation ---
    animate();
});
