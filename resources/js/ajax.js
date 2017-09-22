"use strict";

const ipc = require('electron').ipcRenderer

const populateGroups = function(callback) {
    const data = ipc.sendSync('populate-groups')
    const groups = $('#groups')
    groups.html('')
    data.forEach(function(file) {
        const name = removeFileType(file)
        groups.append($('<option>', {
            val: name,
            text: name
        }))
    })

    if (data.length > 0) {
        reloadGroup(function() {
            setColors()
            clearDisabled()
        })
    }

    if (callback != null) {
        callback(data)
    }
}

const reloadGroup = function(callback) {
    group = ipc.sendSync('load-group', $('#groups').val(), callback)
    if (callback != null) {
        callback()
    }
    $('#proportional').prop('checked', group.proportional)
    parts = calculateParts()
    drawGroup()
}

const updateGroup = function(callback) {
    ipc.sendSync('save-group', group)
    if (callback != null) {
        callback()
    }
}
