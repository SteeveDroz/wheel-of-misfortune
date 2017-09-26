"use strict";

const addGroup = function() {
    let newName = $('#new-group-name').val().replace(/<script[^>]*>.*<\/script[^>]*>/, '').replace(/<script[^>]*>.*$/, '').trim()
    const newChoices = $('#new-group-choices')
        .val()
        .split(/[\r\n]+/)
        .map(function(element) {
            return element.replace(/<script[^>]*>.*<\/script[^>]*>/, '').replace(/<script[^>]*>.*$/, '').trim()
        })
        .filter(function(element) {
            return element
        })

    newName = createGroupName(newName)

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

    let newName = data.find('thead').find('td').eq(0).text().trim()
    if (newName == '') {
        newName = oldName
    }

    $('#groups option').filter(function() {
        return $(this).val() == oldName
    }).remove()
    newGroup.name = createGroupName(newName)

    newGroup.choices = []
    data.find('tbody tr').each(function(id, line) {
        const name = $(line).find('td').eq(0).text().trim()

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

    if (newGroup.choices.length == 0) {
        newGroup.choices = group.choices
    }

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
    const validateWithEnter = function(event) {
        if (event.which == 13) {
            event.preventDefault()
            $(this).blur()
        }
    }

    $('#group-display').text('')
    if (group === undefined) {
        return
    }
    const table = $('<table>')
    table.append(`<thead><tr></tr><tr><td>${i18n.__('Name')}</td><td>${i18n.__('Points')}</td><td>${i18n.__('Disabled')}</td></tr></thead><tbody></tbody>`)
    const title = $('<td>', {
        contenteditable: true,
        colspan: 3,
        text: group.name,
        blur: editGroup,
        keydown: validateWithEnter
    })
    table.find('thead').find('tr').eq(0).append(title)
    $('#group-display').append(table)
    for (let i = 0; i < group.choices.length; i++) {
        const choice = group.choices[i]

        const name = $('<td>', {
            contenteditable: true,
            blur: editGroup,
            keydown: validateWithEnter
        })
        name.append(choice.name)

        const points = $('<td>', {
            contenteditable: true,
            blur: editGroup,
            keydown: validateWithEnter
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

    const row = $('<tr>')
    row.append($('<td>', {
        contenteditable: true,
        blur: editGroup,
        keydown: validateWithEnter
    }))
    row.append('<td>-</td><td><input type="checkbox" disabled></td>')
    table.find('tbody').append(row)
}

const reset = function() {
    group.choices.forEach(function(choice) {
        choice.points = 0
    })
    group.last = undefined
}
