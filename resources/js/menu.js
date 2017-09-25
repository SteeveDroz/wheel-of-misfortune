const Menu = require('electron').remote.Menu

const template = [{
    label: 'File',
    submenu: [{
        role: 'close'
    }, {
        role: 'quit'
    }]
}, {
    label: 'Actions',
    submenu: [{
            label: 'Run',
            accelerator: 'CmdOrCtrl+Enter',
            click: function() {
                run()
            }
        },
        {
            label: 'Add group',
            click: function() {
                addGroupPopup()
            }
        },
        {
            label: 'Reset',
            click: function() {
                reset()
            }
        }
    ]
}, {
    label: 'Dev',
    submenu: [{
        role: 'toggledevtools'
    }, {
        role: 'reload'
    }]
}]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
