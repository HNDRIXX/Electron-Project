const http = require('http');
const fs = require('fs');
const path = require('path'); // Add this line
const { app, BrowserWindow } = require('electron');
const electron = require('electron')
require('electron-reloader')(module);

function createWindow() {
    const win = new BrowserWindow({
        height: 800,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        // frame: false,
        icon: __dirname + '/assets/icon.png',
    });

    win.maximize();
    win.setMenuBarVisibility(false)
    win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
    createWindow();

    const server = http.createServer((req, res) => {
        // Check if the request is for an asset
        if (req.url.startsWith('/assets/')) {
            const assetPath = path.join(__dirname, req.url); // Construct absolute path to the asset
            fs.readFile(assetPath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error loading asset');
                    return;
                }

                res.writeHead(200);
                res.end(data); // Serve the asset
            });
        } else {
            const assetPath = path.join(__dirname, 'index.html');
            // For other requests, serve index.html
            fs.readFile(assetPath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('<h1>Error loading index.html</h1>');
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data); // Serve the contents of index.html
            });
        }
    });

    server.listen(3000, 'localhost', () => {
        console.log('Server running at http://localhost:3000/');
    });
});
