/**
 * Created by qingzhu on 15/7/1.
 * modify by bq49 at 20190418 for LayaAir
 */
module qr {
    export class QRCode{
        /**
         * msg
         * width,height 二维码宽度，高度
         * color 颜色
         * */
        public static create(msg:string,color="#000000", width:number=200,height:number=200,errorCorrectLevel=2):Laya.Sprite{
          var _htOption = {
                width : width,
                height : height,
                correctLevel : qr.QRErrorCorrectLevel.H,
                color:color
            };
            var _oQRCode = new qr.QRCodeModel(qr.QRUtil._getTypeNumber(msg,_htOption.correctLevel), _htOption.correctLevel);
            _oQRCode.addData(msg);
            _oQRCode.make();
            return  QRCode.draw(_oQRCode,_htOption);
        }

        public static draw(m:qr.QRCodeModel ,_htOption):Laya.Sprite{
            var sc:Laya.Sprite = new Laya.Sprite();
            var _htOption = _htOption;
            var nCount = m.getModuleCount();
            var nWidth = _htOption.width / nCount;
            var nHeight = _htOption.height / nCount;

            for (var row = 0; row < nCount; row++) {
                for (var col = 0; col < nCount; col++) {
                    var b =m.isDark(row, col);
                    if(b){
                        sc.graphics.drawRect(col*nWidth,row*nHeight,nWidth,nHeight,_htOption.color);
                    }
                }
            }
            return sc;
        }

    }
}