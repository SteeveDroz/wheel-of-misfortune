"use strict";

const calculateParts = function() {
    const min = getMin()
    const total = proportional ? getTotalProportional(min) : getTotalSimple(min)
    const parts = {}
    group.choices.forEach(function(choice) {
        const part = proportional ? getProportion(choice.points, min) : (choice.points == min ? 1 : 0)
        parts[choice.name] = part / total * 2 * Math.PI
    })
    return parts
}

const getMin = function() {
    let min = Infinity
    group.choices.forEach(function(choice) {
        min = Math.min(choice.points, min)
    })
    return min
}

const getTotalSimple = function(min) {
    let total = 0
    group.choices.forEach(function(choice) {
        total += choice.points == min ? 1 : 0
    })
    return total
}

const getTotalProportional = function(min) {
    let total = 0
    group.choices.forEach(function(choice) {
        total += getProportion(choice.points, min)
    })
    return total
}

const getProportion = function(value, min) {
    return 1 / Math.pow(2, value - min + 1)
}

const getRandomBrightColor = function() {
    const letters = '0123456789abcdef'
    let code = ''
    for (let i = 0; i < 2; i++) {
        code += letters[Math.floor(Math.random() * letters.length)]
    }

    let color = '#'

    const type = Math.floor(Math.random() * 6)
    switch (type) {
        case 0: // Red -> Yellow
            color += 'ff' + code + '00'
            break

        case 1: // Yellow -> Green
            color += code + 'ff00'
            break

        case 2: // Green -> Cyan
            color += '00ff' + code
            break

        case 3: // Cyan -> Blue
            color += '00' + code + 'ff'
            break

        case 4: // Blue -> Magenta
            color += code + '00ff'
            break

        case 5: // Magenta -> Red
            color += 'ff00' + code
            break

        default:
            return undefined
    }
    return color
}

const hsv2Rgb = function(h, s, v) {
    if (arguments.length == 1) {
        v = h.v
        s = h.s
        h = h.h
    }
    const rgb = {
        r: 0,
        g: 0,
        b: 0
    }
    const firstColor = s * v
    const angle = 6 * h / (2 * Math.PI)
    const secondColor = firstColor * (1 - Math.abs(angle % 2 - 1))
    if (angle < 1) {
        rgb.r = firstColor
        rgb.g = secondColor
    } else if (angle < 2) {
        rgb.g = firstColor
        rgb.r = secondColor
    } else if (angle < 3) {
        rgb.g = firstColor
        rgb.b = secondColor
    } else if (angle < 4) {
        rgb.b = firstColor
        rgb.g = secondColor
    } else if (angle < 5) {
        rgb.b = firstColor
        rgb.r = secondColor
    } else if (angle < 6) {
        rgb.r = firstColor
        rgb.b = secondColor
    }

    return rgb
}

const rgb2Color = function(rgb) {
    return '#' + percent2Hex(rgb.r) + percent2Hex(rgb.g) + percent2Hex(rgb.b)
}

const percent2Hex = function(percent) {
    const value = 16 * percent
    if (value < 0) {
        return undefined
    } else if (value <= 10) {
        return Math.floor(value)
    } else if (value <= 11) {
        return 'A'
    } else if (value <= 12) {
        return 'B'
    } else if (value <= 13) {
        return 'C'
    } else if (value <= 14) {
        return 'D'
    } else if (value <= 15) {
        return 'E'
    } else if (value <= 16) {
        return 'F'
    }
    return undefined
}

const getRainbowColor = function(n, total) {
    const rgb = hsv2Rgb(n / total * 2 * Math.PI, 1, 1)
    return rgb2Color(rgb)
}
