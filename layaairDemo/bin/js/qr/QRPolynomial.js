/**
 * Created by qingzhu on 15/7/1.
 */
var qr;
(function (qr) {
    var QRPolynomial = /** @class */ (function () {
        function QRPolynomial(num, shift) {
            if (num.length == undefined)
                throw new Error(num.length + "/" + shift);
            var offset = 0;
            while (offset < num.length && num[offset] == 0)
                offset++;
            this.num = new Array(num.length - offset + shift);
            for (var i = 0; i < num.length - offset; i++)
                this.num[i] = num[i + offset];
        }
        QRPolynomial.prototype.get = function (index) {
            return this.num[index];
        };
        QRPolynomial.prototype.getLength = function () {
            return this.num.length;
        };
        QRPolynomial.prototype.multiply = function (e) {
            var num = new Array(this.getLength() + e.getLength() - 1);
            for (var i = 0; i < this.getLength(); i++)
                for (var j = 0; j < e.getLength(); j++)
                    num[i + j] ^= qr.QRMath.gexp(qr.QRMath.glog(this.get(i)) + qr.QRMath.glog(e.get(j)));
            return new QRPolynomial(num, 0);
        };
        QRPolynomial.prototype.mod = function (e) {
            if (this.getLength() - e.getLength() < 0)
                return this;
            var ratio = qr.QRMath.glog(this.get(0)) - qr.QRMath.glog(e.get(0)), num = new Array(this.getLength());
            for (var i = 0; i < this.getLength(); i++)
                num[i] = this.get(i);
            for (var i = 0; i < e.getLength(); i++)
                num[i] ^= qr.QRMath.gexp(qr.QRMath.glog(e.get(i)) + ratio);
            return (new QRPolynomial(num, 0)).mod(e);
        };
        return QRPolynomial;
    }());
    qr.QRPolynomial = QRPolynomial;
})(qr || (qr = {}));
//# sourceMappingURL=QRPolynomial.js.map