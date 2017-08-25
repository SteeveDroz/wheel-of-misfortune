"use strict";

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

const reset = function() {
    openPopup('Are you sure you want to reset?', confirmReset)
}

const confirmReset = function() {
    group.choices.forEach(function(choice) {
        choice.points = 0
    })
    updateGroup(reloadGroup)
}
