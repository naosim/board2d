/**
 * 位置(不変)
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
     * 方向を加えた位置を取得する
     *
     * 現在(x, y) = (0, 0)にいる場合
     * up なら    ( 0, -1)
     * down なら  ( 0,  1)
     * right なら ( 1,  0)
     * left なら  (-1,  0)
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
 * 位置
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
    /**
     * 方向を加えた位置を取得する
     *
     * 現在(x, y) = (0, 0)にいる場合
     * up なら    ( 0, -1)
     * down なら  ( 0,  1)
     * right なら ( 1,  0)
     * left なら  (-1,  0)
     * @param direction
     */
    addDirection(direction) {
        return this.add(Pos.createFromDirection(direction));
    }
    static createFromPos(pos) {
        return new PosMutable(pos.x, pos.y);
    }
}
/**
 * 方向
 */
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
