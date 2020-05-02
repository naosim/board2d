(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./pos/pos", "./board/board"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 盤ライブラリ
     * バージョン: 3.2.0
     */
    exports.version = '3.2.0';
    __export(require("./pos/pos"));
    __export(require("./board/board"));
});
