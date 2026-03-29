const INITIAL_CELLS = 8;
const NUTRIENT_COUNT = 150;
const MAX_CELLS = 220;
const SPLIT_ENERGY = 128;

let cells = [];
let nutrients = [];

function setup() {
    const canvas = createCanvas(760, 620);
    canvas.parent("canvas-container");

    colorMode(HSB, 360, 100, 100, 100);
    textFont("monospace");

    cells = [];
    nutrients = [];

    for (let i = 0; i < INITIAL_CELLS; i++) {
        const spawn = createVector(random(width), random(height));
        cells.push(new Cell(spawn));
    }

    for (let i = 0; i < NUTRIENT_COUNT; i++) {
        nutrients.push(createNutrient());
    }
}

function draw() {
    drawBackground();
    updateAndDrawNutrients();
    updateAndDrawCells();
    drawHUD();
}

function mousePressed() {
    for (let i = cells.length - 1; i >= 0; i--) {
        const cell = cells[i];
        if (!cell.containsPoint(mouseX, mouseY)) {
            continue;
        }

        if (cells.length + 1 <= MAX_CELLS) {
            cell.energy = max(cell.energy, SPLIT_ENERGY + 10);
            const children = cell.divide();
            cells.splice(i, 1, ...children);
        }
        return;
    }
}

function updateAndDrawCells() {
    for (let i = cells.length - 1; i >= 0; i--) {
        const cell = cells[i];
        cell.update(nutrients);
        cell.show();

        if (cell.canDivide() && cells.length + 1 <= MAX_CELLS) {
            const children = cell.divide();
            cells.splice(i, 1, ...children);
            continue;
        }

        if (cell.isDead()) {
            cells.splice(i, 1);
        }
    }

    if (cells.length === 0) {
        cells.push(new Cell(createVector(width * 0.5, height * 0.5), 24, 85, random(360)));
    }
}

function createNutrient() {
    return {
        pos: createVector(random(width), random(height)),
        energy: random(7, 17),
        drift: p5.Vector.random2D().mult(random(0.12, 0.35)),
        twinkle: random(TWO_PI),
    };
}

function updateAndDrawNutrients() {
    for (const nutrient of nutrients) {
        nutrient.twinkle += 0.04;
        nutrient.pos.add(nutrient.drift);

        if (nutrient.pos.x < 0 || nutrient.pos.x > width) {
            nutrient.drift.x *= -1;
        }
        if (nutrient.pos.y < 0 || nutrient.pos.y > height) {
            nutrient.drift.y *= -1;
        }

        const size = 2.8 + sin(nutrient.twinkle) * 0.8;
        noStroke();
        fill(55, 35, 100, 80);
        circle(nutrient.pos.x, nutrient.pos.y, size);
    }
}

function resetNutrient(nutrient) {
    nutrient.pos.set(random(width), random(height));
    nutrient.energy = random(7, 17);
    nutrient.drift = p5.Vector.random2D().mult(random(0.12, 0.35));
}

function drawBackground() {
    for (let y = 0; y < height; y += 3) {
        const t = y / height;
        const hue = lerp(204, 252, t);
        const brightness = lerp(16, 7, t);
        stroke(hue, 55, brightness, 100);
        line(0, y, width, y);
    }

    noStroke();
    fill(0, 0, 0, 8);
    rect(0, 0, width, height);
}

function drawHUD() {
    const avgEnergy =
        cells.reduce((sum, cell) => sum + max(0, cell.energy), 0) / max(cells.length, 1);

    noStroke();
    fill(0, 0, 8, 62);
    rect(12, 12, 280, 74, 10);

    fill(190, 15, 98, 95);
    textSize(13);
    text(`Cells: ${cells.length} / ${MAX_CELLS}`, 24, 36);
    text(`Avg energy: ${avgEnergy.toFixed(1)}`, 24, 56);
    text("Click a cell to force mitosis", 24, 76);
}
