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
    //TODO Do something
    return
    let editName = $('#edit-group-name').val()
    const editChoices = $('#edit-group-choices')
        .val()
        .split(/[\r\n]+/)
        .map(function(element) {
            element = element.trim()
            return element.split(/\s*->\s*/)
        })
        .filter(function(element) {
            if (element.length == 2) {
                return element
            }
            return false
        })

    if (!editName) {
        console.log('Name required')
        return
    }
    if (editName != group.group) {
        while ($('#groups').find(':contains(' + editName + ')').length > 0) {
            editName += '_'
        }
    }
    if (editChoices.length == 0) {
        console.log('Non-empty lines required with syntax "name -> points"')
        return
    }

    const editGroup = {}
    editGroup.group = editName
    editGroup.proportional = false
    editGroup.choices = []
    editChoices.forEach(function(choice) {
        editGroup.choices.push({
            name: choice[0],
            points: choice[1]
        })
    })
    editGroup.proportional = group.proportional

    const oldName = group.group
    group = editGroup
    updateGroup(function() {
        if (oldName != editName) {
            $.post('php/delete.php', {
                file: oldName
            })
        }
        populateGroups(function() {
            $('#groups').val(editName)
            reloadGroup(setColors)
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
            change: editGroup
        }))

        const row = $('<tr>')
        row.append(name)
        row.append(points)
        row.append(disabled)
        table.find('tbody').append(row)
    }
}
