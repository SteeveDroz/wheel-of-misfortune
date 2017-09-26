"use strict";

$(function() {
    fetchLocale().then(translate).then(function() {
        setMenu(false)
    }).then(function() {
        return new Promise(function(resolve, reject) {
            setTimeout(resolve, 1000)
        })
    }).then(redraw).then(populateGroups).then(function() {
        if (group === undefined) {
            addGroupPopup()
        }
    }).then(nothing)
    $('#mask').hide()
    $('#popup').hide()

    $('#groups').change(function() {
        reloadGroup().then(setColors).then(drawGroup).then(updateGroupDisplay)
    })
})

const redraw = function() {
    return new Promise(function(resolve, reject) {
        SIZE = Math.min($('#center').width(), $('#center').height() - $('h1').eq(0).height() - $('#run').height()) - 10

        canvas = $('#wheel')
        canvas[0].width = SIZE
        canvas[0].height = SIZE
        wheel = canvas[0].getContext('2d')

        wheel.clearRect(0, 0, SIZE, SIZE)
        wheel.beginPath()
        wheel.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 50, 0, 2 * Math.PI, false)
        wheel.fill()
        resolve()
    })
}

$('#proportional').change(function() {
    group.proportional = $(this).is(':checked')
    updateGroupDisplay()
    updateGroup().then(reloadGroup).then(drawGroup)
})

$('#twice-in-a-row').change(function() {
    updateGroup().then(reloadGroup).then(drawGroup)
})

$('#run').click(function() {
    setMenu(true).then(run).then(selectChoice).then(function() {
        setMenu(false)
    })
})

$('#disabled').click(function() {
    $('#group-display').slideToggle()
})

$('#reset').click(function() {
    resetPopup()
})

$('#add-group').click(function() {
    addGroupPopup()
})

$('#delete-group').click(function() {
    deleteGroupPopup()
})

const resetPopup = function() {
    openPopup(i18n.__('Reset'), i18n.__('Are you sure you want to reset?')).then(reset).then(updateGroup).then(reloadGroup).then(drawGroup)
        .then(updateGroupDisplay).catch(nothing)
}

const addGroupPopup = function() {
    $('#ok').prop('disabled', true)
    const enableOk = function() {
        if ($('#new-group-name').val().trim() == '' || $('#new-group-choices').val().trim() == '') {
            $('#ok').prop('disabled', true)
        } else {
            $('#ok').prop('disabled', false)
        }
    }

    const groupForm = $('<div>', {
        css: {
            display: 'flex',
            flexDirection: 'column'
        }
    })
    groupForm.append($('<input>', {
        id: 'new-group-name',
        placeholder: i18n.__('Group name'),
        size: 50,
        keyup: enableOk
    }))
    groupForm.append($('<textarea>', {
        id: 'new-group-choices',
        rows: 20,
        placeholder: i18n.__('Choices, each on a new line'),
        keyup: enableOk
    }))
    openPopup(i18n.__('Add a group'), groupForm).then(addGroup).catch(nothing)
}

const deleteGroupPopup = function() {
    openPopup(i18n.__('Delete the group'), i18n.__(`Are you sure you want to delete the group "{{groupName}}"?`, {
        groupName: $('#groups').val()
    })).then(function() {
        return deleteGroup($('#groups').val())
    }).catch(nothing).then(populateGroups).then(reloadGroup).then(drawGroup).catch(function() {
        group = undefined
        redraw().then(updateGroupDisplay).then(function() {
            setTimeout(addGroupPopup, 1000)
        })
    })
}

const about = function() {
    openPopup(i18n.__('About'), `<div style="margin-bottom:30px">The Wheel of Misfortune, v${require('../package.json').version}</div><div id="license" style="white-space: pre-wrap;width:75vw;"></div><script>$('#license').load('../LICENSE')</script>`).then(nothing).catch(nothing)
}
