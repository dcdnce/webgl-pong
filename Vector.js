export class Vec3 {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    toArray() {
        return [this.x, this.y, this.z];
    }
}

export class Vec2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    toArray() {
        return [this.x, this.y];
    }
}