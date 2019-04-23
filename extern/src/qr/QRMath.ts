/**
 * Created by qingzhu on 15/7/1.
 */
module qr {
    export class QRMath{
        public static isInit:boolean;
        public static glog(n) {
            if(!QRMath.isInit) {
                QRMath.init();
            }
            if (n < 1) console.log("错误:n="+n);
            return QRMath.LOG_TABLE[n];
        }
        public static gexp(n) {
            if(!QRMath.isInit){
                QRMath.init();
            }
            while (n < 0) n += 255;
            while (n >= 256) n -= 255;
            return QRMath.EXP_TABLE[n];
        }
        public static EXP_TABLE = new Array(256);
        public static LOG_TABLE = new Array(256);

        public static init(){
            QRMath.isInit = true;
            for (var i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
            for (var i = 8; i < 256; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
            for (var i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
        }
    }
}