"use strict";

const isDisabled = function(id) {
    return $('#group-display table tbody tr').eq(id).find('input').prop('checked')
}

const isTwiceInARow = function(id) {
    return $('#twice-in-a-row').not(':checked').length > 0 && group.last === group.choices[id].name
}

const calculateParts = function() {
    const min = getMin()
    const total = group.proportional ? getTotalProportional(min) : getTotalSimple(min)
    $('#run').prop('disabled', total == 0)
    if (total == 0) {
        return {
            "Error, no choices available": 2 * Math.PI
        }
    }
    const parts = {}
    for (let i = 0; i < group.choices.length; i++) {
        const choice = group.choices[i]
        let part = 0
        if (isDisabled(i) || isTwiceInARow(i)) {
            part = 0
        } else if (group.proportional) {
            part = getProportion(choice.points, min)
        } else {
            part = (choice.points == min) ? 1 : 0
        }
        parts[choice.name] = part / total * 2 * Math.PI
    }
    return parts
}

const getMin = function() {
    let min = Infinity
    for (let i = 0; i < group.choices.length; i++) {
        const choice = group.choices[i]
        if (isDisabled(i) || isTwiceInARow(i)) {
            continue
        }
        min = Math.min(choice.points, min)
    }
    return min
}

const getTotalSimple = function(min) {
    let total = 0
    for (let i = 0; i < group.choices.length; i++) {
        const choice = group.choices[i]
        if (isDisabled(i) || isTwiceInARow(i)) {
            continue
        }
        total += choice.points == min ? 1 : 0
    }
    return total
}

const getTotalProportional = function(min) {
    let total = 0
    for (let i = 0; i < group.choices.length; i++) {
        const choice = group.choices[i]
        if (isDisabled(i) || isTwiceInARow(i)) {
            continue
        }
        total += getProportion(choice.points, min)
    }
    return total
}

const getProportion = function(value, min) {
    return 1 / Math.pow(2, value - min + 1)
}

const getRandomBrightColor = function() {
    return rgb2Color(hsv2Rgb(2 * Math.PI * Math.random(), 1, 1))
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

const removeFileType = function(fileName) {
    return fileName.split('.').slice(0, -1).join('.')
}
