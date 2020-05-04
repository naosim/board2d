board2d
===
ゲーム用の盤面ライブラリ。  
オセロや将棋など格子状の盤面を使ったゲームに使ってください。


## install
```
npm install board2d
```

## import
```javascript
import * as board2d from 'board2d';
```

## usage
### 3x3の盤を作り、駒を置く
```javascript
var board = board2d.Board.empty(3, 3) // 3x3の盤面を生成
  .put(new board2d.Pos(2, 2), 'x') // 駒を置く
  .put({x: 2, y: 1}, 'o') // 座標は{x:number, y:number}のobjectでも良い
  .putFromXY(2, 0, 'o') // x, yを直接渡すメソッドもある
var mark = board.getValue(new board2d.Pos(2, 2)); // 指定位置の駒を取得する
console.log(mark); // => 'x'
var markEmpty = board.getValue(new board2d.Pos(0, 0)); // 空のセルを取得するとnullを返す
console.log(markEmpty); // => null
```

### 盤面の参照
#### 指定位置にある駒を取得する
```javascript
var mark = board.getValue({x: 2, y: 2});
console.log(mark); // => 'x'
console.log(board.getValue({x: 0, y: 0})); // => null  :空の場合
console.log(board.getValue({x: -1, y: -1})); // => undefined  :盤面外の場合
```

#### 駒をそれぞれ取得する
```javascript
board.forEach((pos, value) => {
  console.log(pos.x, pos.y, value);
})
```

#### 指定位置から任意の方向(隣)にある駒を取得する
```javascript
var mark;
posAndValue = board.getFromDrection({x: 2, y: 2}, board2d.Direction.up)// {x: 2, y: 1}の駒を取得する => {pos: {x: 2, y: 1}, value: 'o'}
posAndValue = board.getFromDrection({x: 2, y: 2}, board2d.Direction.left)// {x: 1, y: 2}の駒を取得する => {pos: {x: 1, y: 2}, value: null}
posAndValue = board.getFromDrection({x: 2, y: 2}, board2d.Direction.right)// {x: 3, y: 2}の駒を取得する => undefined
```

#### 任意の条件で駒を探す
```javascript
var result = board.find((pos, value) => value == 'o') // 'o'の駒を探す
console.log(result.pos.x, result.pos.y, result.value);
// => 2, 0, o
```

#### 任意の条件で駒を探す(全件取得)
```javascript
var results = board.findAll((pos, value) => value == 'o') // 'o'の駒を探す
results.forEach(v => console.log(v.pos.x, v.pos.y, v.value))
// => 2, 0, o
// => 2, 1, o
```

#### 駒の存在を確認する
```javascript
var exist = board.exists({x: 2, y: 2})// => true
var notExist = board.exists({x: 0, y: 0})// => false
```

#### 条件を満たす駒の存在チェック
```javascript
var result = board.some((pos, value) => value == 'x'); // xの駒があるかどうか
console.log(result);// => true
```

#### 盤面のサイズを取得する
```javascript
console.log(board.xSize);// => 3
console.log(board.ySize);// => 3
```

#### 盤面の生データを取得する
```javascript
var values = board.values;
console.log(values[1][2]); // => o
// valuesを変更しても盤面には影響しない
values[1][2] = null;
console.log(values[1][2]); // => null
console.log(board.getValue({x: 2, y: 1})); // => o  影響しない
```