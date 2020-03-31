export declare module board2d {
    /**
     * 盤の位置
     */
    class Pos {
        x: number;
        y: number;
        constructor(x: number, y: number);
        add(pos: Pos): Pos;
        addXY(x: number, y: number): Pos;
    }
    /**
     * 盤
     *
     * 2次元配列のラッパークラス
     * 空のセルにはnullが入っている
     *
     */
    class Board<T> {
        #private;
        constructor(xSize: number, ySize: number);
        get xSize(): number;
        get ySize(): number;
        get values(): (T | null)[][];
        put(pos: Pos, value: T | null): Board<T>;
        /**
         * call関数を、配列の各要素に対して一度ずつ実行する
         * @param callback
         */
        forEach(callback: (pos: Pos, value: T | null) => void): void;
        /**
         * 指定した位置にある要素を取得
         *
         * @param pos
         * @return 空の場合はnullを返す。盤の外側の場合、undefinedを返す。
         */
        getValue(pos: Pos): T | null | undefined;
        /**
         * 指定した位置にある要素を取得
         * @param x
         * @param y
         * @return 空の場合はnullを返す。盤の外側の場合、undefinedを返す。
         */
        getValueFromXY(x: number, y: number): T | null | undefined;
        exists(pos: Pos): boolean;
        copy(): Board<T>;
        static create<T>(board: Board<T>): Board<T>;
    }
}
