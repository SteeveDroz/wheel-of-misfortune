"use strict";

const drawGroup = function() {
    let start = 0
    let end = 0
    let color = 0
    if (parts === undefined) {
        return
    }

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
        wheel.rotate(start + (end - start) / 2 + angle)
        wheel.fillStyle = '#000'
        const fontSize = 18
        wheel.font = fontSize + 'pt sans-serif'
        wheel.fillText(text, SIZE / 2 - 65 - wheel.measureText(text).width, fontSize / 2)
        wheel.rotate(-start - (end - start) / 2 - angle)
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

const setColors = function() {
    if (group.choices !== undefined) {
        colors = []
        for (let i = 0; i < group.choices.length; i++) {
            colors.push(getRainbowColor(i, group.choices.length))
        }
    }
}

const run = function() {
    return new Promise(function(resolve, reject) {
        if (parts === undefined) {
            return
        }
        $('button, select, input').prop('disabled', true)
        let speed = 0.3 * Math.random() + 0.2
        const slowDown = 0.001
        const timer = setInterval(function() {
            angle += speed
            speed -= slowDown
            drawGroup()
            if (speed <= 0) {
                clearTimeout(timer)
                $('button, select, input').prop('disabled', false)
                resolve()
            }
        }, 1000 / 60)
    })
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
    openPopup(i18n.__('Selected'), selected).then(function() {
        if (selected !== undefined) {
            group.choices.forEach(function(choice) {
                if (choice.name == selected) {
                    group.last = choice.name
                    choice.points++
                }
            })
        }
    }).then(updateGroup).then(reloadGroup).then(drawGroup).then(updateGroupDisplay).catch(nothing)
}
