import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const isDev = process.env.NODE_ENV === "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RootDir = path.join(__dirname, "../../");

// Logging
const logDir = path.join(RootDir, "logs");
const frontendLogDir = path.join(logDir, "front");

if (!fs.existsSync(frontendLogDir)) {
  fs.mkdirSync(frontendLogDir, { recursive: true });
}

const frontendLog = fs.createWriteStream(
  path.join(frontendLogDir, "electron.log"),
  {
    flags: "w",
  }
);

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
    frontendLog.write(`[EL] Unsupported run mode\n`);
    app.quit();
  }
}

app.whenReady().then(() => {
  frontendLog.write(`[EL] Electron started\n`);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Handle application exit
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    frontendLog.write(`[EL] Electron terminated\n`);
    app.quit();
  }
});
