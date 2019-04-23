var WebGL = Laya.WebGL;
// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        Laya.init(600, 400, WebGL);
        Laya.stage.bgColor = "#ffffff";
        var sp_qr = qr.QRCode.create("sean@ju-ax.com", "#000000", 128, 128, 1);
        Laya.stage.addChild(sp_qr);
    }
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map