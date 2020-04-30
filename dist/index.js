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
     * 位置
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
    board2d.Pos = Pos;
    /**
     * 盤
     *
     * 2次元配列のラッパークラス
     * 空のセルにはnullが入っている
     *
     */
    class Board {
        /**
         * 盤のサイズを指定してインスタンスを生成します。下記は3x3の盤を作っています。
         * ```javascript
         * var board = new board2d.Board<string>(3, 3);
         * ```
         *
         * @param xSize
         * @param ySize
         */
        constructor(xSize, ySize) {
            _xSize.set(this, void 0);
            _ySize.set(this, void 0);
            _values.set(this, void 0); // T or null
            __classPrivateFieldSet(this, _xSize, xSize);
            __classPrivateFieldSet(this, _ySize, ySize);
            __classPrivateFieldSet(this, _values, new Array(ySize).fill(null).map(v => new Array(xSize).fill(null))); // 3x3
        }
        /**
         * 盤のxサイズ
         */
        get xSize() { return __classPrivateFieldGet(this, _xSize); }
        /**
         * 盤のyサイズ
         */
        get ySize() { return __classPrivateFieldGet(this, _ySize); }
        get values() { return __classPrivateFieldGet(this, _values); }
        /**
         * 盤を更新する
         * @deprecated
         *
         * @param pos
         * @param value
         */
        put(pos, value) {
            __classPrivateFieldGet(this, _values)[pos.y][pos.x] = value;
            return this;
        }
        /**
         * 盤を更新する
         * @deprecated
         *
         * @param pos
         * @param value
         */
        putMutable(pos, value) {
            __classPrivateFieldGet(this, _values)[pos.y][pos.x] = value;
            return this;
        }
        /**
         * 盤に駒を置く (イミュータブル)
         * 盤上のセルに駒をおきます。下記では3x3の盤上の`(x, y)=(2, 2)`に`"x"`という駒を置いています。
         * ```javascript
         * var board = new board2d.Board<string>(3, 3);
         * var newBoard = board.putImmutable(new board2d.Pos(2, 2), 'x'); // 駒を置く
         * console.log(board.getValue(new board2d.Pos(2, 2)));    // null(空)
         * console.log(newBoard.getValue(new board2d.Pos(2, 2))); // x
         * ```
         *
         * メソッドの戻り値は駒を置いた結果の盤です。元のインスタンスは変更されません。そのため上記の例の場合、`board変数`の状態は変化しません。また引数の`value`に`null`を指定した場合、そのセルは空になります。
         * @param pos
         * @param value
         */
        putImmutable(pos, value) {
            var result = Board.create(this);
            __classPrivateFieldGet(result, _values)[pos.y][pos.x] = value;
            return result;
        }
        /**
         * callback関数を、盤上の各セルに対して一度ずつ実行する
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
         * 指定した位置にある駒を取得する
         *
         * 指定した位置が空の場合はnullを返す。盤の外側の場合はundefinedを返す。
         * ```javascript
         * var board = new board2d.Board<string>(2, 2).putImmutable(new board2d.Pos(1, 1), 'x');
         * var a = board.getValue(new board2d.Pos(1, 1)); // x
         * var b = board.getValue(new board2d.Pos(0, 0)); // null
         * var c = board.getValue(new board2d.Pos(-1, -1)); // undefined
         * ```
         *
         * @param pos
         * @return 空の場合はnullを返す。盤の外側の場合はundefinedを返す。
         */
        getValue(pos) {
            return this.getValueFromXY(pos.x, pos.y);
        }
        /**
         * 指定した位置にある駒を取得する
         *
         * 引数がx, yであること以外は、`getValue()`と同じ。
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
        /**
         * 指定した位置に駒があるかどうかを取得する
         *
         * 駒がある場合はtrueを返す。
         * 駒がない、または、位置が盤の外側の場合、falseを返す。
         * @param pos
         */
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
        /**
         * posからdirectionの方向に1歩進んだ場所を取得する
         * @param pos
         * @param direction
         */
        getFromDrection(pos, direction) {
            var p = pos.addDirection(direction);
            var v = this.getValue(p);
            if (v === undefined) {
                return undefined;
            }
            return {
                pos: p,
                value: v
            };
        }
        /**
         * イミュータブルに盤を作成する
         * @param board
         */
        static create(board) {
            var result = new Board(__classPrivateFieldGet(board, _xSize), __classPrivateFieldGet(board, _ySize));
            board.forEach((pos, v) => result.put(pos, v));
            return result;
        }
    }
    _xSize = new WeakMap(), _ySize = new WeakMap(), _values = new WeakMap();
    board2d.Board = Board;
    /**
     * 方向
     */
    let Direction;
    (function (Direction) {
        Direction[Direction["up"] = 0] = "up";
        Direction[Direction["down"] = 1] = "down";
        Direction[Direction["left"] = 2] = "left";
        Direction[Direction["right"] = 3] = "right";
        Direction[Direction["upLeft"] = 4] = "upLeft";
        Direction[Direction["upRight"] = 5] = "upRight";
        Direction[Direction["downLeft"] = 6] = "downLeft";
        Direction[Direction["downRight"] = 7] = "downRight";
    })(Direction = board2d.Direction || (board2d.Direction = {}));
})(board2d = exports.board2d || (exports.board2d = {}));
