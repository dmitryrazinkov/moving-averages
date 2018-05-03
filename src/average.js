const isNumber = subject => typeof subject === 'number';

const isArray = Array.isArray;

function dma (data, alpha, noHead) {

    const length = data.length

    if (alpha > 1) {
        return Array(length)
    }

    if (alpha === 1) {
        return data.slice()
    }

    const noArrayWeight = !isArray(alpha)
    const ret = []

    let datum

    // period `i`
    let i = 0

    // `s` is the value of the DWMA at any time period `i`
    let s = 0

    // Handles head
    for (; i < length; i ++) {
        datum = data[i]

        if (
            isNumber(datum)
            && (
                noArrayWeight
                || isNumber(datum)
            )
        ) {

            ret[i] = noHead
                ? 0
                : datum

            s = datum
            i ++

            break
        }
    }

    // Dynamic weights: an array of weights
    // Ref:
    // https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average
    // with a dynamic alpha
    if (!noArrayWeight) {
        for (; i < length; i ++) {
            datum = data[i]

            isNumber(datum) && isNumber(alpha[i])
                ? s =
                    ret[i] = alpha[i] * datum + (1 - alpha[i]) * s
                : ret[i] = ret[i - 1]
        }

        return ret
    }

    const o = 1 - alpha

    // Fixed alpha
    for (; i < length; i++) {
        datum = data[i]

        isNumber(datum)
            ? s =
                ret[i] = alpha * datum + o * s
            : ret[i] = ret[i - 1]
    }

    return ret
}

function ema (data, size) { return dma(data, 2 / (size + 1))}

function ma(data, size) {
    const length = data.length

    if (!size) {
        return data.reduce((a, b) => a + b) / length
    }

    if (size <= 1) {
        return data.slice()
    }

    if (size > length) {
        return Array(length)
    }

    const prepare = size - 1
    const ret = []
    let sum = 0
    let i = 0
    let counter = 0
    let datum

    for (; i < length && counter < prepare; i ++) {
        datum = data[i]

        if (isNumber(datum)) {
            sum += datum
            counter ++
        }
    }

    for (; i < length; i ++) {
        datum = data[i]

        if (isNumber(datum)) {
            sum += datum
        }

        if (isNumber(data[i - size])) {
            sum -= data[i - size]
        }

        ret[i] = sum / size
    }

    return ret
}

function sma(data, size, times = 1) { return dma(data, times / size, 1)}

function wma(data, size) {
    const length = data.length

    if (size <= 1) {
        return data.slice()
    }

    if (size > length) {
        return Array(length)
    }

    const ret = []
    const denominator = size * (size + 1) / 2
    const prepare = size - 1
    let sum = 0
    let numerator = 0
    let datum = 0
    let i = 0
    let real = -1


    for (; i < prepare; i ++) {
        datum = data[i]

        if (isNumber(datum)) {
            sum += datum
            numerator += (i + 1) * datum
        }
    }

    for (; i < length; i ++, real ++) {
        datum = data[i]

        if (isNumber(datum)) {
            sum += datum
            numerator += size * datum
        }

        if (real >= 0 && isNumber(data[real])) {
            sum -= data[real]
        }

        ret[i] = numerator / denominator
        numerator -= sum
    }

    return ret
}


export {
  dma,
  sma,
  ema,
  ma,
  wma
}
