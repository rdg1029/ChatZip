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
        let {pos, onGround, gravity, gravAccel} = this.state;
        if (onGround) return;
        gravAccel -= gravity * delta;
        pos[1] += gravAccel;
    },
};

export {user};
