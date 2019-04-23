/**
 * Created by qingzhu on 15/7/1.
 */
module qr {
    export class QRBitBuffer{
        public buffer;
        public length:number;
        public constructor() {
            this.buffer = [];
            this.length = 0;
        }

        public get(index) {
         var bufIndex = Math.floor(index / 8);
            return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
        }
        public put(num, length) {
            for (var i = 0; i < length; i++) this.putBit((num >>> length - i - 1 & 1) == 1);
        }
        public getLengthInBits() {
            return this.length;
        }
        public  putBit(bit) {
             var bufIndex = Math.floor(this.length / 8);
             this.buffer.length <= bufIndex && this.buffer.push(0), bit && (this.buffer[bufIndex] |= 128 >>> this.length % 8), this.length++;
        }
    }
}