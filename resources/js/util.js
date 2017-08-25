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
