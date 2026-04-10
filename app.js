function initForceVectors() {
    const f1Mag = document.getElementById("f1_mag");
    const f1Ang = document.getElementById("f1_ang");
    const f2Mag = document.getElementById("f2_mag");
    const f2Ang = document.getElementById("f2_ang");
    const vecCanvas = document.getElementById("vectorCanvas");

    if (!f1Mag || !f1Ang || !f2Mag || !f2Ang || !vecCanvas) {
        return;
    }

    const f1Val = document.getElementById("f1_val");
    const f1AngVal = document.getElementById("f1_ang_val");
    const f2Val = document.getElementById("f2_val");
    const f2AngVal = document.getElementById("f2_ang_val");
    const fx1Span = document.getElementById("fx1");
    const fy1Span = document.getElementById("fy1");
    const fx2Span = document.getElementById("fx2");
    const fy2Span = document.getElementById("fy2");
    const rMagSpan = document.getElementById("r_mag");
    const rAngSpan = document.getElementById("r_ang");
    const vecCtx = vecCanvas.getContext("2d");

    function drawArrow(fromX, fromY, toX, toY, color, label) {
        vecCtx.beginPath();
        vecCtx.moveTo(fromX, fromY);
        vecCtx.lineTo(toX, toY);
        vecCtx.strokeStyle = color;
        vecCtx.lineWidth = 2.5;
        vecCtx.stroke();

        const angle = Math.atan2(toY - fromY, toX - fromX);
        const headLength = 8;
        vecCtx.beginPath();
        vecCtx.moveTo(toX, toY);
        vecCtx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        vecCtx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        vecCtx.fillStyle = color;
        vecCtx.fill();

        vecCtx.font = "bold 12px Segoe UI";
        vecCtx.fillStyle = color;
        vecCtx.fillText(label, (fromX + toX) / 2 + 5, (fromY + toY) / 2 - 5);
    }

    function drawVectors(vx1, vy1, vx2, vy2, rx, ry) {
        const canvasWidth = Math.min(500, vecCanvas.clientWidth || 500);
        const canvasHeight = 300;
        vecCanvas.width = canvasWidth;
        vecCanvas.height = canvasHeight;
        vecCtx.clearRect(0, 0, canvasWidth, canvasHeight);

        const originX = canvasWidth / 2;
        const originY = canvasHeight / 2;
        const scale = 7;

        vecCtx.beginPath();
        vecCtx.strokeStyle = "#b6c1cd";
        vecCtx.lineWidth = 1;
        vecCtx.moveTo(0, originY);
        vecCtx.lineTo(canvasWidth, originY);
        vecCtx.moveTo(originX, 0);
        vecCtx.lineTo(originX, canvasHeight);
        vecCtx.stroke();

        const e1x = originX + vx1 * scale;
        const e1y = originY - vy1 * scale;
        const e2x = originX + vx2 * scale;
        const e2y = originY - vy2 * scale;
        const erx = originX + rx * scale;
        const ery = originY - ry * scale;

        drawArrow(originX, originY, e1x, e1y, "#d45c4c", "F₁");
        drawArrow(originX, originY, e2x, e2y, "#4c7c5c", "F₂");
        drawArrow(originX, originY, erx, ery, "#2c5282", "R");

        vecCtx.setLineDash([5, 5]);
        vecCtx.beginPath();
        vecCtx.moveTo(e1x, e1y);
        vecCtx.lineTo(erx, ery);
        vecCtx.moveTo(e2x, e2y);
        vecCtx.lineTo(erx, ery);
        vecCtx.stroke();
        vecCtx.setLineDash([]);
    }

    function updateForces() {
        const F1 = parseFloat(f1Mag.value);
        const theta1 = parseFloat(f1Ang.value) * Math.PI / 180;
        const F2 = parseFloat(f2Mag.value);
        const theta2 = parseFloat(f2Ang.value) * Math.PI / 180;

        f1Val.innerText = `${F1.toFixed(1)} N`;
        f1AngVal.innerText = `${f1Ang.value}°`;
        f2Val.innerText = `${F2.toFixed(1)} N`;
        f2AngVal.innerText = `${f2Ang.value}°`;

        const fx1 = F1 * Math.cos(theta1);
        const fy1 = F1 * Math.sin(theta1);
        const fx2 = F2 * Math.cos(theta2);
        const fy2 = F2 * Math.sin(theta2);
        const sumFx = fx1 + fx2;
        const sumFy = fy1 + fy2;
        const resultant = Math.hypot(sumFx, sumFy);
        const angleR = Math.atan2(sumFy, sumFx) * 180 / Math.PI;

        fx1Span.innerText = fx1.toFixed(2);
        fy1Span.innerText = fy1.toFixed(2);
        fx2Span.innerText = fx2.toFixed(2);
        fy2Span.innerText = fy2.toFixed(2);
        rMagSpan.innerText = resultant.toFixed(2);
        rAngSpan.innerText = angleR.toFixed(2);

        drawVectors(fx1, fy1, fx2, fy2, sumFx, sumFy);
    }

    [f1Mag, f1Ang, f2Mag, f2Ang].forEach((input) => {
        input.addEventListener("input", updateForces);
    });

    window.addEventListener("resize", updateForces);
    updateForces();
}

