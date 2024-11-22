import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const isDev = process.env.NODE_ENV === "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RootDir = path.join(__dirname, "../../");

// Logging
const logDir = path.join(RootDir, "logs", "front");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = fs.createWriteStream(path.join(logDir, "electron.log"), {
  flags: "w",
});

const log = (message) => {
  const timestamp = new Date().toISOString();
  logFile.write(`[${timestamp}] ${message}\n`);
};

process.stdout.write = logFile.write.bind(logFile);
process.stderr.write = logFile.write.bind(logFile);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    log(`Unsupported run mode`);
    app.quit();
  }
}

app.whenReady().then(() => {
  log(`Electron started`);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Handle application exit
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    log(`Electron terminated`);
    app.quit();
  }
});
