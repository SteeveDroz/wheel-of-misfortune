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
        const data = ipc.sendSync('load-group', $('#groups').val())
        if (data !== null && data.error !== undefined) {
            reject()
            return
        }
        group = JSON.parse(JSON.stringify(data))
        group.choices = []
        const choicesNames = []
        data.choices.forEach(function(choice) {
            while (choicesNames.includes(choice.name)) {
                choice.name += '_'
            }
            choicesNames.push(choice.name)
            group.choices.push(choice)
        })
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

ipc.on('resize', function() {
    new Promise(function(resolve, reject) {
        setTimeout(resolve, 100)
    }).then(redraw).then(drawGroup)
})
