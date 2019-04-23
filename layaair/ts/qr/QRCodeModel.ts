/**
 * Created by qingzhu on 15/7/1.
 */
module qr {
    export class QRCodeModel{
        public typeNumber:number ;
        public errorCorrectLevel ;
        public modules = null;
        public moduleCount = 0;
        public dataCache = null;
        public dataList = [];
        public constructor(typeNumber, errorCorrectLevel) {
            this.typeNumber = typeNumber;
            this.errorCorrectLevel = errorCorrectLevel;
            this.modules = null;
            this.moduleCount = 0;
            this.dataCache = null;
            this.dataList = [];
        }
        public addData(data) {
            var newData = new QR8bitByte(data);
            this.dataList.push(newData), this.dataCache = null;
        }
        public isDark(row, col) {
             if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) throw new Error(row + "," + col);
             return this.modules[row][col];
        }
        public getModuleCount() {
            return this.moduleCount;
        }
        public make() {
            this.makeImpl(!1, this.getBestMaskPattern());
        }
        public makeImpl(test, maskPattern) {
            this.moduleCount = this.typeNumber * 4 + 17, this.modules = new Array(this.moduleCount);
            for (var row = 0; row < this.moduleCount; row++) {
                this.modules[row] = new Array(this.moduleCount);
                for (var col = 0; col < this.moduleCount; col++) this.modules[row][col] = null;
            }
                this.setupPositionProbePattern(0, 0),
                this.setupPositionProbePattern(this.moduleCount - 7, 0),
                this.setupPositionProbePattern(0, this.moduleCount - 7),
                this.setupPositionAdjustPattern(),
                this.setupTimingPattern(),
                this.setupTypeInfo(test, maskPattern),
            this.typeNumber >= 7 && this.setupTypeNumber(test),
            this.dataCache == null && (this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, maskPattern);
        }
        public setupPositionProbePattern (row, col) {
            for (var r = -1; r <= 7; r++) {
                if (row + r <= -1 || this.moduleCount <= row + r) continue;
                for (var c = -1; c <= 7; c++) {
                    if (col + c <= -1 || this.moduleCount <= col + c) continue;
                    0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4 ? this.modules[row + r][col + c] = !0 : this.modules[row + r][col + c] = !1;
                }
            }
        }
        public getBestMaskPattern() {
            var minLostPoint = 0, pattern = 0;
            for (var i = 0; i < 8; i++) {
                this.makeImpl(!0, i);
                var lostPoint = QRUtil.getLostPoint(this);
                if (i == 0 || minLostPoint > lostPoint) minLostPoint = lostPoint, pattern = i;
            }
            return pattern;
        }
        public createMovieClip(target_mc, instance_name, depth) {
            var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth), cs = 1;
            this.make();
            for (var row = 0; row < this.modules.length; row++) {
                var y = row * cs;
                for (var col = 0; col < this.modules[row].length; col++) {
                    var x = col * cs, dark = this.modules[row][col];
                    dark && (qr_mc.beginFill(0, 100), qr_mc.moveTo(x, y), qr_mc.lineTo(x + cs, y), qr_mc.lineTo(x + cs, y + cs), qr_mc.lineTo(x, y + cs), qr_mc.endFill());
                }
            }
            return qr_mc;
        }
        public setupTimingPattern() {
            for (var r = 8; r < this.moduleCount - 8; r++) {
                if (this.modules[r][6] != null) continue;
                this.modules[r][6] = r % 2 == 0;
            }
            for (var c = 8; c < this.moduleCount - 8; c++) {
                if (this.modules[6][c] != null) continue;
                this.modules[6][c] = c % 2 == 0;
            }
        }
        public setupPositionAdjustPattern() {
            var pos = QRUtil.getPatternPosition(this.typeNumber);
            for (var i = 0; i < pos.length; i++) for (var j = 0; j < pos.length; j++) {
                var row = pos[i], col = pos[j];
                if (this.modules[row][col] != null) continue;
                for (var r = -2; r <= 2; r++) for (var c = -2; c <= 2; c++) r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0 ? this.modules[row + r][col + c] = !0 : this.modules[row + r][col + c] = !1;
            }
        }
        public setupTypeNumber(test) {
            var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
            for (var i = 0; i < 18; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
            }
            for (var i = 0; i < 18; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
            }
        }
        public setupTypeInfo(test, maskPattern) {
            var data = this.errorCorrectLevel << 3 | maskPattern, bits = QRUtil.getBCHTypeInfo(data);
            for (var i = 0; i < 15; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                i < 6 ? this.modules[i][8] = mod : i < 8 ? this.modules[i + 1][8] = mod : this.modules[this.moduleCount - 15 + i][8] = mod;
            }
            for (var i = 0; i < 15; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                i < 8 ? this.modules[8][this.moduleCount - i - 1] = mod : i < 9 ? this.modules[8][15 - i - 1 + 1] = mod : this.modules[8][15 - i - 1] = mod;
            }
            this.modules[this.moduleCount - 8][8] = !test;
        }
        public mapData(data, maskPattern) {
            var inc = -1, row = this.moduleCount - 1, bitIndex = 7, byteIndex = 0;
            for (var col = this.moduleCount - 1; col > 0; col -= 2) {
                col == 6 && col--;
                for (;;) {
                    for (var c = 0; c < 2; c++) if (this.modules[row][col - c] == null) {
                        var dark = !1;
                        byteIndex < data.length && (dark = (data[byteIndex] >>> bitIndex & 1) == 1);
                        var mask = QRUtil.getMask(maskPattern, row, col - c);
                        mask && (dark = !dark), this.modules[row][col - c] = dark, bitIndex--, bitIndex == -1 && (byteIndex++, bitIndex = 7);
                    }
                    row += inc;
                    if (row < 0 || this.moduleCount <= row) {
                        row -= inc, inc = -inc;
                        break;
                    }
                }
            }
        }
        ////
        public static PAD0 = 236;
        public static PAD1 = 17;
        public static createData(typeNumber, errorCorrectLevel, dataList) {
            var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel), buffer = new QRBitBuffer;
            for (var i = 0; i < dataList.length; i++) {
                var data = dataList[i];
                buffer.put(data.mode, 4), buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber)), data.write(buffer);
            }
            var totalDataCount = 0;
            for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
            if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
            buffer.getLengthInBits() + 4 <= totalDataCount * 8 && buffer.put(0, 4);
            while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(!1);
            for (;;) {
                if (buffer.getLengthInBits() >= totalDataCount * 8) break;
                buffer.put(QRCodeModel.PAD0, 8);
                if (buffer.getLengthInBits() >= totalDataCount * 8) break;
                buffer.put(QRCodeModel.PAD1, 8);
            }
            return QRCodeModel.createBytes(buffer, rsBlocks);
         }
        public static createBytes(buffer, rsBlocks) {
            var offset = 0, maxDcCount = 0, maxEcCount = 0, dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length);
            for (var r = 0; r < rsBlocks.length; r++) {
                var dcCount = rsBlocks[r].dataCount, ecCount = rsBlocks[r].totalCount - dcCount;
                maxDcCount = Math.max(maxDcCount, dcCount), maxEcCount = Math.max(maxEcCount, ecCount), dcdata[r] = new Array(dcCount);
                for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 255 & buffer.buffer[i + offset];
                offset += dcCount;
                var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount), rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1), modPoly = rawPoly.mod(rsPoly);
                ecdata[r] = new Array(rsPoly.getLength() - 1);
                for (var i = 0; i < ecdata[r].length; i++) {
                    var modIndex = i + modPoly.getLength() - ecdata[r].length;
                    ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
                }
            }
            var totalCodeCount = 0;
            for (var i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
            var data = new Array(totalCodeCount), index = 0;
            for (var i = 0; i < maxDcCount; i++) for (var r = 0; r < rsBlocks.length; r++) i < dcdata[r].length && (data[index++] = dcdata[r][i]);
            for (var i = 0; i < maxEcCount; i++) for (var r = 0; r < rsBlocks.length; r++) i < ecdata[r].length && (data[index++] = ecdata[r][i]);
            return data;
        }
    }
}