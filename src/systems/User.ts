interface UserData {
    id: string;
    name: string;
}
interface UserState {
    pos: Array<number>;
    velocity: Array<number>;
    onGround: boolean;
    speed: number;
    jumpHeight: number;
    gravity: number;
    gravAccel: number;
}
interface UserCollision {
    width: number;
    height: number;
    depth: number;
}
interface User {
    data: UserData;
    state: UserState;
    collision: UserCollision;
}

const user: User = {
    data: {
        id: "",
        name: "",
    },
    state: {
        pos: [0, 0, 0],
        velocity: [0, 0, 0],
        onGround: false,
        speed: 25,
        jumpHeight: 60,
        gravity: 200,
        gravAccel: 0,
    },
    collision: {
        width: 4,
        height: 14,
        depth: 4,
    },
};

export {user, User, UserData, UserState, UserCollision};
