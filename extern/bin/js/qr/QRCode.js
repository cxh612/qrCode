/**
 * Created by qingzhu on 15/7/1.
 * modify by bq49 at 20190418 for LayaAir
 */
var qr;
(function (qr) {
    var QRCode = /** @class */ (function () {
        function QRCode() {
        }
        /**
         * msg
         * width,height 二维码宽度，高度
         * color 颜色
         * */
        QRCode.create = function (msg, color, width, height, errorCorrectLevel) {
            if (color === void 0) { color = "#000000"; }
            if (width === void 0) { width = 200; }
            if (height === void 0) { height = 200; }
            if (errorCorrectLevel === void 0) { errorCorrectLevel = 2; }
            var _htOption = {
                width: width,
                height: height,
                correctLevel: qr.QRErrorCorrectLevel.H,
                color: color
            };
            var _oQRCode = new qr.QRCodeModel(qr.QRUtil._getTypeNumber(msg, _htOption.correctLevel), _htOption.correctLevel);
            _oQRCode.addData(msg);
            _oQRCode.make();
            return QRCode.draw(_oQRCode, _htOption);
        };
        QRCode.draw = function (m, _htOption) {
            var sc = new Laya.Sprite();
            var _htOption = _htOption;
            var nCount = m.getModuleCount();
            var nWidth = _htOption.width / nCount;
            var nHeight = _htOption.height / nCount;
            for (var row = 0; row < nCount; row++) {
                for (var col = 0; col < nCount; col++) {
                    var b = m.isDark(row, col);
                    if (b) {
                        sc.graphics.drawRect(col * nWidth, row * nHeight, nWidth, nHeight, _htOption.color);
                    }
                }
            }
            return sc;
        };
        return QRCode;
    }());
    qr.QRCode = QRCode;
})(qr || (qr = {}));
//# sourceMappingURL=QRCode.js.map