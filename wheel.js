let SIZE = 800
let canvas
let wheel
let group
let parts
let angle = 0
let colors
let proportional

$(function() {
    SIZE = $('body').width()
    canvas = $('#wheel')
    canvas[0].width = SIZE
    canvas[0].height = SIZE
    wheel = canvas[0].getContext('2d')

    wheel.beginPath()
    wheel.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 50, 0, 2 * Math.PI, false)
    wheel.fill()

    $('#mask').hide()
    $('#popup').hide()

    populateGroups()

    $('#groups').change(function() {
        reloadGroup(setColors)
    })

    $('#proportional').change(function() {
        group.proportional = $(this).is(':checked')
        updateGroup(reloadGroup)
    })

    $('#run').click(function() {
        run(selectChoice)
    })

    $('#reset').click(reset)
    $('#add-group').click(function() {
        openPopup('Add a group<input id="new-group-name" placeholder="Group name"><textarea id="new-group-choices" rows="20" placeholder="Choices, each on a new line"></textarea>', addGroup)
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
        proportional = group.proportional == 'true'
        $('#proportional').prop('checked', proportional)
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

const populateGroups = function(callback) {
    $.getJSON('php/populateGroups.php', function(data) {
        const groups = $('#groups')
        groups.html('')
        $.each(data, function(id) {
            groups.append($('<option>', {
                val: data[id],
                text: data[id].substr(0, data[id].length - 5)
            }))
        })
        reloadGroup(setColors)
        if (callback !== undefined) {
            callback(data)
        }
    })
}

const drawGroup = function() {
    let start = 0
    let end = 0
    let color = 0
    Object.keys(parts).forEach(function(name) {
        if (parts[name] == 0) {
            color = (color + 1) % colors.length
            return
        }
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

const run = function(finished) {
    if (parts === undefined) {
        return
    }
    $('#working *').prop('disabled', true)
    let speed = 0.3 * Math.random() + 0.2
    const slowDown = 0.001
    const timer = setInterval(function() {
        angle += speed
        speed -= slowDown
        drawGroup()
        if (speed <= 0) {
            clearTimeout(timer)
            $('#working *').prop('disabled', false)
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
        openPopup(selected, function() {
            updateGroup(reloadGroup)
        })
    }
}

const openPopup = function(content, callback) {
    $('#popup-text').html(content)
    $('#mask').fadeIn()
    $('#popup').fadeIn()
    $('#ok').unbind('click')
    $('#ok').click(function() {
        callback()
        closePopup()
    })
    $('#cancel').unbind('click')
    $('#cancel').click(closePopup)
}

const closePopup = function() {
    $('#popup').fadeOut(400, function() {
        $('#popup-text').text('')
    })
    $('#mask').fadeOut()
}

const updateGroup = function(callback) {
    $.post('php/save.php', {
        file: group
    }, function(data) {
        callback()
    })
}

const reset = function() {
    openPopup('Are you sure you want to reset?', confirmReset)
}

const confirmReset = function() {
    group.choices.forEach(function(choice) {
        choice.points = 0
    })
    updateGroup(reloadGroup)
}

const addGroup = function() {
    let newName = $('#new-group-name').val()
    const newChoices = $('#new-group-choices')
        .val()
        .split(/[\r\n]+/)
        .map(function(element) {
            return element.trim()
        })
        .filter(function(element) {
            return element
        })

    if (!newName) {
        console.log('Name required')
        return
    }
    while ($('#groups').find(':contains(' + newName + ')').length > 0) {
        newName += '_'
    }
    if (newChoices.length == 0) {
        console.log('Non-empty lines required')
        return
    }

    const newGroup = {}
    newGroup.group = newName
    newGroup.proportional = false
    newGroup.choices = []
    newChoices.forEach(function(choice) {
        newGroup.choices.push({
            name: choice,
            points: 0
        })
    })
    group = newGroup
    updateGroup(function() {
        populateGroups(function() {
            $('#groups').val(newName + '.json')
            reloadGroup(setColors)
        })
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
