const user = {
    data: {
        id: "",
        name: "",
    },
    state: {
        pos: [0, 0, 0],
        dir: [0, 0, 0],
        onGround: false,
        gravity: 2,
        gravAccel: 0,
        jumpHeight: 0.5,
    },
    colllision: {
        width: 4,
        height: 14,
        depth: 4,
    },
    update: function(delta) {
        this.state.gravAccel -= this.state.gravity * delta;
        this.state.pos[1] += this.state.gravAccel;
        if (this.state.pos[1] > 0) return;
        this.state.pos[1] = 0;
        this.state.onGround = true;
    },
};

export {user};
