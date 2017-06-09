'use strict';

const electron = require('electron');
const app = electron.app;
const BrwoserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;
let mainWindow;

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
	// Icon と コンテキストメニュー
	const appIcon = new Tray(`${__dirname}/favicon.ico`);
	const contextMenu = Menu.buildFromTemplate([
		{label: 'テストメニュー', type: 'radio'},
		{label: 'テストメニュー02', type: 'radio'},
		{type: 'separator'},
		{label: 'サブメニュー', submenu: [
			{label: 'サブメニュー０１'},
			{label: 'サブメニュー０２'},
		]},
		{label: '終了', click: () => { app.quit(); }}
	]);
	appIcon.setContextMenu(contextMenu);
	appIcon.setToolTip('This is sample.');

	// アプリケーションメニュー
	const menu = Menu.buildFromTemplate([
		{
			label: 'Sample',
			submenu: [
				{label: 'About'},
				{label: 'Quit'}
			]
		},
		{
			label: 'File',
			submenu: [
				{label: 'New File'},
				{label: 'Paste'}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Copy',
					accelerator: 'Command+C',
					selector: 'copy'
				},
				{
					label: 'Paste',
					accelerator: 'Command+V',
					selector: 'paste'
				}
			]
		}
	]);
	Menu.setApplicationMenu(menu);
	mainWindow = new BrwoserWindow({
		width: 800,
		height: 600
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
});
