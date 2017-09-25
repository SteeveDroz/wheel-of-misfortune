"use strict";

$(function() {
    new Promise(function(resolve, reject) {
        setTimeout(resolve, 1000)
    }).then(redraw).then(populateGroups).then(function() {
        if (group === undefined) {
            addGroupPopup()
        }
    })
    $('#mask').hide()
    $('#popup').hide()

    $('#groups').change(function() {
        reloadGroup().then(setColors).then(drawGroup).then(updateGroupDisplay)
    })
})

const redraw = function() {
    return new Promise(function(resolve, reject) {
        SIZE = Math.min($('#center').width(), $('#center').height() - $('h1').eq(0).height() - $('#run').height()) - 10

        canvas = $('#wheel')
        canvas[0].width = SIZE
        canvas[0].height = SIZE
        wheel = canvas[0].getContext('2d')

        wheel.clearRect(0, 0, SIZE, SIZE)
        wheel.beginPath()
        wheel.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 50, 0, 2 * Math.PI, false)
        wheel.fill()
        resolve()
    })
}

$('#proportional').change(function() {
    group.proportional = $(this).is(':checked')
    updateGroupDisplay()
    updateGroup().then(reloadGroup).then(drawGroup)
})

$('#twice-in-a-row').change(function() {
    updateGroup().then(reloadGroup).then(drawGroup)
})

$('#run').click(function() {
    run().then(selectChoice)
})

$('#disabled').click(function() {
    $('#group-display').slideToggle()
})

$('#reset').click(function() {
    resetPopup()
})

$('#add-group').click(function() {
    addGroupPopup()
})

$('#delete-group').click(function() {
    deleteGroupPopup()
})

const resetPopup = function() {
    openPopup('Are you sure you want to reset?').then(reset).then(updateGroup).then(reloadGroup).then(drawGroup)
        .then(updateGroupDisplay).catch(nothing)
}

const addGroupPopup = function() {
    openPopup('Add a group<input id="new-group-name" placeholder="Group name"><textarea id="new-group-choices" rows="20" placeholder="Choices, each on a new line"></textarea>').then(addGroup).catch(nothing)
}

const deleteGroupPopup = function() {
    openPopup('Are you sure you want to delete the group ' + $('#groups').val() + '?').then(function() {
        return deleteGroup($('#groups').val())
    }).catch(nothing).then(populateGroups).then(reloadGroup).then(drawGroup).catch(function() {
        group = undefined
        redraw().then(updateGroupDisplay).then(function() {
            setTimeout(addGroupPopup, 1000)
        })
    })
}
