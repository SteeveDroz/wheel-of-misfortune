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
            $('#groups').val(newName)
            reloadGroup(setColors)
        })
    })
}

const editGroup = function() {
    const data = $('#disabled-choices table')
    const newGroup = {}
    const oldName = group.group

    newGroup.group = data.find('thead').find('td').eq(0).text()

    newGroup.choices = []
    data.find('tbody tr').each(function(id, line) {
        const name = $(line).find('td').eq(0).text()
        const points = $(line).find('td').eq(1).text()
        const disabled = $(line).find('td').eq(2).find('input').prop('checked')
        if (name.trim() != '') {
            newGroup.choices.push({
                name: name,
                points,
                points,
                disabled: disabled
            })
        }
    })

    newGroup.last = group.last

    newGroup.proportional = group.proportional

    group = newGroup

    updateGroup(function() {
        deleteGroup(oldName, function() {
            populateGroups(function() {
                $('#groups').val(newGroup.group)
                reloadGroup()
                clearDisabled()
            })
        })
    })
}

const clearDisabled = function() {
    $('#disabled-choices').text('')
    const table = $('<table>')
    table.append('<thead><tr></tr><tr><td>Name</td><td>Points</td><td>Disabled</td></tr></thead><tbody></tbody>')
    const title = $('<td>', {
        contenteditable: true,
        blur: editGroup,
        colspan: 3,
        text: group.group
    })
    table.find('thead').find('tr').eq(0).append(title)
    $('#disabled-choices').append(table)
    for (let i = 0; i < group.choices.length; i++) {
        const choice = group.choices[i]

        const name = $('<td>', {
            contenteditable: true,
            blur: editGroup
        })
        name.append(choice.name)

        const points = $('<td>', {
            contenteditable: true,
            blur: editGroup
        })
        points.append(choice.points)

        const disabled = $('<td>')
        disabled.append($('<input>', {
            type: 'checkbox',
            checked: choice.disabled,
            change: editGroup
        }))

        const row = $('<tr>')
        row.append(name)
        row.append(points)
        row.append(disabled)
        table.find('tbody').append(row)
    }
}
