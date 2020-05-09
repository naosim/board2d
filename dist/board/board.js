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
var _poses, _boardCore;
import { Pos } from '../pos/pos';
export class BoardCore {
    /**
     * Create with board size.
     */
    constructor(xSize, ySize) {
        this.xSize = xSize;
        this.ySize = ySize;
        _poses.set(this, void 0);
        this.values = new Array(ySize).fill(null).map(_ => new Array(xSize).fill(null));
        __classPrivateFieldSet(this, _poses, new Array(ySize).fill(null).map((_, y) => new Array(xSize).fill(null).map((__, x) => new Pos(x, y))));
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
    /**
     * @deprecated
     * @ignore
     */
    getValueFromXY(x, y) {
        return this.getValueWithXY(x, y);
    }
    getValueWithXY(x, y) {
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
                    return true;
                }
            }
        }
        return false;
    }
    find(check) {
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                if (check(__classPrivateFieldGet(this, _poses)[y][x], this.values[y][x])) {
                    return { pos: __classPrivateFieldGet(this, _poses)[y][x], value: this.values[y][x] };
                }
            }
        }
        return null;
    }
    findAll(check) {
        var result = [];
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                if (check(__classPrivateFieldGet(this, _poses)[y][x], this.values[y][x])) {
                    result.push({
                        pos: __classPrivateFieldGet(this, _poses)[y][x],
                        value: this.values[y][x]
                    });
                }
            }
        }
        return result;
    }
    /**
     * @deprecated
     * @ignore
     */
    getFromDrection(pos, direction) {
        return this.getValueWithDirection(pos, direction);
    }
    getValueWithDirection(pos, direction) {
        var p = Pos.createFromPos(pos).addDirection(direction);
        var v = this.getValue(p);
        if (v === undefined) {
            return undefined;
        }
        return {
            pos: p,
            value: v
        };
    }
    indexToPos(index) {
        if (index < 0 || index >= this.xSize * this.ySize) {
            throw new Error('out of index');
        }
        return new Pos(index % this.xSize, Math.floor(index / this.xSize));
    }
    posToIndex(pos) {
        if (pos.x < 0 || pos.x >= this.xSize || pos.y < 0 || pos.y >= this.ySize) {
            throw new Error('out of index');
        }
        return pos.y * this.xSize + pos.x;
    }
    copy() {
        var result = new BoardCore(this.xSize, this.ySize);
        this.forEach((pos, v) => result.values[pos.y][pos.x] = v);
        return result;
    }
}
_poses = new WeakMap();
/**
 * Two-dimensional board
 */
export class Board {
    constructor(boardCore, skipCopy = false) {
        _boardCore.set(this, void 0);
        __classPrivateFieldSet(this, _boardCore, skipCopy ? boardCore : boardCore.copy());
    }
    get xSize() { return __classPrivateFieldGet(this, _boardCore).xSize; }
    get ySize() { return __classPrivateFieldGet(this, _boardCore).ySize; }
    /**
     * Two-dimensional array as raw data on the board
     *
     * @return Return a copy. Updating the returned value does not affect the board.
     */
    get values() { return __classPrivateFieldGet(this, _boardCore).copy().values; }
    /**
     * Put pieces on the board (immutable)
     */
    put(pos, value) {
        var newBoardCore = __classPrivateFieldGet(this, _boardCore).copy();
        newBoardCore.values[pos.y][pos.x] = value;
        return new Board(newBoardCore, true);
    }
    /**
     * @deprecated
     * @ignore
     */
    putFromXY(x, y, value) {
        return this.put(new Pos(x, y), value);
    }
    putWithXY(x, y, value) {
        return this.put(new Pos(x, y), value);
    }
    forEach(callback) {
        __classPrivateFieldGet(this, _boardCore).forEach(callback);
    }
    getValue(pos) {
        return __classPrivateFieldGet(this, _boardCore).getValue(pos);
    }
    /**
     * @deprecated
     * @ignore
     */
    getValueFromXY(x, y) {
        return __classPrivateFieldGet(this, _boardCore).getValueWithXY(x, y);
    }
    getValueWithXY(x, y) {
        return __classPrivateFieldGet(this, _boardCore).getValueWithXY(x, y);
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
    findAll(check) {
        return __classPrivateFieldGet(this, _boardCore).findAll(check);
    }
    /**
     * @deprecated
     * @ignore
     */
    getFromDrection(pos, direction) {
        return __classPrivateFieldGet(this, _boardCore).getValueWithDirection(pos, direction);
    }
    getValueWithDirection(pos, direction) {
        return __classPrivateFieldGet(this, _boardCore).getValueWithDirection(pos, direction);
    }
    indexToPos(index) {
        return __classPrivateFieldGet(this, _boardCore).indexToPos(index);
    }
    posToIndex(pos) {
        return __classPrivateFieldGet(this, _boardCore).posToIndex(pos);
    }
    toMutable() {
        return new BoardMutable(__classPrivateFieldGet(this, _boardCore));
    }
    static empty(xSize, ySize) {
        return new Board(new BoardCore(xSize, ySize), true);
    }
}
_boardCore = new WeakMap();
/**
 * Use of Board class is recommended, but it is used when the processing speed and memory usage efficiency are required.
 */
export class BoardMutable {
    constructor(boardCore, skipCopy = false) {
        this.boardCore = skipCopy ? boardCore : boardCore.copy();
    }
    get xSize() { return this.boardCore.xSize; }
    get ySize() { return this.boardCore.ySize; }
    /**
     * Put pieces on the board (mutable)
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
    /**
     * @deprecated
     * @ignore
     */
    getValueFromXY(x, y) {
        return this.boardCore.getValueWithXY(x, y);
    }
    getValueWithXY(x, y) {
        return this.boardCore.getValueWithXY(x, y);
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
    findAll(check) {
        return this.boardCore.findAll(check);
    }
    /**
     * @deprecated
     * @ignore
     */
    getFromDrection(pos, direction) {
        return this.boardCore.getValueWithDirection(pos, direction);
    }
    getValueWithDirection(pos, direction) {
        return this.boardCore.getValueWithDirection(pos, direction);
    }
    indexToPos(index) {
        return this.boardCore.indexToPos(index);
    }
    posToIndex(pos) {
        return this.boardCore.posToIndex(pos);
    }
    static empty(xSize, ySize) {
        return new BoardMutable(new BoardCore(xSize, ySize), true);
    }
    toImmutable() {
        return new Board(this.boardCore);
    }
}
