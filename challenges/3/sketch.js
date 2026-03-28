let snake = null;
let gridSize = 16;
let boxSize = 0;
let apple = null;
let state = "paused";
let score = null;
let highScore = localStorage.getItem("ch3_highscore") || 0;

class Apple {
	constructor() {
		let x = -1;
		let y = -1;
		this.reset();
	}

	reset() {
		while (true) {
			let x = floor(random(0, gridSize));
			let y = floor(random(0, gridSize));
			let pos = createVector(x, y);

			if (snake.hits(pos)) {
				continue;
			}

			this.x = x;
			this.y = y;
			break;
		}
	}
}

class Snake {
	constructor() {
		this.body = [];
		this.body.push(createVector(1, 1));
		this.body.push(createVector(2, 1));
		this.body.push(createVector(3, 1));

		this.dir = createVector(1, 0);
		this.changedDir = false;
	}

	getNewPos() {
		let head = this.body[this.body.length - 1];
		let newPos = createVector(head.x + this.dir.x, head.y + this.dir.y);

		if (newPos.x < 0) {
			newPos.x = gridSize - 1;
		} else if (newPos.x >= gridSize) {
			newPos.x = 0;
		}

		if (newPos.y < 0) {
			newPos.y = gridSize - 1;
		} else if (newPos.y >= gridSize) {
			newPos.y = 0;
		}

		return newPos;
	}

	hits(pos) {
		for (let block of snake.body) {
			if (block.toString() == pos.toString()) {
				return true;
			}
		}
		return false;
	}

	hitsNext(pos) {
		let first = true;
		for (let block of snake.body) {
			if (block.toString() == pos.toString()) {
				return !first;
			}
			first = false;
		}
		return false;
	}

	update() {
		let newPos = this.getNewPos();

		if (this.hitsNext(newPos)) {
			state = "lost";
			if (score > highScore) {
				highScore = score;
				localStorage.setItem("ch3_highscore", highScore);
			}
		}

		if (newPos.x == apple.x && newPos.y == apple.y) {
			apple = null;
			this.body.push(newPos);
			apple = new Apple();
			score += 1;
		}

		this.body.push(newPos);
		this.body.shift();
		this.changedDir = false;
	}
}

function setup() {
	const canvas = createCanvas(600, 600);
	canvas.parent("canvas-container");
	frameRate(10);
	boxSize = width / gridSize;

	snake = new Snake();
	apple = new Apple();
	score = 0;
}

function update() {
	switch (state) {
		case "paused":
			fill(255);
			textSize(15);
			textAlign(CENTER, CENTER);
			text("Paused. Press space to play.", width / 2, height / 2);
			text(
				"Current Score: " + score + " | High Score: " + highScore,
				width / 2,
				height / 2 + 20
			);
			break;

		case "playing":
			snake.update();
			break;

		case "won":
			fill(0, 255, 0);
			textSize(15);
			textAlign(CENTER, CENTER);
			text("You won! Press space to play again.", width / 2, height / 2);
			fill(255);
			text(
				"Current Score: " + score + " | High Score: " + highScore,
				width / 2,
				height / 2 + 20
			);
			break;

		case "lost":
			fill(255, 0, 0);
			textSize(15);
			textAlign(CENTER, CENTER);
			text(
				"You lost... Press space to play again.",
				width / 2,
				height / 2
			);
			fill(255);
			text(
				"Current Score: " + score + " | High Score: " + highScore,
				width / 2,
				height / 2 + 20
			);
			break;

		default:
			break;
	}
}

function keyPressed() {
	if (key == " ") {
		switch (state) {
			case "paused":
				state = "playing";
				break;
			case "playing":
				state = "paused";
				break;
			case "won":
				setup();
				state = "playing";
				break;
			case "lost":
				setup();
				state = "playing";
				break;

			default:
				break;
		}
	}

	if (snake.changedDir || state != "playing") return;

	let newDir = null;

	switch (key) {
		case "w":
			newDir = createVector(0, -1);
			break;
		case "a":
			newDir = createVector(-1, 0);
			break;
		case "s":
			newDir = createVector(0, 1);
			break;
		case "d":
			newDir = createVector(1, 0);
			break;
	}

	if (newDir != null) {
		if (
			[snake.dir.x + newDir.x, snake.dir.y + newDir.y].toString() !=
			[0, 0].toString()
		) {
			snake.dir = newDir;
			snake.changedDir = true;
		}
	}
}

function draw() {
	background(0);
	update();

	if (state != "playing") {
		return;
	}
	stroke(0);
	let last = null;
	let i = 1;
	let c = 0;
	for (const block of snake.body) {
		let offset = 0;
		let size = 0;
		if (block.toString() == last) {
			offset = 0;
			size = boxSize;
		} else {
			offset = (boxSize * 1) / 8;
			size = (boxSize * 6) / 8;
			c += 1;
		}

		if (i == snake.body.length) {
			fill(0, 0, 255);
		} else {
			fill(255);
		}

		square(block.x * boxSize + offset, block.y * boxSize + offset, size);
		last = block.toString();
		i += 1;
	}

	if (c == gridSize * gridSize - 1) {
		state = "won";
	}

	offset = (boxSize * 2) / 8;
	fill(255, 0, 0);
	square(
		apple.x * boxSize + offset,
		apple.y * boxSize + offset,
		(boxSize * 4) / 8
	);

	fill(255);
	stroke(0);
	textSize(15);
	textAlign(LEFT, TOP);
	text("Score: " + score, 10, 10);
}
