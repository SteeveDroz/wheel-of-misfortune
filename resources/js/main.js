"use strict";

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
