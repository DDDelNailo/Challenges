let bodies = [];
frameskip = 1;

function setup() {
	const canvas = createCanvas(600, 600);
	canvas.parent("canvas-container");

	background(0, 0, 0);

	sun = new StaticBody(createVector(width / 2, height / 2), 80, color(255, 204, 0));
	planet = new DynamicBody(createVector(width / 2 + 200, height / 2), 20, color(0, 102, 255));
	moon = new DynamicBody(createVector(width / 2 + 200 + 20, height / 2 + 40), 10, color(200));

	bodies.push(sun);
	bodies.push(planet);
	bodies.push(moon);

	planet.targets = [sun];
	planet.vel = createVector(-0.2, 2.8);

	moon.targets = [sun, planet];
	moon.vel = createVector(-0.32, 1.2);
}


function draw() {
	background(
		0,
		0,
		0
	);

	if (frameskip > 0) {
		for (let i = 0; i < frameskip; i++) {
			for (let body of bodies) {
				body.update();
			}
		}

		for (let body of bodies) {
			body.draw();
		}
	} else {
		for (let body of bodies) {
			body.update();
			body.draw();
		}
	}
}
