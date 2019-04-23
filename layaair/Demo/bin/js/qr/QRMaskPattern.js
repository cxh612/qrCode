/**
 * Created by qingzhu on 15/7/1.
 */
var qr;
(function (qr) {
    var QRMaskPattern = /** @class */ (function () {
        function QRMaskPattern() {
        }
        QRMaskPattern.PATTERN000 = 0;
        QRMaskPattern.PATTERN001 = 1;
        QRMaskPattern.PATTERN010 = 2;
        QRMaskPattern.PATTERN011 = 3;
        QRMaskPattern.PATTERN100 = 4;
        QRMaskPattern.PATTERN101 = 5;
        QRMaskPattern.PATTERN110 = 6;
        QRMaskPattern.PATTERN111 = 7;
        return QRMaskPattern;
    }());
    qr.QRMaskPattern = QRMaskPattern;
})(qr || (qr = {}));
//# sourceMappingURL=QRMaskPattern.js.map