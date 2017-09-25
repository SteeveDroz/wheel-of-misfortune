"use strict";

$(function() {
    SIZE = Math.min($('#center').width(), $('#center').height() - $('h1').eq(0).height() - $('#run').height()) - 10
    canvas = $('#wheel')
    canvas[0].width = SIZE
    canvas[0].height = SIZE
    wheel = canvas[0].getContext('2d')

    wheel.beginPath()
    wheel.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 50, 0, 2 * Math.PI, false)
    wheel.fill()

    $('#mask').hide()
    $('#popup').hide()

    populateGroups().then()

    $('#groups').change(function() {
        reloadGroup().then(setColors).then(drawGroup).then(updateGroupDisplay)
    })
})

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
    reset()
})

$('#add-group').click(function() {
    openPopup('Add a group<input id="new-group-name" placeholder="Group name"><textarea id="new-group-choices" rows="20" placeholder="Choices, each on a new line"></textarea>').then(addGroup)
})

$('#edit-group').click(function() {
    const choiceLines = group.choices.map(function(choice) {
        return choice.name + ' -> ' + choice.points
    })

    openPopup('Edit group<input id="edit-group-name" placeholder="Group name" value="' + group.name + '"><textarea id="edit-group-choices" rows="20" placeholder="Choices, each on a new line">' + choiceLines.join('\n') + '</textarea>').then(editGroup)
})
