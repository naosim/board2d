import { X, Y, Pos, PosReadable, Direction } from '../pos/pos';
/**
 * @ignore
 */
declare const SkipCopyNominality: unique symbol;
/**
 * Whether to omit the copy
 *
 * Boolean type extension
 */
export declare type SkipCopy = boolean & {
    [SkipCopyNominality]: never;
};
export interface BoardReadable<T> {
    readonly xSize: number;
    readonly ySize: number;
    /**
     * executes a provided function once for each positions on the board.
     * @param callback
     */
    forEach(callback: (pos: Pos, value: T | null) => void): void;
    /**
     * Get the piece at the specified position
     *
     * @param pos
     * @return Returns null if the specified position is empty. Returns undefined if outside the board.
     */
    getValue(pos: PosReadable): T | null | undefined;
    /**
     * @deprecated
     * @ignore
     */
    getValueFromXY(x: X, y: Y): T | null | undefined;
    getValueWithXY(x: X, y: Y): T | null | undefined;
    /**
     * whether there is a piece at the specified position
     *
     * @return Returns true if there is a piece. Returns false if there is no a piece or the position is outside of the board.
     * @param pos
     */
    exists(pos: PosReadable): boolean;
    /**
     * Tests whether at least one piece in the board passes the test implemented by the provided check function. It returns a Boolean value.
     * @param check
     */
    some(check: (pos: Pos, value: T | null) => boolean): boolean;
    find(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null> | null;
    findAll(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null>[];
    /**
     * @deprecated
     * @ignore
     */
    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    /**
     * Get a piece that is one step ahead in the direction from position.
     * @param pos
     * @param direction
     * @return Returns true if there is a piece. Returns false if there is no a piece or the position is outside of the board.
     */
    getValueWithDirection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    indexToPos(index: number): Pos;
    posToIndex(pos: PosReadable): number;
}
export declare class BoardCore<T> implements BoardReadable<T> {
    #private;
    readonly xSize: number;
    readonly ySize: number;
    readonly values: (T | null)[][];
    /**
     * Create with board size.
     */
    constructor(xSize: number, ySize: number);
    forEach(callback: (pos: Pos, value: T | null) => void): void;
    getValue(pos: PosReadable): T | null | undefined;
    /**
     * @deprecated
     * @ignore
     */
    getValueFromXY(x: X, y: Y): T | null | undefined;
    getValueWithXY(x: X, y: Y): T | null | undefined;
    exists(pos: PosReadable): boolean;
    some(check: (pos: Pos, value: T | null) => boolean): boolean;
    find(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null> | null;
    findAll(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null>[];
    /**
     * @deprecated
     * @ignore
     */
    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    getValueWithDirection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    indexToPos(index: number): Pos;
    posToIndex(pos: PosReadable): number;
    copy(): BoardCore<T>;
}
/**
 * Two-dimensional board
 */
export declare class Board<T> implements BoardReadable<T> {
    #private;
    constructor(boardCore: BoardCore<T>, skipCopy?: SkipCopy);
    get xSize(): number;
    get ySize(): number;
    /**
     * Two-dimensional array as raw data on the board
     *
     * @return Return a copy. Updating the returned value does not affect the board.
     */
    get values(): (T | null)[][];
    /**
     * Put pieces on the board (immutable)
     */
    put(pos: PosReadable, value: T | null): Board<T>;
    /**
     * @deprecated
     * @ignore
     */
    putFromXY(x: X, y: Y, value: T | null): Board<T>;
    putWithXY(x: X, y: Y, value: T | null): Board<T>;
    forEach(callback: (pos: Pos, value: T | null) => void): void;
    getValue(pos: PosReadable): T | null | undefined;
    /**
     * @deprecated
     * @ignore
     */
    getValueFromXY(x: X, y: Y): T | null | undefined;
    getValueWithXY(x: X, y: Y): T | null | undefined;
    exists(pos: PosReadable): boolean;
    copy(): Board<T>;
    some(check: (pos: Pos, value: T | null) => boolean): boolean;
    find(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null> | null;
    findAll(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null>[];
    /**
     * @deprecated
     * @ignore
     */
    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    getValueWithDirection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    indexToPos(index: number): Pos;
    posToIndex(pos: PosReadable): number;
    toMutable(): BoardMutable<T>;
    static empty<T>(xSize: number, ySize: number): Board<T>;
}
/**
 * Use of Board class is recommended, but it is used when the processing speed and memory usage efficiency are required.
 */
export declare class BoardMutable<T> implements BoardReadable<T> {
    boardCore: BoardCore<T>;
    constructor(boardCore: BoardCore<T>, skipCopy?: SkipCopy);
    get xSize(): number;
    get ySize(): number;
    /**
     * Put pieces on the board (mutable)
     */
    put(pos: PosReadable, value: T | null): BoardMutable<T>;
    forEach(callback: (pos: Pos, value: T | null) => void): void;
    getValue(pos: PosReadable): T | null | undefined;
    /**
     * @deprecated
     * @ignore
     */
    getValueFromXY(x: X, y: Y): T | null | undefined;
    getValueWithXY(x: X, y: Y): T | null | undefined;
    exists(pos: PosReadable): boolean;
    copy(): Board<T>;
    some(check: (pos: Pos, value: T | null) => boolean): boolean;
    find(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null> | null;
    findAll(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null>[];
    /**
     * @deprecated
     * @ignore
     */
    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    getValueWithDirection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    indexToPos(index: number): Pos;
    posToIndex(pos: PosReadable): number;
    static empty<T>(xSize: number, ySize: number): BoardMutable<T>;
    toImmutable(): Board<T>;
}
export declare type ValueAndPos<T> = {
    readonly pos: Pos;
    readonly value: T;
};
export {};
