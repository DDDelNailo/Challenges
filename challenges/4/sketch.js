let drops = [];
let dropsNum = 0;
let maxDrops = 2000;
let spawnScale = 0;

let bgLight = [115, 173, 255];
let bgDark = [10, 11, 36];

let dropLight = [179, 255, 250];
let dropDark = [0, 0, 250];

class Drop {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;

		this.reset();
	}

	reset() {
		this.x = random(spawnScale * -width, spawnScale * width);
		this.y = -20;
		this.speed = random(8, 16);
	}
}

function setup() {
	const canvas = createCanvas(650, 650);
	canvas.parent("canvas-container");

	for (let i = 0; i < dropsNum; i++) {
		drops.push(new Drop());
	}
}

function keyPressed() {
	if (key == " ") {
		for (let drop of drops) {
			drop.x = width / 2;
			drop.y = 0;
		}
	}
}

function draw() {
	let mx = constrain(map(mouseX, 0, width, -10, 10), -10, 10);
	let my = constrain(map(mouseY, 0, height, 0, maxDrops), 0, maxDrops);

	spawnScale = map(abs(mx), 0, 10, 1, 1.8);

	let colIntensity = map(my, 0, maxDrops, 0, 255);
	let colBlend = colIntensity / 255;

	background(
		lerp(bgLight[0], bgDark[0], colIntensity / 255),
		lerp(bgLight[1], bgDark[1], colIntensity / 255),
		lerp(bgLight[2], bgDark[2], colIntensity / 255)
	);

	if (my > dropsNum) {
		for (let i = dropsNum; i < my; i++) {
			drops.push(new Drop());
		}
		dropsNum = my;
	} else if (my < dropsNum) {
		for (let i = dropsNum; i > my; i--) {
			let idx = random(0, drops.length);
			drops.splice(idx, 1);
		}
		dropsNum = my;
	}

	stroke(
		lerp(dropLight[0], dropDark[0], colBlend),
		lerp(dropLight[1], dropDark[1], colBlend),
		lerp(dropLight[2], dropDark[2], colBlend)
	);
	strokeWeight(2);
	for (let drop of drops) {
		line(drop.x, drop.y, drop.x + mx, drop.y + drop.speed);

		drop.x += mx;
		drop.y += drop.speed;
		if (drop.y > height) {
			drop.reset();
		}
	}
}
