class StaticBody {
    constructor(pos, size, color) {
        this.pos = pos;
        this.size = size;
        this.color = color;
    };

    update() {
    }

    draw() {
        fill(this.color);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.size);
    }
}
