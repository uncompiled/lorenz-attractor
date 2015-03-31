var Vector = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

Vector.prototype = {
    add: function (v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    },
    invert: function () {
        return new Vector(-this.x, -this.y, -this.z);
    },
    scale: function (s) {
        return new Vector(this.x * s, this.y * s, this.z * s);
    },
    subtract: function (v) {
        return this.add(v.invert());
    },
    dot: function (v) {
        return this.x * v.x + this.y * v.y + this.z + v.z;
    },
    rk4: function (h, fn) {
        // perform a step of rk4 using the given step size and function
        var k1 = fn(this).scale(h),
            k2 = fn(this.add(k1.scale(0.5))).scale(h),
            k3 = fn(this.add(k2.scale(0.5))).scale(h),
            k4 = fn(this.add(k3)).scale(h);
        return this.add((k1.add(k2.scale(2)).add(k3.scale(2)).add(k4)).scale(1 / 6));
    },
    toString: function () {
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    }
};