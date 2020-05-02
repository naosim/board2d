import { X, Y, Pos, PosReadable, Direction } from '../pos/pos';
/**
 * @ignore
 */
declare const SkipCopyNominality: unique symbol;
/**
 * コピーを省略するフラグ
 * boolean型の拡張
 */
export declare type SkipCopy = boolean & {
    [SkipCopyNominality]: never;
};
export interface BoardReadable<T> {
    readonly xSize: number;
    readonly ySize: number;
    /**
     * callback関数を、盤上の各セルに対して一度ずつ実行する
     * @param callback
     */
    forEach(callback: (pos: Pos, value: T | null) => void): void;
    /**
     * 指定した位置にある駒を取得する
     *
     * 指定した位置が空の場合はnullを返す。盤の外側の場合はundefinedを返す。
     * ```javascript
     * var board = new board2d.Board<string>(2, 2).put(new board2d.Pos(1, 1), 'x');
     * var a = board.getValue(new board2d.Pos(1, 1)); // 'x'
     * var b = board.getValue(new board2d.Pos(0, 0)); // null
     * var c = board.getValue(new board2d.Pos(-1, -1)); // undefined
     * ```
     *
     * @param pos
     * @return 空の場合はnullを返す。盤の外側の場合はundefinedを返す。
     */
    getValue(pos: PosReadable): T | null | undefined;
    /**
     * 指定した位置にある駒を取得する
     *
     * 引数がx, yであること以外は、`getValue()`と同じ。
     * @param x
     * @param y
     * @return 空の場合はnullを返す。盤の外側の場合、undefinedを返す。
     */
    getValueFromXY(x: X, y: Y): T | null | undefined;
    /**
     * 指定した位置に駒があるかどうかを取得する
     *
     * 駒がある場合はtrueを返す。
     * 駒がない、または、位置が盤の外側の場合、falseを返す。
     * @param pos
     */
    exists(pos: PosReadable): boolean;
    some(check: (pos: Pos, value: T | null) => boolean): boolean;
    find(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null> | null;
    /**
     * posからdirectionの方向に1歩進んだ場所を取得する
     * @param pos
     * @param direction
     */
    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
}
export declare class BoardCore<T> implements BoardReadable<T> {
    #private;
    readonly xSize: number;
    readonly ySize: number;
    readonly values: (T | null)[][];
    /**
     * 盤のサイズを指定してインスタンスを生成します。下記は3x3の盤を作っています。
     * ```javascript
     * var board = new board2d.Board<string>(3, 3);
     * ```
     *
     * @param xSize
     * @param ySize
     */
    constructor(xSize: number, ySize: number);
    forEach(callback: (pos: Pos, value: T | null) => void): void;
    getValue(pos: PosReadable): T | null | undefined;
    getValueFromXY(x: X, y: Y): T | null | undefined;
    exists(pos: PosReadable): boolean;
    some(check: (pos: Pos, value: T | null) => boolean): boolean;
    find(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null> | null;
    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    copy(): BoardCore<T>;
}
/**
 * 盤
 *
 * 2次元配列のラッパークラス
 * 空のセルにはnullが入っている
 *
 */
export declare class Board<T> implements BoardReadable<T> {
    #private;
    constructor(boardCore: BoardCore<T>, skipCopy?: SkipCopy);
    get xSize(): number;
    get ySize(): number;
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
    put(pos: PosReadable, value: T | null): Board<T>;
    forEach(callback: (pos: Pos, value: T | null) => void): void;
    getValue(pos: PosReadable): T | null | undefined;
    getValueFromXY(x: X, y: Y): T | null | undefined;
    exists(pos: PosReadable): boolean;
    copy(): Board<T>;
    some(check: (pos: Pos, value: T | null) => boolean): boolean;
    find(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null> | null;
    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    toMutable(): BoardMutable<T>;
    static empty<T>(xSize: number, ySize: number): Board<T>;
}
export declare class BoardMutable<T> implements BoardReadable<T> {
    boardCore: BoardCore<T>;
    constructor(boardCore: BoardCore<T>, skipCopy?: SkipCopy);
    get xSize(): number;
    get ySize(): number;
    /**
     * 盤を更新する
     *
     * @param pos
     * @param value
     */
    put(pos: PosReadable, value: T | null): BoardMutable<T>;
    forEach(callback: (pos: Pos, value: T | null) => void): void;
    getValue(pos: PosReadable): T | null | undefined;
    getValueFromXY(x: X, y: Y): T | null | undefined;
    exists(pos: PosReadable): boolean;
    copy(): Board<T>;
    some(check: (pos: Pos, value: T | null) => boolean): boolean;
    find(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null> | null;
    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
    static empty<T>(xSize: number, ySize: number): BoardMutable<T>;
    toImmutable(): Board<T>;
}
export declare type ValueAndPos<T> = {
    readonly pos: Pos;
    readonly value: T;
};
export {};
