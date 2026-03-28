let objects = [];
let speed = 0;
let hwidth = 0;
let hheight = 0;

function setup() {
	const canvas = createCanvas(600, 600);
	canvas.parent("canvas-container");

	hwidth = width / 2;
	hheight = height / 2;

	for (let i = 0; i < 1000; i++) {
		objects.push(new Star());
	}

	background(0);
}

function draw() {
	background(0, 0, 0, 40);

	let mx = constrain(map(mouseX, 0, width, 0, 5), 0, 5);
	let my = constrain(map(mouseY, 0, height, 1, 5), 1, 5);

	speed = mx ** my;

	for (let obj of objects) {
		obj.update();
		obj.display();
	}

	fill(255);
	stroke(255);
	textSize(15);
	textAlign(LEFT, TOP);
	text(
		`Speed: ${speed.toFixed(4)} = ${mx.toFixed(4)} ^ ${my.toFixed(4)}`,
		10,
		10
	);
}

function mouseClicked() {
	for (let obj of objects) {
		obj.reset();
	}

	background(10);
}

class Star {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.size = 0;
		this.intensity = 0;

		this.reset();
	}

	reset() {
		this.x = random(-hwidth, hwidth);
		this.y = random(-hheight, hheight);
		this.z = 0;

		this.size = 0;

		this.intensity = random(0.3, 1);
	}

	update() {
		let dx;
		let dy;

		// clockwise spiral
		// dx = this.x * 0.01 - this.y * 0.01;
		// dy = this.y * 0.01 + this.x * 0.01;

		// skewed clockwise spiral
		// dx = this.x * 0.01;
		// dy = this.y * 0.01 + this.x * 0.01;

		// rotated skewed clockwise spiral
		// dx = this.x * 0.01 - this.y * 0.01;
		// dy = this.y * 0.01;

		// counter-clockwise spiral
		// dx = this.x * 0.01 + this.y * 0.01;
		// dy = this.y * 0.01 - this.x * 0.01;

		// skewed counter-clockwise spiral
		// dx = this.x * 0.01 + this.y * 0.01;
		// dy = this.y * 0.01;

		// rotated skewed clockwise spiral
		// dx = this.x * 0.01;
		// dy = this.y * 0.01 - this.x * 0.01;

		// diagonal rupture
		// dx = this.x * 0.01 + this.y * 0.01;
		// dy = this.y * 0.01 + this.x * 0.01;

		// skewed circle
		// dx = -this.x * 0.01 - this.y * 0.02;
		// dy = this.y * 0.01 + this.x * 0.01;

		// mirrorred diagonal rupture
		// dx = this.x * 0.01 - this.y * 0.01;
		// dy = this.y * 0.01 - this.x * 0.01;

		// diagonal line
		// dx = this.y * 0.01;
		// dy = this.x * 0.01;

		// clockwise circle
		// dx = -this.y * 0.01;
		// dy = this.x * 0.01;

		// counter-clockwise circle
		// dx = this.y * 0.01;
		// dy = -this.x * 0.01;

		// mirrorred diagonal line
		// dx = -this.y * 0.01;
		// dy = -this.x * 0.01;

		// standard stars
		dx = this.x * 0.01;
		dy = this.y * 0.01;

		// supernova
		// dx = -this.x * 0.01;
		// dy = -this.y * 0.01;

		// vertical line
		// dx = -this.x * 0.01;
		// dy = this.y * 0.01;

		// horizontal line
		// dx = this.x * 0.01;
		// dy = -this.y * 0.01;

		let dz = 1;

		this.x += dx * speed;
		this.y += dy * speed;
		this.z += dz * speed;

		if (abs(this.x) > hwidth || abs(this.y) > hheight) {
			this.reset();
		}
	}

	display() {
		let z_cap = 200;

		let col_rg = map(this.z, 0, z_cap, 0, 255);
		if (col_rg > 200) {
			col_rg = 200;
		}

		let col_b = map(this.z, 0, z_cap, 0, 255);

		fill(
			this.intensity * col_rg,
			this.intensity * col_rg,
			this.intensity * col_b
		);
		stroke(
			this.intensity * col_rg,
			this.intensity * col_rg,
			this.intensity * col_b
		);

		this.size = map(this.z, 0, z_cap * 5, 0, 5);
		ellipse(this.x + hwidth, this.y + hheight, this.size);
	}
}
