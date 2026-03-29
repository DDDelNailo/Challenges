class Cell {
    constructor(pos, radius, energy, hue) {
        this.pos = pos.copy();
        this.vel = p5.Vector.random2D().mult(random(0.4, 1.4));
        this.acc = createVector(0, 0);
        this.radius = radius ?? random(20, 34);
        this.energy = energy ?? random(45, 80);
        this.hue = hue ?? random(360);
        this.pulse = random(TWO_PI);
        this.age = 0;
    }

    update(nutrients) {
        this.age += 1;
        this.pulse += 0.03;

        const closest = this.findClosestNutrient(nutrients);
        if (closest) {
            this.seek(closest.pos, 0.08);
            const d = p5.Vector.dist(this.pos, closest.pos);
            if (d < this.radius + 5) {
                this.energy += closest.energy;
                resetNutrient(closest);
            }
        }

        const wander = p5.Vector.random2D().mult(0.05);
        this.applyForce(wander);

        this.vel.add(this.acc);
        this.vel.limit(map(this.radius, 8, 44, 2.7, 1.2));
        this.pos.add(this.vel);
        this.acc.mult(0);

        this.wrapAround();

        this.energy -= 0.09 + this.radius * 0.002;
        this.radius = constrain(this.radius + map(this.energy, 0, 150, -0.05, 0.045), 7, 46);
    }

    show() {
        const glowSize = this.radius * (1.8 + 0.08 * sin(this.pulse));
        const alpha = constrain(map(this.energy, 0, 140, 25, 95), 10, 95);

        noStroke();
        fill(this.hue, 55, 95, alpha * 0.25);
        circle(this.pos.x, this.pos.y, glowSize);

        fill(this.hue, 70, 90, alpha);
        circle(this.pos.x, this.pos.y, this.radius * 1.03);

        fill(this.hue, 30, 100, 85);
        circle(this.pos.x - this.radius * 0.18, this.pos.y - this.radius * 0.18, this.radius * 0.35);
    }

    canDivide() {
        return this.energy > SPLIT_ENERGY && this.radius > 14;
    }

    divide() {
        const childRadius = this.radius * 0.74;
        const childEnergy = this.energy * 0.48;
        const offset = p5.Vector.random2D().mult(childRadius * 0.65);

        const a = new Cell(p5.Vector.add(this.pos, offset), childRadius, childEnergy, (this.hue + random(-18, 18) + 360) % 360);
        const b = new Cell(p5.Vector.sub(this.pos, offset), childRadius, childEnergy, (this.hue + random(-18, 18) + 360) % 360);

        a.vel = this.vel.copy().rotate(random(-0.55, -0.2)).mult(1.15);
        b.vel = this.vel.copy().rotate(random(0.2, 0.55)).mult(1.15);

        return [a, b];
    }

    isDead() {
        return this.energy < -22 || this.radius <= 7.2;
    }

    containsPoint(x, y) {
        return dist(x, y, this.pos.x, this.pos.y) < this.radius;
    }

    seek(target, strength) {
        const desired = p5.Vector.sub(target, this.pos).setMag(1.8);
        const steer = p5.Vector.sub(desired, this.vel).limit(strength);
        this.applyForce(steer);
    }

    findClosestNutrient(nutrients) {
        let closest = null;
        let closestDist = Infinity;
        for (const nutrient of nutrients) {
            const d = p5.Vector.dist(this.pos, nutrient.pos);
            if (d < closestDist && d < 190) {
                closest = nutrient;
                closestDist = d;
            }
        }
        return closest;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    wrapAround() {
        if (this.pos.x < -this.radius) {
            this.pos.x = width + this.radius;
        } else if (this.pos.x > width + this.radius) {
            this.pos.x = -this.radius;
        }

        if (this.pos.y < -this.radius) {
            this.pos.y = height + this.radius;
        } else if (this.pos.y > height + this.radius) {
            this.pos.y = -this.radius;
        }
    }
}
