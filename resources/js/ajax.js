"use strict";

const updateGroup = function(callback) {
    $.post('php/save.php', {
        file: group
    }, function(data) {
        callback()
    })
}
