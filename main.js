const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Recomendado para mejores prácticas de seguridad
      contextIsolation: true, // Aislamiento de contexto para mayor seguridad
      enableRemoteModule: false // Deshabilitar el módulo remoto si no se usa
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'dist/sistema-base/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