function initMotion() {
    const initVSlider = document.getElementById("initV");
    const accelSlider = document.getElementById("accel");
    const timeSlider = document.getElementById("time");
    const motionCanvas = document.getElementById("motionCanvas");

    if (!initVSlider || !accelSlider || !timeSlider || !motionCanvas) {
        return;
    }

    const uVal = document.getElementById("u_val");
    const aVal = document.getElementById("a_val");
    const tVal = document.getElementById("t_val");
    const sSpan = document.getElementById("s_val");
    const vSpan = document.getElementById("v_val");
    const v2CheckSpan = document.getElementById("v2_check");
    const motionCtx = motionCanvas.getContext("2d");

    function updateMotion() {
        const u = parseFloat(initVSlider.value);
        const a = parseFloat(accelSlider.value);
        const t = parseFloat(timeSlider.value);

        uVal.innerText = `${u.toFixed(1)} m/s`;
        aVal.innerText = `${a.toFixed(1)} m/s²`;
        tVal.innerText = `${t.toFixed(1)} s`;

        const s = u * t + 0.5 * a * t * t;
        const v = u + a * t;
        const v2FromEq = u * u + 2 * a * s;

        sSpan.innerText = `${s.toFixed(2)} m`;
        vSpan.innerText = `${v.toFixed(2)} m/s`;
        v2CheckSpan.innerText = `${v2FromEq.toFixed(2)} (v² = ${(v * v).toFixed(2)})`;

        const width = motionCanvas.clientWidth || 600;
        const height = 120;
        motionCanvas.width = width;
        motionCanvas.height = height;

        motionCtx.clearRect(0, 0, width, height);
        motionCtx.beginPath();
        motionCtx.moveTo(30, height - 30);
        motionCtx.lineTo(width - 30, height - 30);
        motionCtx.strokeStyle = "#cbd5e0";
        motionCtx.lineWidth = 4;
        motionCtx.stroke();

        let maxDist = Math.max(0, Math.abs(u * 10 + 0.5 * a * 100));
        if (maxDist < 0.1) {
            maxDist = 10;
        }

        const x = 30 + Math.min(width - 60, Math.max(0, (s / maxDist) * (width - 60)));

        motionCtx.beginPath();
        motionCtx.arc(x, height - 30, 12, 0, 2 * Math.PI);
        motionCtx.fillStyle = "#f97316";
        motionCtx.fill();

        motionCtx.fillStyle = "white";
        motionCtx.font = "bold 12px sans-serif";
        motionCtx.fillText("●", x - 4, height - 26);
        motionCtx.fillStyle = "#94a3b8";
        motionCtx.font = "10px monospace";
        motionCtx.fillText(`t = ${t.toFixed(1)} s`, width - 82, 20);
        motionCtx.fillText(`s = ${s.toFixed(1)} m`, width - 82, 36);
    }

    [initVSlider, accelSlider, timeSlider].forEach((input) => {
        input.addEventListener("input", updateMotion);
    });

    window.addEventListener("resize", updateMotion);
    updateMotion();
}

function initQuantumWell() {
    const widthSlider = document.getElementById("wellWidth");
    const quantumSlider = document.getElementById("quantumN");
    const waveCanvas = document.getElementById("wave1D");
    const probCanvas = document.getElementById("prob1D");

    if (!widthSlider || !quantumSlider || !waveCanvas || !probCanvas) {
        return;
    }

    const widthVal = document.getElementById("widthVal");
    const nVal = document.getElementById("nVal");

    function update1DWell() {
        const L = parseFloat(widthSlider.value);
        const n = parseInt(quantumSlider.value, 10);

        widthVal.innerText = `${L.toFixed(1)} nm`;
        nVal.innerText = `${n}`;

        const width = 600;
        const height = 300;

        waveCanvas.width = width;
        waveCanvas.height = height;
        probCanvas.width = width;
        probCanvas.height = height;

        const waveCtx = waveCanvas.getContext("2d");
        const probCtx = probCanvas.getContext("2d");

        waveCtx.clearRect(0, 0, width, height);
        waveCtx.fillStyle = "#0f172a";
        waveCtx.fillRect(0, 0, width, height);

        const norm = Math.sqrt(2 / L);

        waveCtx.beginPath();
        waveCtx.strokeStyle = "#f97316";
        waveCtx.lineWidth = 2;
        for (let x = 0; x <= width; x += 1) {
            const xx = x / width * L;
            const psi = norm * Math.sin(n * Math.PI * xx / L);
            const y = height / 2 - psi * height / 3;
            if (x === 0) {
                waveCtx.moveTo(x, y);
            } else {
                waveCtx.lineTo(x, y);
            }
        }
        waveCtx.stroke();

        waveCtx.strokeStyle = "white";
        waveCtx.lineWidth = 1;
        waveCtx.beginPath();
        waveCtx.moveTo(0, 0);
        waveCtx.lineTo(0, height);
        waveCtx.moveTo(width, 0);
        waveCtx.lineTo(width, height);
        waveCtx.stroke();

        probCtx.clearRect(0, 0, width, height);
        probCtx.fillStyle = "#0f172a";
        probCtx.fillRect(0, 0, width, height);

        for (let x = 0; x <= width; x += 1) {
            const xx = x / width * L;
            const prob = (2 / L) * Math.sin(n * Math.PI * xx / L) ** 2;
            const heightProb = prob * height * 0.8;
            probCtx.fillStyle = `hsl(${240 - prob * 200}, 70%, 60%)`;
            probCtx.fillRect(x, height - heightProb, 2, heightProb);
        }

        probCtx.strokeStyle = "white";
        probCtx.beginPath();
        probCtx.moveTo(0, 0);
        probCtx.lineTo(0, height);
        probCtx.moveTo(width, 0);
        probCtx.lineTo(width, height);
        probCtx.stroke();
    }

    [widthSlider, quantumSlider].forEach((input) => {
        input.addEventListener("input", update1DWell);
    });

    update1DWell();
}

document.addEventListener("DOMContentLoaded", () => {
    initForceVectors();
    initMotion();
    initQuantumWell();
});
