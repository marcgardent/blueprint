const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  /*
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  */
  mainWindow.loadURL(
    "http://localhost:4200" //[DEBUG WITH VSCODE] use angular's endpoint
  );
 
  // Open the DevTools.
  mainWindow.webContents.openDevTools() //[DEBUG WITH VSCODE] the VS debugger attach to devtools and not to the page!

  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.removeMenu()
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})