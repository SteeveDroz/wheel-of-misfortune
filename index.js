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
        icon: 'assets/logo.png'
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
