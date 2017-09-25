"use strict";

const ipc = require('electron').ipcRenderer

const populateGroups = function() {
    return new Promise(function(resolve, reject) {
        const data = ipc.sendSync('populate-groups')
        if (data.error !== undefined) {
            reject(data.error)
            return
        }
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
            reloadGroup().then(setColors).then(drawGroup).then(updateGroupDisplay)
        }

        resolve(data)
    })
}

const reloadGroup = function() {
    return new Promise(function(resolve, reject) {
        group = ipc.sendSync('load-group', $('#groups').val())
        if (group !== null && group.error !== undefined) {
            reject()
            return
        }
        resolve()
        $('#proportional').prop('checked', group.proportional)
        parts = calculateParts()
    })
}

const updateGroup = function() {
    return new Promise(function(resolve, reject) {
        const result = ipc.sendSync('save-group', group)
        if (result !== null && result.error !== undefined) {
            reject()
            return
        }
        resolve()
    })
}

const deleteGroup = function(name) {
    return new Promise(function(resolve, reject) {
        const result = ipc.sendSync('delete-group', name)
        if (result !== null && result.error !== undefined) {
            reject()
            return
        }
        resolve()
    })
}
