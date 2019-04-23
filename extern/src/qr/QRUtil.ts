/**
 * Created by qingzhu on 15/7/1.
 */
module qr {
    export class QRUtil{
        public static PATTERN_POSITION_TABLE = [ [], [ 6, 18 ], [ 6, 22 ], [ 6, 26 ], [ 6, 30 ], [ 6, 34 ], [ 6, 22, 38 ], [ 6, 24, 42 ], [ 6, 26, 46 ], [ 6, 28, 50 ], [ 6, 30, 54 ], [ 6, 32, 58 ], [ 6, 34, 62 ], [ 6, 26, 46, 66 ], [ 6, 26, 48, 70 ], [ 6, 26, 50, 74 ], [ 6, 30, 54, 78 ], [ 6, 30, 56, 82 ], [ 6, 30, 58, 86 ], [ 6, 34, 62, 90 ], [ 6, 28, 50, 72, 94 ], [ 6, 26, 50, 74, 98 ], [ 6, 30, 54, 78, 102 ], [ 6, 28, 54, 80, 106 ], [ 6, 32, 58, 84, 110 ], [ 6, 30, 58, 86, 114 ], [ 6, 34, 62, 90, 118 ], [ 6, 26, 50, 74, 98, 122 ], [ 6, 30, 54, 78, 102, 126 ], [ 6, 26, 52, 78, 104, 130 ], [ 6, 30, 56, 82, 108, 134 ], [ 6, 34, 60, 86, 112, 138 ], [ 6, 30, 58, 86, 114, 142 ], [ 6, 34, 62, 90, 118, 146 ], [ 6, 30, 54, 78, 102, 126, 150 ], [ 6, 24, 50, 76, 102, 128, 154 ], [ 6, 28, 54, 80, 106, 132, 158 ], [ 6, 32, 58, 84, 110, 136, 162 ], [ 6, 26, 54, 82, 110, 138, 166 ], [ 6, 30, 58, 86, 114, 142, 170 ] ];
        public static G15 = 1335;
        public static G18 = 7973;
        public static G15_MASK = 21522;
        public static getBCHTypeInfo(data) {
            var d = data << 10;
             while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
             return (data << 10 | d) ^ QRUtil.G15_MASK;
        }
        public static getBCHTypeNumber(data) {
            var d = data << 12;
             while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
            return data << 12 | d;
        }
        public static getBCHDigit(data) {
             var digit = 0;
             while (data != 0) digit++, data >>>= 1;
                return digit;
        }
        public static getPatternPosition (typeNumber) {
          return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
        }
        public static getMask(maskPattern, i, j) {
            switch (maskPattern) {
                case QRMaskPattern.PATTERN000:
                    return (i + j) % 2 == 0;
                case QRMaskPattern.PATTERN001:
                    return i % 2 == 0;
                case QRMaskPattern.PATTERN010:
                    return j % 3 == 0;
                case QRMaskPattern.PATTERN011:
                    return (i + j) % 3 == 0;
                case QRMaskPattern.PATTERN100:
                    return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
                case QRMaskPattern.PATTERN101:
                    return i * j % 2 + i * j % 3 == 0;
                case QRMaskPattern.PATTERN110:
                    return (i * j % 2 + i * j % 3) % 2 == 0;
                case QRMaskPattern.PATTERN111:
                    return (i * j % 3 + (i + j) % 2) % 2 == 0;
                default:
                    throw new Error("bad maskPattern:" + maskPattern);
            }
        }
        public static getErrorCorrectPolynomial(errorCorrectLength) {
            var a = new QRPolynomial([ 1 ], 0);
            for (var i = 0; i < errorCorrectLength; i++) a = a.multiply(new QRPolynomial([ 1, QRMath.gexp(i) ], 0));
            return a;
        }
        public static getLengthInBits(mode, type) {
            if (1 <= type && type < 10) switch (mode) {
                case qr.QRMode.MODE_NUMBER:
                    return 10;
                case qr.QRMode.MODE_ALPHA_NUM:
                    return 9;
                case qr.QRMode.MODE_8BIT_BYTE:
                    return 8;
                case qr.QRMode.MODE_KANJI:
                    return 8;
                default:
                    throw new Error("mode:" + mode);
            } else if (type < 27) switch (mode) {
                case qr.QRMode.MODE_NUMBER:
                    return 12;
                case qr.QRMode.MODE_ALPHA_NUM:
                    return 11;
                case qr.QRMode.MODE_8BIT_BYTE:
                    return 16;
                case qr.QRMode.MODE_KANJI:
                    return 10;
                default:
                    throw new Error("mode:" + mode);
            } else {
                if (!(type < 41)) throw new Error("type:" + type);
                switch (mode) {
                    case QRMode.MODE_NUMBER:
                        return 14;
                    case QRMode.MODE_ALPHA_NUM:
                        return 13;
                    case QRMode.MODE_8BIT_BYTE:
                        return 16;
                    case QRMode.MODE_KANJI:
                        return 12;
                    default:
                        throw new Error("mode:" + mode);
                }
            }
        }
        public static getLostPoint(qrCode) {
            var moduleCount = qrCode.getModuleCount(), lostPoint = 0;
            for (var row = 0; row < moduleCount; row++) for (var col = 0; col < moduleCount; col++) {
                var sameCount = 0, dark = qrCode.isDark(row, col);
                for (var r = -1; r <= 1; r++) {
                    if (row + r < 0 || moduleCount <= row + r) continue;
                    for (var c = -1; c <= 1; c++) {
                        if (col + c < 0 || moduleCount <= col + c) continue;
                        if (r == 0 && c == 0) continue;
                        dark == qrCode.isDark(row + r, col + c) && sameCount++;
                    }
                }
                sameCount > 5 && (lostPoint += 3 + sameCount - 5);
            }
            for (var row = 0; row < moduleCount - 1; row++) for (var col = 0; col < moduleCount - 1; col++) {
                var count = 0;
                qrCode.isDark(row, col) && count++, qrCode.isDark(row + 1, col) && count++, qrCode.isDark(row, col + 1) && count++, qrCode.isDark(row + 1, col + 1) && count++;
                if (count == 0 || count == 4) lostPoint += 3;
            }
            for (var row = 0; row < moduleCount; row++) for (var col = 0; col < moduleCount - 6; col++) qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6) && (lostPoint += 40);
            for (var col = 0; col < moduleCount; col++) for (var row = 0; row < moduleCount - 6; row++) qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col) && (lostPoint += 40);
            var darkCount = 0;
            for (var col = 0; col < moduleCount; col++) for (var row = 0; row < moduleCount; row++) qrCode.isDark(row, col) && darkCount++;
            var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
            return lostPoint += ratio * 10, lostPoint;
        }


        ///////////////////////////
        public static QRCodeLimitLength=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]];

        public  static_isSupportCanvas() {
            return typeof CanvasRenderingContext2D != "undefined";
        }

        public static _getTypeNumber(sText, nCorrectLevel) {
            var nType = 1;
            var length =QRUtil._getUTF8Length(sText);

            for (var i = 0, len = QRUtil.QRCodeLimitLength.length; i <= len; i++) {
                var nLimit = 0;

                switch (nCorrectLevel) {
                    case QRErrorCorrectLevel.L :
                        nLimit = QRUtil.QRCodeLimitLength[i][0];
                        break;
                    case QRErrorCorrectLevel.M :
                        nLimit = QRUtil.QRCodeLimitLength[i][1];
                        break;
                    case QRErrorCorrectLevel.Q :
                        nLimit = QRUtil.QRCodeLimitLength[i][2];
                        break;
                    case QRErrorCorrectLevel.H :
                        nLimit = QRUtil.QRCodeLimitLength[i][3];
                        break;
                }

                if (length <= nLimit) {
                    break;
                } else {
                    nType++;
                }
            }

            if (nType > QRUtil.QRCodeLimitLength.length) {
                throw new Error("Too long data");
            }

            return nType;
        }

        public static _getUTF8Length(sText) {
            var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
            return replacedText.length + (replacedText.length != sText ? 3 : 0);
        }
    }
}