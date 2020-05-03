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
define("pos/pos", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 位置(不変)
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
    exports.Pos = Pos;
    /**
     * 位置
     */
    class PosMutable {
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
    exports.PosMutable = PosMutable;
    /**
     * 方向
     */
    var Direction;
    (function (Direction) {
        Direction[Direction["up"] = 0] = "up";
        Direction[Direction["down"] = 1] = "down";
        Direction[Direction["left"] = 2] = "left";
        Direction[Direction["right"] = 3] = "right";
        Direction[Direction["upLeft"] = 4] = "upLeft";
        Direction[Direction["upRight"] = 5] = "upRight";
        Direction[Direction["downLeft"] = 6] = "downLeft";
        Direction[Direction["downRight"] = 7] = "downRight";
    })(Direction = exports.Direction || (exports.Direction = {}));
});
define("board/board", ["require", "exports", "pos/pos"], function (require, exports, pos_1) {
    "use strict";
    var _poses, _boardCore;
    Object.defineProperty(exports, "__esModule", { value: true });
    class BoardCore {
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
            this.xSize = xSize;
            this.ySize = ySize;
            _poses.set(this, void 0);
            this.values = new Array(ySize).fill(null).map(_ => new Array(xSize).fill(null));
            __classPrivateFieldSet(this, _poses, new Array(ySize).fill(null).map((_, y) => new Array(xSize).fill(null).map((__, x) => new pos_1.Pos(x, y))));
        }
        forEach(callback) {
            for (var y = 0; y < this.ySize; y++) {
                for (var x = 0; x < this.xSize; x++) {
                    callback(__classPrivateFieldGet(this, _poses)[y][x], this.values[y][x]);
                }
            }
        }
        getValue(pos) {
            return this.getValueFromXY(pos.x, pos.y);
        }
        getValueFromXY(x, y) {
            if (x < 0 || y < 0) {
                return undefined;
            }
            if (this.values.length <= y || this.values[0].length <= x) {
                return undefined;
            }
            return this.values[y][x];
        }
        exists(pos) {
            return this.getValue(pos) !== null && this.getValue(pos) !== undefined;
        }
        some(check) {
            for (var y = 0; y < this.ySize; y++) {
                for (var x = 0; x < this.xSize; x++) {
                    if (check(__classPrivateFieldGet(this, _poses)[y][x], this.values[y][x])) {
                        return true; // 1つでも見つかったら即返す
                    }
                }
            }
            return false;
        }
        find(check) {
            for (var y = 0; y < this.ySize; y++) {
                for (var x = 0; x < this.xSize; x++) {
                    if (check(__classPrivateFieldGet(this, _poses)[y][x], this.values[y][x])) {
                        return {
                            pos: __classPrivateFieldGet(this, _poses)[y][x],
                            value: this.values[y][x]
                        }; // 1つでも見つかったら即返す
                    }
                }
            }
            return null;
        }
        getFromDrection(pos, direction) {
            var p = pos_1.Pos.createFromPos(pos).addDirection(direction);
            var v = this.getValue(p);
            if (v === undefined) {
                return undefined;
            }
            return {
                pos: p,
                value: v
            };
        }
        copy() {
            var result = new BoardCore(this.xSize, this.ySize);
            this.forEach((pos, v) => result.values[pos.y][pos.x] = v);
            return result;
        }
    }
    exports.BoardCore = BoardCore;
    _poses = new WeakMap();
    /**
     * 盤
     *
     * 2次元配列のラッパークラス
     * 空のセルにはnullが入っている
     *
     */
    class Board {
        constructor(boardCore, skipCopy = false) {
            _boardCore.set(this, void 0);
            __classPrivateFieldSet(this, _boardCore, skipCopy ? boardCore : boardCore.copy());
        }
        get xSize() { return __classPrivateFieldGet(this, _boardCore).xSize; }
        get ySize() { return __classPrivateFieldGet(this, _boardCore).ySize; }
        // これを隠蔽したい
        //get values(): (T | null)[][] { return this.#boardCore.values; }
        /**
         * 盤に駒を置く (イミュータブル)
         * 盤上のセルに駒をおきます。下記では3x3の盤上の`(x, y)=(2, 2)`に`"x"`という駒を置いています。
         * ```javascript
         * var board = new board2d.Board<string>(3, 3);
         * var newBoard = board.put(new board2d.Pos(2, 2), 'x'); // 駒を置く
         * console.log(board.getValue(new board2d.Pos(2, 2)));    // null(空)
         * console.log(newBoard.getValue(new board2d.Pos(2, 2))); // x
         * ```
         *
         * メソッドの戻り値は駒を置いた結果の盤です。元のインスタンスは変更されません。そのため上記の例の場合、`board変数`の状態は変化しません。また引数の`value`に`null`を指定した場合、そのセルは空になります。
         * @param pos
         * @param value
         */
        put(pos, value) {
            var newBoardCore = __classPrivateFieldGet(this, _boardCore).copy();
            newBoardCore.values[pos.y][pos.x] = value;
            return new Board(newBoardCore, true);
        }
        forEach(callback) {
            __classPrivateFieldGet(this, _boardCore).forEach(callback);
        }
        getValue(pos) {
            return __classPrivateFieldGet(this, _boardCore).getValue(pos);
        }
        getValueFromXY(x, y) {
            return __classPrivateFieldGet(this, _boardCore).getValueFromXY(x, y);
        }
        exists(pos) {
            return __classPrivateFieldGet(this, _boardCore).exists(pos);
        }
        copy() {
            return new Board(__classPrivateFieldGet(this, _boardCore).copy());
        }
        some(check) {
            return __classPrivateFieldGet(this, _boardCore).some(check);
        }
        find(check) {
            return __classPrivateFieldGet(this, _boardCore).find(check);
        }
        getFromDrection(pos, direction) {
            return __classPrivateFieldGet(this, _boardCore).getFromDrection(pos, direction);
        }
        toMutable() {
            return new BoardMutable(__classPrivateFieldGet(this, _boardCore));
        }
        static empty(xSize, ySize) {
            return new Board(new BoardCore(xSize, ySize), true);
        }
    }
    exports.Board = Board;
    _boardCore = new WeakMap();
    class BoardMutable {
        constructor(boardCore, skipCopy = false) {
            this.boardCore = skipCopy ? boardCore : boardCore.copy();
        }
        get xSize() { return this.boardCore.xSize; }
        get ySize() { return this.boardCore.ySize; }
        /**
         * 盤を更新する
         *
         * @param pos
         * @param value
         */
        put(pos, value) {
            this.boardCore.values[pos.y][pos.x] = value;
            return this;
        }
        forEach(callback) {
            this.boardCore.forEach(callback);
        }
        getValue(pos) {
            return this.boardCore.getValue(pos);
        }
        getValueFromXY(x, y) {
            return this.boardCore.getValueFromXY(x, y);
        }
        exists(pos) {
            return this.boardCore.exists(pos);
        }
        copy() {
            return new Board(this.boardCore.copy());
        }
        some(check) {
            return this.boardCore.some(check);
        }
        find(check) {
            return this.boardCore.find(check);
        }
        getFromDrection(pos, direction) {
            return this.boardCore.getFromDrection(pos, direction);
        }
        static empty(xSize, ySize) {
            return new BoardMutable(new BoardCore(xSize, ySize), true);
        }
        toImmutable() {
            return new Board(this.boardCore);
        }
    }
    exports.BoardMutable = BoardMutable;
});
define("index", ["require", "exports", "pos/pos", "board/board"], function (require, exports, pos_2, board_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 盤ライブラリ
     * バージョン: 3.4.0
     */
    exports.version = '3.4.0';
    __export(pos_2);
    __export(board_1);
});
