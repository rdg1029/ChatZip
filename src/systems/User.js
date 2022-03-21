const user = {
    data: {
        id: "",
        name: "",
    },
    state: {
        pos: [0, 0, 0],
        onGround: false,
        gravity: 1,
        gravAccel: 0,
        jumpHeight: 1,
    },
    colllision: {
        width: 4,
        height: 14,
        depth: 4,
    },
    update: function(delta) {
        this.state.gravAccel -= this.state.gravity * delta;
        if (this.state.pos[1] > 0) return;
        this.state.pos[1] = 0;
        this.state.onGround = true;
    },
};

export {user};
