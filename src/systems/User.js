const user = {
    data: {
        id: "",
        name: "",
    },
    state: {
        pos: [0, 0, 0],
        velocity: [0, 0, 0],
        onGround: false,
        gravity: 3.2,
        gravAccel: 0,
        jumpHeight: 1,
    },
    colllision: {
        width: 4,
        height: 14,
        depth: 4,
    },
};

export {user};
