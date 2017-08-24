const SIZE = 800
let canvas
let wheel
let group
let parts
let angle = 0
let colors

$(function() {
    canvas = $('#wheel')
    canvas[0].width = SIZE
    canvas[0].height = SIZE
    wheel = canvas[0].getContext('2d')

    wheel.beginPath()
    wheel.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 50, 0, 2 * Math.PI, false)
    wheel.fill()

    $('#popup').hide()
    $('#ok').click(function() {
        updateGroup()
        closePopup()
    })
    $('#cancel').click(closePopup)

    populateGroups()
    $('#groups').change(function() {
        reloadGroup(setColors)
    })

    $('#run').click(function() {
        run(selectChoice)
    })
})

const setColors = function() {
    if (group.choices !== undefined) {
        colors = []
        group.choices.forEach(function(choice) {
            colors.push(getRandomBrightColor())
        })
    }
}

const reloadGroup = function(callback) {
    $.getJSON('php/getGroup.php', {
        name: $('#groups').val()
    }, function(data) {
        group = JSON.parse(data)
        if (callback !== undefined) {
            callback()
        }
        parts = calculateParts()
        drawGroup()
    })
}

const save = function() {
    $.post('php/save.php', {
        file: {
            group: 'test-1',
            choices: [{
                name: 'user 1',
                points: 3
            }, {
                name: 'user 2',
                points: 1
            }]
        }
    }, function(data) {
        alert(data)
    })
}

const populateGroups = function() {
    $.getJSON('php/populateGroups.php', function(data) {
        const groups = $('#groups')
        $.each(data, function(id) {
            groups.append($('<option>', {
                val: data[id],
                text: data[id].substr(0, data[id].length - 5)
            }))
        })
        reloadGroup(setColors)
    })
}

const drawGroup = function() {
    let start = 0
    let end = 0
    let color = 0
    Object.keys(parts).forEach(function(name) {
        start = end
        end = start + parts[name]
        wheel.beginPath()
        wheel.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 60, start + angle, end + angle, false)
        wheel.lineTo(SIZE / 2, SIZE / 2)
        wheel.fillStyle = colors[color]
        wheel.strokeStyle = '#000'
        wheel.lineWidth = 3
        wheel.fill()
        wheel.stroke()
        color = (color + 1) % colors.length

        const text = name + ' (' + (Math.round(10000 * parts[name] / (2 * Math.PI)) / 100) + '%)'
        wheel.translate(SIZE / 2, SIZE / 2)
        wheel.rotate(start + angle)
        wheel.fillStyle = '#000'
        wheel.font = '20pt sans-serif'
        wheel.fillText(text, SIZE / 2 - 65 - wheel.measureText(text).width, 25)
        wheel.rotate(-start - angle)
        wheel.translate(-SIZE / 2, -SIZE / 2)
    })
    drawNeedle()
}

const drawNeedle = function() {
    wheel.beginPath()
    wheel.moveTo(SIZE - 100, SIZE / 2)
    wheel.lineTo(SIZE - 10, SIZE / 2 - 10)
    wheel.lineTo(SIZE, SIZE / 2)
    wheel.lineTo(SIZE - 10, SIZE / 2 + 10)
    wheel.fillStyle = '#000'
    wheel.fill()
}

const calculateParts = function() {
    const min = getMin()
    const total = getTotal(min)
    const parts = {}
    group.choices.forEach(function(choice) {
        parts[choice.name] = getProportion(choice.points, min) / total * 2 * Math.PI
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

const getTotal = function(min) {
    let total = 0
    group.choices.forEach(function(choice) {
        total += getProportion(choice.points, min)
    })
    return total
}

const getProportion = function(value, min) {
    return 1 / Math.pow(2, value - min + 1)
}

const run = function(finished) {
    if (parts === undefined) {
        return
    }
    $('#run').prop('disabled', true)
    $('#groups').prop('disabled', true)
    let speed = 0.3 * Math.random() + 0.2
    const slowDown = 0.001
    const timer = setInterval(function() {
        angle += speed
        speed -= slowDown
        drawGroup()
        if (speed <= 0) {
            clearTimeout(timer)
            $('#run').prop('disabled', false)
            $('#groups').prop('disabled', false)
            finished()
        }
    }, 1000 / 60)
}

const selectChoice = function() {
    while (angle > 0) {
        angle -= 2 * Math.PI
    }

    let sum = 0
    let selected
    Object.keys(parts).forEach(function(part) {
        sum += parts[part]
        if (-angle <= sum && selected === undefined) {
            selected = part
        }
    })
    if (selected !== undefined) {
        group.choices.forEach(function(choice) {
            if (choice.name == selected) {
                choice.points++
            }
        })
        openPopup(selected)
    }
}

const openPopup = function(name) {
    $('#name').text(name)
    $('#popup').fadeIn()
}

const closePopup = function() {
    $('#popup').fadeOut()
}

const updateGroup = function() {
    $.post('php/save.php', {
        file: group
    }, function(data) {
        reloadGroup()
    })
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
