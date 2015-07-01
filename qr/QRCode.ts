/**
 * Created by qingzhu on 15/7/1.
 */
module qr {
    export class QRCode{
        /**
         * msg
         * width,height 二维码宽度，高度
         * color 颜色
         * */
        public static create(msg:string,color=0, width:number=200,height:number=200,errorCorrectLevel=2):egret.Sprite{
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

        public static draw(m:qr.QRCodeModel ,_htOption):egret.Sprite{
            var sc:egret.Sprite = new egret.Sprite();
            var _htOption = _htOption;
            var nCount = m.getModuleCount();
            var nWidth = Math.floor(_htOption.width / nCount);
            var nHeight = Math.floor(_htOption.height / nCount);

            for (var row = 0; row < nCount; row++) {
                for (var col = 0; col < nCount; col++) {
                    var b =m.isDark(row, col);
                    if(b){
                        sc.graphics.beginFill(_htOption.color);
                        sc.graphics.drawRect(col*nWidth,row*nHeight,nWidth,nHeight);
                        sc.graphics.endFill();
                    }
                }
            }
            return sc;
        }

    }
}