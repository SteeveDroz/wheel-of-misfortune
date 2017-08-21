let canvas
let wheel

$(function() {
    canvas = $('#wheel')
    canvas[0].width = 800
    canvas[0].height = 800
    wheel = canvas[0].getContext('2d')
})
