function setup() {
	const canvas = createCanvas(400, 400);
	canvas.parent("canvas-container");
	background(30);
}

function draw() {
	fill(138, 99, 255);
	ellipse(mouseX, mouseY, 50, 50);
}