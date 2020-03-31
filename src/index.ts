export module board2d {
  /**
   * 盤の位置
   */
  export class Pos {
    constructor(public x: number, public y: number) {
    }
    add(pos: Pos): Pos {
      return this.addXY(pos.x, pos.y);
    }
    addXY(x: number, y: number) {
      return new Pos(this.x + x, this.y + y);
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
    constructor(xSize:number, ySize: number) {
      this.#xSize = xSize;
      this.#ySize = ySize;

      this.#values = new Array(ySize).fill(null).map(v => new Array(xSize).fill(null)); // 3x3
    }
    get xSize(): number { return this.#xSize; }
    get ySize(): number { return this.#ySize; }
    get values(): (T | null)[][] { return this.#values; }

    put(pos: Pos, value: T | null): Board<T> {
      this.#values[pos.y][pos.x] = value;
      return this;
    }
  
    /**
     * call関数を、配列の各要素に対して一度ずつ実行する
     * @param callback 
     */
    forEach(callback: (pos: Pos, value: T | null)=>void) {
      for(var y = 0; y < this.#ySize; y++) {
        for(var x = 0; x < this.#xSize; x++) {
          callback(new Pos(x, y), this.#values[y][x])
        }
      }
    }

    /**
     * 指定した位置にある要素を取得
     * 
     * @param pos 
     * @return 空の場合はnullを返す。盤の外側の場合、undefinedを返す。
     */
    getValue(pos: Pos): T | null | undefined {
      return this.getValueFromXY(pos.x, pos.y);
    }

    /**
     * 指定した位置にある要素を取得
     * @param x 
     * @param y 
     * @return 空の場合はnullを返す。盤の外側の場合、undefinedを返す。
     */
    getValueFromXY(x: number, y: number): T | null | undefined {
      if(x < 0 || y < 0) {
        return undefined;
      }
      if(this.#values.length <= y || this.#values[0].length <= x) {
        return undefined;
      }
      return this.#values[y][x];
    }

    exists(pos: Pos): boolean {
      return this.getValue(pos) !== null && this.getValue(pos) !== undefined;
    }

    copy(): Board<T> {
      var result = new Board<T>(this.#xSize, this.#ySize);
      this.forEach((pos, v) => result.put(pos, v));
      return result;
    }

    static create<T>(board: Board<T>): Board<T> {
      var result = new Board<T>(board.#xSize, board.#ySize);
      board.forEach((pos, v) => result.put(pos, v));
      return result;
    }
  }
}