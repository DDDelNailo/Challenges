function setup() {
    const canvas = createCanvas(420, 420);
    canvas.parent("canvas-container");

    background(18);
}

function draw() {
    background(18, 20, 35, 55);
    translate(width / 2, height / 2);

    const t = frameCount * 0.02;
    const x = cos(t) * 120;
    const y = sin(t * 1.7) * 120;

    noStroke();
    fill(138, 99, 255, 180);
    ellipse(x, y, 48, 48);

    fill(255, 255, 255, 210);
    ellipse(-x * 0.55, -y * 0.55, 14, 14);
}
