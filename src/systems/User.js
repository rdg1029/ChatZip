const user = {
    data: {
        id: "",
        name: "",
    },
    state: {
        pos: [0, 0, 0],
        dir: [0, 0, 0],
        onGround: true,
        gravity: 3.2,
        gravAccel: 0,
        jumpHeight: 1,
    },
    colllision: {
        width: 4,
        height: 14,
        depth: 4,
    },
    update: function(delta) {
        if (this.state.onGround) {
            this.state.gravAccel = 0;
            return;
        }
        this.state.gravAccel -= this.state.gravity * delta;
        this.state.dir[1] += this.state.gravAccel;
    },
};

export {user};
