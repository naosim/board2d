/**
 * @ignore
 */
declare const XNominality: unique symbol;
/**
 * Number type extension
 */
export declare type X = number & {
    [XNominality]: never;
};
/**
 * @ignore
 */
declare const YNominality: unique symbol;
/**
 * Number type extension
 */
export declare type Y = number & {
    [YNominality]: never;
};
/**
 * Position on the board
 */
export interface PosReadable {
    readonly x: X;
    readonly y: Y;
}
/**
 * Position on the board (immutable)
 */
export declare class Pos implements PosReadable {
    readonly x: X;
    readonly y: Y;
    constructor(x: X, y: Y);
    add(pos: PosReadable): Pos;
    addXY(x: X, y: Y): Pos;
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
    addDirection(direction: Direction): Pos;
    static createFromPos(pos: PosReadable): Pos;
    static createFromDirection(direction: Direction): Pos;
}
/**
 * Position on the board (mutable)
 *
 * Use of pos class is recommended, but it is used when the processing speed and memory usage efficiency are required.
 */
export declare class PosMutable implements PosReadable {
    x: X;
    y: Y;
    constructor(x: X, y: Y);
    add(pos: PosReadable): PosMutable;
    addXY(x: X, y: Y): PosMutable;
    addDirection(direction: Direction): PosMutable;
    static createFromPos(pos: PosReadable): PosMutable;
}
export declare enum Direction {
    up = 0,
    down = 1,
    left = 2,
    right = 3,
    upLeft = 4,
    upRight = 5,
    downLeft = 6,
    downRight = 7
}
export {};
