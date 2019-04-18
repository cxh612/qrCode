declare module qr {

    class QRCode {
        public static create(msg:string,color:any, width:number,height:number,errorCorrectLevel:number):MySprite;
        public static draw(m:qr.QRCodeModel ,_htOption):MySprite;
    }
}

declare module qr {

    class QRCodeModel {
    }
}