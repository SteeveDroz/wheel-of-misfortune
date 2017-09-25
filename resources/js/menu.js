const Menu = require('electron').remote.Menu

const template = [{
        label: 'File',
        submenu: [{
                role: 'close'
            },
            {
                role: 'quit'
            }
        ]
    },
    {
        label: 'Actions',
        submenu: [{
                label: 'Run',
                accelerator: 'CmdOrCtrl+Enter',
                click: function() {
                    run().then(selectChoice)
                }
            },
            {
                label: 'Add group',
                accelerator: 'CmdOrCtrl+N',
                click: function() {
                    addGroupPopup()
                }
            },
            {
                label: 'Reset',
                accelerator: 'CmdOrCtrl+D',
                click: function() {
                    resetPopup()
                }
            },
            {
                label: 'Delete',
                accelerator: 'CmdOrCtrl+Delete',
                click: function() {
                    deleteGroupPopup()
                }
            }
        ]
    },
    // {
    //     label: 'Dev',
    //     submenu: [{
    //             role: 'toggledevtools'
    //         },
    //         {
    //             role: 'reload'
    //         }
    //     ]
    // },
    {
        label: '?',
        submenu: [{
            label: 'About',
            click: function() {
                about()
            }
        }]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
