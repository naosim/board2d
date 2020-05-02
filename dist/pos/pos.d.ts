/**
 * @ignore
 */
declare const XNominality: unique symbol;
/**
 * X座標
 * number型の拡張
 */
export declare type X = number & {
    [XNominality]: never;
};
/**
 * @ignore
 */
declare const YNominality: unique symbol;
/**
 * Y座標
 * number型の拡張
 */
export declare type Y = number & {
    [YNominality]: never;
};
/**
 * 位置
 */
export interface PosReadable {
    readonly x: X;
    readonly y: Y;
}
/**
 * 位置(不変)
 */
export declare class Pos implements PosReadable {
    readonly x: X;
    readonly y: Y;
    constructor(x: X, y: Y);
    add(pos: PosReadable): Pos;
    addXY(x: X, y: Y): Pos;
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
    addDirection(direction: Direction): Pos;
    static createFromPos(pos: PosReadable): Pos;
    static createFromDirection(direction: Direction): Pos;
}
/**
 * 位置
 */
export declare class PosMutable implements PosReadable {
    x: X;
    y: Y;
    constructor(x: X, y: Y);
    add(pos: PosReadable): PosMutable;
    addXY(x: X, y: Y): PosMutable;
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
    addDirection(direction: Direction): PosMutable;
    static createFromPos(pos: PosReadable): PosMutable;
}
/**
 * 方向
 */
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
