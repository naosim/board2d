/**
 * 盤ライブラリ
 * バージョン: ##version##
 */
export module board2d {
  export const version = '##version##';
  /**
   * @ignore
   */
  declare const XNominality: unique symbol
  /**
   * X座標
   * number型の拡張
   */
  export type X = number & { [XNominality]: never }

  /**
   * @ignore
   */
  declare const YNominality: unique symbol
  /**
   * Y座標
   * number型の拡張
   */
  export type Y = number & { [YNominality]: never }

  /**
   * @ignore
   */
  declare const SkipCopyNominality: unique symbol
  /**
   * コピーを省略するフラグ
   * boolean型の拡張
   */
  export type SkipCopy = boolean & { [SkipCopyNominality]: never }

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
  export class Pos implements PosReadable {
    constructor(readonly x: X, readonly y: Y) {
    }

    add(pos: PosReadable): Pos {
      return this.addXY(pos.x, pos.y);
    }

    addXY(x: X, y: Y): Pos {
      return new Pos(this.x + x as X, this.y + y as Y);
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
    addDirection(direction: Direction): Pos {
      return this.add(Pos.createFromDirection(direction));
    }

    static createFromPos(pos: PosReadable): Pos {
      return new Pos(pos.x, pos.y);
    }

    static createFromDirection(direction: Direction): Pos {
      if(direction == Direction.up) {
        return new Pos(0 as X, -1 as Y);
      } else if(direction == Direction.down) {
        return new Pos(0 as X, 1 as Y);
      } else if(direction == Direction.right) {
        return new Pos(1 as X, 0 as Y);
      } else if(direction == Direction.left) {
        return new Pos(-1 as X, 0 as Y);
      } else if(direction == Direction.upRight) {
        return new Pos(1 as X, -1 as Y);
      } else if(direction == Direction.upLeft) {
        return new Pos(-1 as X, -1 as Y);
      } else if(direction == Direction.downRight) {
        return new Pos(1 as X, 1 as Y);
      } else if(direction == Direction.downLeft) {
        return new Pos(-1 as X, 1 as Y);
      } else {
        throw new Error('unknown direction')
      }
    }
  }

  /**
   * 位置
   */
  export class PosMutable implements PosReadable{
    constructor(public x: X, public y: Y) {
    }
    add(pos: PosReadable): PosMutable {
      return this.addXY(pos.x, pos.y);
    }

    addXY(x: X, y: Y): PosMutable {
      this.x = this.x + x as X;
      this.y = this.y + y as Y;
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
    addDirection(direction: Direction): PosMutable {
      return this.add(Pos.createFromDirection(direction));
    }

    static createFromPos(pos: PosReadable): PosMutable {
      return new PosMutable(pos.x, pos.y);
    }
  }

  interface BoardReadable<T> {
    readonly xSize: number;
    readonly ySize: number;
    /**
     * callback関数を、盤上の各セルに対して一度ずつ実行する
     * @param callback
     */
    forEach(callback: (pos: Pos, value: T | null)=>void): void;

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

    some(check: (pos: Pos, value: T | null)=>boolean): boolean;

    find(check: (pos: Pos, value: T | null)=>boolean): ValueAndPos<T | null> | null;

    /**
     * posからdirectionの方向に1歩進んだ場所を取得する
     * @param pos
     * @param direction
     */
    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined;
  }

  class BoardCore<T> implements BoardReadable<T> {
    readonly values: (T | null)[][]; // T or null
    readonly #poses: Pos[][];

    /**
     * 盤のサイズを指定してインスタンスを生成します。下記は3x3の盤を作っています。
     * ```javascript
     * var board = new board2d.Board<string>(3, 3);
     * ```
     *
     * @param xSize
     * @param ySize
     */
    constructor(readonly xSize:number, readonly ySize: number) {
      this.values = new Array(ySize).fill(null).map(_ => new Array(xSize).fill(null));
      this.#poses = new Array(ySize).fill(null).map((_, y) => new Array(xSize).fill(null).map((__, x) => new Pos(x as X, y as Y)));
    }

