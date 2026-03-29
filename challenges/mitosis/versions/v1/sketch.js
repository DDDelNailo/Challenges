let cells = [];

function setup() {
	const canvas = createCanvas(650, 650);
	canvas.parent("canvas-container");

	for (let i = 0; i < 5; i++) {
		let pos = createVector(random(width - 100) + 50, random(height - 100) + 50);
		cells.push(new Cell(pos, 0));
	}
}

function draw() {
	background(
		0,
		0,
		0
	);

	for (let cell of cells) {
		cell.update();
		cell.draw();
	}
}
