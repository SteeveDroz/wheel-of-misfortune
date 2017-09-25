"use strict";

const openPopup = function(content) {
    return new Promise(function(resolve, reject) {
        $('#popup-text').html(content)
        $('#mask').fadeIn()
        $('#popup').fadeIn()
        $('#ok').unbind('click')
        $('#ok').click(function() {
            resolve()
            closePopup()
        })
        $('#cancel').unbind('click')
        $('#cancel').click(function() {
            closePopup()
            reject()
        })
    })
}

const closePopup = function() {
    $('#popup').fadeOut(400, function() {
        $('#popup-text').text('')
    })
    $('#mask').fadeOut()
}

const reset = function() {
    openPopup('Are you sure you want to reset?').then(confirmReset).then(updateGroupDisplay)
}

const confirmReset = function() {
    group.choices.forEach(function(choice) {
        choice.points = 0
    })
    group.last = undefined
    updateGroup().then(reloadGroup).then(drawGroup)
}