    /**
     * callback関数を、盤上の各セルに対して一度ずつ実行する
     * @param callback
     */
    forEach(callback: (pos: Pos, value: T | null)=>void) {
      for(var y = 0 as Y; y < this.ySize; y++) {
        for(var x = 0 as X; x < this.xSize; x++) {
          callback(this.#poses[y][x], this.values[y][x])
        }
      }
    }

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
    getValue(pos: PosReadable): T | null | undefined {
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
    getValueFromXY(x: X, y: Y): T | null | undefined {
      if(x < 0 || y < 0) {
        return undefined;
      }
      if(this.values.length <= y || this.values[0].length <= x) {
        return undefined;
      }
      return this.values[y][x];
    }

    /**
     * 指定した位置に駒があるかどうかを取得する
     *
     * 駒がある場合はtrueを返す。
     * 駒がない、または、位置が盤の外側の場合、falseを返す。
     * @param pos
     */
    exists(pos: PosReadable): boolean {
      return this.getValue(pos) !== null && this.getValue(pos) !== undefined;
    }

    some(check: (pos: Pos, value: T | null)=>boolean): boolean {
      for(var y: Y = 0 as Y; y < this.ySize; y++) {
        for(var x: X = 0 as X; x < this.xSize; x++) {
          if(check(this.#poses[y][x], this.values[y][x])) {
            return true;// 1つでも見つかったら即返す
          }
        }
      }
      return false;
    }

    find(check: (pos: Pos, value: T | null)=>boolean): ValueAndPos<T | null> | null {
      for(var y = 0 as Y; y < this.ySize; y++) {
        for(var x = 0 as X; x < this.xSize; x++) {
          if(check(this.#poses[y][x], this.values[y][x])) {
            return {
              pos: this.#poses[y][x],
              value: this.values[y][x]
            };// 1つでも見つかったら即返す
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
    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined {
      var p = Pos.createFromPos(pos).addDirection(direction);
      var v = this.getValue(p);
      if(v === undefined) {
        return undefined;
      }
      return {
        pos: p,
        value: v
      };
    }

    copy(): BoardCore<T> {
      var result = new BoardCore<T>(this.xSize, this.ySize);
      this.forEach((pos, v) => result.values[pos.y][pos.x] = v);
      return result;
    }
  }

  /**
   * 盤
   *
   * 2次元配列のラッパークラス
   * 空のセルにはnullが入っている
   *
   */
  export class Board<T> implements BoardReadable<T> {
    #boardCore: BoardCore<T>;

    constructor(boardCore: BoardCore<T>, skipCopy: SkipCopy = false as SkipCopy) {
      this.#boardCore = skipCopy ? boardCore : boardCore.copy();
    }

    get xSize(): number { return this.#boardCore.xSize; }
    get ySize(): number { return this.#boardCore.ySize; }

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
    put(pos: PosReadable, value: T | null): Board<T> {
      var newBoardCore = this.#boardCore.copy();
      newBoardCore.values[pos.y][pos.x] = value;
      return new Board<T>(newBoardCore, true as SkipCopy);
    }

    forEach(callback: (pos: Pos, value: T | null)=>void) {
      this.#boardCore.forEach(callback);
    }

    getValue(pos: PosReadable): T | null | undefined {
      return this.#boardCore.getValue(pos);
    }

    getValueFromXY(x: X, y: Y): T | null | undefined {
      return this.#boardCore.getValueFromXY(x, y);
    }

    exists(pos: PosReadable): boolean {
      return this.#boardCore.exists(pos);
    }

    copy(): Board<T> {
      return new Board<T>(this.#boardCore.copy());
    }

    some(check: (pos: Pos, value: T | null)=>boolean): boolean {
      return this.#boardCore.some(check);
    }

    find(check: (pos: Pos, value: T | null)=>boolean): ValueAndPos<T | null> | null {
      return this.#boardCore.find(check);
    }

    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined {
      return this.#boardCore.getFromDrection(pos, direction);
    }

    toMutable(): BoardMutable<T> {
      return new BoardMutable<T>(this.#boardCore);
    }

    static empty<T>(xSize: number, ySize: number): Board<T> {
      return new Board<T>(new BoardCore(xSize, ySize), true as SkipCopy)
    }
  }

  export class BoardMutable<T> implements BoardReadable<T> {
    boardCore: BoardCore<T>;
    constructor(boardCore: BoardCore<T>, skipCopy: SkipCopy = false as SkipCopy) {
      this.boardCore = skipCopy ? boardCore : boardCore.copy();
    }

    get xSize(): number { return this.boardCore.xSize; }
    get ySize(): number { return this.boardCore.ySize; }

    /**
     * 盤を更新する
     * 
     * @param pos
     * @param value
     */
    put(pos: PosReadable, value: T | null): BoardMutable<T> {
      this.boardCore.values[pos.y][pos.x] = value;
      return this;
    }

    forEach(callback: (pos: Pos, value: T | null)=>void) {
      this.boardCore.forEach(callback);
    }

    getValue(pos: PosReadable): T | null | undefined {
      return this.boardCore.getValue(pos);
    }

    getValueFromXY(x: X, y: Y): T | null | undefined {
      return this.boardCore.getValueFromXY(x, y);
    }

    exists(pos: PosReadable): boolean {
      return this.boardCore.exists(pos);
    }

    copy(): Board<T> {
      return new Board<T>(this.boardCore.copy());
    }

    some(check: (pos: Pos, value: T | null)=>boolean): boolean {
      return this.boardCore.some(check);
    }

    find(check: (pos: Pos, value: T | null)=>boolean): ValueAndPos<T | null> | null {
      return this.boardCore.find(check);
    }

    getFromDrection(pos: PosReadable, direction: Direction): ValueAndPos<T | null> | undefined {
      return this.boardCore.getFromDrection(pos, direction);
    }


    static empty<T>(xSize: number, ySize: number): BoardMutable<T> {
      return new BoardMutable<T>(new BoardCore(xSize, ySize), true as SkipCopy)
    }

    toImmutable(): Board<T> {
      return new Board<T>(this.boardCore);
    }
  }

  export type ValueAndPos<T> = {
    readonly pos: Pos,
    readonly value:T
  }

  /**
   * 方向
   */
  export enum Direction {
    up, down, left, right,
    upLeft, upRight, downLeft, downRight
  }
}
