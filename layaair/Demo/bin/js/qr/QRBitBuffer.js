/**
 * Created by qingzhu on 15/7/1.
 */
var qr;
(function (qr) {
    var QRBitBuffer = /** @class */ (function () {
        function QRBitBuffer() {
            this.buffer = [];
            this.length = 0;
        }
        QRBitBuffer.prototype.get = function (index) {
            var bufIndex = Math.floor(index / 8);
            return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
        };
        QRBitBuffer.prototype.put = function (num, length) {
            for (var i = 0; i < length; i++)
                this.putBit((num >>> length - i - 1 & 1) == 1);
        };
        QRBitBuffer.prototype.getLengthInBits = function () {
            return this.length;
        };
        QRBitBuffer.prototype.putBit = function (bit) {
            var bufIndex = Math.floor(this.length / 8);
            this.buffer.length <= bufIndex && this.buffer.push(0), bit && (this.buffer[bufIndex] |= 128 >>> this.length % 8), this.length++;
        };
        return QRBitBuffer;
    }());
    qr.QRBitBuffer = QRBitBuffer;
})(qr || (qr = {}));
//# sourceMappingURL=QRBitBuffer.js.map