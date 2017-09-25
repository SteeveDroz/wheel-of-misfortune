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
            label: 'Add group'
        },
        {
            label: 'Reset'
        }
    ]
}]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
