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
    $('#disabled-choices').hide()

    populateGroups()

    $('#groups').change(function() {
        reloadGroup(setColors)
    })

    $('#proportional').change(function() {
        group.proportional = $(this).is(':checked')
        clearDisabled()
        updateGroup(reloadGroup)
    })

    $('#run').click(function() {
        $('#disabled-choices').slideUp()
        run(selectChoice)
    })

    $('#hide').click(function() {
        $('#disabled-choices').slideToggle()
    })

    $('#reset').click(reset)

    $('#add-group').click(function() {
        openPopup('Add a group<input id="new-group-name" placeholder="Group name"><textarea id="new-group-choices" rows="20" placeholder="Choices, each on a new line"></textarea>', addGroup)
    })
    $('#edit-group').click(function() {
        const choiceLines = group.choices.map(function(choice) {
            return choice.name + ' -> ' + choice.points
        })
        openPopup('Edit group<input id="edit-group-name" placeholder="Group name" value="' + group.group + '"><textarea id="edit-group-choices" rows="20" placeholder="Choices, each on a new line">' + choiceLines.join('\n') + '</textarea>', editGroup)
    })
})
