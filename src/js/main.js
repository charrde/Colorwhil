const { app, BrowserWindow, globalShortcut, screen, ipcMain } = require('electron');

let mainWindow;
let isClickThrough = false;

app.whenReady().then(() => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: true,
		transparent: true,
		alwaysOnTop: true,
		fullscreen: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow.setBounds({ width, height });

	mainWindow.loadFile('src/index.html');

    globalShortcut.register('CommandOrControl+D', () => {
        isClickThrough = !isClickThrough;
        mainWindow.setIgnoreMouseEvents(isClickThrough, { forward: true });
    });

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
});

ipcMain.on('app-quit', () => {
	app.quit();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
