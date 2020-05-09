/**
 * Position on the board (immutable)
 */
export class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(pos) {
        return this.addXY(pos.x, pos.y);
    }
    addXY(x, y) {
        return new Pos(this.x + x, this.y + y);
    }
    /**
     *  Get the position moved one step in the specified direction
     *
     * If you are currently at (x, y) = (0, 0):
     * up    is  ( 0, -1)
     * down  is  ( 0,  1)
     * right is  ( 1,  0)
     * left  is  (-1,  0)
     * @param direction
     */
    addDirection(direction) {
        return this.add(Pos.createFromDirection(direction));
    }
    static createFromPos(pos) {
        return new Pos(pos.x, pos.y);
    }
    static createFromDirection(direction) {
        if (direction == Direction.up) {
            return new Pos(0, -1);
        }
        else if (direction == Direction.down) {
            return new Pos(0, 1);
        }
        else if (direction == Direction.right) {
            return new Pos(1, 0);
        }
        else if (direction == Direction.left) {
            return new Pos(-1, 0);
        }
        else if (direction == Direction.upRight) {
            return new Pos(1, -1);
        }
        else if (direction == Direction.upLeft) {
            return new Pos(-1, -1);
        }
        else if (direction == Direction.downRight) {
            return new Pos(1, 1);
        }
        else if (direction == Direction.downLeft) {
            return new Pos(-1, 1);
        }
        else {
            throw new Error('unknown direction');
        }
    }
}
/**
 * Position on the board (mutable)
 *
 * Use of pos class is recommended, but it is used when the processing speed and memory usage efficiency are required.
 */
export class PosMutable {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(pos) {
        return this.addXY(pos.x, pos.y);
    }
    addXY(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        return this;
    }
    addDirection(direction) {
        return this.add(Pos.createFromDirection(direction));
    }
    static createFromPos(pos) {
        return new PosMutable(pos.x, pos.y);
    }
}
export var Direction;
(function (Direction) {
    Direction[Direction["up"] = 0] = "up";
    Direction[Direction["down"] = 1] = "down";
    Direction[Direction["left"] = 2] = "left";
    Direction[Direction["right"] = 3] = "right";
    Direction[Direction["upLeft"] = 4] = "upLeft";
    Direction[Direction["upRight"] = 5] = "upRight";
    Direction[Direction["downLeft"] = 6] = "downLeft";
    Direction[Direction["downRight"] = 7] = "downRight";
})(Direction || (Direction = {}));
