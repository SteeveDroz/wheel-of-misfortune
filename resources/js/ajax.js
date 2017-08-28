"use strict";

const populateGroups = function(callback) {
    $.getJSON('php/populateGroups.php', function(data) {
        const groups = $('#groups')
        groups.html('')
        $.each(data, function(id) {
            groups.append($('<option>', {
                val: data[id],
                text: data[id].substr(0, data[id].length - 5)
            }))
        })
        reloadGroup(setColors)
        if (callback !== undefined) {
            callback(data)
        }
    })
}

const updateGroup = function(callback) {
    $.post('php/save.php', {
        file: group
    }, function(data) {
        callback()
    })
}

const reloadGroup = function(callback) {
    $.getJSON('php/getGroup.php', {
        name: $('#groups').val()
    }, function(data) {
        group = JSON.parse(data)
        if (callback !== undefined) {
            callback()
        }
        proportional = group.proportional == 'true'
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
        parts = calculateParts()
        drawGroup()
    })
}
