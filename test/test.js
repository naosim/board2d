var board2d = require('./dist/index')
// console.log(board2d);

test('3x3の盤を作り、駒を置く', () => {
  var board = board2d.Board.empty(3, 3) // 3x3の盤面を生成
    .put(new board2d.Pos(2, 2), 'x') // 駒を置く
    .put({x: 2, y: 1}, 'o') // 座標は{x:number, y:number}のobjectでも良い
    .putFromXY(2, 0, 'o') // x, yを直接渡すメソッドもある
  var mark = board.getValue(new board2d.Pos(2, 2)); // 指定位置の駒を取得する => 'x'
  var markEmpty = board.getValue(new board2d.Pos(0, 0)); // 空のセルを取得するとnullを返す

  expect(mark).toBe('x');
  expect(markEmpty).toBeNull();
})

describe('盤面の参照', () => {
  var board;
  beforeEach(() => {
    board = board2d.Board.empty(3, 3)
      .put(new board2d.Pos(2, 2), 'x')
      .put({x: 2, y: 1}, 'o')
      .putFromXY(2, 0, 'o')
  });  

  test('指定位置にある駒を取得する', () => {
    var mark1 = board.getValue({x: 2, y: 2});
    var mark2 = board.getValue({x: 0, y: 0});
    var mark3 = board.getValue({x: -1, y: -1});

    expect(mark1).toBe('x');
    expect(mark2).toBeNull();
    expect(mark3).toBeUndefined();
  })

  test('駒をそれぞれ取得する', () => {
    var acts = [];
    board.forEach((pos, value) => {
      acts.push([pos.x, pos.y, value])
    })

    expect(JSON.stringify(acts)).toBe(JSON.stringify([
      [0, 0, null],
      [1, 0, null],
      [2, 0, 'o'],
      [0, 1, null],
      [1, 1, null],
      [2, 1, 'o'],
      [0, 2, null],
      [1, 2, null],
      [2, 2, 'x'],
    ]));
  })

  test('指定位置から任意の方向(隣)にある駒を取得する', () => {
    var posAndValue1 = board.getValueWithDirection({x: 2, y: 2}, board2d.Direction.up)// {x: 2, y: 1}の駒を取得する => 'o'
    var posAndValue2 = board.getValueWithDirection({x: 2, y: 2}, board2d.Direction.left)// {x: 1, y: 2}の駒を取得する => null
    var posAndValue3 = board.getValueWithDirection({x: 2, y: 2}, board2d.Direction.right)// {x: 3, y: 2}の駒を取得する => undefined :盤面外

    expect(JSON.stringify(posAndValue1.pos)).toBe(JSON.stringify({x: 2, y: 1}));
    expect(posAndValue1.value).toBe('o');

    expect(JSON.stringify(posAndValue2.pos)).toBe(JSON.stringify({x: 1, y: 2}));
    expect(posAndValue2.value).toBeNull();

    expect(posAndValue3).toBeUndefined();
    
  })

  test('任意の条件で駒を探す', () => {
    var result = board.find((pos, value) => value == 'o') // 'o'の駒を探す

    expect(result.pos.x).toBe(2);
    expect(result.pos.y).toBe(0);
    expect(result.value).toBe('o');
  })

  test('任意の条件で駒を探す(全件取得)', () => {
    var results = board.findAll((pos, value) => value == 'o') // 'o'の駒を探す

    expect(JSON.stringify(results)).toBe(JSON.stringify([
      {pos: {x: 2, y: 0}, value: 'o'},
      {pos: {x: 2, y: 1}, value: 'o'},
    ]));
  })

  test('駒の存在を確認する', () => {
    var exist = board.exists({x: 2, y: 2})// => true
    var notExist = board.exists({x: 0, y: 0})// => false

    expect(exist).toBe(true);
    expect(notExist).toBe(false);
  })

  test('条件を満たす駒の存在チェック', () => {
    var result = board.some((pos, value) => value == 'x'); // xの駒があるかどうか

    expect(result).toBe(true);
  })

  test('盤面のサイズを取得する', () => {
    expect(board.xSize).toBe(3);
    expect(board.ySize).toBe(3);
  })

  test('盤面の生データを取得する', () => {
    var values = board.values;
    values[1][2] = null;
    var value = board.getValue({x: 2, y: 1});

    expect(JSON.stringify(values)).toBe(JSON.stringify([
      [null, null, 'o'],
      [null, null, null],
      [null, null, 'x'],
    ]))
    expect(value).toBe(('o'));

  })

})

describe('ユーティリティ', () => {
  var board;
  beforeEach(() => {
    board = board2d.Board.empty(3, 3)
  });

  test('indexToPos', () => {
    var pos = board.indexToPos(3);
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(1);
  })
  
  test('indexToPos#outOfIndex', () => {
    expect(() => {
      board.indexToPos(-1)
    }).toThrow();
    expect(() => {
      board.indexToPos(9)
    }).toThrow();
  })

  test('posToIndex', () => {
    var index = board.posToIndex({x: 0, y: 1});
    expect(index).toBe(3);
  })
  test('posToIndex#outOfIndex', () => {
    expect(() => {
      board.posToIndex({x: -1, y: 0});
    }).toThrow();

    expect(() => {
      board.posToIndex({x: 3, y: 0});
    }).toThrow();

    expect(() => {
      board.posToIndex({x: 0, y: 3});
    }).toThrow();
  })
});