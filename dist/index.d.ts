export declare module board2d {
    /**
     * @ignore
     */
    const XNominality: unique symbol;
    /**
     * X座標
     * number型の拡張
     */
    export type X = number & {
        [XNominality]: never;
    };
    /**
     * @ignore
     */
    const YNominality: unique symbol;
    /**
     * Y座標
     * number型の拡張
     */
    export type Y = number & {
        [YNominality]: never;
    };
    /**
     * 位置
     */
    export interface Pos {
        readonly x: X;
        readonly y: Y;
    }
    /**
     * 位置(不変)
     */
    export class PosImmutable implements Pos {
        readonly x: X;
        readonly y: Y;
        constructor(x: X, y: Y);
        add(pos: Pos): PosImmutable;
        addXY(x: X, y: Y): PosImmutable;
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
        addDirection(direction: Direction): PosImmutable;
        static createFromPos(pos: Pos): PosImmutable;
        static createFromDirection(direction: Direction): PosImmutable;
    }
    /**
     * 位置
     */
    export class PosMutable {
        x: X;
        y: Y;
        constructor(x: X, y: Y);
        add(pos: Pos): PosMutable;
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
        static createFromPos(pos: Pos): PosMutable;
    }
    /**
     * 盤
     *
     * 2次元配列のラッパークラス
     * 空のセルにはnullが入っている
     *
     */
    export class Board<T> {
        #private;
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
        /**
         * 盤のxサイズ
         */
        get xSize(): number;
        /**
         * 盤のyサイズ
         */
        get ySize(): number;
        get values(): (T | null)[][];
        /**
         * 盤を更新する
         *
         * @param pos
         * @param value
         */
        putMutable(pos: Pos, value: T | null): Board<T>;
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
        put(pos: Pos, value: T | null): Board<T>;
        /**
         * callback関数を、盤上の各セルに対して一度ずつ実行する
         * @param callback
         */
        forEach(callback: (pos: PosImmutable, value: T | null) => void): void;
        /**
         * 指定した位置にある駒を取得する
         *
         * 指定した位置が空の場合はnullを返す。盤の外側の場合はundefinedを返す。
         * ```javascript
         * var board = new board2d.Board<string>(2, 2).put(new board2d.Pos(1, 1), 'x');
         * var a = board.getValue(new board2d.Pos(1, 1)); // x
         * var b = board.getValue(new board2d.Pos(0, 0)); // null
         * var c = board.getValue(new board2d.Pos(-1, -1)); // undefined
         * ```
         *
         * @param pos
         * @return 空の場合はnullを返す。盤の外側の場合はundefinedを返す。
         */
        getValue(pos: Pos): T | null | undefined;
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
        exists(pos: Pos): boolean;
        copy(): Board<T>;
        some(check: (pos: PosImmutable, value: T | null) => boolean): boolean;
        find(check: (pos: Pos, value: T | null) => boolean): ValueAndPos<T | null> | null;
        /**
         * posからdirectionの方向に1歩進んだ場所を取得する
         * @param pos
         * @param direction
         */
        getFromDrection(pos: Pos, direction: Direction): ValueAndPos<T | null> | undefined;
        /**
         * イミュータブルに盤を作成する
         * @param board
         */
        static create<T>(board: Board<T>): Board<T>;
    }
    export type ValueAndPos<T> = {
        readonly pos: PosImmutable;
        readonly value: T;
    };
    /**
     * 方向
     */
    export enum Direction {
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
}
