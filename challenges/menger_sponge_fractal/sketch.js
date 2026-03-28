let headerHeight = 0;
let angle = 0;
let cubes = [];

function V(x, y, z) {
	return createVector(x, y, z);
}

class Cube {
	constructor(pos, r) {
		this.pos = pos;
		this.r = r;
	}
}

function setup() {
	let header = document.querySelector("header");
	if (header) headerHeight = header.offsetHeight;

	const canvas = createCanvas(windowWidth, windowHeight - headerHeight, WEBGL);
	canvas.parent("canvas-container");
	cubes.push(new Cube(V(0, 0, 0), 300));

	noStroke();
	fill(255);
}

function draw() {
	background(0);

	lights();

	angle += 0.01;
	rotateX(angle);
	rotateY((angle * 7) / 10);
	rotateZ((angle * 3) / 10);

	for (let cube of cubes) {
		push();
		translate(cube.pos);
		box(cube.r);
		pop();
	}
}

function mouseClicked() {
	incdepth(1);
}

function windowResized() {
	let header = document.querySelector("header");
	if (header) headerHeight = header.offsetHeight;

	resizeCanvas(windowWidth, windowHeight - headerHeight);
}

function incdepth(depth) {
	for (let i = 0; i < depth; i++) {
		if (cubes.length == 8000) break;

		let newcubes = [];
		for (let cube of cubes) {
			let r = cube.r / 3;
			let xs = [cube.pos.x - r, cube.pos.x, cube.pos.x + r];
			let ys = [cube.pos.y - r, cube.pos.y, cube.pos.y + r];
			let zs = [cube.pos.z - r, cube.pos.z, cube.pos.z + r];

			for (let x of xs) {
				for (let y of ys) {
					for (let z of zs) {
						if (
							(x == cube.pos.x && y == cube.pos.y) ||
							(x == cube.pos.x && z == cube.pos.z) ||
							(y == cube.pos.y && z == cube.pos.z)
						)
							continue;
						newcubes.push(new Cube(V(x, y, z), r));
					}
				}
			}
		}
		cubes = newcubes;
		console.log("depth", depth, "cubes", cubes.length);
	}
}
