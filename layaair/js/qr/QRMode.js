/**
 * Created by qingzhu on 15/7/1.
 */
var qr;
(function (qr) {
    var QRMode = /** @class */ (function () {
        function QRMode() {
        }
        QRMode.MODE_NUMBER = 1;
        QRMode.MODE_ALPHA_NUM = 2;
        QRMode.MODE_8BIT_BYTE = 4;
        QRMode.MODE_KANJI = 8;
        return QRMode;
    }());
    qr.QRMode = QRMode;
})(qr || (qr = {}));
//# sourceMappingURL=QRMode.js.map