"use strict";

const addGroup = function() {
    let newName = $('#new-group-name').val()
    const newChoices = $('#new-group-choices')
        .val()
        .split(/[\r\n]+/)
        .map(function(element) {
            return element.trim()
        })
        .filter(function(element) {
            return element
        })

    if (!newName) {
        console.log('Name required')
        return
    }
    while ($('#groups').find(':contains(' + newName + ')').length > 0) {
        newName += '_'
    }
    if (newChoices.length == 0) {
        console.log('Non-empty lines required')
        return
    }

    const newGroup = {}
    newGroup.group = newName
    newGroup.proportional = false
    newGroup.choices = []
    newChoices.forEach(function(choice) {
        newGroup.choices.push({
            name: choice,
            points: 0
        })
    })
    group = newGroup
    updateGroup(function() {
        populateGroups(function() {
            $('#groups').val(newName + '.json')
            reloadGroup(setColors)
        })
    })
}

const clearDisabled = function() {
    $('#proportional').prop('checked', proportional)
    $('#disabled-choices').text('')
    for (let i = 0; i < group.choices.length; i++) {
        const choice = group.choices[i]
        const line = $('<div>', {
            css: {
                display: 'flex',
                flexDirection: 'row'
            }
        })
        line.append($('<input>', {
            type: 'checkbox',
            id: 'disable_' + i,
            name: 'disable_' + i,
            click: function() {
                parts = calculateParts()
                drawGroup()
            }
        }))
        line.append($('<label>', {
            for: 'disable_' + i,
            text: choice.name
        }))
        $('#disabled-choices').append(line)
    }
}
