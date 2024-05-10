import { app, globalShortcut, BrowserWindow, ipcMain } from "electron"
import { exec } from "child_process"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { registerShortcut } from "./shortcutManager.mjs"

const SHORTCUT_FOCUS_AND_TURN_OFF_MIC = "Command+Option+A"
const SHORTCUT_FOCUS_AND_TURN_ON_MIC = "Shift+Command+Option+A"

function startLobeChatDockerImage() {
  exec(
    "docker run -d -p 3210:3210 lobehub/lobe-chat",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
      }
      console.log(`Container ID: ${stdout}`)
    }
  )
}

function stopLobeChatDockerImage() {
  exec(
    "docker stop $(docker ps -q --filter ancestor=lobehub/lobe-chat)",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
      }
      console.log("Container stopped successfully.")
    }
  )
}

let mainWindow

function createWindow() {
  const preloadPath = `${dirname(fileURLToPath(import.meta.url))}/preload.js`
  console.log("Preload path:", preloadPath)

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // This improves security since you're loading an external page.
      contextIsolation: true, // Enable context isolation for additional security.
      preload: preloadPath, // Make sure the path is accurate
    },
  })

  mainWindow.loadURL("http://localhost:3210/chat")

  // Open the DevTools optionally:
  // mainWindow.webContents.openDevTools()
}

app.on("ready", () => {
  // startLobeChatDockerImage()
  createWindow()

  // Register the global shortcuts
  registerShortcut(
    SHORTCUT_FOCUS_AND_TURN_ON_MIC,
    (win) => win.webContents.send("focus-input-and-turn-on-mic"),
    mainWindow
  )
  registerShortcut(
    SHORTCUT_FOCUS_AND_TURN_OFF_MIC,
    (win) => win.webContents.send("focus-input-and-turn-off-mic"),
    mainWindow
  )
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on("will-quit", () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
  ipcMain.removeAllListeners()
})
