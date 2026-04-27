class Body {
    constructor(pos, size, color) {
        this.pos = pos;
        this.vel = createVector();
        this.size = size;
        this.color = color;
        this.targets = [null];
        this.trail = [];
    };

    orbit(target) {
        let dir = p5.Vector.sub(target.pos, this.pos);
        let distance = dir.mag();
        let strength = (target.size * 10) / (distance * distance);
        dir.setMag(strength);
        this.vel.add(dir);
    }

    update() {
        this.pos.add(this.vel);

        for (let target of this.targets) {
            if (target) {
                this.orbit(target);
            }
        }

        this.trail.push(this.pos.copy());
        if (this.trail.length > 100) {
            this.trail.shift();
        }
    }

    draw() {
        fill(this.color);
        noStroke();

        for (let i = 0; i < this.trail.length; i++) {
            let pos = this.trail[i];
            let percentage = i / this.trail.length;
            let alpha = percentage * 255;
            fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], alpha);
            ellipse(pos.x, pos.y, percentage * this.size);
        }

        ellipse(this.pos.x, this.pos.y, this.size);
    }
}
