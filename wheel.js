const SIZE = 800
let canvas
let wheel

$(function() {
    canvas = $('#wheel')
    canvas[0].width = SIZE
    canvas[0].height = SIZE
    wheel = canvas[0].getContext('2d')

    wheel.beginPath()
    wheel.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 50, 0, 2 * Math.PI, false)
    wheel.fill()

    wheel.beginPath()
    wheel.moveTo(SIZE - 100, SIZE / 2)
    wheel.lineTo(SIZE - 10, SIZE / 2 - 10)
    wheel.lineTo(SIZE, SIZE / 2)
    wheel.lineTo(SIZE - 10, SIZE / 2 + 10)
    wheel.fillStyle = '#f00'
    wheel.fill()
})

const save = function() {
    $.post('php/save.php', {
        file: {
            group: 'test-1',
            people: [{
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
