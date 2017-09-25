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
    newName = createGroupName(newName)
    if (newChoices.length == 0) {
        console.log('Non-empty lines required')
        return
    }

    const newGroup = {}
    newGroup.name = newName
    newGroup.proportional = false
    newGroup.choices = []
    newChoices.forEach(function(choice) {
        newGroup.choices.push({
            name: choice,
            points: 0
        })
    })
    group = newGroup
    updateGroup().then(populateGroups).then(function() {
        $('#groups').val(newName)
    }).then(reloadGroup).then(setColors).then(drawGroup)
}

const createGroupName = function(name) {
    while ($('#groups').find('option').filter(function() {
            return $(this).val() == name
        }).length > 0) {
        name += '_'
    }
    return name
}

const editGroup = function() {
    const data = $('#group-display table')
    const newGroup = {}
    const oldName = group.name
    const newName = data.find('thead').find('td').eq(0).text().trim()
    $('#groups option').filter(function() {
        return $(this).val() == oldName
    }).remove()
    newGroup.name = createGroupName(newName)

    newGroup.choices = []
    data.find('tbody tr').each(function(id, line) {
        const name = $(line).find('td').eq(0).text()

        const pointsFromField = Number($(line).find('td').eq(1).text())
        const points = isNaN(pointsFromField) ? 0 : pointsFromField

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

    updateGroup().then(function() {
        if (oldName != group.name) {
            deleteGroup(oldName)
        }
    }).then(populateGroups).then(function() {
        $('#groups').val(newGroup.name)
    }).then(reloadGroup).then(updateGroupDisplay).then(drawGroup)
}

const updateGroupDisplay = function() {
    $('#group-display').text('')
    const table = $('<table>')
    table.append('<thead><tr></tr><tr><td>Name</td><td>Points</td><td>Disabled</td></tr></thead><tbody></tbody>')
    const title = $('<td>', {
        contenteditable: true,
        blur: editGroup,
        colspan: 3,
        text: group.name
    })
    table.find('thead').find('tr').eq(0).append(title)
    $('#group-display').append(table)
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
    table.find('tbody').append('<tr><td contenteditable onblur="editGroup()"></td><td></td><td><input type="checkbox"></td></tr>')
}

const reset = function() {
    group.choices.forEach(function(choice) {
        choice.points = 0
    })
    group.last = undefined
}
