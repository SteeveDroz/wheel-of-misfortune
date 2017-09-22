const electron = require('electron')
const fs = require('fs')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    mainWindow.loadURL(`file://${__dirname}/resources/index.html`)

    //mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    })
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
    const files = fs.readdirSync('data').filter(function(file) {
        return file.endsWith('.json')
    })
    event.returnValue = files
})

ipc.on('save-group', function(event, group) {
    try {
        fs.writeFileSync(`data/${group.group}.json`, JSON.stringify(group), 'utf-8');
        event.returnValue = null
    } catch (e) {
        console.log('Failed to save the file !')
    }
})

ipc.on('load-group', function(event, name) {
    try {
        const group = JSON.parse(fs.readFileSync(`data/${name}.json`, 'utf-8'));
        event.returnValue = group
    } catch (e) {
        console.log('Failed to load the file !')
    }
})
