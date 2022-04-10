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

function goToSpawn(spawnPoint: number[]) {
    user.state.gravAccel = 0;
    const userPos = user.state.pos;
    userPos[0] = spawnPoint[0];
    userPos[1] = spawnPoint[1];
    userPos[2] = spawnPoint[2];
}

export {user, goToSpawn, User, UserData, UserState, UserCollision};
