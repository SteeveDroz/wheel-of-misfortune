"use strict";

const ipc = require('electron').ipcRenderer

ipc.on('populate-groups', function(event, data, callback) {
    const groups = $('#groups')
    groups.html('')
    data.forEach(function(file) {
        const name = file.split('.').slice(0, -1).join('.')
        groups.append($('<option>', {
            val: name,
            text: name
        }))
    })

    reloadGroup(function() {
        setColors()
        clearDisabled()
    })

    if (callback != null) {
        callback(data)
    }
})

ipc.on('load-group', function(event, data, callback) {
    group = data
    if (callback != null) {
        callback()
    }
    group.proportional = group.proportional == 'true'
    $('#proportional').prop('checked', group.proportional)
    parts = calculateParts()
    drawGroup()
})

ipc.on('save-group', function(event, callback) {
    if (callback != null) {
        callback()
    }
})

const populateGroups = function(callback) {
    ipc.send('populate-groups', callback)
}

const updateGroup = function(callback) {
    ipc.send('save-group', group, callback)
}

const reloadGroup = function(callback) {
    console.log(callback);
    ipc.send('load-group', $('#groups').val(), callback)
}
