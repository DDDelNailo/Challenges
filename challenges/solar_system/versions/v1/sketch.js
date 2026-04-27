let bodies = [];

function setup() {
	const canvas = createCanvas(600, 600);
	canvas.parent("canvas-container");

	background(0, 0, 0);

	sun = new Body(createVector(width / 2, height / 2), 80, color(255, 204, 0));
	planet = new Body(createVector(width / 2 + 200, height / 2), 20, color(0, 102, 255));
	moon = new Body(createVector(width / 2 + 200 + 30, height / 2), 10, color(200));

	bodies.push(sun);
	bodies.push(planet);
	bodies.push(moon);

	planet.targets = [sun];
	planet.vel = createVector(-0.2, 2);

	moon.targets = [sun, planet];
	moon.vel = createVector(-0.8, -0.5);
}


function draw() {
	background(
		0,
		0,
		0
	);

	for (let body of bodies) {
		body.update();
		body.draw();
	}
}
