const SIZE = 300
let canvas
let wheel
let group
let parts
let angle = 0

$(function() {
    canvas = $('#wheel')
    canvas[0].width = SIZE
    canvas[0].height = SIZE
    wheel = canvas[0].getContext('2d')

    wheel.beginPath()
    wheel.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 50, 0, 2 * Math.PI, false)
    wheel.fill()

    populateGroups()
    $('#groups').change(function() {
        $.getJSON('php/getGroup.php', {
            name: $(this).val()
        }, function(data) {
            group = JSON.parse(data)
            parts = calculateParts()
            drawGroup()
        })
    })

    $('#run').click(run)
})

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
    })
}

const drawGroup = function() {
    let start = 0
    let end = 0
    const colors = ['#ff0', '#f00', '#fff']
    let color = 0
    Object.keys(parts).forEach(function(name) {
        start = end
        end = start + parts[name]
        wheel.beginPath()
        wheel.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 60, start + angle, end + angle, false)
        wheel.lineTo(SIZE / 2, SIZE / 2)
        wheel.fillStyle = colors[color]
        wheel.fill()
        color = (color + 1) % 3
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

const run = function() {
    let speed = 0.8 * Math.random() + 0.2
    const slowDown = 0.001
    const timer = setInterval(function() {
        angle += speed
        speed -= slowDown
        drawGroup()
        console.log(angle);
        if (speed <= 0) {
            clearTimeout(timer)
        }
    }, 1000 / 60)
}
