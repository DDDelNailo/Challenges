class Cell {
    constructor(pos, size) {
        this.pos = pos;
        this.vel = createVector();
        this.size = size;
        this.target = random(this.size + 10, this.size + 50);
    };

    update() {
        this.pos.add(this.vel);
        this.size += random(0.01, 0.1);

        this.vel.mult(0.99);
        if (this.vel.mag() <= 0.1) {
            this.vel = p5.Vector.random2D().mult(random(0, 1));
        }

        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x *= -1;
        }
        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y *= -1;
        }

        if (this.size > this.target) {
            this.size /= 2;
            cells.push(new Cell(this.pos.copy(), this.size));
            this.target = random(this.size + 10, this.size + 50);
        }
    }

    draw() {
        fill(lerp(0, 255, this.size / this.target), lerp(255, 0, this.size / this.target), 0);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.size);
    }
}
