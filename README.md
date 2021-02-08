# TDD Tutorial

TDDをする場合としない場合の違いを検証
作成するのは書籍「テスト駆動開発」の為替変換ツール


### node上でのtypescriptのコンパイル
- https://qiita.com/notakaos/items/3bbd2293e2ff286d9f49
```
$ yarn init //package.jsonの追加
$ yarn add typescript @types/node@12 jest ts-jest @types/jest
$ npx tsc --init    // tsconfig.jsonの生成
$ npx tsc   // コンパイル
$ node index.js 
```


### 結果
- tddなしと比べて、より安心して実装できた
- テストすることで、例外に対してもtddなしより対応できている
    - 例えば、rateに負数がこないようにするとか
    - TODOをすぐに作ることで設計がストレスなくできるようになった
- 今後もテストがあるという安心感はある