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

        reloadGroup(function() {
            setColors()
            clearDisabled()
        })

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
        group.proportional = group.proportional == 'true'
        $('#proportional').prop('checked', group.proportional)
        parts = calculateParts()
        drawGroup()
    })
}
