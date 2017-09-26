const electron = require('electron')
const fs = require('fs')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain

const dataDir = `${__dirname}/data`

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: `${__dirname}/assets/logo.png`
    })
    mainWindow.maximize()

    mainWindow.loadURL(`file://${__dirname}/resources/index.html`)

    //mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    })

    mainWindow.on('resize', function() {
        mainWindow.webContents.send('resize')
    })
    mainWindow.on('maximize', function() {
        mainWindow.webContents.send('resize')
    })
    mainWindow.on('unmaximize', function() {
        mainWindow.webContents.send('resize')
    })

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir)
    }

}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})

ipc.on('populate-groups', function(event) {
    try {
        const files = fs.readdirSync(`${dataDir}`).filter(function(file) {
            return file.endsWith('.json')
        })
        event.returnValue = files
    } catch (e) {
        console.log('Failed to load the list of groups')
        event.returnValue = {
            error: 'Failed to load the list of groups'
        }
    }
})

ipc.on('save-group', function(event, group) {
    try {
        fs.writeFileSync(`${dataDir}/${group.name}.json`, JSON.stringify(group), 'utf-8');
        event.returnValue = null
    } catch (e) {
        console.log('Failed to save the file!')
        event.returnValue = {
            error: 'Failed to save the file!'
        }
    }
})

ipc.on('load-group', function(event, name) {
    try {
        const group = JSON.parse(fs.readFileSync(`${dataDir}/${name}.json`, 'utf-8'));
        event.returnValue = group
    } catch (e) {
        console.log('Failed to load the file!')
        event.returnValue = {
            error: 'Failed to load the file!'
        }
    }
})

ipc.on('delete-group', function(event, name) {
    try {
        fs.unlinkSync(`${dataDir}/${name}.json`)
        event.returnValue = null
    } catch (e) {
        console.log('Failed to delete the file!')
        event.returnValue = {
            error: 'Failed to delete the file!'
        }
    }
})

ipc.on('list-languages', function(event) {
    try {
        const files = fs.readdirSync(`${__dirname}/i18n/`).filter(function(file) {
            return file.endsWith('.json')
        })
        event.returnValue = files
    } catch (e) {
        console.log('Failed to list the files')
        event.returnValue = {
            error: 'Failed to list the files'
        }
    }
})

ipc.on('fetch-locale', function(event) {
    try {
        event.returnValue = getConfig('locale')
    } catch (e) {
        console.log('Failed to fetch locale')
        returnValue = {
            error: 'Failed to fetch locale'
        }
    }
})

ipc.on('relaunch', function(event, locale) {
    try {
        setConfig('locale', locale)
        app.relaunch()
        app.quit()
        event.returnValue = null
    } catch (e) {
        console.log('Failed to relaunch')
        event.returnValue = {
            error: 'Failed to relaunch'
        }
    }
})

const getConfig = function(config) {
    const configJSON = getConfigJSON()
    return configJSON[config]
}

const setConfig = function(config, value) {
    const configJSON = getConfigJSON()
    configJSON[config] = value
    setConfigJSON(configJSON)
}

const getConfigJSON = function() {
    return JSON.parse(fs.readFileSync(`${__dirname}/config/config.json`, 'utf-8'))
}

const setConfigJSON = function(configJSON) {
    fs.writeFileSync(`${__dirname}/config/config.json`, JSON.stringify(configJSON))
}
