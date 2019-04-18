/**
 * Created by qingzhu on 15/7/1.
 */
module qr {
    export class QRPolynomial{
        public num;
        public constructor(num, shift) {
            if (num.length == undefined) throw new Error(num.length + "/" + shift);
            var offset = 0;
            while (offset < num.length && num[offset] == 0) offset++;
            this.num = new Array(num.length - offset + shift);
            for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
        }

        public get(index) {
            return this.num[index];
        }
        public getLength () {
         return this.num.length;
        }
        public multiply(e) {
             var num = new Array(this.getLength() + e.getLength() - 1);
             for (var i = 0; i < this.getLength(); i++) for (var j = 0; j < e.getLength(); j++) num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
             return new QRPolynomial(num, 0);
        }
        public mod (e) {
            if (this.getLength() - e.getLength() < 0) return this;
            var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0)), num = new Array(this.getLength());
            for (var i = 0; i < this.getLength(); i++) num[i] = this.get(i);
            for (var i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
            return (new QRPolynomial(num, 0)).mod(e);
        }
    }
}