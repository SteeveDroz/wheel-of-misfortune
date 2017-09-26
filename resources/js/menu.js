const Menu = require('electron').remote.Menu

const template = [{
        label: i18n.__('File'),
        submenu: [{
                label: i18n.__('Close'),
                role: 'close'
            },
            {
                label: i18n.__('Quit'),
                role: 'quit'
            }
        ]
    },
    {
        label: i18n.__('Actions'),
        submenu: [{
                label: i18n.__('Run'),
                accelerator: 'CmdOrCtrl+Enter',
                click: function() {
                    setMenu(true).then(run).then(selectChoice).then(function() {
                        setMenu(false)
                    })
                }
            },
            {
                label: i18n.__('Add group'),
                accelerator: 'CmdOrCtrl+N',
                click: function() {
                    addGroupPopup()
                }
            },
            {
                label: i18n.__('Reset'),
                accelerator: 'CmdOrCtrl+D',
                click: function() {
                    resetPopup()
                }
            },
            {
                label: i18n.__('Delete'),
                accelerator: 'CmdOrCtrl+Delete',
                click: function() {
                    deleteGroupPopup()
                }
            }
        ]
    },
    {
        label: 'Dev',
        submenu: [{
                role: 'toggledevtools'
            },
            {
                role: 'reload'
            }
        ]
    },
    {
        label: i18n.__('Options'),
        submenu: [{
            label: i18n.__('Change language'),
            click: function() {
                changeLanguage()
            }
        }, {
            label: i18n.__('About'),
            click: function() {
                about()
            }
        }]
    }
]

const setMenu = function(disableActions) {
    return new Promise(function(resolve, reject) {
        const editedTemplate = Object.values($.extend(true, {}, template))
        if (disableActions) {
            editedTemplate.splice(1, 1)
        }
        const menu = Menu.buildFromTemplate(editedTemplate)
        Menu.setApplicationMenu(menu)
        resolve()
    })
}
