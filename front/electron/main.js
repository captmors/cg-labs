import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";
import fs from "fs";

const isDev = process.env.NODE_ENV === "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RootDir = path.join(__dirname, "../../");

const logDir = path.join(RootDir, "logs/back");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const backendLog = fs.createWriteStream(path.join(logDir, "log.log"), {
  flags: "w",
});

function startBackend() {
  const pythonProcess = spawn("python", ["main.py"], {
    cwd: RootDir,
    stdio: ["ignore", "pipe", "pipe"],
  });

  pythonProcess.stdout.on("data", (data) => {
    backendLog.write(`[STDOUT] ${data}\n`);
  });

  pythonProcess.stderr.on("data", (data) => {
    backendLog.write(`[STDERR] ${data}\n`);
  });

  pythonProcess.on("error", (error) => {
    backendLog.write(`[ERROR] Failed to start FastAPI server: ${error}\n`);
  });

  pythonProcess.on("exit", (code) => {
    backendLog.write(`[INFO] FastAPI server exited with code: ${code}\n`);
  });
}

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
    mainWindow.loadFile(path.join(RootDir, "front/dist/index.html"));
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
