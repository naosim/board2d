export module board2d {
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
    constructor(readonly x: X, readonly y: Y) {
    }

    add(pos: Pos): PosImmutable {
      return this.addXY(pos.x, pos.y);
    }

    addXY(x: X, y: Y) {
      return new PosImmutable(this.x + x as X, this.y + y as Y);
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
    addDirection(direction: Direction): PosImmutable {
      return this.add(PosImmutable.createFromDirection(direction));
    }

    static createFromPos(pos: Pos): PosImmutable {
      return new PosImmutable(pos.x, pos.y);
    }

    static createFromDirection(direction: Direction): PosImmutable {
      if(direction == Direction.up) {
        return new PosImmutable(0 as X, -1 as Y);
      } else if(direction == Direction.down) {
        return new PosImmutable(0 as X, 1 as Y);
      } else if(direction == Direction.right) {
        return new PosImmutable(1 as X, 0 as Y);
      } else if(direction == Direction.left) {
        return new PosImmutable(-1 as X, 0 as Y);
      } else if(direction == Direction.upRight) {
        return new PosImmutable(1 as X, -1 as Y);
      } else if(direction == Direction.upLeft) {
        return new PosImmutable(-1 as X, -1 as Y);
      } else if(direction == Direction.downRight) {
        return new PosImmutable(1 as X, 1 as Y);
      } else if(direction == Direction.downLeft) {
        return new PosImmutable(-1 as X, 1 as Y);
      } else {
        throw new Error('unknown direction')
      }
    }
  }

  /**
   * 位置
   */
  export class PosMutable {
    constructor(public x: X, public y: Y) {
    }
    add(pos: Pos): PosMutable {
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
      return this.add(PosImmutable.createFromDirection(direction));
    }

    static createFromPos(pos: Pos): PosMutable {
      return new PosMutable(pos.x, pos.y);
    }
    
  }

  /**
   * 盤
   *
   * 2次元配列のラッパークラス
   * 空のセルにはnullが入っている
   *
   */
  export class Board<T> {
    #xSize: number;
    #ySize: number;
    #values: (T | null)[][]; // T or null

    /**
     * 盤のサイズを指定してインスタンスを生成します。下記は3x3の盤を作っています。
     * ```javascript
     * var board = new board2d.Board<string>(3, 3);
     * ```
     *
     * @param xSize
     * @param ySize
     */
    constructor(xSize:number, ySize: number) {
      this.#xSize = xSize;
      this.#ySize = ySize;

      this.#values = new Array(ySize).fill(null).map(v => new Array(xSize).fill(null)); // 3x3
    }

    /**
     * 盤のxサイズ
     */
    get xSize(): number { return this.#xSize; }
    /**
     * 盤のyサイズ
     */
    get ySize(): number { return this.#ySize; }
    get values(): (T | null)[][] { return this.#values; }

    /**
     * 盤を更新する
     * 
     * @param pos
     * @param value
     */
    putMutable(pos: Pos, value: T | null): Board<T> {
      this.#values[pos.y][pos.x] = value;
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
    put(pos: Pos, value: T | null): Board<T> {
      var result = Board.create(this);
      result.#values[pos.y][pos.x] = value;
      return result;
    }

    /**
     * callback関数を、盤上の各セルに対して一度ずつ実行する
     * @param callback
     */
    forEach(callback: (pos: PosImmutable, value: T | null)=>void) {
      for(var y = 0 as Y; y < this.#ySize; y++) {
        for(var x = 0 as X; x < this.#xSize; x++) {
          callback(new PosImmutable(x, y), this.#values[y][x])
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
    getValue(pos: Pos): T | null | undefined {
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
      if(this.#values.length <= y || this.#values[0].length <= x) {
        return undefined;
      }
      return this.#values[y][x];
    }

    /**
     * 指定した位置に駒があるかどうかを取得する
     *
     * 駒がある場合はtrueを返す。
     * 駒がない、または、位置が盤の外側の場合、falseを返す。
     * @param pos
     */
    exists(pos: Pos): boolean {
      return this.getValue(pos) !== null && this.getValue(pos) !== undefined;
    }

    copy(): Board<T> {
      var result = new Board<T>(this.#xSize, this.#ySize);
      this.forEach((pos, v) => result.put(pos, v));
      return result;
    }

    some(check: (pos: PosImmutable, value: T | null)=>boolean): boolean {
      for(var y: Y = 0 as Y; y < this.#ySize; y++) {
        for(var x: X = 0 as X; x < this.#xSize; x++) {
          if(check(new PosImmutable(x, y), this.#values[y][x])) {
            return true;// 1つでも見つかったら即返す
          }
        }
      }
      return false;
    }

    find(check: (pos: Pos, value: T | null)=>boolean): ValueAndPos<T | null> | null {
      for(var y = 0 as Y; y < this.#ySize; y++) {
        for(var x = 0 as X; x < this.#xSize; x++) {
          if(check(new PosImmutable(x, y), this.#values[y][x])) {
            return {
              pos: new PosImmutable(x, y),
              value: this.#values[y][x]
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
    getFromDrection(pos: Pos, direction: Direction): ValueAndPos<T | null> | undefined {
      var p = PosImmutable.createFromPos(pos).addDirection(direction);
      var v = this.getValue(p);
      if(v === undefined) {
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
    static create<T>(board: Board<T>): Board<T> {
      var result = new Board<T>(board.#xSize, board.#ySize);
      board.forEach((pos, v) => result.put(pos, v));
      return result;
    }
  }

  export type ValueAndPos<T> = {
    readonly pos: PosImmutable,
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
