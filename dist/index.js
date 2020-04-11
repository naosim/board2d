"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
Object.defineProperty(exports, "__esModule", { value: true });
var board2d;
(function (board2d) {
    var _xSize, _ySize, _values;
    /**
     * 盤の位置
     */
    class Pos {
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
    }
    board2d.Pos = Pos;
    /**
     * 盤
     *
     * 2次元配列のラッパークラス
     * 空のセルにはnullが入っている
     *
     */
    class Board {
        constructor(xSize, ySize) {
            _xSize.set(this, void 0);
            _ySize.set(this, void 0);
            _values.set(this, void 0); // T or null
            __classPrivateFieldSet(this, _xSize, xSize);
            __classPrivateFieldSet(this, _ySize, ySize);
            __classPrivateFieldSet(this, _values, new Array(ySize).fill(null).map(v => new Array(xSize).fill(null))); // 3x3
        }
        get xSize() { return __classPrivateFieldGet(this, _xSize); }
        get ySize() { return __classPrivateFieldGet(this, _ySize); }
        get values() { return __classPrivateFieldGet(this, _values); }
        put(pos, value) {
            __classPrivateFieldGet(this, _values)[pos.y][pos.x] = value;
            return this;
        }
        /**
         * call関数を、配列の各要素に対して一度ずつ実行する
         * @param callback
         */
        forEach(callback) {
            for (var y = 0; y < __classPrivateFieldGet(this, _ySize); y++) {
                for (var x = 0; x < __classPrivateFieldGet(this, _xSize); x++) {
                    callback(new Pos(x, y), __classPrivateFieldGet(this, _values)[y][x]);
                }
            }
        }
        /**
         * 指定した位置にある要素を取得
         *
         * @param pos
         * @return 空の場合はnullを返す。盤の外側の場合、undefinedを返す。
         */
        getValue(pos) {
            return this.getValueFromXY(pos.x, pos.y);
        }
        /**
         * 指定した位置にある要素を取得
         * @param x
         * @param y
         * @return 空の場合はnullを返す。盤の外側の場合、undefinedを返す。
         */
        getValueFromXY(x, y) {
            if (x < 0 || y < 0) {
                return undefined;
            }
            if (__classPrivateFieldGet(this, _values).length <= y || __classPrivateFieldGet(this, _values)[0].length <= x) {
                return undefined;
            }
            return __classPrivateFieldGet(this, _values)[y][x];
        }
        exists(pos) {
            return this.getValue(pos) !== null && this.getValue(pos) !== undefined;
        }
        copy() {
            var result = new Board(__classPrivateFieldGet(this, _xSize), __classPrivateFieldGet(this, _ySize));
            this.forEach((pos, v) => result.put(pos, v));
            return result;
        }
        some(check) {
            for (var y = 0; y < __classPrivateFieldGet(this, _ySize); y++) {
                for (var x = 0; x < __classPrivateFieldGet(this, _xSize); x++) {
                    if (check(new Pos(x, y), __classPrivateFieldGet(this, _values)[y][x])) {
                        return true; // 1つでも見つかったら即返す
                    }
                }
            }
            return false;
        }
        find(check) {
            for (var y = 0; y < __classPrivateFieldGet(this, _ySize); y++) {
                for (var x = 0; x < __classPrivateFieldGet(this, _xSize); x++) {
                    if (check(new Pos(x, y), __classPrivateFieldGet(this, _values)[y][x])) {
                        return {
                            pos: new Pos(x, y),
                            value: __classPrivateFieldGet(this, _values)[y][x]
                        }; // 1つでも見つかったら即返す
                    }
                }
            }
            return null;
        }
        getFromDrection(pos, direction) {
            var p;
            if (direction == Direction.up) {
                p = pos.addXY(0, -1);
            }
            else if (direction == Direction.down) {
                p = pos.addXY(0, 1);
            }
            else if (direction == Direction.right) {
                p = pos.addXY(1, 0);
            }
            else if (direction == Direction.left) {
                p = pos.addXY(-0, 0);
            }
            else {
                throw new Error('unknown direction');
            }
            var v = this.getValue(p);
            if (v === undefined) {
                return undefined;
            }
            return {
                pos: p,
                value: v
            };
        }
        static create(board) {
            var result = new Board(__classPrivateFieldGet(board, _xSize), __classPrivateFieldGet(board, _ySize));
            board.forEach((pos, v) => result.put(pos, v));
            return result;
        }
    }
    _xSize = new WeakMap(), _ySize = new WeakMap(), _values = new WeakMap();
    board2d.Board = Board;
    let Direction;
    (function (Direction) {
        Direction[Direction["up"] = 0] = "up";
        Direction[Direction["down"] = 1] = "down";
        Direction[Direction["left"] = 2] = "left";
        Direction[Direction["right"] = 3] = "right";
    })(Direction = board2d.Direction || (board2d.Direction = {}));
})(board2d = exports.board2d || (exports.board2d = {}));
