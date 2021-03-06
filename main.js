'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const clipboard = electron.clipboard;

const ipcMain = electron.ipcMain;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

var clipboardTimer;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 320, 
    height: 800,
    alwaysOnTop: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the wind rresponding element.
    mainWindow = null;
  });
  
  mainWindow.webContents.on('did-finish-load', function() {
    clipboardTimer = setInterval(getClipboardChanges, 250);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

var previousClipboard = clipboard.readText();

function getClipboardChanges() {
  var currentContents = clipboard.readText();
  if (previousClipboard != currentContents) {
    previousClipboard = currentContents;
    console.log('Clipboard changed! New Contents: ' + currentContents);
    mainWindow.webContents.send('clipboard-change', currentContents); 
  }
}
