"use strict";

const openPopup = function(title, content) {
    return new Promise(function(resolve, reject) {
        $('#popup-title').text(title)
        $('#popup-content').html(content)
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
        $('#popup-content').text('')
    })
    $('#mask').fadeOut()
}
