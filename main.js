// Desktop app: starts the server with your installed Node.js, then opens it in its own window.
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const URL = 'http://localhost:3000';
let server;

function waitForServer(cb, tries = 0) {
  http.get(URL + '/api/state', r => { r.resume(); cb(); })
    .on('error', () => {
      if (tries > 50) return cb();
      setTimeout(() => waitForServer(cb, tries + 1), 200);
    });
}

function createWindow() {
  const win = new BrowserWindow({ width: 520, height: 860, title: 'Study Planner', autoHideMenuBar: true, icon: path.join(__dirname, 'public', 'icon-512.png') });
  win.loadURL(URL);
}

function stop() { if (server) { try { server.kill(); } catch (e) {} server = null; } }

app.whenReady().then(() => {
  server = spawn('node', ['server.js'], { cwd: __dirname, windowsHide: true });
  waitForServer(createWindow);
});
app.on('window-all-closed', () => { stop(); app.quit(); });
app.on('before-quit', stop);
