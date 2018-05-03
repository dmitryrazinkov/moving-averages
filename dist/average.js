(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.average = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var isNumber = function isNumber(subject) {
        return typeof subject === 'number';
    };

    var isArray = Array.isArray;

    function dma(data, alpha, noHead) {

        var length = data.length;

        if (alpha > 1) {
            return Array(length);
        }

        if (alpha === 1) {
            return data.slice();
        }

        var noArrayWeight = !isArray(alpha);
        var ret = [];

        var datum = void 0;

        // period `i`
        var i = 0;

        // `s` is the value of the DWMA at any time period `i`
        var s = 0;

        // Handles head
        for (; i < length; i++) {
            datum = data[i];

            if (isNumber(datum) && (noArrayWeight || isNumber(datum))) {

                ret[i] = noHead ? 0 : datum;

                s = datum;
                i++;

                break;
            }
        }

        // Dynamic weights: an array of weights
        // Ref:
        // https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average
        // with a dynamic alpha
        if (!noArrayWeight) {
            for (; i < length; i++) {
                datum = data[i];

                isNumber(datum) && isNumber(alpha[i]) ? s = ret[i] = alpha[i] * datum + (1 - alpha[i]) * s : ret[i] = ret[i - 1];
            }

            return ret;
        }

        var o = 1 - alpha;

        // Fixed alpha
        for (; i < length; i++) {
            datum = data[i];

            isNumber(datum) ? s = ret[i] = alpha * datum + o * s : ret[i] = ret[i - 1];
        }

        return ret;
    }

    function ema(data, size) {
        return dma(data, 2 / (size + 1));
    }

    function ma(data, size) {
        var length = data.length;

        if (!size) {
            return data.reduce(function (a, b) {
                return a + b;
            }) / length;
        }

        if (size <= 1) {
            return data.slice();
        }

        if (size > length) {
            return Array(length);
        }

        var prepare = size - 1;
        var ret = [];
        var sum = 0;
        var i = 0;
        var counter = 0;
        var datum = void 0;

        for (; i < length && counter < prepare; i++) {
            datum = data[i];

            if (isNumber(datum)) {
                sum += datum;
                counter++;
            }
        }

        for (; i < length; i++) {
            datum = data[i];

            if (isNumber(datum)) {
                sum += datum;
            }

            if (isNumber(data[i - size])) {
                sum -= data[i - size];
            }

            ret[i] = sum / size;
        }

        return ret;
    }

    function sma(data, size) {
        var times = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        return dma(data, times / size, 1);
    }

    function wma(data, size) {
        var length = data.length;

        if (size <= 1) {
            return data.slice();
        }

        if (size > length) {
            return Array(length);
        }

        var ret = [];
        var denominator = size * (size + 1) / 2;
        var prepare = size - 1;
        var sum = 0;
        var numerator = 0;
        var datum = 0;
        var i = 0;
        var real = -1;

        for (; i < prepare; i++) {
            datum = data[i];

            if (isNumber(datum)) {
                sum += datum;
                numerator += (i + 1) * datum;
            }
        }

        for (; i < length; i++, real++) {
            datum = data[i];

            if (isNumber(datum)) {
                sum += datum;
                numerator += size * datum;
            }

            if (real >= 0 && isNumber(data[real])) {
                sum -= data[real];
            }

            ret[i] = numerator / denominator;
            numerator -= sum;
        }

        return ret;
    }

    exports.dma = dma;
    exports.sma = sma;
    exports.ema = ema;
    exports.ma = ma;
    exports.wma = wma;
});
