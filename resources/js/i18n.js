const i18n = require('i18n')

i18n.configure({
    directory: `${__dirname}/../i18n/`
})

const fetchLocale = function() {
    return new Promise(function(resolve, reject) {
        const locale = ipc.sendSync('fetch-locale')
        if (locale !== null && locale.error !== undefined) {
            reject()
        } else {
            i18n.setLocale(locale)
            resolve()
        }
    })
}

const translate = function() {
    return new Promise(function(resolve, reject) {
        const elements = []
        addAllToArray($('head title'), elements)
        addAllToArray($('label'), elements)
        addAllToArray($('button'), elements)
        addAllToArray($('h1'), elements)

        elements.forEach(function(element) {
            element.text(i18n.__(element.text()))
        })
        resolve()
    })
}

const addAllToArray = function(elements, array) {
    elements.each(function() {
        array.push($(this))
    })
}

const changeLanguage = function() {
    const buttons = $('<div>', {
        css: {
            display: 'flex',
            flexFlow: 'row wrap',
            maxWidth: 180
        }
    })

    const languages = ipc.sendSync('list-languages')
    languages.forEach(function(language) {
        const name = removeFileType(language)
        const button = $('<button>', {
            text: name.toUpperCase(),
            click: function() {
                i18n.setLocale(name)
                $('#ok').click()
            },
            css: {
                marginBottom: 10,
                marginRight: 10,
                width: 50,
                height: 50
            }
        })
        buttons.append(button)
    })
    openPopup(i18n.__('Change language'), buttons).then(relaunch).then(nothing).catch(nothing)
}
