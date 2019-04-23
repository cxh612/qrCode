import WebGL = Laya.WebGL;
// 程序入口
class GameMain{
    constructor()
    {
        Laya.init(600,400, WebGL);
        Laya.stage.bgColor = "#ffffff";

        var sp_qr = qr.QRCode.create("sean@ju-ax.com","#000000",128,128,1);
        Laya.stage.addChild(sp_qr);
    }
}
new GameMain();